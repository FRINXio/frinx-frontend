import React, { Component } from 'react';
import {Modal, Button, Form, Row, Col} from "react-bootstrap";
import {connect} from "react-redux";
import * as builderActions from "../../../../../store/actions/builder";
const http = require('../../../../../server/HttpServerSide').HttpClient;


class InputModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            def: "{}",
            workflowForm: [],
            wfdesc: "",
            status: "Execute",
            wfId: null,
            name: this.props.wf.split(" / ")[0],
            version: Number(this.props.wf.split(" / ")[1]),
            warning: []
        };
    }

    componentDidMount() {
        let name = this.props.wf.split(" / ")[0];
        let version = this.props.wf.split(" / ")[1];
        http.get('/api/conductor/metadata/workflow/' + name + '/' + version).then(res => {
            this.setState({
                def: JSON.stringify(res.result, null, 2),
                wfdesc: res.result["description"] ? res.result["description"].split("-")[0] : "",
            }, () => this.getWorkflowInputDetails())
        });
    }

    getWorkflowInputDetails() {
        this.setState({
            workflowForm: {
                labels: this.getInputs(this.state.def),
            }
        }, () => {
            this.setState({
                workflowForm: {
                    labels: this.state.workflowForm.labels,
                    ...this.getDetails(this.state.def, this.state.workflowForm.labels)
                }
            })
        });
    }

    getInputs(def) {
        let matchArray = def.match(/\workflow.input([\w.])+}/igm);
        let inputsArray = [];
        if (matchArray) {
            let sortedArray =  matchArray.join().match(/[^.]+(?=})/igm);
            inputsArray = [...new Set(sortedArray)];
        }

        return inputsArray;
    }

    getDetails(def, inputsArray) {
        let  [detailsArray, tmpDesc, tmpValue, descs, values] = [[],[],[],[],[]];

        if (inputsArray.length > 0) {
            for (let i = 0; i < inputsArray.length; i++) {
                let RegExp3 = new RegExp(`\\b${inputsArray[i]}\\[.*?]"`, 'igm');
                detailsArray[i] = def.match(RegExp3);
            }
        }

        for (let i = 0; i < detailsArray.length; i++) {
            if (detailsArray[i]) {
                tmpDesc[i] = detailsArray[i][0].match(/\[.*?\[/);
                tmpValue[i] = detailsArray[i][0].match(/].*?]/);
                if (tmpDesc[i] == null) {
                    tmpDesc[i] = detailsArray[i][0].match(/\[(.*?)]/);
                    descs[i] = tmpDesc[i][1];
                    values[i] = null;
                } else {
                    tmpDesc[i] = tmpDesc[i][0].match(/[^[\]"]+/);
                    tmpValue[i] = tmpValue[i][0].match(/[^[\]*]+/);
                    descs[i] = tmpDesc[i][0];
                    values[i] = tmpValue[i] ? tmpValue[i][0].replace(/\\/g,"") : null;
                }
            } else {
                descs[i] = null;
                values[i] = null;
            }
        }
        return {descs, values};
    }

    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler()
    }

    handleInput(e,i) {
        let wfForm = this.state.workflowForm;
        let warning = this.state.warning;
        wfForm.values[i] = e.target.value;
        e.target.value.match(/^\s.*$/) || e.target.value.match(/^.*\s$/)
            ? warning[i] = true
            : warning[i] = false;
        this.setState({
            workflowForm: wfForm,
            warning: warning
        })
    }

    executeWorkflow() {
        let {labels, values } = this.state.workflowForm;
        let input = {};
        let payload = {
            name: this.state.name,
            version: this.state.version,
            input
        };

        for (let i = 0; i < labels.length; i++) {
            if (values[i]) {
                input[labels[i]] = values[i].startsWith("{") ? JSON.parse(values[i]) : values[i];
            }
        }
        this.setState({ status: "Executing..."});
        http.post('/api/conductor/workflow', JSON.stringify(payload)).then(res => {
            console.log(res);
            this.setState({
                status: res.statusText,
                wfId: res.body.text
            });
            this.props.storeWorkflowId(res.body.text);
            this.timeoutBtn();

            if (this.props.fromBuilder) {
                this.handleClose()
            }
        });
    }

    timeoutBtn() {
        setTimeout(() => this.setState({status: "Execute"}), 1000);
    }

    render() {

        let values = this.state.workflowForm.values || [];
        let descs = this.state.workflowForm.descs || [];
        let labels = this.state.workflowForm.labels || [];
        let warning = this.state.warning;

        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
                <Modal.Body style={{padding: "30px"}}>
                    <h4>{this.state.name} / {this.state.version}</h4>
                    <p className="text-muted">{this.state.wfdesc}</p>
                    <hr/>
                    <Form onSubmit={this.executeWorkflow.bind(this)}>
                        <Row>
                            {labels.map((item, i) => {
                                return (
                                    <Col sm={6} key={`col1-${i}`}>
                                        <Form.Group>
                                            <Form.Label>{item}</Form.Label>
                                            {warning[i]
                                                ? <div style={{color: "red", fontSize: "12px", float: "right", marginTop: "5px"}}>Unnecessary space</div>
                                                : null}
                                            <Form.Control
                                                type="input" onChange={(e) => this.handleInput(e,i)}
                                                placeholder="Enter the input" defaultValue={values[i]}
                                                isInvalid={warning[i]}
                                            />
                                            <Form.Text className="text-muted">
                                                {descs[i]}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <a style={{float: "left", marginRight: "50px"}} href={`/workflows/exec/${this.state.wfId}`}>{this.state.wfId}</a>
                    <Button
                        variant={
                            this.state.status === "OK" ? "success" :
                            this.state.status === "Executing..." ? "info" :
                            this.state.status === "Execute" ? "primary" : "danger"}
                        onClick={this.executeWorkflow.bind(this)}>
                        {this.state.status === "Execute" ? <i className="fas fa-play"/> : null}
                        {this.state.status === "Executing..." ? <i className="fas fa-spinner fa-spin"/> : null}
                        {this.state.status === "OK" ? <i className="fas fa-check-circle"/> : null}
                        &nbsp;&nbsp;{this.state.status}
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeWorkflowId: (id) => dispatch(builderActions.storeWorkflowId(id))
    }
};

export default connect(null, mapDispatchToProps)(InputModal);
