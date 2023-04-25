import { Box, Container, Heading } from '@chakra-ui/react';
import { convertTaskToExtendedTask, jsonParse } from '@frinx/shared';
import {
  callbackUtils,
  createEmptyWorkflow,
  ExtendedTask,
  unwrap,
  useNotifications,
  Task,
  ClientWorkflow,
  DescriptionJSON,
} from '@frinx/shared/src';
import { saveAs } from 'file-saver';
import React, { useEffect, useMemo, useState, VoidFunctionComponent } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import App from './app';
import WorkflowForm from './components/workflow-form/workflow-form';
import { TaskActionsProvider } from './task-actions-context';
import {
  UpdateWorkflowMutation,
  UpdateWorkflowMutationVariables,
  WorkflowListQuery,
  WorkflowQuery,
  WorkflowQueryVariables,
} from './__generated__/graphql';

type Props = {
  onClose: () => void;
};

export const WorkflowFragment = gql`
  fragment WorkflowFragment on Workflow {
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
    restartable
    timeoutSeconds
    timeoutPolicy
  }
`;

const WORKFLOW_DETAIL_QUERY = gql`
  query Workflow($nodeId: ID!, $version: Int) {
    workflow: node(id: $nodeId, version: $version) {
      ...WorkflowFragment
    }
  }
  ${WorkflowFragment}
`;

const WORKFLOW_LIST_QUERY = gql`
  query WorkflowList {
    workflows {
      edges {
        cursor
        node {
          ...WorkflowFragment
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
  ${WorkflowFragment}
`;

const UPDATE_WORKFLOW_MUTATION = gql`
  mutation UpdateWorkflow($updateWorkflowId: String!, $input: UpdateWorkflowInput!) {
    updateWorkflow(id: $updateWorkflowId, input: $input) {
      workflow {
        createdBy
        updatedAt
        tasks
        name
        description
        version
      }
    }
  }
`;

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowByName(
    $inputParameters: String!
    $workflowName: String!
    $workflowVersion: Int
    $correlationId: String
    $priority: Int
  ) {
    executeWorkflowByName(
      inputParameters: $inputParameters
      workflowName: $workflowName
      workflowVersion: $workflowVersion
      correlationId: $correlationId
      priority: $priority
    )
  }
`;

const Root: VoidFunctionComponent<Props> = ({ onClose }) => {
  const ctx = useMemo(
    () => ({
      additionalTypenames: ['Workflow'],
    }),
    [],
  );
  const { workflowId, version } = useParams<{ workflowId: string; version: string }>();
  const [workflow, setWorkflow] = useState<ClientWorkflow<ExtendedTask> | null>(null);
  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState(false);

  const [{ data: workflowListData }] = useQuery<WorkflowListQuery>({
    query: WORKFLOW_LIST_QUERY,
  });

  const [{ data: workflowData }] = useQuery<WorkflowQuery, WorkflowQueryVariables>({
    query: WORKFLOW_DETAIL_QUERY,
    variables: {
      nodeId: workflowId ?? '', // query with empty string nodeId wont be called, because query is paused in that case
    },
    context: ctx,
    pause: workflowId == null,
  });

  const [, updateWorkflow] = useMutation<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>(
    UPDATE_WORKFLOW_MUTATION,
  );

  const [, executeWorkflow] = useMutation(EXECUTE_WORKFLOW_MUTATION);

  const { addToastNotification } = useNotifications();

  useEffect(() => {
    if (workflowId == null || version == null) {
      setShouldCreateWorkflow(true);
    }
  }, [workflowId, version]);

  useEffect(() => {
    if (workflowData?.workflow == null) {
      return;
    }

    const { workflow: workflowDetail } = workflowData;

    if (workflowDetail.__typename !== 'Workflow') {
      return;
    }

    const tasks = jsonParse<Task[]>(workflowDetail.tasks);
    const extendedTasks = tasks.map(convertTaskToExtendedTask);
    const description = jsonParse<DescriptionJSON | null>(workflowDetail.description);

    setWorkflow({
      ...workflowDetail,
      labels: description?.labels || [],
      tasks: extendedTasks,
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

  const handleFileExport = (wf: ClientWorkflow) => {
    const parsedWf = JSON.stringify(wf, null, 2);
    const textEncoder = new TextEncoder();
    const arrayBuffer = textEncoder.encode(parsedWf);
    const file = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${wf.name}.json`);
  };

  const handleWorkflowClone = async (wf: ClientWorkflow, wfName: string) => {
    const updatedWorkflow = { ...wf, name: wfName, tasks: JSON.stringify(wf.tasks) };
    await updateWorkflow({
      updateWorkflowId: wf.id,
      input: {
        workflow: updatedWorkflow,
      },
    });
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

  const handleWorkflowChange = (editedWorkflow: ClientWorkflow<ExtendedTask>) => {
    setWorkflow((wf) => ({
      ...unwrap(wf),
      ...editedWorkflow,
    }));
  };

  if (!workflowListData) {
    return null;
  }

  const clientWorkflowList: ClientWorkflow[] = workflowListData.workflows.edges.map((e) => {
    const { node } = e;
    const parsedTasks = jsonParse<Task[]>(node.tasks);
    const description = jsonParse<DescriptionJSON | null>(node.description);
    return {
      ...node,
      labels: description?.labels || [],
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
                labels: [],
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

  const { taskDefinitions } = workflowListData;

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
          updateWorkflow={updateWorkflow}
          executeWorkflow={executeWorkflow}
        />
      </ReactFlowProvider>
    </TaskActionsProvider>
  ) : null;
};

export default Root;
