// @flow
import './DetailsModal.css';
import Clipboard from 'clipboard';
import React, { Component } from 'react';
import TaskModal from '../../../../common/TaskModal';
import UnescapeButton from '../../../../common/UnescapeButton';
import WorkflowDia from './WorkflowDia/WorkflowDia';
import callbackUtils from '../../../../utils/callbackUtils';
import moment from 'moment';
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

new Clipboard('.clp');

class DetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      meta: {},
      result: {},
      wfId: '',
      input: {},
      activeTab: null,
      status: 'Execute',
      timeout: null,
      parentWfId: '',
      inputsArray: [],
      taskDetail: {},
      taskModal: false,
      wfIdRerun: '',
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  getData() {
    const getWorkflowInstanceDetail = callbackUtils.getWorkflowInstanceDetailCallback();

    getWorkflowInstanceDetail(this.props.wfId).then((res) => {
      const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim;
      const def = JSON.stringify(res);
      let match = inputCaptureRegex.exec(def);
      let inputsArray = [];

      while (match != null) {
        inputsArray.push(match[1]);
        match = inputCaptureRegex.exec(def);
      }

      inputsArray = [...new Set(inputsArray)];

      this.setState({
        meta: res.meta,
        result: res.result,
        subworkflows: res.subworkflows,
        input:
          {
            name: res.meta.name,
            version: res.meta.version,
            input: res.result.input,
          } || {},
        wfId: res.result.workflowId,
        parentWfId: res.result.parentWorkflowId || '',
        inputsArray: inputsArray,
      });

      if (this.state.result.status === 'RUNNING') {
        this.setState({
          timeout: setTimeout(() => this.getData(), 2000),
        });
      }
    });
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  executeWorkflow() {
    this.setState({ status: 'Executing...' });

    const executeWorkflow = callbackUtils.executeWorkflowCallback();

    executeWorkflow(this.state.input).then((res) => {
      this.setState({
        status: 'OK',
        wfIdRerun: res.text,
      });
      setTimeout(() => {
        this.setState({ status: 'Execute' });
        this.props.refreshTable();
      }, 1000);
    });
  }

  handleInput(e, key) {
    let wfForm = this.state.input.input;
    if (!wfForm) wfForm = {};
    wfForm[key] = e.target.value;
    this.setState({
      input: {
        ...this.state.input,
        input: wfForm,
      },
    });
  }

  formatDate(dt) {
    console.log(dt);
    if (dt == null || dt === '' || dt === 0) {
      return '-';
    }
    return moment(dt).format('MM/DD/YYYY, HH:mm:ss:SSS');
  }

  execTime(end, start) {
    if (end == null || end === 0) {
      return '';
    }

    const total = end - start;

    return total / 1000;
  }

  taskTableData() {
    const dataset = this.state.result.tasks || [];

    return dataset.map((row, i) => {
      return (
        <Tr key={`row-${i}`} id={`row-${i}`} className="clickable">
          <Td>{row['seq']}</Td>
          <Td onClick={this.handleTaskDetail.bind(this, row)}>{row['taskType']}&nbsp;&nbsp;</Td>
          <Td style={{ textAlign: 'center' }}>
            {row['taskType'] === 'SUB_WORKFLOW' ? (
              <Button colorScheme="blue" onClick={() => this.props.onWorkflowIdClick(row.subWorkflowId)}>
                <i className="fas fa-arrow-circle-right" />
              </Button>
            ) : null}
          </Td>
          <Td onClick={this.handleTaskDetail.bind(this, row)}>{row['referenceTaskName']}</Td>
          <Td>
            {this.formatDate(row['startTime'])}
            <br />
            {this.formatDate(row['endTime'])}
          </Td>
          <Td>{row['status']}</Td>
        </Tr>
      );
    });
  }

  handleTaskDetail(row) {
    this.setState({ taskDetail: row, taskModal: !this.state.taskModal });
  }

  terminateWfs() {
    const terminateWorkflows = callbackUtils.terminateWorkflowsCallback();

    terminateWorkflows([this.state.wfId]).then(() => {
      this.getData();
    });
  }

  pauseWfs() {
    const pauseWorkflows = callbackUtils.pauseWorkflowsCallback();

    pauseWorkflows([this.state.wfId]).then(() => {
      this.getData();
    });
  }

  resumeWfs() {
    const resumeWorkflows = callbackUtils.resumeWorkflowsCallback();

    resumeWorkflows([this.state.wfId]).then(() => {
      this.getData();
    });
  }

  retryWfs() {
    const retryWorkflows = callbackUtils.retryWorkflowsCallback();

    retryWorkflows([this.state.wfId]).then(() => {
      this.getData();
    });
  }

  restartWfs() {
    const restartWorkflows = callbackUtils.restartWorkflowsCallback();

    restartWorkflows([this.state.wfId]).then(() => {
      this.getData();
    });
  }

  render() {
    const actionButtons = (status) => {
      switch (status) {
        case 'FAILED':
        case 'TERMINATED':
          return (
            <ButtonGroup float="right">
              <Button onClick={this.restartWfs.bind(this)} colorScheme="whiteAlpha">
                <i className="fas fa-redo" />
                &nbsp;&nbsp;Restart
              </Button>
              <Button onClick={this.retryWfs.bind(this)} colorScheme="whiteAlpha">
                <i className="fas fa-history" />
                &nbsp;&nbsp;Retry
              </Button>
            </ButtonGroup>
          );
        case 'RUNNING':
          return (
            <ButtonGroup float="right">
              <Button onClick={this.terminateWfs.bind(this)} colorScheme="whiteAlpha">
                <i className="fas fa-times" />
                &nbsp;&nbsp;Terminate
              </Button>
              <Button onClick={this.pauseWfs.bind(this)} colorScheme="whiteAlpha">
                <i className="fas fa-pause" />
                &nbsp;&nbsp;Pause
              </Button>
            </ButtonGroup>
          );
        case 'PAUSED':
          return (
            <ButtonGroup float="right">
              <Button onClick={this.resumeWfs.bind(this)} colorScheme="whiteAlpha">
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
              {this.execTime(this.state.result.endTime, this.state.result.startTime)}
            </div>
          </Box>
          <Box md="auto">
            <div>
              <b>Start Time</b>
              <br />
              {this.formatDate(this.state.result.startTime)}
            </div>
          </Box>
          <Box md="auto">
            <div>
              <b>End Time</b>
              <br />
              {this.formatDate(this.state.result.endTime)}
            </div>
          </Box>
          <Box md="auto">
            <div>
              <b>Status</b>
              <br />
              {this.state.result.status}
            </div>
          </Box>
          <Box>{actionButtons(this.state.result.status)}</Box>
        </Grid>
      </div>
    );

    const taskTable = () => (
      <div className="heightWrapper">
        <Table size="sm" ref={this.table}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Task Type</Th>
              <Th style={{ width: '10px' }}>Subwf.</Th>
              <Th>Task Ref. Name</Th>
              <Th>Start/End Time</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>{this.taskTableData()}</Tbody>
        </Table>
      </div>
    );

    const inputOutput = () => (
      <Flex justifyContent="space-between">
        <Box>
          <h4>
            Workflow Input&nbsp;&nbsp;
            <i title="copy to clipboard" className="clp far fa-clipboard clickable" data-clipboard-target="#wfinput" />
            &nbsp;&nbsp;
            <UnescapeButton size="tiny" target="wfinput" />
          </h4>
          <code>
            <pre id="wfinput" className="heightWrapper">
              {JSON.stringify(this.state.result.input, null, 2)}
            </pre>
          </code>
        </Box>
        <Box>
          <h4>
            Workflow Output&nbsp;&nbsp;
            <i title="copy to clipboard" className="clp far fa-clipboard clickable" data-clipboard-target="#wfoutput" />
            &nbsp;&nbsp;
            <UnescapeButton size="tiny" target="wfoutput" />
          </h4>
          <code>
            <pre id="wfoutput" className="heightWrapper">
              {JSON.stringify(this.state.result.output, null, 2)}
            </pre>
          </code>
        </Box>
      </Flex>
    );

    const wfJson = () => (
      <div>
        <h4>
          Workflow JSON&nbsp;&nbsp;
          <i title="copy to clipboard" className="clp far fa-clipboard clickable" data-clipboard-target="#json" />
        </h4>
        <code>
          <pre id="json" className="heightWrapper" style={{ backgroundColor: '#eaeef3' }}>
            {JSON.stringify(this.state.result, null, 2)}
          </pre>
        </code>
      </div>
    );

    const editRerun = () => {
      const input = this.state.input.input || [];
      const iPam = this.state.meta.inputParameters || [];

      const labels = this.state.inputsArray;
      const values = [];
      labels.forEach((label) => {
        const key = Object.keys(input).findIndex((key) => key === label);
        key > -1 ? values.push(Object.values(input)[key]) : values.push('');
      });
      const descs = iPam.map((param) => {
        if (param.match(/\[(.*?)]/)) return param.match(/\[(.*?)]/)[1];
        else return '';
      });
      return labels.map((label, i) => {
        return (
          <Box key={`col1-${i}`}>
            <FormControl>
              <FormLabel>{label}</FormLabel>
              <Input
                onChange={(e) => this.handleInput(e, labels[i])}
                placeholder="Enter the input"
                value={values[i] ? (typeof values[i] === 'object' ? JSON.stringify(values[i]) : values[i]) : ''}
              />
              <FormHelperText className="text-muted">{descs[i]}</FormHelperText>
            </FormControl>
          </Box>
        );
      });
    };

    const parentWorkflowButton = () => {
      if (this.state.parentWfId) {
        return (
          <Button
            style={{ margin: '2px', display: 'inline' }}
            onClick={() => this.props.onWorkflowIdClick(this.state.parentWfId)}
          >
            Parent
          </Button>
        );
      }
    };

    return (
      <>
        <TaskModal
          task={this.state.taskDetail}
          show={this.state.taskModal}
          handle={this.handleTaskDetail.bind(this, {})}
        />
        <Modal size="5xl" isOpen={this.state.show && !this.state.taskModal} onClose={this.handleClose}>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>
              Details of {this.state.meta.name ? this.state.meta.name : null} / {this.state.meta.version}
              <div>{parentWorkflowButton()}</div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {headerInfo()}
              <Tabs
                value={this.state.activeTab}
                onChange={(index) => {
                  this.setState({ activeTab: index });
                }}
                marginBottom={20}
                id="detailTabs"
              >
                <TabList>
                  <Tab>Task Details</Tab>
                  <Tab>Input/Output</Tab>
                  <Tab>JSON</Tab>
                  <Tab value="editRerun">Edit & Rerun</Tab>
                  <Tab>Execution Flow</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>{taskTable()}</TabPanel>
                  <TabPanel>{inputOutput()}</TabPanel>
                  <TabPanel>{wfJson()}</TabPanel>
                  <TabPanel>
                    <h4>
                      Edit & Rerun Workflow&nbsp;&nbsp;
                      <i className="clp far fa-play-circle" />
                    </h4>
                    <Box padding={12}>
                      <form>
                        <Grid gridTemplateColumns="1fr 1fr" gap={4}>
                          {editRerun()}
                        </Grid>
                      </form>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <WorkflowDia
                      meta={this.state.meta}
                      wfe={this.state.result}
                      subworkflows={this.state.subworkflows}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              <Button
                variant="link"
                colorScheme="blue"
                justifySelf="start"
                onClick={() => this.props.onWorkflowIdClick(this.state.wfIdRerun)}
              >
                {this.state.wfIdRerun}
              </Button>
              <Flex>
                {this.state.activeTab === 3 ? (
                  <Button
                    marginRight={4}
                    colorScheme={
                      this.state.status === 'OK'
                        ? 'green'
                        : this.state.status === 'Executing...'
                        ? 'teal'
                        : this.state.status === 'Execute'
                        ? 'blue'
                        : 'red'
                    }
                    onClick={this.executeWorkflow.bind(this)}
                  >
                    {this.state.status}
                  </Button>
                ) : null}
                <Button colorScheme="gray" onClick={this.handleClose}>
                  Close
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
}

export default DetailsModal;
