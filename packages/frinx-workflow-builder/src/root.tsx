import { Box, Container, Heading } from '@chakra-ui/react';
import {
  convertTaskToExtendedTask,
  jsonParse,
  createEmptyWorkflow,
  unwrap,
  useNotifications,
  ExtendedTask,
  Task,
  DescriptionJSON,
  ClientWorkflowWithTasks,
  TimeoutPolicy,
  TaskDefinition,
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
  DeleteWorkflowDefinitionMutation,
  DeleteWorkflowDefinitionMutationVariables,
  ExecuteWorkflowByNameBuilderMutation,
  ExecuteWorkflowByNameBuilderMutationVariables,
  UpdateWorkflowMutation,
  UpdateWorkflowMutationVariables,
  WorkflowDefinitionListQuery,
  WorkflowDefinitionListQueryVariables,
  WorkflowDefinitionQuery,
  WorkflowDefinitionQueryVariables,
} from './__generated__/graphql';

type Props = {
  onClose: () => void;
};

export const WorkflowDefinitionFragment = gql`
  fragment WorkflowDefinitionFragment on WorkflowDefinition {
    id
    name
    description
    version
    createdAt
    updatedAt
    createdBy
    updatedBy
    hasSchedule
    inputParameters
    outputParameters {
      key
      value
    }
    tasksJson
    restartable
    timeoutSeconds
    timeoutPolicy
    ownerEmail
    variables
  }
`;

const WORKFLOW_DEFINITION_DETAIL_QUERY = gql`
  query WorkflowDefinition($nodeId: ID!) {
    conductor {
      workflowDefinition: node(id: $nodeId) {
        ...WorkflowDefinitionFragment
      }
    }
  }
  ${WorkflowDefinitionFragment}
`;

const WORKFLOW_DEFINITIONS_LIST_QUERY = gql`
  query WorkflowDefinitionList($filter: WorkflowsFilterInput, $taskDefinitionsFilter: FilterTaskDefinitionsInput) {
    conductor {
      workflowDefinitions(filter: $filter) {
        edges {
          cursor
          node {
            ...WorkflowDefinitionFragment
          }
        }
      }
      taskDefinitions(filter: $taskDefinitionsFilter) {
        edges {
          node {
            name
            description
            createdBy
            retryCount
            timeoutSeconds
            retryLogic
            retryDelaySeconds
            responseTimeoutSeconds
            ownerEmail
            inputKeys
            timeoutPolicy
          }
        }
      }
    }
  }
  ${WorkflowDefinitionFragment}
`;

const UPDATE_WORKFLOW_MUTATION = gql`
  mutation UpdateWorkflow($input: UpdateWorkflowDefinitionInput!) {
    conductor {
      updateWorkflowDefinition(input: $input) {
        workflowDefinition {
          updatedAt
          tasksJson
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
  }
`;

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowByNameBuilder($input: ExecuteWorkflowByNameInput!) {
    conductor {
      executeWorkflowByName(input: $input)
    }
  }
