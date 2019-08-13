import React, { Component } from 'react';
import {Modal, Button, Form, Row, Col, InputGroup} from "react-bootstrap";

class SubwfModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            show: true,
            inputs: {},
            customParam: ""
        };
    }

    componentDidMount() {
        this.setState({
            inputs: this.props.inputs.inputs,
        })
    }

    handleClose() {
        this.setState({show: false});
        this.props.modalHandler()
    }

    handleSave() {
        this.setState({show: false});
        this.props.saveInputs(this.state.inputs, this.props.inputs.id);
        this.props.modalHandler()
    }

    handeCustomParam() {
        let inputs = {...this.state.inputs};
        let param = this.state.customParam;

        let inputParameters = inputs.inputParameters;
        inputs = {
            ...inputs,
            inputParameters: {
                ...inputParameters,
                [param]: "${workflow.input." + param + "}"
            }
        };

        this.setState({
            inputs: inputs,
            customParam: ""
        });
    }

    handleInput(e, item, entry, i) {
        let inputs = {...this.state.inputs};

        if (item[0] === "inputParameters") {
            let inputParameters = inputs.inputParameters;
            inputs = {
                ...inputs,
                inputParameters: {
                    ...inputParameters,
                    [entry[0]]: e.target.value
                }
            };
        } else if (item[0] === "subWorkflowParam") {
            let subWorkflowParam = inputs.subWorkflowParam;
            inputs = {
                ...inputs,
                subWorkflowParam: {
                    ...subWorkflowParam,
                    [entry[0]]: e.target.value
                }
            };
        } else if (item[0] === "decisionCases") {
            let decisionCases = {...inputs.decisionCases};
            let keyNames = Object.keys(decisionCases);
            let trueCase = decisionCases[keyNames[1]] || [];
            let falseCase = decisionCases[keyNames[0]] || [];

            if (i === 0) {
                decisionCases = {
                    [e.target.value]: falseCase,
                    [keyNames[1]]: trueCase
                }
            } else {
                decisionCases = {
                    [keyNames[0]]: falseCase,
                    [e.target.value]: trueCase
                }
            }
            inputs.decisionCases = decisionCases;
        } else {
            inputs = {
                ...inputs,
                [entry[0]]: e.target.value
            }
        }

        this.setState({
            inputs: inputs
        });
    }

    render() {

        let hiddenParams = ["type", "optional", "subWorkflowParam", "joinOn", "forkTasks"];
        let template = null;

        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose}>  <Modal.Header>
                <Modal.Title>Edit task inputs</Modal.Title>
            </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Form>
                        <Row>
                            {Object.entries(this.state.inputs).map(((item, i) => {
                                if (item[0] === "inputParameters") {
                                    return Object.entries(item[1]).map((entry, i) => {
                                        if (entry[0] === "template") {
                                            template = (
                                                <InputGroup size="sm" style={{paddingLeft: "15px", paddingRight: "15px", minHeight: "200px"}}>
                                                    <Form.Control
                                                        as="textarea"
                                                        type="input"
                                                        onChange={(e) => this.handleInput(e, item, entry)}
                                                        value={entry[1]}/>
                                                </InputGroup>
                                            )
                                        } else {
                                            return (
                                                <Col sm={6} key={`col1-${i}`}>
                                                    <Form.Group>
                                                        <Form.Label>{entry[0]}</Form.Label>
                                                        <Form.Control
                                                            type="input"
                                                            onChange={(e) => this.handleInput(e, item, entry)}
                                                            value={entry[1]}/>
                                                    </Form.Group>
                                                </Col>
                                            )
                                        }
                                    })
                                }
                                if (item[0] === "decisionCases") {
                                    return Object.entries(item[1]).map((entry, i) => {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                <Form.Group>
                                                    <Form.Label>decision case #{i}</Form.Label>
                                                    <Form.Control
                                                        type="input"
                                                        onChange={(e) => this.handleInput(e, item, entry, i)}
                                                        value={entry[0]}/>
                                                </Form.Group>
                                            </Col>
                                        )
                                    })
                                } else if (!hiddenParams.includes(item[0])) {
                                    return (
                                        <Col sm={6} key={`col2-${i}`}>
                                            <Form.Group>
                                                <Form.Label>{item[0]}</Form.Label>
                                                <Form.Control
                                                    type="input"
                                                    onChange={(e) => this.handleInput(e, item, item)}
                                                    value={item[1]}/>
                                            </Form.Group>
                                        </Col>
                                    )
                                }
                                return null;
                            }))}
                        </Row>
                        <Row>
                            <label style={{paddingLeft: "15px"}}>template</label>
                            {template}
                        </Row>
                        <hr className="hr-text" data-content="add custom input parameters"/>
                        <Row>
                            <InputGroup style={{padding: "0px 190px 10px 190px"}}>
                                <Form.Control value={this.state.customParam}
                                              onChange={(e) => this.setState({customParam: e.target.value})}
                                              placeholder="Add new parameter name"/>
                                <InputGroup.Append>
                                    <Button variant="outline-primary" onClick={this.handeCustomParam.bind(this)}>Add</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleSave}>Save</Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default SubwfModal;
