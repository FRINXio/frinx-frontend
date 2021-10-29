import React, { ChangeEvent, FC, useEffect, useState } from 'react';
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
import { WorkflowPayload } from '../../types/uniflow-types';
import { Workflow, WorkflowInstanceDetail } from '../../types/types';
import InputOutputTab from './executed-workflow-detail-tabs/input-output-tab';
import WorkflowJsonTab from './executed-workflow-detail-tabs/workflow-json-tab';
import EditRerunTab from './executed-workflow-detail-tabs/edit-rerun-tab';
import DetailsModalHeader from './executed-workflow-detail-header';

type Props = {
  workflowId: string;
  onWorkflowIdClick: (workflowId: string) => void;
};

export type Status = 'RUNNING' | 'FAILED' | 'TERMINATED' | 'PAUSED';

export type ExecutedWorkflowDetailResult = {
  status: Status;
  tasks: Task[];
  startTime: Date | number | string;
  endTime: Date | number | string;
  input: Record<string, string>;
  output: Record<string, string>;
};

type workflowDetails = {
  meta: Partial<Workflow>;
  result: ExecutedWorkflowDetailResult | null;
  workflowId: string;
  input: WorkflowPayload;
  status: 'Execute' | 'OK' | 'Executing...';
  timeouts: any[];
  parentWorkflowId: string;
  editAndRerunInputLabels: string[];
  workflowIdRerun: string;
  isEscaped: boolean;
  subworkflows: WorkflowInstanceDetail[];
};

const INITIAL_STATE: workflowDetails = {
  meta: {
    name: '',
    version: 0,
    inputParameters: [],
  },
  result: null,
  workflowId: '',
  input: {
    input: {},
    name: '',
    version: 0,
  },
  status: 'Execute',
  timeouts: [],
  parentWorkflowId: '',
  editAndRerunInputLabels: [],
  workflowIdRerun: '',
  isEscaped: true,
  subworkflows: [],
};

