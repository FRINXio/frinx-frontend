import './DetailsModal.css';
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
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import TaskTable from './task-table';
import useResponseToasts from '../../../../hooks/use-response-toasts';
import { Task } from '../../../../types/task';
import { WorkflowPayload } from '../../../../types/uniflow-types';

type Props = {
  wfId: string;
  modalHandler: () => void;
  refreshTable: () => void;
  onWorkflowIdClick: (wfId: string) => void;
};

type Status = 'RUNNING' | 'FAILED' | 'TERMINATED' | 'PAUSED';

type WfDetails = {
  shouldShow: boolean;
  meta: {
    name: string;
    version: string;
    inputParameters: string[];
  };
  result: {
    status: Status;
    tasks: Task[];
    startTime: Date | number | string;
    endTime: Date | number | string;
    input: string;
    output: string;
  } | null;
  wfId: string;
  input: WorkflowPayload;
  activeTab: number;
  status: 'Execute' | 'OK' | 'Executing...';
  timeouts: number[];
  parentWfId: string;
  inputsArray: string[];
  taskDetail: Task | null;
  shouldShowTaskModal: boolean;
  wfIdRerun: string;
  isEscaped: boolean;
  subworkflows: any[];
};

const INITIAL_STATE: WfDetails = {
  shouldShow: true,
  meta: {
    name: '',
    version: '',
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
        clearTimeout(timeout);
      });
    };
  }, []);

  const getData = () => {
    const getWorkflowInstanceDetail = callbackUtils.getWorkflowInstanceDetailCallback();

    getWorkflowInstanceDetail(wfId).then((res: any) => {
      const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim;
      const def = JSON.stringify(res);
      let match = inputCaptureRegex.exec(def);
      let inputsArray: string[] = [];

      while (match != null) {
        inputsArray.push(match[1]);
        match = inputCaptureRegex.exec(def);
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

      if (details.result && details.result.status === 'RUNNING') {
        setDetails((prev) => {
          return {
            ...prev,
            // used window.setTimeout because if we use only setTimeout
            // then there is clash between types we can send to clearTimeout
            timeouts: [...prev.timeouts, window.setTimeout(() => getData(), 2000)],
          };
        });
      }
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

  const execTime = (end: Date | number | string | undefined, start: Date | number | string | undefined) => {
    if (end == null || end === 0 || isEmpty(end)) {
      return '';
    }

    const endTime = new Date(end).getTime();

    if (start == null || start === 0 || isEmpty(start)) {
      return endTime / 1000;
    }

    const startTime = new Date(start).getTime();

    const total = endTime - startTime;

    return total / 1000;
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

  const terminateWfs = () => {
    const terminateWorkflows = callbackUtils.terminateWorkflowsCallback();

    terminateWorkflows([details.wfId]).then(() => {
      getData();
    });
  };

  const pauseWfs = () => {
    const pauseWorkflows = callbackUtils.pauseWorkflowsCallback();

    pauseWorkflows([details.wfId]).then(() => {
      getData();
    });
  };

  const resumeWfs = () => {
    const resumeWorkflows = callbackUtils.resumeWorkflowsCallback();

    resumeWorkflows([details.wfId]).then(() => {
      getData();
    });
  };

  const retryWfs = () => {
    const retryWorkflows = callbackUtils.retryWorkflowsCallback();

    retryWorkflows([details.wfId]).then(() => {
      getData();
    });
  };

  const restartWfs = () => {
    const restartWorkflows = callbackUtils.restartWorkflowsCallback();

    restartWorkflows([details.wfId]).then(() => {
      getData();
    });
  };

  const actionButtons = (status: Status | undefined) => {
    switch (status) {
      case 'FAILED':
      case 'TERMINATED':
        return (
          <ButtonGroup float="right">
            <Button onClick={restartWfs} colorScheme="whiteAlpha">
              <i className="fas fa-redo" />
              &nbsp;&nbsp;Restart
            </Button>
            <Button onClick={retryWfs} colorScheme="whiteAlpha">
              <i className="fas fa-history" />
              &nbsp;&nbsp;Retry
            </Button>
          </ButtonGroup>
        );
      case 'RUNNING':
        return (
          <ButtonGroup float="right">
            <Button onClick={terminateWfs} colorScheme="whiteAlpha">
              <i className="fas fa-times" />
              &nbsp;&nbsp;Terminate
            </Button>
            <Button onClick={pauseWfs} colorScheme="whiteAlpha">
              <i className="fas fa-pause" />
              &nbsp;&nbsp;Pause
            </Button>
          </ButtonGroup>
        );
      case 'PAUSED':
        return (
          <ButtonGroup float="right">
            <Button onClick={resumeWfs} colorScheme="whiteAlpha">
              <i className="fas fa-play" />
              &nbsp;&nbsp;Resume
            </Button>
          </ButtonGroup>
        );
      default:
        break;
    }
  };

  const headerInfo = () => (
    <div className="headerInfo">
      <Grid gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
        <Box md="auto">
          <div>
            <b>Total Time (sec)</b>
            <br />
            {execTime(details.result?.endTime, details.result?.startTime)}
          </div>
        </Box>
        <Box md="auto">
          <div>
            <b>Start Time</b>
            <br />
            {formatDate(details.result?.startTime)}
          </div>
        </Box>
        <Box md="auto">
          <div>
            <b>End Time</b>
            <br />
            {formatDate(details.result?.endTime)}
          </div>
        </Box>
        <Box md="auto">
          <div>
            <b>Status</b>
            <br />
            {details.result?.status}
          </div>
        </Box>
        <Box>{actionButtons(details.result?.status)}</Box>
      </Grid>
    </div>
  );

  const inputOutput = () => {
    const { isEscaped, result } = details;
    const input = result?.input ?? '';
    const output = result?.output ?? '';

    return (
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Stack direction="row" spacing={2} align="center" mb={2}>
            <Text as="b" fontSize="sm">
              Workflow Input
            </Text>
            <IconButton
              aria-label="copy"
              icon={<CopyIcon />}
              size="sm"
              className="clp"
              onClick={() => copyToClipBoard(input)}
            />
            <Button
              size="sm"
              onClick={() =>
                setDetails((prevState) => {
                  return { ...prevState, isEscaped: !prevState.isEscaped };
                })
              }
            >
              {isEscaped ? 'Unescape' : 'Escape'}
            </Button>
          </Stack>
          <Textarea value={getUnescapedJSON(input)} isReadOnly={true} id="wfinput" variant="filled" minH={200} />
        </Box>
        <Box>
          <Stack direction="row" spacing={2} align="center" mb={2}>
            <Text as="b" fontSize="sm">
              Workflow Output
            </Text>
            <IconButton
              aria-label="copy"
              icon={<CopyIcon />}
              size="sm"
              className="clp"
              onClick={() => copyToClipBoard(output)}
            />
            <Button
              size="sm"
              onClick={() =>
                setDetails((prevState) => {
                  return { ...prevState, isEscaped: !prevState.isEscaped };
                })
              }
            >
              {isEscaped ? 'Unescape' : 'Escape'}
            </Button>
          </Stack>
          <Textarea value={getUnescapedJSON(output)} isReadOnly={true} id="wfoutput" variant="filled" minH={200} />
        </Box>
      </SimpleGrid>
    );
  };

  const wfJson = () => {
    const { isEscaped, result } = details;

    return (
      <Box>
        <Stack direction="row" spacing={2} align="center" mb={2}>
          <Text as="b" fontSize="sm">
            Workflow JSON
          </Text>
          <IconButton
            aria-label="copy"
            icon={<CopyIcon />}
            size="sm"
            className="clp"
            onClick={() => copyToClipBoard(result)}
          />
          <Button
            size="sm"
            onClick={() =>
              setDetails((prev) => {
                return { ...prev, isEscaped: !prev.isEscaped };
              })
            }
          >
            {isEscaped ? 'Unescape' : 'Escape'}
          </Button>
        </Stack>
        <Textarea value={getUnescapedJSON(result)} isReadOnly={true} id="json" variant="filled" minH={200} />
      </Box>
    );
  };

  const editRerun = () => {
    const input = details.input?.input ?? {};
    const iPam = details.meta.inputParameters || [];
    const labels = details.inputsArray;
    const values: string[] = [];

    labels.forEach((label: string) => {
      const key = Object.keys(input).findIndex((key) => key === label);
      key > -1 ? values.push(Object.values(input)[key]) : values.push('');
    });

    const matchParam = (param: string) => {
      return param.match(/\[(.*?)]/);
    };

    const descriptions = iPam.map((param: string) => {
      if (matchParam(param) && matchParam(param)?.length) {
        return matchParam(param)![1];
      }

      return '';
    });

    return labels.map((label: string, i) => {
      return (
        <Box key={`col1-${i}`}>
          <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input
              onChange={(e) => handleInput(e, labels[i])}
              placeholder="Enter the input"
              value={values[i] ? (typeof values[i] === 'object' ? JSON.stringify(values[i]) : values[i]) : ''}
            />
            <FormHelperText className="text-muted">{descriptions[i]}</FormHelperText>
          </FormControl>
        </Box>
      );
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
            {headerInfo()}
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
                <TabPanel>{inputOutput()}</TabPanel>
                <TabPanel>{wfJson()}</TabPanel>
                <TabPanel>
                  <Text as="b" fontSize="sm">
                    Edit & Rerun Workflow
                  </Text>
                  <Box>
                    <form>
                      <Grid gridTemplateColumns="1fr 1fr" gap={4}>
                        {editRerun()}
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
