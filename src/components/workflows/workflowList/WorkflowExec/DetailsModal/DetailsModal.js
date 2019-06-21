import React, { Component } from 'react';
import {Modal, Button, Row, Col, Tabs, Tab, Table, Accordion, Card, ButtonGroup} from "react-bootstrap";
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
            result: {}
        };
    }

    componentDidMount() {
        http.get('/api/conductor/id/' + this.props.wfId).then(res => {
            console.log(res);
            this.setState({
                meta: res.meta,
                result: res.result
            })
        })
    }

    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler()
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
            console.log(row["taskReferenceName"]);
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
                                <div style={{
                                    background: "linear-gradient(-120deg, rgb(0, 147, 255) 0%, rgb(0, 118, 203) 100%)",
                                    padding: "15px",
                                    marginBottom: "10px"}}>
                                    <Row>
                                        <Col md="auto">
                                            <div style={{color: "white"}}>
                                                <b>Total Time (sec)</b><br/>
                                                {this.execTime(this.state.result.endTime, this.state.result.startTime)}
                                            </div>
                                        </Col>
                                        <Col md="auto">
                                            <div style={{color: "white"}}>
                                                <b>Start Time</b><br/>
                                                {this.formatDate(this.state.result.startTime)}
                                            </div>
                                        </Col>
                                        <Col md="auto">
                                            <div style={{color: "white"}}>
                                                <b>End Time</b><br/>
                                                {this.formatDate(this.state.result.endTime)}
                                            </div>
                                        </Col>
                                        <Col md="auto">
                                            <div style={{color: "white"}}>
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


                            </Card.Body>
                        </Accordion.Collapse>
                    </Accordion>

                    <Tabs style={{marginBottom: "20px"}} id="detailTabs">
                        <Tab eventKey="taskDetails" title="Task Details">
                            {taskTable()}
                        </Tab>
                        <Tab eventKey="inputOutput" title="Input/Output">
                            {inputOutput()}
                        </Tab>
                        <Tab eventKey="def" disabled title="Definition">

                        </Tab>
                        <Tab eventKey="editRerun" disabled title="Edit & Rerun">

                        </Tab>
                        <Tab eventKey="execFlow" disabled title="Execution Flow">

                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DetailsModal;