import React, { ChangeEvent, FC, useState } from 'react';
import TaskModal from '../../common/modals/task-modal';
import WorkflowDia from './WorkflowDia/WorkflowDia';
import callbackUtils from '../../utils/callback-utils';
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
  useDisclosure,
} from '@chakra-ui/react';
import TaskTable from './task-table';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import DetailsModalHeader from './executed-workflow-detail-header';
import { useAsyncGenerator } from './executed-workflow-detail-status.helpers';
import { ExecutedWorkflowTask } from '@frinx/workflow-ui/src/helpers/types';
import { Link, useParams } from 'react-router-dom';
import unwrap from '../../helpers/unwrap';

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
    if (matchParam(param) && matchParam(param)?.length) {
      return matchParam(param)![1];
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
  const execPayload = useAsyncGenerator(unwrap(workflowId));
  const [openedTask, setOpenedTask] = useState<ExecutedWorkflowTask | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);
  const [workflowVariables, setWorkflowVariables] = useState<Record<string, string> | null>(null);

  if (execPayload == null) {
    return null;
  }

  if (workflowId == null) {
    return null;
  }

  const { result, meta, subworkflows } = execPayload;

  const copyToClipBoard = (textToCopy: any) => {
    navigator.clipboard.writeText(JSON.stringify(textToCopy));
  };

  const getUnescapedJSON = (data: any) => {
    return isEscaped
      ? JSON.stringify(data, null, 2)
          .replace(/\\n/g, '\\n')
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, '\\&')
          .replace(/\\r/g, '\\r')
          .replace(/\\t/g, '\\t')
          .replace(/\\b/g, '\\b')
          .replace(/\\f/g, '\\f')
      : unescapeJs(JSON.stringify(data, null, 2));
  };

  const handleWorkflowExecution = () => {
    const { executeWorkflow } = callbackUtils.getCallbacks;
    const workflowPayload = {
      name: meta.name,
      version: meta.version,
      input: {
        ...result.input,
        ...workflowVariables,
      },
    };
    executeWorkflow(workflowPayload).then((res) => {
      onExecutedOperation(res.text);
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    let workflowForm = result.input;
    workflowForm[key] = e.target.value;
    setWorkflowVariables((prev) => ({ ...prev, ...workflowForm }));
  };

  const formatDate = (date: Date | number | undefined | null | string) => {
    try {
      if (date == null || date === 0) {
        throw new Error();
      }

      return moment(date).format('MM/DD/YYYY, HH:mm:ss');
    } catch (error) {
      return '-';
    }
  };

  const restartWorkflows = () => {
    const { restartWorkflows } = callbackUtils.getCallbacks;
    restartWorkflows([workflowId]).then(() => {
      onExecutedOperation(workflowId);
    });
  };

  const handleOnOpenTaskModal = (task: ExecutedWorkflowTask) => {
    setOpenedTask(task);
    taskModalDisclosure.onOpen();
  };

  const handleOnCloseTaskModal = () => {
    setOpenedTask(null);
    taskModalDisclosure.onClose();
  };

  const isResultInputOutputLoaded = result != null && result.input != null && result.output != null;

  return (
    <Container maxWidth={1280}>
      {openedTask != null && (
        <TaskModal task={openedTask} isOpen={taskModalDisclosure.isOpen} onClose={handleOnCloseTaskModal} />
      )}
      <Heading size="xl" marginBottom={10}>
        Details of {meta.name ? meta.name : null} / {meta.version}
      </Heading>
      <Box>
        {result.parentWorkflowId && (
          <Button display="inline" margin={2} as={Link} to={`/uniflow/executed/${result.parentWorkflowId}`}>
            Parent
          </Button>
        )}
      </Box>
      <DetailsModalHeader
        workflowId={workflowId}
        onWorkflowActionExecution={onExecutedOperation}
        endTime={formatDate(result.endTime)}
        startTime={formatDate(result.startTime)}
        restartWorkflows={restartWorkflows}
        status={result.status}
      />
      <Box background="white" borderRadius={4}>
        <Tabs>
          <TabList>
            <Tab>Task Details</Tab>
            <Tab>Input/Output</Tab>
            <Tab>JSON</Tab>
            <Tab value="editRerun" onClick={() => setWorkflowVariables(result.input)}>
              Edit & Rerun
            </Tab>
            <Tab>Execution Flow</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TaskTable tasks={result.tasks} onTaskClick={handleOnOpenTaskModal} formatDate={formatDate} />
            </TabPanel>
            <TabPanel>
              {isResultInputOutputLoaded && (
                <InputOutputTab
                  copyToClipBoard={copyToClipBoard}
                  isEscaped={isEscaped}
                  input={result.input}
                  output={result.output}
                  onEscapeChange={() => setIsEscaped(!isEscaped)}
                  getUnescapedJSON={getUnescapedJSON}
                  externalInputPayloadStoragePath={result.externalInputPayloadStoragePath}
                  externalOutputPayloadStoragePath={result.externalOutputPayloadStoragePath}
                />
              )}
            </TabPanel>
            <TabPanel>
              {result != null && (
                <WorkflowJsonTab
                  copyToClipBoard={copyToClipBoard}
                  isEscaped={isEscaped}
                  result={result}
                  onEscapeChange={() => setIsEscaped(!isEscaped)}
                  getUnescapedJSON={getUnescapedJSON}
                />
              )}
            </TabPanel>
            <TabPanel>
              <EditRerunTab
                onInputChange={handleInputChange}
                inputs={convertWorkflowVariablesToFormFormat(
                  JSON.stringify(execPayload),
                  result.input,
                  meta.inputParameters,
                )}
                isExecuting={result.status === 'RUNNING'}
                onRerunClick={handleWorkflowExecution}
              />
            </TabPanel>
            <TabPanel>
              <WorkflowDia meta={meta} wfe={result} subworkflows={subworkflows} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default DetailsModal;
