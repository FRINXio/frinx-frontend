import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import TaskModal from '../../../../common/task-modal';
import WorkflowDia from './WorkflowDia/WorkflowDia';
import callbackUtils from '../../../../utils/callback-utils';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import unescapeJs from 'unescape-js';
import {
  Box,
  Button,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import TaskTable from './task-table';
import useResponseToasts from '../../../../hooks/use-response-toasts';
import { Task } from '../../../../types/task';
import { WorkflowPayload } from '../../../../types/uniflow-types';
import { Workflow, WorkflowInstanceDetail } from '../../../../types/types';
import InputOutputTab from './details-modal-tabs/input-output-tab';
import WorkflowJsonTab from './details-modal-tabs/workflow-json-tab';
import EditRerunTab from './details-modal-tabs/edit-rerun-tab';
import DetailsModalHeader from './details-modal-header';

type Props = {
  wfId: string;
  modalHandler: () => void;
  refreshTable: () => void;
  onWorkflowIdClick: (wfId: string) => void;
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

type WfDetails = {
  shouldShow: boolean;
  meta: Partial<Workflow>;
  result: ExecutedWorkflowDetailResult | null;
  wfId: string;
  input: WorkflowPayload;
  activeTab: number;
  status: 'Execute' | 'OK' | 'Executing...';
  timeouts: any[];
  parentWfId: string;
  inputsArray: string[];
  taskDetail: Task | null;
  shouldShowTaskModal: boolean;
  wfIdRerun: string;
  isEscaped: boolean;
  subworkflows: WorkflowInstanceDetail[];
};

const INITIAL_STATE: WfDetails = {
  shouldShow: true,
  meta: {
    name: '',
    version: 0,
    inputParameters: [],
  },
  result: null,
  wfId: '',
  input: {
    input: {},
    name: '',
    version: 0,
  },
  activeTab: 1,
  status: 'Execute',
  timeouts: [],
  parentWfId: '',
  inputsArray: [],
  taskDetail: null,
  shouldShowTaskModal: false,
  wfIdRerun: '',
  isEscaped: true,
  subworkflows: [],
};

const DetailsModal: FC<Props> = ({ wfId, modalHandler, onWorkflowIdClick, refreshTable }) => {
  const [isCopiedSuccessfully, setIsCopiedSuccessfully] = useState(false);
  useResponseToasts({
    isSuccess: isCopiedSuccessfully,
    isFailure: !isCopiedSuccessfully,
    successMessage: 'Copied to clipboard',
    failureMessage: 'Copying to clipboard was not successfull',
  });

  const [details, setDetails] = useState<WfDetails>(INITIAL_STATE);

  useEffect(() => {
    getData();

    return () => {
      details.timeouts.forEach((timeout) => {
        clearInterval(timeout);
      });
    };
  }, []);

  const getData = () => {
    const getWorkflowInstanceDetail = callbackUtils.getWorkflowInstanceDetailCallback();

    getWorkflowInstanceDetail(wfId).then((res) => {
      const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim;
      const def = JSON.stringify(res);
      let match = inputCaptureRegex.exec(def);
      let inputsArray: string[] = [];

      while (match != null) {
        inputsArray.push(match[1]);
        match = inputCaptureRegex.exec(def);
      }

      if (res != null && res.result.status !== 'RUNNING') {
        details.timeouts.forEach((timeout) => {
          clearInterval(timeout);
        });
      }

      inputsArray = [...new Set(inputsArray)];

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
          wfId: res.result.workflowId,
          parentWfId: res.result.parentWorkflowId || '',
          inputsArray: inputsArray,
        };
      });
    });
  };

  const copyToClipBoard = (textToCopy: any) => {
    navigator.clipboard
      .writeText(JSON.stringify(textToCopy))
      .then(() => setIsCopiedSuccessfully(true))
      .catch(() => setIsCopiedSuccessfully(false));
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

  const handleClose = () => {
    setDetails((prev) => {
      return {
        ...prev,
        shouldShow: false,
      };
    });
    modalHandler();
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
        refreshTable();
      }, 1000);

      setDetails((prev) => {
        return {
          ...prev,
          status: 'OK',
          wfIdRerun: res.name,
          timeouts: [...prev.timeouts, setStatus],
        };
      });
    });
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    let wfForm = details.input?.input ?? ({} as any);
    wfForm[key] = e.target.value;
    setDetails((prev) => {
      return {
        ...prev,
        input: {
          ...details.input,
          input: wfForm,
        },
      };
    });
  };

  const formatDate = (dt: Date | number | undefined | null | string) => {
    try {
      if (isEmpty(dt)) {
        throw new Error();
      }

      const resultTime = moment(dt).format('MM/DD/YYYY, HH:mm:ss:SSS');
      return resultTime;
    } catch (error) {
      return '-';
    }
  };

  const handleTaskDetail = (row: Task | null = null) => {
    if (isEmpty(row)) {
      setDetails((prev) => {
        return {
          ...prev,
          taskDetail: details.taskDetail,
          shouldShowTaskModal: !details.shouldShowTaskModal,
        };
      });
      return;
    }

    setDetails((prev) => {
      return {
        ...prev,
        taskDetail: row,
        shouldShowTaskModal: !details.shouldShowTaskModal,
      };
    });
  };

  const restartWfs = () => {
    const restartWorkflows = callbackUtils.restartWorkflowsCallback();

    restartWorkflows([details.wfId]).then(() => {
      getData();
      setDetails((prev) => {
        return {
          ...prev,
          timeouts: [setInterval(() => getData(), 2000)],
        };
      });
    });
  };

  const parentWorkflowButton = () => {
    if (details.parentWfId) {
      return (
        <Button style={{ margin: '2px', display: 'inline' }} onClick={() => onWorkflowIdClick(details.parentWfId)}>
          Parent
        </Button>
      );
    }
  };

  const isResultInputOutputLoaded =
    details.result != null && details.result.input != null && details.result.output != null;

  return (
    <>
      {details.taskDetail != null && (
        <TaskModal task={details.taskDetail} show={details.shouldShowTaskModal} handle={handleTaskDetail} />
      )}
      <Modal size="5xl" isOpen={details.shouldShow && !details.shouldShowTaskModal} onClose={handleClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            Details of {details.meta.name ? details.meta.name : null} / {details.meta.version}
            <div>{parentWorkflowButton()}</div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DetailsModalHeader
              wfId={details.wfId}
              onWorkflowActionExecution={getData}
              endTime={formatDate(details.result?.endTime)}
              startTime={formatDate(details.result?.startTime)}
              restartWfs={restartWfs}
              status={details.result?.status}
            />
            <Tabs
              value={details.activeTab}
              onChange={(index) => {
                setDetails((prev) => {
                  return {
                    ...prev,
                    activeTab: index,
                  };
                });
              }}
            >
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
                    onTaskClick={handleTaskDetail}
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
                  <Text as="b" fontSize="sm">
                    Edit & Rerun Workflow
                  </Text>
                  <Box>
                    <form>
                      <Grid gridTemplateColumns="1fr 1fr" gap={4}>
                        <EditRerunTab
                          handleInput={handleInput}
                          inputParameters={details.meta.inputParameters}
                          inputsArray={details.inputsArray}
                          workflowPayload={details.input}
                        />
                      </Grid>
                    </form>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <WorkflowDia meta={details.meta} wfe={details.result} subworkflows={details.subworkflows} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button
              variant="link"
              colorScheme="blue"
              justifySelf="start"
              onClick={() => onWorkflowIdClick(details.wfIdRerun)}
            >
              {details.wfIdRerun}
            </Button>
            <Flex>
              {details.activeTab === 3 ? (
                <Button
                  marginRight={4}
                  colorScheme={
                    details.status === 'OK'
                      ? 'green'
                      : details.status === 'Executing...'
                      ? 'teal'
                      : details.status === 'Execute'
                      ? 'blue'
                      : 'red'
                  }
                  onClick={executeWorkflow}
                >
                  {details.status}
                </Button>
              ) : null}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetailsModal;
