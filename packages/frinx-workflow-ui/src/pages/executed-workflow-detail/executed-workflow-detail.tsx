import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
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
import { ClientWorkflow, useNotifications } from '@frinx/shared';
import { Link, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery, useSubscription } from 'urql';
import {
  ControlExecutedWorkflowSubscription,
  ControlExecutedWorkflowSubscriptionVariables,
  ExecutedWorkflowDetailQuery,
  ExecutedWorkflowDetailQueryVariables,
  PauseWorkflowMutation,
  PauseWorkflowMutationVariables,
  RerunWorkflowMutation,
  RerunWorkflowMutationVariables,
  RestartWorkflowMutation,
  RestartWorkflowMutationVariables,
  ResumeWorkflowMutation,
  ResumeWorkflowMutationVariables,
  RetryWorkflowMutation,
  RetryWorkflowMutationVariables,
  TerminateWorkflowMutation,
  TerminateWorkflowMutationVariables,
  // TaskDefinition,
} from '../../__generated__/graphql';
import TaskTable from './task-table';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import ExecutedWorkflowDetailHeader from './executed-workflow-detail-header';
import copyToClipBoard from '../../helpers/copy-to-clipboard';
import WorkflowDiagram from '../../components/workflow-diagram';
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
          originalId
          workflowDefinition {
            id
            version
            name
            ownerEmail
            restartable
            tasksJson
            hasSchedule
            description
            createdAt
            updatedAt
            createdBy
            updatedBy
            inputParameters
            outputParameters {
              key
              value
            }
            timeoutPolicy
            timeoutSeconds
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
            reasonForIncompletion
            logs {
              createdAt
              message
            }
          }
          correlationId
        }
      }
    }
  }
`;

const EXECUTED_WORKFLOW_SUBSCRIPTION = gql`
  subscription ControlExecutedWorkflow($workflowId: String!) {
    conductor {
      controlExecutedWorkflow(workflowId: $workflowId) {
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

const RERUN_WORKFLOW_MUTATION = gql`
  mutation RerunWorkflow($workflowId: String!) {
    conductor {
      rerunExecutedWorkflow(id: $workflowId) {
        workflow {
          id
          status
        }
      }
    }
  }
`;

const RESTART_WORKFLOW_MUTATION = gql`
  mutation RestartWorkflow($workflowId: String!) {
    conductor {
      restartExecutedWorkflow(id: $workflowId) {
        workflow {
          id
          status
        }
      }
    }
  }
`;

const RETRY_WORKFLOW_MUTATION = gql`
  mutation RetryWorkflow($workflowId: String!) {
    conductor {
      retryExecutedWorkflow(id: $workflowId) {
        workflow {
          id
          status
        }
      }
    }
  }
`;

const PAUSE_WORKFLOW_MUTATION = gql`
  mutation PauseWorkflow($workflowId: String!) {
    conductor {
      pauseExecutedWorkflow(id: $workflowId) {
        workflow {
          id
          status
        }
      }
    }
  }
`;

const RESUME_WORKFLOW_MUTATION = gql`
  mutation ResumeWorkflow($workflowId: String!) {
    conductor {
      resumeExecutedWorkflow(id: $workflowId) {
        workflow {
          id
          status
        }
      }
    }
  }
`;

const TERMINATE_WORKFLOW_MUTATION = gql`
  mutation TerminateWorkflow($workflowId: String!) {
    conductor {
      terminateExecutedWorkflow(id: $workflowId) {
        workflow {
          id
          status
        }
      }
    }
  }
`;

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
    variables: { workflowId: workflowId || '' },
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
  const [, rerunWorkflow] = useMutation<RerunWorkflowMutation, RerunWorkflowMutationVariables>(RERUN_WORKFLOW_MUTATION);

  // TODO: FIXME
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

  const handleOnRerunClick = () => {
    rerunWorkflow({
      workflowId,
    })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error?.message);
        }
        if (result.data?.conductor.rerunExecutedWorkflow.workflow == null) {
          throw new Error('Something went wrong');
        }
        // when specific task detail is opened we need to close it after rerun so that we can see new tasks that have different ids
        setOpenedTaskId(null);
        onExecutedOperation(result.data?.conductor.rerunExecutedWorkflow.workflow.id);
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
        workflowId,
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
        workflowId,
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
        workflowId,
      },
      ctx,
    ).then((res) => {
      if (res.data?.conductor.retryExecutedWorkflow.workflow != null) {
        return addToastNotification({
          title: 'Workflow retried',
          content: `Workflow ${executedWorkflow.workflowDefinition?.name} retried`,
          type: 'success',
          timeout: 2500,
        });
      }
      return addToastNotification({
        title: 'Error',
        content: "Can't retry workflow",
        type: 'error',
        timeout: 2500,
      });
    });
  };

  const handleOnPauseWorkflow = () => {
    pauseWorkflow(
      {
        workflowId,
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
        workflowId,
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

  // TODO: FIXME
  // some propery typing or helper function
  const clientWorkflow: ClientWorkflow | null =
    executedWorkflow.workflowDefinition != null
      ? {
          ...executedWorkflow.workflowDefinition,
          labels: [],
          timeoutSeconds: executedWorkflow.workflowDefinition.timeoutSeconds ?? 0,
        }
      : null;

  return (
    <Container maxWidth="container.xl">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          {executedWorkflow.workflowDefinition?.name} / {executedWorkflow.workflowDefinition?.version}
        </Heading>
        {executedWorkflow.parentId && (
          <Button margin={2} as={Link} to={`../executed/${executedWorkflow.parentId}`}>
            Go to parent workflow
          </Button>
        )}
      </Flex>
      <ExecutedWorkflowDetailHeader
        endTime={executedWorkflow.endTime}
        startTime={executedWorkflow.startTime}
        status={executedWorkflow.status}
        isRestartButtonEnabled={executedWorkflow.workflowDefinition?.restartable ?? false}
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
                    onClose={() => {
                      setOpenedTaskId(null);
                    }}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <InputOutputTab
                  copyToClipBoard={handleCopyToClipborad}
                  isEscaped={isEscaped}
                  input={executedWorkflow.input != null ? JSON.parse(executedWorkflow.input) : {}}
                  output={executedWorkflow.output != null ? JSON.parse(executedWorkflow.output) : {}}
                  onEscapeChange={() => {
                    setIsEscaped((prev) => !prev);
                  }}
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
                    workflowDefinition={clientWorkflow}
                    workflowInput={executedWorkflow.input != null ? JSON.parse(executedWorkflow.input) : {}}
                  />
                )}
              </TabPanel>
              <TabPanel>
                {executedWorkflow.workflowDefinition && (
                  <WorkflowDiagram
                    meta={{ ...executedWorkflow.workflowDefinition, tasks: [] }}
                    result={data?.conductor.controlExecutedWorkflow}
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </Container>
  );
};

export default ExecutedWorkflowDetail;
