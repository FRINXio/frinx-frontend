import React, { Component } from 'react';
import {Modal, Button, Row, Col, Tabs, Tab, Table, Accordion, Card, ButtonGroup, Form} from "react-bootstrap";
import moment from 'moment';
import Clipboard from 'clipboard';
import Highlight from "react-highlight.js";
import './DetailsModal.css'
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
            input: {},
            activeTab: null,
            status: "Execute"
        };
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        http.get('/api/conductor/id/' + this.props.wfId).then(res => {
            console.log(res);
            this.setState({
                meta: res.meta,
                result: res.result,
                input: res.result.input || {}
            })
        })
    }

    handleClose() {
        this.props.refreshTable();
        this.setState({ show: false });
        this.props.modalHandler()
    }

    executeWorkflow() {
        this.setState({ status: "Executing..."});
        http.post('/api/conductor/workflow/' + this.state.meta.name, JSON.stringify(this.state.input)).then(res => {
            console.log(res);
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

    render() {

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
                        <ButtonGroup style={{float: "right"}}>
                            <Button disabled variant="outline-light">Terminate</Button>
                            <Button disabled variant="outline-light">Restart</Button>
                            <Button disabled variant="outline-light">Retry</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
        );

        const taskTable = () => (
            <Table ref={this.table} striped bordered hover>
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
        );

        const inputOutput = () => (
            <Row>
                <Col>
                    <h4>Workflow Input&nbsp;&nbsp;<i title="copy to clipboard"
                                                     className="clp far fa-clipboard clickable"
                                                     data-clipboard-target="#wfinput"/></h4>
                    <code>
                        <pre id="wfinput" className="codeWrapper">
                            <Highlight language="json">
                                {JSON.stringify(this.state.result.input, null, 2)}
                            </Highlight>
                        </pre>
                    </code>
                </Col>
                <Col>
                    <h4>Workflow Output&nbsp;&nbsp;<i title="copy to clipboard"
                                                      className="clp far fa-clipboard clickable"
                                                      data-clipboard-target="#wfoutput"/></h4>
                    <code>
                        <pre id="wfoutput" className="codeWrapper">
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
                    <pre id="json" className="codeWrapper">
                        <Highlight language="json">
                            {JSON.stringify(this.state.result, null, 2)}
                        </Highlight>
                     </pre>
                </code>
            </div>
        );

        const editRerurn = () => {
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
                    <Button variant="outline-primary" onClick={this.getData.bind(this)}><i
                        className="fas fa-cloud-download-alt"/>&nbsp;&nbsp;Refresh data</Button>
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

                    <Tabs onSelect={(e) => this.setState({activeTab: e})} style={{marginBottom: "20px"}} id="detailTabs">
                        <Tab eventKey="taskDetails" title="Task Details">
                            {taskTable()}
                        </Tab>
                        <Tab eventKey="inputOutput" title="Input/Output">
                            {inputOutput()}
                        </Tab>
                        <Tab eventKey="json" title="JSON">
                            {wfJson()}
                        </Tab>
                        <Tab eventKey="editRerun" title="Edit & Rerun">
                            <h4>Edit & Rerun Workflow&nbsp;&nbsp;<i className="clp far fa-play-circle"/></h4>
                            <div style={{padding: "20px"}}>
                                <Form>
                                    <Row>
                                        {editRerurn()}
                                    </Row>
                                </Form>
                            </div>
                        </Tab>
                        <Tab eventKey="execFlow" disabled title="Execution Flow">

                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
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