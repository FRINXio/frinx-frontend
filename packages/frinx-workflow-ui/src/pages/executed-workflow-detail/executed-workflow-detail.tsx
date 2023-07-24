import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
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
import { useNotifications } from '@frinx/shared/src';
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
    node(id: $nodeId) {
      ... on ExecutedWorkflow {
        id
        createdBy
        updatedBy
        createdAt
        updatedAt
        status
        parentWorkflowId
        ownerApp
        input
        output
        reasonForIncompletion
        failedReferenceTaskNames
        workflowDefinition {
          id
          version
          timeoutSeconds
          name
          description
          createdBy
          updatedBy
          createdAt
          updatedAt
          tasks
          inputParameters
          outputParameters {
            key
            value
          }
          hasSchedule
          restartable
          timeoutPolicy
        }
        variables
        lastRetriedTime
        startTime
        endTime
        workflowVersion
        workflowName
        workflowId
        tasks {
          id
          taskType
          referenceTaskName
          status
          retryCount
          startTime
          endTime
          updateTime
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
`;

const EXECUTED_WORKFLOW_SUBSCRIPTION = gql`
  subscription ControlExecutedWorkflow($controlExecutedWorkflowId: String!) {
    controlExecutedWorkflow(id: $controlExecutedWorkflowId) {
      endTime
      startTime
      status
      tasks {
        id
        endTime
        startTime
        updateTime
        status
        taskType
        subWorkflowId
      }
    }
  }
`;

const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation ExecuteWorkflowByItsName($input: ExecuteWorkflowByName!) {
    executeWorkflowByName(input: $input)
  }
`;

const RESTART_WORKFLOW_MUTATION = gql`
  mutation RestartWorkflow($restartWorkflowId: String!) {
    restartWorkflow(id: $restartWorkflowId) {
      isOk
    }
  }
`;

const RETRY_WORKFLOW_MUTATION = gql`
  mutation RetryWorkflow($retryWorkflowId: String!, $retryWorkflowInput: RetryWorkflowInput) {
    retryWorkflow(id: $retryWorkflowId, input: $retryWorkflowInput) {
      isOk
    }
  }
`;

const PAUSE_WORKFLOW_MUTATION = gql`
  mutation PauseWorkflow($pauseWorkflowId: String!) {
    pauseWorkflow(id: $pauseWorkflowId) {
      isOk
    }
  }
`;

const RESUME_WORKFLOW_MUTATION = gql`
  mutation ResumeWorkflow($resumeWorkflowId: String!) {
    resumeWorkflow(id: $resumeWorkflowId) {
      isOk
    }
  }
`;

const TERMINATE_WORKFLOW_MUTATION = gql`
  mutation TerminateWorkflow($terminateWorkflowId: String!) {
    terminateWorkflow(id: $terminateWorkflowId) {
      isOk
    }
  }
`;

const convertWorkflowVariablesToFormFormat = (
  workflowDetails: string,
  workflowInput: Record<string, string>,
  inputParameters: string[] = [],
) => {
  /*
                  search through whole executed workflow and is searching for all worklow.input
                  variables in this object and returns array of found variables
                */
  const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim;
  let match = inputCaptureRegex.exec(workflowDetails);
  const labels = new Set<string>([]);

  while (match != null) {
    labels.add(match[1]);
    match = inputCaptureRegex.exec(workflowDetails);
  }

  const values = [...labels].map((label: string) => {
    return workflowInput[label] != null ? workflowInput[label] : '';
  });

  const matchParam = (param: string) => {
    return param.match(/\[(.*?)]/);
  };

  const descriptions = inputParameters.map((param: string) => {
    const matchedParam = matchParam(param);
    if (matchedParam == null) {
      return '';
    }

    if (matchedParam.length > 0) {
      return matchedParam[1];
    }

    return '';
  });

  return {
    descriptions,
    values,
    labels: [...labels],
  };
};

type Props = {
  onExecutedOperation: (workflowId: string) => void;
};

const ExecutedWorkflowDetail: FC<Props> = ({ onExecutedOperation }) => {
  const ctx = useMemo(() => ({ additionalTypenames: ['ExecutedWorkflow'] }), []);
  const { workflowId } = useParams<{ workflowId: string }>();
  const [openedTaskId, setOpenedTaskId] = useState<string | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);
  const [workflowVariables, setWorkflowVariables] = useState<Record<string, string> | null>(null);
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
    if (data?.controlExecutedWorkflow?.status !== 'RUNNING') {
      reexecuteQuery();
    }
  }, [data?.controlExecutedWorkflow?.status, reexecuteQuery]);

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
    executedWorkflowDetail.node == null ||
    executedWorkflowDetail.node.__typename !== 'ExecutedWorkflow'
  ) {
    return <Text>Workflow not found</Text>;
  }

  const executedWorkflow = {
    ...executedWorkflowDetail.node,
    ...data?.controlExecutedWorkflow,
    tasks: executedWorkflowDetail.node.tasks?.map((task) => ({
      ...task,
      ...data?.controlExecutedWorkflow?.tasks?.find((t) => t.id === task.id),
    })),
  };

  const handleOnRerunClick = () => {
    if (workflowVariables == null) {
      return;
    }

    executeWorkflowByName({
      input: {
        workflowName: executedWorkflow.workflowName || '',
        workflowVersion: executedWorkflow.workflowVersion,
        correlationId: executedWorkflow.correlationId,
        priority: 0,
        inputParameters: JSON.stringify(workflowVariables),
      },
    })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error?.message);
        }

        if (result.data?.executeWorkflowByName == null) {
          throw new Error('Something went wrong');
        }

        // when specific task detail is opened we need to close it after rerun so that we can see new tasks that have different ids
        setOpenedTaskId(null);
        onExecutedOperation(result.data?.executeWorkflowByName || '');
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const workflowForm = executedWorkflow.input != null ? JSON.parse(executedWorkflow.input) : {};
    workflowForm[key] = e.target.value;
    setWorkflowVariables((prev) => ({ ...prev, ...workflowForm }));
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
          content: `Workflow ${executedWorkflow.workflowName} terminated`,
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
          content: `Workflow ${executedWorkflow.workflowName} retried`,
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
          content: `Workflow ${executedWorkflow.workflowName} paused`,
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
          content: `Workflow ${executedWorkflow.workflowName} resumed`,
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
        Details of {executedWorkflow.workflowName} / {executedWorkflow.workflowVersion}
      </Heading>
      <Box>
        {executedWorkflow.parentWorkflowId && (
          <Button display="inline" margin={2} as={Link} to={`../executed/${executedWorkflow.parentWorkflowId}`}>
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
              <Tab
                value="editRerun"
                onClick={() =>
                  setWorkflowVariables(executedWorkflow.input != null ? JSON.parse(executedWorkflow.input) : {})
                }
              >
                Edit & Rerun
              </Tab>
              <Tab>Execution Flow</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {openedTaskId == null && <TaskTable tasks={executedWorkflow.tasks} onTaskClick={setOpenedTaskId} />}

                {openedTaskId != null && executedWorkflow.tasks != null && (
                  <ExecutedWorkflowDetailTaskDetail
                    executedWorkflow={executedWorkflowDetail.node}
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
                    result={executedWorkflowDetail.node}
                    onEscapeChange={() => setIsEscaped(!isEscaped)}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <EditRerunTab
                  onInputChange={handleInputChange}
                  inputs={convertWorkflowVariablesToFormFormat(
                    JSON.stringify(executedWorkflow),
                    JSON.parse(executedWorkflow.input || '{}'),
                    executedWorkflow.workflowDefinition?.inputParameters ?? [],
                  )}
                  onRerunClick={handleOnRerunClick}
                />
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
