import React, { ChangeEvent, FC, useState } from 'react';
import { TaskModal } from '@frinx/workflow-ui/src/common/modals';
import moment from 'moment';
import unescapeJs from 'unescape-js';
import {
  Box,
  Button,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import { Link, useParams } from 'react-router-dom';
import { gql, useMutation, useSubscription } from 'urql';
import {
  ControlExecutedWorkflowSubscription,
  ControlExecutedWorkflowSubscriptionVariables,
  ExecuteWorkflowByItsNameMutation,
  ExecuteWorkflowByItsNameMutationVariables,
} from '../../__generated__/graphql';
import TaskTable from './task-table';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import DetailsModalHeader from './executed-workflow-detail-header';
import copyToClipBoard from '../../helpers/copy-to-clipboard';
import WorkflowDiagram from '../../common/workflow-diagram';

const EXECUTED_WORKFLOW_SUBSCRIPTION = gql`
  subscription ControlExecutedWorkflow($controlExecutedWorkflowId: String!) {
    controlExecutedWorkflow(id: $controlExecutedWorkflowId) {
      result {
        id
        version
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
          version
          taskType
          taskReferenceName
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
      meta {
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
  mutation RestartWorkflow($restartWorkflowId: String!, $resumeWorkflowId: String!, $pauseWorkflowId: String!) {
    restartWorkflow(id: $restartWorkflowId) {
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

const DetailsModal: FC<Props> = ({ onExecutedOperation }) => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const taskModalDisclosure = useDisclosure();
  const [openedTaskId, setOpenedTaskId] = useState<string | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);
  const [workflowVariables, setWorkflowVariables] = useState<Record<string, string> | null>(null);
  const { addToastNotification } = useNotifications();
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  const [, executeWorkflowByName] = useMutation<
    ExecuteWorkflowByItsNameMutation,
    ExecuteWorkflowByItsNameMutationVariables
  >(EXECUTE_WORKFLOW_MUTATION);
  const [{ data, error }] = useSubscription<
    ControlExecutedWorkflowSubscription,
    ControlExecutedWorkflowSubscription,
    ControlExecutedWorkflowSubscriptionVariables
  >(
    {
      query: EXECUTED_WORKFLOW_SUBSCRIPTION,
      variables: { controlExecutedWorkflowId: workflowId || '' },
    },
    (_, curr) => curr,
  );

  const [, restartWorkflow] = useMutation(RESTART_WORKFLOW_MUTATION);

  if (workflowId == null) {
    return null;
  }

  if (error || data == null) {
    return <Container maxWidth={1280}>We had problem to find executed workflow</Container>;
  }

  const executedWorkflow = data.controlExecutedWorkflow;

  if (executedWorkflow == null) {
    return <Container maxWidth={1280}>We had problem to find executed workflow</Container>;
  }

  const handleOnRerunClick = () => {
    if (workflowVariables == null) {
      return;
    }

    const { result: executionResult } = executedWorkflow;

    if (!executionResult) {
      return;
    }

    executeWorkflowByName({
      input: {
        workflowName: executionResult.workflowName || '',
        workflowVersion: executionResult.workflowVersion ? String(executionResult.workflowVersion) : '1',
        correlationId: executionResult.correlationId,
        priority: 0,
        inputParameters: JSON.stringify(workflowVariables),
      },
    })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error?.message);
        }

        addToastNotification({
          title: 'Workflow started',
          content: `Workflow ${executionResult.workflowName} started`,
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

  const getUnescapedJSON = (item: Record<string, unknown> | unknown) => {
    return isEscaped
      ? JSON.stringify(item, null, 2)
          .replace(/\\n/g, '\\n')
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, '\\&')
          .replace(/\\r/g, '\\r')
          .replace(/\\t/g, '\\t')
          .replace(/\\b/g, '\\b')
          .replace(/\\f/g, '\\f')
      : unescapeJs(JSON.stringify(item, null, 2));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const workflowForm = executedWorkflow.result.input != null ? JSON.parse(executedWorkflow.result.input) : {};
    workflowForm[key] = e.target.value;
    setWorkflowVariables((prev) => ({ ...prev, ...workflowForm }));
  };

  const formatDate = (date: Date | number | undefined | null | string) => {
    if (date == null || date === 0) {
      return '-';
    }

    return moment(date).format('MM/DD/YYYY, HH:mm:ss');
  };

  const handleOnOpenTaskModal = (id: string) => {
    setOpenedTaskId(id);
    taskModalDisclosure.onOpen();
  };

  const handleOnCloseTaskModal = () => {
    setOpenedTaskId(null);
    taskModalDisclosure.onClose();
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

  const { result } = executedWorkflow;

  return (
    <Container maxWidth={1280}>
      {openedTaskId != null && (
        <TaskModal
          taskId={openedTaskId}
          executedWorkflow={executedWorkflow}
          isOpen={taskModalDisclosure.isOpen}
          onClose={handleOnCloseTaskModal}
        />
      )}
      <Heading size="xl" marginBottom={10}>
        Details of {result.workflowName} / {result.workflowVersion}
      </Heading>
      <Box>
        {result.parentWorkflowId && (
          <Button display="inline" margin={2} as={Link} to={`../executed/${result.parentWorkflowId}`}>
            Parent
          </Button>
        )}
      </Box>
      <DetailsModalHeader
        workflowId={workflowId}
        onWorkflowActionExecution={onExecutedOperation}
        endTime={formatDate(result.endTime)}
        startTime={formatDate(result.startTime)}
        restartWorkflows={() => {
          restartWorkflow({
            restartWorkflowId: workflowId,
          });
        }}
        status={result.status}
        visibleRestartButton={result.workflowDefinition?.restartable ?? false}
      />
      <Box background="white" borderRadius={4} mb={5}>
        <Tabs index={tabIndex} onChange={setTabIndex}>
          <TabList>
            <Tab>Task Details</Tab>
            <Tab>Input/Output</Tab>
            <Tab>JSON</Tab>
            <Tab
              value="editRerun"
              onClick={() => setWorkflowVariables(result.input != null ? JSON.parse(result.input) : {})}
            >
              Edit & Rerun
            </Tab>
            <Tab>Execution Flow</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TaskTable
                executedWorkflow={executedWorkflow}
                onTaskClick={handleOnOpenTaskModal}
                formatDate={formatDate}
              />
            </TabPanel>
            <TabPanel>
              <InputOutputTab
                copyToClipBoard={handleCopyToClipborad}
                isEscaped={isEscaped}
                input={result.input != null ? JSON.parse(result.input) : {}}
                output={result.output != null ? JSON.parse(result.output) : {}}
                onEscapeChange={() => setIsEscaped(!isEscaped)}
              />
            </TabPanel>
            <TabPanel>
              {executedWorkflow != null && (
                <WorkflowJsonTab
                  copyToClipBoard={handleCopyToClipborad}
                  isEscaped={isEscaped}
                  result={executedWorkflow}
                  onEscapeChange={() => setIsEscaped(!isEscaped)}
                  getUnescapedJSON={getUnescapedJSON}
                />
              )}
            </TabPanel>
            <TabPanel>
              <EditRerunTab
                onInputChange={handleInputChange}
                inputs={convertWorkflowVariablesToFormFormat(
                  JSON.stringify(executedWorkflow),
                  JSON.parse(result.input || '{}'),
                  result.workflowDefinition?.inputParameters ?? [],
                )}
                isExecuting={result.status === 'RUNNING'}
                onRerunClick={handleOnRerunClick}
              />
            </TabPanel>
            <TabPanel>
              <WorkflowDiagram executedWorkflow={executedWorkflow} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default DetailsModal;