`;

const WORKFLOW_DELETE_MUTATION = gql`
  mutation DeleteWorkflowDefinition($input: DeleteWorkflowDefinitionInput!) {
    conductor {
      deleteWorkflowDefinition(input: $input) {
        workflowDefinition {
          id
        }
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
  const [workflow, setWorkflow] = useState<ClientWorkflowWithTasks<ExtendedTask> | null>(null);
  const [workflowFilter, setWorkflowFilter] = useState<string>('');
  const [taskdefsFilter, setTaskdefsFilter] = useState<string>('');

  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState(false);

  const [{ data: workflowListData }] = useQuery<WorkflowDefinitionListQuery, WorkflowDefinitionListQueryVariables>({
    query: WORKFLOW_DEFINITIONS_LIST_QUERY,
    variables: {
      filter: { keyword: workflowFilter },
      taskDefinitionsFilter: {
        keyword: taskdefsFilter,
      },
    },
  });

  const [{ data: workflowData }] = useQuery<WorkflowDefinitionQuery, WorkflowDefinitionQueryVariables>({
    query: WORKFLOW_DEFINITION_DETAIL_QUERY,
    variables: {
      nodeId: workflowId ?? '', // query with empty string nodeId wont be called, because query is paused in that case
    },
    context: ctx,
    pause: workflowId == null,
  });

  const [, updateWorkflow] = useMutation<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>(
    UPDATE_WORKFLOW_MUTATION,
  );

  const [, deleteWorkflow] = useMutation<DeleteWorkflowDefinitionMutation, DeleteWorkflowDefinitionMutationVariables>(
    WORKFLOW_DELETE_MUTATION,
  );

  const [, executeWorkflow] = useMutation<
    ExecuteWorkflowByNameBuilderMutation,
    ExecuteWorkflowByNameBuilderMutationVariables
  >(EXECUTE_WORKFLOW_MUTATION);

  const { addToastNotification } = useNotifications();

  useEffect(() => {
    if (workflowId == null || version == null) {
      setShouldCreateWorkflow(true);
    }
  }, [workflowId, version]);

  useEffect(() => {
    if (workflowData?.conductor.workflowDefinition == null) {
      return;
    }
    const { workflowDefinition: workflowDetail } = workflowData.conductor;
    if (workflowDetail.__typename !== 'WorkflowDefinition') {
      return;
    }
    const tasks = jsonParse<Task[]>(workflowDetail.tasksJson);
    const extendedTasks = tasks?.map(convertTaskToExtendedTask) ?? [];
    const description = jsonParse<DescriptionJSON | null>(workflowDetail.description);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...wfDetail } = workflowDetail;
    setWorkflow({
      ...wfDetail,
      description: description?.description ?? null,
      labels: description?.labels || [],
      tasks: extendedTasks,
      hasSchedule: workflowDetail.hasSchedule ?? false,
      outputParameters: workflowDetail.outputParameters,
      timeoutSeconds: workflowDetail.timeoutSeconds ?? 0,
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

  const handleFileExport = (wf: ClientWorkflowWithTasks) => {
    const parsedWf = JSON.stringify(wf, null, 2);
    const textEncoder = new TextEncoder();
    const arrayBuffer = textEncoder.encode(parsedWf);
    const file = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${wf.name}_v${wf.version}.json`);
  };

  const handleWorkflowClone = async (wf: ClientWorkflowWithTasks, wfName: string) => {
    const { hasSchedule, id, createdAt, updatedAt, labels, timeoutPolicy, ...wfData } = wf;
    const updatedWorkflow = {
      ...wfData,
      name: wfName,
      tasks: JSON.stringify(wf.tasks),
      timeoutPolicy: (timeoutPolicy ?? undefined) as TimeoutPolicy,
    };
    const result = await updateWorkflow({
      input: {
        id: '',
        workflowDefinition: updatedWorkflow,
      },
    });
    if (result.data) {
      onClose();
      addToastNotification({
        content: 'Workflow cloned',
        type: 'success',
      });
    } else {
      addToastNotification({
        content: `Workflow clone failed: ${result.error}`,
        type: 'error',
      });
    }
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

  const handleWorkflowChange = (editedWorkflow: ClientWorkflowWithTasks<ExtendedTask>) => {
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

  const clientWorkflowList: ClientWorkflowWithTasks[] = workflowListData.conductor.workflowDefinitions.edges.map(
    (e) => {
      const { node } = e;
      const parsedTasks = jsonParse<Task[]>(node.tasksJson) ?? [];
      const description = jsonParse<DescriptionJSON | null>(node.description);
      return {
        ...node,
        labels: description?.labels || [],
        tasks: parsedTasks,
        hasSchedule: node.hasSchedule || false,
        timeoutSeconds: node.timeoutSeconds ?? 0,
      };
    },
  );

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

  const { taskDefinitions } = workflowListData.conductor;
  // TODO: FIXME
  const taskDefintionsWithPolicy: TaskDefinition[] = taskDefinitions.edges.map((td) => ({
    ...td.node,
    timeoutPolicy: null,
  }));

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
          // taskDefinitions={taskDefinitions.edges.map((e) => e.node)}
          taskDefinitions={taskDefintionsWithPolicy}
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