const DetailsModal: FC<Props> = ({ workflowId, onWorkflowIdClick }) => {
  const [details, setDetails] = useState<workflowDetails>(INITIAL_STATE);
  const [openedTask, setOpenedTask] = useState<Task | null>(null);
  const taskModalDisclosure = useDisclosure();

  useEffect(() => {
    fetchWorkflowData();

    return () => {
      details.timeouts.forEach((timeout) => {
        clearInterval(timeout);
      });
    };
  }, []);

  const fetchWorkflowData = () => {
    const getWorkflowInstanceDetail = callbackUtils.getWorkflowInstanceDetailCallback();

    getWorkflowInstanceDetail(workflowId).then((res) => {
      const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim;
      const def = JSON.stringify(res);
      let match = inputCaptureRegex.exec(def);
      let editAndRerunInputLabels: string[] = [];

      while (match != null) {
        editAndRerunInputLabels.push(match[1]);
        match = inputCaptureRegex.exec(def);
      }

      if (res != null && res.result.status !== 'RUNNING') {
        details.timeouts.forEach((timeout) => {
          clearInterval(timeout);
        });
      }

      editAndRerunInputLabels = [...new Set(editAndRerunInputLabels)];

      setDetails((prev) => {
        return {
          ...prev,
          meta: res.meta,
          result: res.result,
          subworkflows: res.subworkflows,
          input: {
            name: res.meta.name,
            version: res.meta.version,
            input: res.result.input,
          },
          workflowId: res.result.workflowId,
          parentWorkflowId: res.result.parentWorkflowId || '',
          editAndRerunInputLabels,
        };
      });
    });
  };

  const copyToClipBoard = (textToCopy: any) => {
    navigator.clipboard.writeText(JSON.stringify(textToCopy));
  };

  const getUnescapedJSON = (data: any) => {
    return details.isEscaped
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
    setDetails((prev) => {
      return {
        ...prev,
        status: 'Executing...',
      };
    });

    const executeWorkflow = callbackUtils.executeWorkflowCallback();

    executeWorkflow(details.input).then((res) => {
      const setStatus = window.setTimeout(() => {
        setDetails((prev) => {
          return {
            ...prev,
            status: 'Execute',
          };
        });
      }, 1000);

      setDetails((prev) => {
        return {
          ...prev,
          status: 'OK',
          workflowIdRerun: res.name,
          timeouts: [...prev.timeouts, setStatus],
        };
      });
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    let workflowForm = details.input?.input ?? ({} as any);
    workflowForm[key] = e.target.value;
    setDetails((prev) => {
      return {
        ...prev,
        input: {
          ...details.input,
          input: workflowForm,
        },
      };
    });
  };

  const formatDate = (date: Date | number | undefined | null | string) => {
    try {
      if (date == null) {
        throw new Error();
      }

      return moment(date).format('MM/DD/YYYY, HH:mm:ss');
    } catch (error) {
      return '-';
    }
  };

  const restartWorkflows = () => {
    const restartWorkflows = callbackUtils.restartWorkflowsCallback();

    restartWorkflows([details.workflowId]).then(() => {
      fetchWorkflowData();
      setDetails((prev) => {
        return {
          ...prev,
          timeouts: [...prev.timeouts, setInterval(() => fetchWorkflowData(), 2000)],
        };
      });
    });
  };

  const handleOnOpenTaskModal = (task: Task) => {
    setOpenedTask(task);
    taskModalDisclosure.onOpen();
  };

  const handleOnCloseTaskModal = () => {
    setOpenedTask(null);
    taskModalDisclosure.onClose();
  };

  const isResultInputOutputLoaded =
    details.result != null && details.result.input != null && details.result.output != null;

  return (
    <Container maxWidth={1280}>
      {openedTask != null && (
        <TaskModal task={openedTask} isOpen={taskModalDisclosure.isOpen} onClose={handleOnCloseTaskModal} />
      )}
      <Heading size="xl" marginBottom={10}>
        Details of {details.meta.name ? details.meta.name : null} / {details.meta.version}
      </Heading>
      <Box>
        {details.parentWorkflowId && (
          <Button display="inline" margin={2} onClick={() => onWorkflowIdClick(details.parentWorkflowId)}>
            Parent
          </Button>
        )}
      </Box>
      <DetailsModalHeader
        workflowId={details.workflowId}
        onWorkflowActionExecution={fetchWorkflowData}
        endTime={formatDate(details.result?.endTime)}
        startTime={formatDate(details.result?.startTime)}
        restartWorkflows={restartWorkflows}
        status={details.result?.status}
      />
      <Tabs>
        <TabList>
          <Tab>Task Details</Tab>
          <Tab>Input/Output</Tab>
          <Tab>JSON</Tab>
          <Tab value="editRerun">Edit & Rerun</Tab>
          <Tab>Execution Flow</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TaskTable
              tasks={details.result?.tasks ?? []}
              onTaskClick={handleOnOpenTaskModal}
              onWorkflowClick={onWorkflowIdClick}
              formatDate={formatDate}
            />
          </TabPanel>
          <TabPanel>
            {isResultInputOutputLoaded && (
              <InputOutputTab
                copyToClipBoard={copyToClipBoard}
                isEscaped={details.isEscaped}
                input={details.result?.input ?? {}}
                output={details.result?.output ?? {}}
                onEscapeChange={(isEscaped) => setDetails((prev) => ({ ...prev, isEscaped }))}
                getUnescapedJSON={getUnescapedJSON}
              />
            )}
          </TabPanel>
          <TabPanel>
            {details.result != null && (
              <WorkflowJsonTab
                copyToClipBoard={copyToClipBoard}
                isEscaped={details.isEscaped}
                result={details.result}
                onEscapeChange={(isEscaped) => setDetails((prev) => ({ ...prev, isEscaped }))}
                getUnescapedJSON={getUnescapedJSON}
              />
            )}
          </TabPanel>
          <TabPanel>
            <EditRerunTab
              onInputChange={handleInputChange}
              inputParameters={details.meta.inputParameters}
              inputLabels={details.editAndRerunInputLabels}
              workflowPayload={details.input}
              status={details.status}
              onRerunClick={executeWorkflow}
            />
          </TabPanel>
          <TabPanel>
            <WorkflowDia meta={details.meta} workflowe={details.result} subworkflows={details.subworkflows} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Button
        variant="link"
        colorScheme="blue"
        justifySelf="start"
        onClick={() => onWorkflowIdClick(details.workflowIdRerun)}
      >
        {details.workflowIdRerun}
      </Button>
    </Container>
  );
};

export default DetailsModal;
