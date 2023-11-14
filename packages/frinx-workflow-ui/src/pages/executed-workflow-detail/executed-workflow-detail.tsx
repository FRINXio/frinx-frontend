import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
import { Link, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery, useSubscription } from 'urql';
import {
  ControlExecutedWorkflowSubscription,
  ControlExecutedWorkflowSubscriptionVariables,
  ExecutedWorkflowDetailQuery,
  ExecutedWorkflowDetailQueryVariables,
  ExecuteWorkflowByItsNameMutation,
  ExecuteWorkflowByItsNameMutationVariables,
  PauseWorkflowMutation,
  PauseWorkflowMutationVariables,
  RestartWorkflowMutation,
  RestartWorkflowMutationVariables,
  ResumeWorkflowMutation,
  ResumeWorkflowMutationVariables,
  RetryWorkflowMutation,
  RetryWorkflowMutationVariables,
  TerminateWorkflowMutation,
  TerminateWorkflowMutationVariables,
} from '../../__generated__/graphql';
import TaskTable from './task-table';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import ExecutedWorkflowDetailHeader from './executed-workflow-detail-header';
import copyToClipBoard from '../../helpers/copy-to-clipboard';
import WorkflowDiagram from '../../components/workflow-diagram';
import { formatDate } from '../../helpers/utils.helpers';
import ExecutedWorkflowDetailTaskDetail from './executed-workflow-detail-task-detail/executed-workflow-detail-task-detail';

const EXECUTED_WORKFLOW_QUERY = gql`
  query ExecutedWorkflowDetail($nodeId: ID!) {
    conductor {
      node(id: $nodeId) {
        ... on Workflow {
          id
          createdBy
          updatedBy
          createdAt
          updatedAt
          status
          parentId
          ownerApp
          input
          output
          reasonForIncompletion
          failedReferenceTaskNames
          workflowDefinition {
            id
            version
            name
          }
          variables
          lastRetriedTime
          startTime
          endTime
          tasks {
            id
            taskType
            referenceTaskName
            status
            retryCount
            startTime
            endTime
            updatedAt
            scheduledTime
            taskDefName
            workflowType
            retried
            executed
            taskId
            reasonForIncompletion
            taskDefinition
            subWorkflowId
            inputData
            outputData
            externalOutputPayloadStoragePath
            externalInputPayloadStoragePath
            callbackAfterSeconds
            seq
            pollCount
          }
          correlationId
        }
      }
    }
  }
`;

const EXECUTED_WORKFLOW_SUBSCRIPTION = gql`
  subscription ControlExecutedWorkflow($controlExecutedWorkflowId: String!) {
    conductor {
      controlExecutedWorkflow(workflowId: $controlExecutedWorkflowId) {
        endTime
        startTime
        status
        tasks {
          id
          endTime
          startTime
          updatedAt
          status
          taskType
          subWorkflowId
        }
      }
    }
  }
`;

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowByItsName($input: StartWorkflowRequest_Input!) {
    conductor {
      startWorkflow(input: $input)
    }
  }
`;

// const RESTART_WORKFLOW_MUTATION = gql`
//   mutation RestartWorkflow($restartWorkflowId: String!) {
//     restartWorkflow(id: $restartWorkflowId) {
//       isOk
//     }
//   }
// `;
//
// const RETRY_WORKFLOW_MUTATION = gql`
//   mutation RetryWorkflow($retryWorkflowId: String!, $retryWorkflowInput: RetryWorkflowInput) {
//     retryWorkflow(id: $retryWorkflowId, input: $retryWorkflowInput) {
//       isOk
//     }
//   }
// `;
//
// const PAUSE_WORKFLOW_MUTATION = gql`
//   mutation PauseWorkflow($pauseWorkflowId: String!) {
//     pauseWorkflow(id: $pauseWorkflowId) {
//       isOk
//     }
//   }
// `;
//
// const RESUME_WORKFLOW_MUTATION = gql`
//   mutation ResumeWorkflow($resumeWorkflowId: String!) {
//     resumeWorkflow(id: $resumeWorkflowId) {
//       isOk
//     }
//   }
// `;
//
// const TERMINATE_WORKFLOW_MUTATION = gql`
//   mutation TerminateWorkflow($terminateWorkflowId: String!) {
//     terminateWorkflow(id: $terminateWorkflowId) {
//       isOk
//     }
//   }
// `;
//
type Props = {
  onExecutedOperation: (workflowId: string) => void;
};

