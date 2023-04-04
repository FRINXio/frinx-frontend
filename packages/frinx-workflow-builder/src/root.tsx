import { Box, Container, Heading } from '@chakra-ui/react';
import { convertTaskToExtendedTask, jsonParse } from '@frinx/shared';
import {
  callbackUtils,
  createEmptyWorkflow,
  ExtendedTask,
  unwrap,
  Workflow,
  useNotifications,
  Task,
  ClientWorkflow,
} from '@frinx/shared/src';
import { saveAs } from 'file-saver';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import App from './app';
import WorkflowForm from './components/workflow-form/workflow-form';
import { TaskActionsProvider } from './task-actions-context';
import { WorkflowQuery, WorkflowQueryVariables } from './__generated__/graphql';

type Props = {
  onClose: () => void;
};

const WORKFLOW_DETAIL_QUERY = gql`
  query Workflow($nodeId: ID!) {
    workflow: node(id: $nodeId) {
      ... on Workflow {
        id
        name
        description
        version
        createdAt
        updatedAt
        createdBy
        updatedBy
        tasks
        hasSchedule
        inputParameters
      }
    }
    workflows {
      edges {
        cursor
        node {
          id
          name
          description
          version
          createdAt
          updatedAt
          createdBy
          updatedBy
          tasks
          hasSchedule
          inputParameters
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
    taskDefinitions {
      name
      description
      createdAt
      retryCount
      timeoutSeconds
      timeoutPolicy
      retryLogic
      retryDelaySeconds
      responseTimeoutSeconds
      ownerEmail
    }
  }
`;

const Root: VoidFunctionComponent<Props> = ({ onClose }) => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const [workflow, setWorkflow] = useState<ClientWorkflow<ExtendedTask> | null>(null);
  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState(false);
  const [{ data: workflowData }] = useQuery<WorkflowQuery, WorkflowQueryVariables>({
    query: WORKFLOW_DETAIL_QUERY,
    variables: {
      nodeId: unwrap(workflowId),
    },
  });

  const { addToastNotification } = useNotifications();

  useEffect(() => {
    if (workflowData?.workflow == null) {
      return;
    }

    const { workflow: workflowDetail } = workflowData;

    if (workflowDetail.__typename !== 'Workflow') {
      return;
    }

    const tasks = jsonParse<Task[]>(workflowDetail.tasks);
    const extenedTasks = tasks.map(convertTaskToExtendedTask);

    setWorkflow({
      ...workflowDetail,
      tasks: extenedTasks,
      hasSchedule: workflowDetail.hasSchedule ?? false,
    });
  }, [workflowData]);

  const handleFileImport = (file: File) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setWorkflow(json);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });

    fileReader.readAsText(file);
  };

  const handleFileExport = (wf: Workflow) => {
    const parsedWf = JSON.stringify(wf, null, 2);
    const textEncoder = new TextEncoder();
    const arrayBuffer = textEncoder.encode(parsedWf);
    const file = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${wf.name}.json`);
  };

  const handleWorkflowClone = (wf: Workflow, wfName: string) => {
    const updatedWorkflow: Workflow = { ...wf, name: wfName };
    const { putWorkflow } = callbackUtils.getCallbacks;

    putWorkflow([updatedWorkflow]);
  };

  const handleWorkflowDelete = () => {
    const { getWorkflows } = callbackUtils.getCallbacks;
    getWorkflows().then((wfs) => {
      const isWorkflow = wfs.find((wf) => wf.name === workflow?.name);

      if (isWorkflow != null && workflow != null) {
        const { deleteWorkflow } = callbackUtils.getCallbacks;
        deleteWorkflow(workflow.name, (workflow?.version ?? 1).toString()).then(() => {
          onClose();
          addToastNotification({
            content: 'Workflow deleted',
            type: 'success',
          });
        });
      }

      if (!isWorkflow) {
        addToastNotification({
          content: 'No workflow definition to be deleted',
          type: 'error',
        });
      }
    });
  };

  const handleWorkflowChange = (
    editedWorkflow: Pick<
      Workflow,
      | 'name'
      | 'description'
      | 'version'
      | 'restartable'
      | 'timeoutPolicy'
      | 'timeoutSeconds'
      | 'outputParameters'
      | 'variables'
    >,
  ) => {
    setWorkflow((wf) => ({
      ...unwrap(wf),
      ...editedWorkflow,
    }));
  };

  if (!workflowData) {
    return null;
  }

  const clientWorkflowList: ClientWorkflow[] = workflowData.workflows.edges.map((e) => {
    const { node } = e;
    const parsedTasks = jsonParse<Task[]>(node.tasks);
    return {
      ...node,
      tasks: parsedTasks,
      hasSchedule: node.hasSchedule || false,
    };
  });
  if (shouldCreateWorkflow) {
    return (
      <Container maxWidth={1200}>
        <Box background="white" paddingY={8} paddingX={4}>
          <Heading as="h1" size="xl">
            Create new workflow
          </Heading>
          <WorkflowForm
            workflow={createEmptyWorkflow()}
            workflows={clientWorkflowList}
            onSubmit={(wf) => {
              setWorkflow({
                // ownerEmail: '',
                // schemaVersion: 2,
                ...wf,
                id: '',
                description: '',
                createdAt: '',
                updatedAt: '',
                createdBy: '',
                updatedBy: '',
                // labels:
                tasks: [],
                // updateTime: 0,
                hasSchedule: false,
                // correlationId: '',
                inputParameters: [],
              });
              setShouldCreateWorkflow(false);
            }}
            canEditName
            isCreatingWorkflow
          />
        </Box>
      </Container>
    );
  }

  const { taskDefinitions } = workflowData;

  return workflow != null && taskDefinitions != null ? (
    <TaskActionsProvider>
      <ReactFlowProvider>
        <App
          key={`${workflow.id}`}
          workflow={workflow}
          onWorkflowChange={handleWorkflowChange}
          workflows={clientWorkflowList}
          taskDefinitions={taskDefinitions}
          onFileImport={handleFileImport}
          onFileExport={handleFileExport}
          onWorkflowDelete={handleWorkflowDelete}
          onWorkflowClone={handleWorkflowClone}
        />
      </ReactFlowProvider>
    </TaskActionsProvider>
  ) : null;
};

export default Root;
