import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TaskModal from '../../common/task-modal';
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
import { Task } from '../../types/task';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import DetailsModalHeader from './executed-workflow-detail-header';
import { useAsyncGenerator } from './executed-workflow-detail-status.helpers';

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
  workflowId: string;
  onExecutedOperation: () => void;
  onWorkflowIdClick: (workflowId: string) => void;
};

export type Status = 'RUNNING' | 'FAILED' | 'TERMINATED' | 'PAUSED' | 'COMPLETED';

export type ExecutedWorkflowDetailResult = {
  status: Status;
  tasks: Task[];
  startTime: Date | number | string;
  endTime: Date | number | string;
  input: Record<string, string>;
  output: Record<string, string>;
  externalInputPayloadStoragePath?: string;
  externalOutputPayloadStoragePath?: string;
};

const DetailsModal: FC<Props> = ({ workflowId, onWorkflowIdClick, onExecutedOperation }) => {
  const taskModalDisclosure = useDisclosure();
  const execPayload = useAsyncGenerator(workflowId);
  const [openedTask, setOpenedTask] = useState<Task | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);
  const [workflowVariables, setWorkflowVariables] = useState<Record<string, string> | null>(null);

  if (execPayload == null) {
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

  const executeWorkflow = () => {
    const executeWorkflow = callbackUtils.executeWorkflowCallback();
    const workflowPayload = {
      name: meta.name,
      version: meta.version,
      input: {
        ...result.input,
        ...workflowVariables,
      },
    };
    executeWorkflow(workflowPayload);
    onExecutedOperation();
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
    const restartWorkflows = callbackUtils.restartWorkflowsCallback();
    restartWorkflows([workflowId]);
    onExecutedOperation();
  };

  const handleOnOpenTaskModal = (task: Task) => {
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
          <Button display="inline" margin={2} onClick={() => onWorkflowIdClick(result.parentWorkflowId)}>
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
              <TaskTable
                tasks={result.tasks}
                onTaskClick={handleOnOpenTaskModal}
                onWorkflowClick={onWorkflowIdClick}
                formatDate={formatDate}
              />
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
                  externalInputPayloadStoragePath={details.result?.externalInputPayloadStoragePath}
                  externalOutputPayloadStoragePath={details.result?.externalOutputPayloadStoragePath}
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
                isSuccessfullyExecuted={result.status === 'COMPLETED'}
                onRerunClick={executeWorkflow}
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
