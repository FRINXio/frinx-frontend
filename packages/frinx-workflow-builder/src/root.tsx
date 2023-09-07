import { Box, Container, Heading } from '@chakra-ui/react';
import {
  convertTaskToExtendedTask,
  jsonParse,
  createEmptyWorkflow,
  ExtendedTask,
  unwrap,
  useNotifications,
  Task,
  ClientWorkflow,
  DescriptionJSON,
} from '@frinx/shared';
import { saveAs } from 'file-saver';
import React, { useEffect, useMemo, useState, VoidFunctionComponent } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import App from './app';
import WorkflowForm from './components/workflow-form/workflow-form';
import { TaskActionsProvider } from './task-actions-context';
import {
  DeleteWorkflowMutation,
  DeleteWorkflowMutationVariables,
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
    outputParameters {
      key
      value
    }
    restartable
    timeoutSeconds
    timeoutPolicy
    ownerEmail
    variables
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
  query WorkflowList($filter: FilterWorkflowsInput, $taskDefinitionsFilter: FilterTaskDefinitionsInput) {
    workflows(filter: $filter) {
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
    taskDefinitions(filter: $taskDefinitionsFilter) {
      edges {
        node {
          name
          description
          createdBy
          retryCount
          timeoutSeconds
          timeoutPolicy
          retryLogic
          retryDelaySeconds
          responseTimeoutSeconds
          ownerEmail
        }
      }
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
        outputParameters {
          key
          value
        }
      }
    }
  }
`;

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowByName($input: ExecuteWorkflowByName!) {
    executeWorkflowByName(input: $input)
  }
`;

const WORKFLOW_DELETE_MUTATION = gql`
  mutation DeleteWorkflow($input: DeleteWorkflowInput!) {
    deleteWorkflow(input: $input) {
      workflow {
        id
      }
    }
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
  const [workflowFilter, setWorkflowFilter] = useState<string>('');
  const [taskdefsFilter, setTaskdefsFilter] = useState<string>('');

  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState(false);

  const [{ data: workflowListData }] = useQuery<WorkflowListQuery>({
    query: WORKFLOW_LIST_QUERY,
    variables: {
      filter: { keyword: workflowFilter },
      taskDefinitionsFilter: {
        keyword: taskdefsFilter,
      },
    },
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

  const [, deleteWorkflow] = useMutation<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>(
    WORKFLOW_DELETE_MUTATION,
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
    const extendedTasks = tasks?.map(convertTaskToExtendedTask) ?? [];
    const description = jsonParse<DescriptionJSON | null>(workflowDetail.description);

    setWorkflow({
      ...workflowDetail,
      description: description?.description ?? null,
      labels: description?.labels || [],
      tasks: extendedTasks,
      hasSchedule: workflowDetail.hasSchedule ?? false,
      outputParameters: workflowDetail.outputParameters,
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
    saveAs(file, `${wf.name}_v${wf.version}.json`);
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

  const handleWorkflowDelete = async () => {
    const workflowToDelete = unwrap(workflow);
    const { id, name, version: workflowVersion } = workflowToDelete;
    // if we are in create mode, workflow is not saved on server yet, no delete needed
    if (!id) {
      onClose();
      addToastNotification({
        content: 'No workflow definition to be deleted',
        type: 'error',
      });
      return;
    }

    const result = await deleteWorkflow({ input: { name, version: workflowVersion || 1 } });

    if (result.data) {
      onClose();
      addToastNotification({
        content: 'Workflow deleted',
        type: 'success',
      });
    } else {
      addToastNotification({
        content: `Workflow delete failed: ${result.error}`,
        type: 'error',
      });
    }
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

  const handleOnWorkflowSearch = (keyword: string) => {
    setWorkflowFilter(keyword);
  };
  const handleOnTaskdefSearch = (keyword: string) => {
    setTaskdefsFilter(keyword);
  };

  const clientWorkflowList: ClientWorkflow[] = workflowListData.workflows.edges.map((e) => {
    const { node } = e;
    const parsedTasks = jsonParse<Task[]>(node.tasks) ?? [];
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
                ...wf,
                id: '',
                createdAt: new Date().toISOString(),
                updatedAt: '',
                createdBy: '',
                updatedBy: '',
                hasSchedule: false,
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
          workflowFilter={workflowFilter}
          onWorkflowSearch={handleOnWorkflowSearch}
          onTaskdefSearch={handleOnTaskdefSearch}
          key={workflow.id}
          workflow={workflow}
          onWorkflowChange={handleWorkflowChange}
          workflows={clientWorkflowList}
          taskDefinitions={taskDefinitions.edges.map((e) => e.node)}
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