const ExecutedWorkflowDetail: FC<Props> = ({ onExecutedOperation }) => {
  const ctx = useMemo(() => ({ additionalTypenames: ['ExecutedWorkflow'] }), []);
  const { workflowId } = useParams<{ workflowId: string }>();
  const [openedTaskId, setOpenedTaskId] = useState<string | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);
  const { addToastNotification } = useNotifications();
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  const [
    { data: executedWorkflowDetail, fetching: isLoadingExecutedWorkflow, error: executedWorkflowDetailError },
    reexecuteQuery,
  ] = useQuery<ExecutedWorkflowDetailQuery, ExecutedWorkflowDetailQueryVariables>({
    query: EXECUTED_WORKFLOW_QUERY,
    variables: { nodeId: workflowId || '' },
  });
  const [{ data, error }, reexecuteSubscription] = useSubscription<
    ControlExecutedWorkflowSubscription,
    ControlExecutedWorkflowSubscription,
    ControlExecutedWorkflowSubscriptionVariables
  >({
    query: EXECUTED_WORKFLOW_SUBSCRIPTION,
    variables: { controlExecutedWorkflowId: workflowId || '' },
  });

  const [, restartWorkflow] = useMutation<RestartWorkflowMutation, RestartWorkflowMutationVariables>(
    RESTART_WORKFLOW_MUTATION,
  );
  const [, retryWorkflow] = useMutation<RetryWorkflowMutation, RetryWorkflowMutationVariables>(RETRY_WORKFLOW_MUTATION);
  const [, pauseWorkflow] = useMutation<PauseWorkflowMutation, PauseWorkflowMutationVariables>(PAUSE_WORKFLOW_MUTATION);
  const [, resumeWorkflow] = useMutation<ResumeWorkflowMutation, ResumeWorkflowMutationVariables>(
    RESUME_WORKFLOW_MUTATION,
  );
  const [, terminateWorkflow] = useMutation<TerminateWorkflowMutation, TerminateWorkflowMutationVariables>(
    TERMINATE_WORKFLOW_MUTATION,
  );
  const [, executeWorkflowByName] = useMutation<
    ExecuteWorkflowByItsNameMutation,
    ExecuteWorkflowByItsNameMutationVariables
  >(EXECUTE_WORKFLOW_MUTATION);

  useEffect(() => {
    if (data?.conductor.controlExecutedWorkflow?.status !== 'RUNNING') {
      reexecuteQuery();
    }
  }, [data?.conductor.controlExecutedWorkflow?.status, reexecuteQuery]);

  if (workflowId == null) {
    return <Text>Workflow id is not defined</Text>;
  }

  if (isLoadingExecutedWorkflow) {
    return <Progress size="xs" mt={-10} isIndeterminate />;
  }

  if (executedWorkflowDetailError != null) {
    return <Text>{executedWorkflowDetailError.message}</Text>;
  }

  if (error != null) {
    return <Text>{error.message}</Text>;
  }

  if (
    executedWorkflowDetail == null ||
    executedWorkflowDetail.conductor.node == null ||
    executedWorkflowDetail.conductor.node.__typename !== 'Workflow'
  ) {
    return <Text>Workflow not found</Text>;
  }

  const executedWorkflow = {
    ...executedWorkflowDetail.conductor.node,
    ...data?.conductor.controlExecutedWorkflow,
    tasks: executedWorkflowDetail.conductor.node.tasks?.map((task) => ({
      ...task,
      ...data?.conductor.controlExecutedWorkflow?.tasks?.find((t) => t.id === task.id),
    })),
  };

  const handleOnRerunClick = (inputParameters: Record<string, string | boolean | number | string[]>) => {
    executeWorkflowByName({
      input: {
        name: executedWorkflow.workflowDefinition?.name || '',
        version: executedWorkflow.workflowDefinition?.version,
        correlationId: executedWorkflow.correlationId,
        priority: 0,
        input: JSON.stringify(inputParameters),
      },
    })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error?.message);
        }

        if (result.data?.conductor.startWorkflow == null) {
          throw new Error('Something went wrong');
        }

        // when specific task detail is opened we need to close it after rerun so that we can see new tasks that have different ids
        setOpenedTaskId(null);
        onExecutedOperation(result.data?.conductor.startWorkflow || '');
      })
      .catch((err) => {
        addToastNotification({
          title: 'Error',
          content: err.message,
          type: 'error',
          timeout: 2500,
        });
      });
  };

  const handleCopyToClipborad = (inputText: Record<string, unknown>) => {
    if (inputText !== null) {
      copyToClipBoard(inputText)
        .then(() => {
          toast({
            title: 'Copied to Clipboard',
            status: 'success',
            duration: 2500,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 2500,
            isClosable: true,
          });
        });
    }
    if (!inputText) {
      toast({
        title: 'Nothing to copy',
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const handleOnRestartWorkflow = () => {
    restartWorkflow(
      {
        restartWorkflowId: workflowId,
      },
      ctx,
    ).then(() => {
      reexecuteQuery();
      reexecuteSubscription();
    });
  };

  const handleOnTerminateWorkflow = () => {
    terminateWorkflow(
      {
        terminateWorkflowId: workflowId,
      },
      ctx,
    )
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Workflow terminated',
          content: `Workflow ${executedWorkflow.workflowDefinition?.name} terminated`,
          type: 'success',
          timeout: 2500,
        });
      })
      .catch((err) => {
        addToastNotification({
          title: 'Error',
          content: err.message,
          type: 'error',
          timeout: 2500,
        });
      });
  };

  const handleOnRetryWorkflow = () => {
    retryWorkflow(
      {
        retryWorkflowId: workflowId,
      },
      ctx,
    )
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Workflow retried',
          content: `Workflow ${executedWorkflow.workflowDefinition?.name} retried`,
          type: 'success',
          timeout: 2500,
        });
      })
      .catch((err) => {
        addToastNotification({
          title: 'Error',
          content: err.message,
          type: 'error',
          timeout: 2500,
        });
      });
  };

  const handleOnPauseWorkflow = () => {
    pauseWorkflow(
      {
        pauseWorkflowId: workflowId,
      },
      ctx,
    )
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Workflow paused',
          content: `Workflow ${executedWorkflow.workflowDefinition?.name} paused`,
          type: 'success',
          timeout: 2500,
        });
      })
      .catch((err) => {
        addToastNotification({
          title: 'Error',
          content: err.message,
          type: 'error',
          timeout: 2500,
        });
      });
  };

  const handleOnResumeWorkflow = () => {
    resumeWorkflow(
      {
        resumeWorkflowId: workflowId,
      },
      ctx,
    )
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Workflow resumed',
          content: `Workflow ${executedWorkflow.workflowDefinition?.name} resumed`,
          type: 'success',
          timeout: 2500,
        });
      })
      .catch((err) => {
        addToastNotification({
          title: 'Error',
          content: err.message,
          type: 'error',
          timeout: 2500,
        });
      });
  };

  return (
    <Container maxWidth={1280}>
      <Heading size="xl" marginBottom={10}>
        Details of {executedWorkflow.workflowDefinition?.name} / {executedWorkflow.workflowDefinition?.version}
      </Heading>
      <Box>
        {executedWorkflow.parentId && (
          <Button display="inline" margin={2} as={Link} to={`../executed/${executedWorkflow.parentId}`}>
            Parent
          </Button>
        )}
      </Box>
      <ExecutedWorkflowDetailHeader
        endTime={formatDate(executedWorkflow.endTime)}
        startTime={formatDate(executedWorkflow.startTime)}
        status={executedWorkflow.status}
        visibleRestartButton={executedWorkflow.workflowDefinition?.restartable ?? false}
        onRestartWorkflow={handleOnRestartWorkflow}
        onTerminateWorkflow={handleOnTerminateWorkflow}
        onRetryWorkflow={handleOnRetryWorkflow}
        onPauseWorkflow={handleOnPauseWorkflow}
        onResumeWorkflow={handleOnResumeWorkflow}
      />
      <Box background="white" borderRadius={4} mb={5}>
        {executedWorkflow.status === 'RUNNING' ? (
          <VStack>
            <Progress isIndeterminate />
            <TaskTable tasks={executedWorkflow.tasks} onTaskClick={setOpenedTaskId} />
          </VStack>
        ) : (
          <Tabs index={tabIndex} onChange={setTabIndex}>
            <TabList>
              <Tab>Task Details</Tab>
              <Tab>Input/Output</Tab>
              <Tab>JSON</Tab>
              <Tab value="editRerun">Edit & Rerun</Tab>
              <Tab>Execution Flow</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {openedTaskId == null && <TaskTable tasks={executedWorkflow.tasks} onTaskClick={setOpenedTaskId} />}
                {openedTaskId != null && executedWorkflow.tasks != null && (
                  <ExecutedWorkflowDetailTaskDetail
                    executedWorkflow={executedWorkflowDetail.conductor.node}
                    taskId={openedTaskId}
                    onClose={() => setOpenedTaskId(null)}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <InputOutputTab
                  copyToClipBoard={handleCopyToClipborad}
                  isEscaped={isEscaped}
                  input={executedWorkflow.input != null ? JSON.parse(executedWorkflow.input) : {}}
                  output={executedWorkflow.output != null ? JSON.parse(executedWorkflow.output) : {}}
                  onEscapeChange={() => setIsEscaped(!isEscaped)}
                />
              </TabPanel>
              <TabPanel>
                {executedWorkflow != null && (
                  <WorkflowJsonTab
                    copyToClipBoard={handleCopyToClipborad}
                    isEscaped={isEscaped}
                    result={executedWorkflowDetail.conductor.node}
                    onEscapeChange={() => setIsEscaped(!isEscaped)}
                  />
                )}
              </TabPanel>
              <TabPanel>
                {executedWorkflow != null && executedWorkflow.workflowDefinition != null && (
                  <EditRerunTab
                    onRerunClick={handleOnRerunClick}
                    workflowDefinition={{
                      ...executedWorkflow.workflowDefinition,
                      labels: [],
                      tasks: JSON.parse(executedWorkflow.workflowDefinition.tasks || '[]'),
                      hasSchedule: executedWorkflow.workflowDefinition.hasSchedule ?? false,
                    }}
                    workflowInput={executedWorkflow.input != null ? JSON.parse(executedWorkflow.input) : {}}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <WorkflowDiagram meta={executedWorkflow.workflowDefinition} result={data?.controlExecutedWorkflow} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </Container>
  );
};

export default ExecutedWorkflowDetail;
