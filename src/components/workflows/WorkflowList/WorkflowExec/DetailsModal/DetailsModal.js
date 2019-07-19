import React, { Component } from 'react';
import {Modal, Button, Row, Col, Tabs, Tab, Table, Accordion, Card, ButtonGroup, Form} from "react-bootstrap";
import moment from 'moment';
import Clipboard from 'clipboard';
import Highlight from "react-highlight.js";
import './DetailsModal.css'
import WorkflowDia from "./WorkflowDia/WorkflowDia";
import UnescapeButton from "../../../../uniconfig/deviceView/consoleModal/UnescapeButton";
const http = require('../../../../../server/HttpServerSide').HttpClient;

new Clipboard('.clp');

class DetailsModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            meta: {},
            result: {},
            wfId: "",
            input: {},
            activeTab: null,
            status: "Execute",
            timeout: null
        };
    }

    componentDidMount() {
        this.getData();

    }

    componentWillUnmount() {
        clearTimeout(this.state.timeout);
    }

    getData() {
        http.get('/api/conductor/id/' + this.props.wfId).then(res => {
            this.setState({
                meta: res.meta,
                result: res.result,
                subworkflows: res.subworkflows,
                input: res.result.input || {},
                wfId : res.result.workflowId
            });

            if (this.state.result.status === 'RUNNING') {
                this.setState({
                    timeout: setTimeout(() => this.getData(), 2000)
                })
            }
        });
    }

    handleClose() {
        this.props.refreshTable();
        this.setState({ show: false });
        this.props.modalHandler()
    }

    executeWorkflow() {
        this.setState({ status: "Executing..."});
        http.post('/api/conductor/workflow/' + this.state.meta.name, JSON.stringify(this.state.input)).then(res => {
            this.setState({
                status: res.statusText
            });
            setTimeout(() => this.setState({status: "Execute"}), 1000);
        })
    }

    handleInput(e,i) {
        let wfForm = this.state.input;
        wfForm[Object.keys(wfForm)[i]] = e.target.value;
        this.setState({
            input: wfForm
        })
    }

    formatDate(dt) {
        if (dt == null || dt === '') {
            return '';
        }
        return moment(dt).format('MM/DD/YYYY, HH:mm:ss:SSS');
    }

    execTime(end, start) {
        if (end == null || end === 0) {
            return "";
        }

        let total = end - start;

        return total / 1000;
    }

    taskTableData() {
        let dataset = this.state.result.tasks || [];

        return dataset.map((row,i) => {
            return (
            <tr key={`row-${i}`} id={`row-${i}`} className="clickable">
                <td>{row["seq"]}</td>
                <td>{row["taskType"]}</td>
                <td>{row["referenceTaskName"]}</td>
                <td>{this.formatDate(row["startTime"])}<br/>{this.formatDate(row["endTime"])}</td>
                <td>{row["status"]}</td>
            </tr>
            )
        });
    }

    terminateWfs() {
        http.delete('/api/conductor/bulk/terminate', [this.state.wfId]).then(() => {
            this.getData();
        });
    }

    pauseWfs() {
        http.put('/api/conductor/bulk/pause', [this.state.wfId]).then(() => {
            this.getData();
        })
    }

    resumeWfs() {
        http.put('/api/conductor/bulk/resume', [this.state.wfId]).then(() => {
            this.getData();
        })
    }

    retryWfs() {
        http.post('/api/conductor/bulk/retry', [this.state.wfId]).then(() => {
            this.getData();
        })
    }

    restartWfs() {
        http.post('/api/conductor/bulk/restart', [this.state.wfId]).then(() => {
            this.getData();
        })
    }

    render() {

        const actionButtons = (status) => {
            switch (status) {
                case "FAILED":
                case "TERMINATED":
                    return (
                        <ButtonGroup style={{float: "right"}}>
                            <Button onClick={this.restartWfs.bind(this)} variant="outline-light"><i
                                className="fas fa-redo"/>&nbsp;&nbsp;Restart</Button>
                            <Button onClick={this.retryWfs.bind(this)} variant="outline-light"><i
                                className="fas fa-history"/>&nbsp;&nbsp;Retry</Button>
                        </ButtonGroup>
                    );
                case "RUNNING":
                    return (
                        <ButtonGroup style={{float: "right"}}>
                            <Button onClick={this.terminateWfs.bind(this)} variant="outline-light"><i
                                className="fas fa-times"/>&nbsp;&nbsp;Terminate</Button>
                            <Button onClick={this.pauseWfs.bind(this)} variant="outline-light"><i
                                className="fas fa-pause"/>&nbsp;&nbsp;Pause</Button>
                        </ButtonGroup>
                    );
                case "PAUSED":
                    return (
                        <ButtonGroup style={{float: "right"}}>
                            <Button onClick={this.resumeWfs.bind(this)} variant="outline-light"><i
                                className="fas fa-play"/>&nbsp;&nbsp;Resume</Button>
                        </ButtonGroup>
                    );
                default: break;
            }
        };

        const headerInfo = () => (
            <div className="headerInfo">
                <Row>
                    <Col md="auto">
                        <div>
                            <b>Total Time (sec)</b><br/>
                            {this.execTime(this.state.result.endTime, this.state.result.startTime)}
                        </div>
                    </Col>
                    <Col md="auto">
                        <div>
                            <b>Start Time</b><br/>
                            {this.formatDate(this.state.result.startTime)}
                        </div>
                    </Col>
                    <Col md="auto">
                        <div>
                            <b>End Time</b><br/>
                            {this.formatDate(this.state.result.endTime)}
                        </div>
                    </Col>
                    <Col md="auto">
                        <div>
                            <b>Status</b><br/>
                            {this.state.result.status}
                        </div>
                    </Col>
                    <Col>
                        {actionButtons(this.state.result.status)}
                    </Col>
                </Row>
            </div>
        );

        const taskTable = () => (
            <div className="heightWrapper">
                <Table className="tasktable" ref={this.table} size="sm" striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Task Type</th>
                        <th>Task Ref. Name</th>
                        <th>Start/End Time</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.taskTableData()}
                    </tbody>
                </Table>
            </div>
        );

        const inputOutput = () => (
            <Row>
                <Col>
                    <h4>Workflow Input&nbsp;&nbsp;<i title="copy to clipboard"
                                                     className="clp far fa-clipboard clickable"
                                                     data-clipboard-target="#wfinput"/>
                        &nbsp;&nbsp;<UnescapeButton size="sm" target="wfinput"/></h4>
                    <code>
                        <pre id="wfinput" className="heightWrapper">
                            <Highlight children={""} language="json">
                                {JSON.stringify(this.state.result.input, null, 2)}
                            </Highlight>
                        </pre>
                    </code>
                </Col>
                <Col>
                    <h4>Workflow Output&nbsp;&nbsp;<i title="copy to clipboard"
                                                      className="clp far fa-clipboard clickable"
                                                      data-clipboard-target="#wfoutput"/>
                        &nbsp;&nbsp;<UnescapeButton size="sm" target="wfoutput"/></h4>
                    <code>
                        <pre id="wfoutput" className="heightWrapper">
                            <Highlight language="json">
                                {JSON.stringify(this.state.result.output, null, 2)}
                            </Highlight>
                        </pre>
                    </code>
                </Col>
            </Row>
        );

        const wfJson = () => (
            <div>
                <h4>Workflow JSON&nbsp;&nbsp;<i title="copy to clipboard"
                                                className="clp far fa-clipboard clickable"
                                                data-clipboard-target="#json"/></h4>
                <code>
                    <pre id="json" className="heightWrapper">
                        <Highlight language="json">
                            {JSON.stringify(this.state.result, null, 2)}
                        </Highlight>
                     </pre>
                </code>
            </div>
        );

        const editRerun = () => {
            let input = this.state.input || [];
            let iPam = this.state.meta.inputParameters || [];

            let labels = Object.keys(input);
            let values = Object.values(input);
            let descs = iPam.map(param => {
                return param.match(/\[(.*?)]/)[1];
            });

            return labels.map((label,i) => {
                return (
                    <Col sm={6} key={`col1-${i}`}>
                        <Form.Group>
                            <Form.Label>{label}</Form.Label>
                            <Form.Control
                                type="input"
                                placeholder="Enter the input"
                                onChange={(e) => this.handleInput(e,i)}
                                defaultValue={values[i]}/>
                            <Form.Text className="text-muted">
                                {descs[i]}
                            </Form.Text>
                        </Form.Group>
                    </Col>
                )
            })

        };

        return (
            <Modal dialogClassName="modalWider" show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Details of {this.state.meta.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion>
                        <Accordion.Toggle as={Card.Header} >
                            <b>{this.state.meta.name} / {this.state.meta.version}</b>
                            &nbsp;&nbsp;
                            <p style={{float: "right"}}>{this.props.wfId}</p>
                        </Accordion.Toggle>
                        <Accordion.Collapse >
                            <Card.Body style={{padding: "0px"}}>
                                {headerInfo()}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Accordion>

                    <Tabs className="heightWrapper" onSelect={(e) => this.setState({activeTab: e})} style={{marginBottom: "20px"}} id="detailTabs">
                        <Tab mountOnEnter eventKey="taskDetails" title="Task Details">
                            {taskTable()}
                        </Tab>
                        <Tab mountOnEnter eventKey="inputOutput" title="Input/Output">
                            {inputOutput()}
                        </Tab>
                        <Tab mountOnEnter eventKey="json" title="JSON">
                            {wfJson()}
                        </Tab>
                        <Tab disabled={this.state.result.status === "RUNNING"} mountOnEnter eventKey="editRerun" title="Edit & Rerun">
                            <h4>Edit & Rerun Workflow&nbsp;&nbsp;<i className="clp far fa-play-circle"/></h4>
                            <div style={{padding: "20px"}}>
                                <Form>
                                    <Row>
                                        {editRerun()}
                                    </Row>
                                </Form>
                            </div>
                        </Tab>
                        <Tab eventKey="execFlow" mountOnEnter title="Execution Flow">
                            <WorkflowDia meta={this.state.meta} wfe={this.state.result} subworkflows={this.state.subworkflows}/>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <a style={{float: "left", marginRight: "50px"}} href={`/workflows/exec/${this.state.wfIdRerun}`}>{this.state.wfIdRerun}</a>
                    {this.state.activeTab === "editRerun" ?
                        <Button variant={
                            this.state.status === "OK" ? "success" :
                                this.state.status === "Executing..." ? "info" :
                                    this.state.status === "Execute" ? "primary" : "danger"}
                                onClick={this.executeWorkflow.bind(this)}>{this.state.status}</Button>
                        : null}
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DetailsModal;
