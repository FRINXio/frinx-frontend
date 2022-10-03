import React, { ChangeEvent, FC, useState } from 'react';
import { TaskModal } from '@frinx/workflow-ui/src/common/modals';
import moment from 'moment';
import unescapeJs from 'unescape-js';
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
  useDisclosure,
} from '@chakra-ui/react';
import { useNotifications, unwrap } from '@frinx/shared/src';
import { ExecutedWorkflowTask } from '@frinx/workflow-ui/src/helpers/types';
import { Link, useParams } from 'react-router-dom';
import callbackUtils from '../../utils/callback-utils';
import TaskTable from './task-table';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import DetailsModalHeader from './executed-workflow-detail-header';
import { useWorkflowGenerator } from './executed-workflow-detail-status.helpers';
import copyToClipBoard from '../../helpers/copy-to-clipboard';
import WorkflowDiagram from '../../common/workflow-diagram';

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
  const execPayload = useWorkflowGenerator(unwrap(workflowId));
  const [openedTask, setOpenedTask] = useState<ExecutedWorkflowTask | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);
  const [workflowVariables, setWorkflowVariables] = useState<Record<string, string> | null>(null);
  const { addToastNotification } = useNotifications();
  const [tabIndex, setTabIndex] = useState(0);

  if (execPayload == null) {
    return <Progress isIndeterminate size="xs" mt={-10} />;
  }

  if (workflowId == null) {
    return null;
  }

  const { result, meta } = execPayload;

  const getUnescapedJSON = (data: Record<string, unknown> | unknown) => {
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
      setTabIndex(0);
      addToastNotification({
        content: 'Successfully executed workflow',
        type: 'success',
      });
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const workflowForm = result.input;
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

  const handleOnRestartWorkflows = () => {
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
        restartWorkflows={handleOnRestartWorkflows}
        status={result.status}
        visibleRestartButton={result.workflowDefinition.restartable}
      />
      <Box background="white" borderRadius={4} mb={5}>
        <Tabs index={tabIndex} onChange={setTabIndex}>
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
              <WorkflowDiagram meta={meta} result={result} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default DetailsModal;
