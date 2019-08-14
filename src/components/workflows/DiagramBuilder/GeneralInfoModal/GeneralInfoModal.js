import React, { Component } from 'react';
import {Modal, Button, Form, Row, Col, InputGroup} from "react-bootstrap";
import {workflowDescriptions} from "../../../constants";
import * as _ from "lodash";

class GeneralInfoModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            show: true,
            finalWf: this.props.definition,
            customParam: ""
        };
    }

    handleClose() {
        this.setState({show: false});
        this.props.modalHandler()
    }

    handleSave() {
        this.setState({show: false});
        this.props.saveInputs(this.state.finalWf);
        this.props.lockWorkflowName();
        this.props.modalHandler()
    }

    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            this.handleSave();
        }
    };

    handleInput(e, item, entry) {
        let finalWf = {...this.state.finalWf};

        if (item[0] === "outputParameters") {
            let outputParameters = finalWf.outputParameters;
            finalWf = {
                ...finalWf,
                outputParameters: {
                    ...outputParameters,
                    [entry[0]]: e.target.value
                }
            };
        } else {
            finalWf = {
                ...finalWf,
                [entry[0]]: e.target.value
            }
        }

        this.setState({
            finalWf: finalWf
        });
    }

    handeCustomParam(e) {
        e.preventDefault();
        e.stopPropagation();

        let finalWf = {...this.state.finalWf};
        let param = this.state.customParam;
        let outputParameters = finalWf.outputParameters;

        finalWf = {
            ...finalWf,
            outputParameters: {
                ...outputParameters,
                [param]: "provide path"
            }
        };

        this.setState({
            finalWf: finalWf,
            customParam: ""
        });
    }

    render() {

        let isNameLocked = this.props.isWfNameLocked;
        let outputParameters = [];
        let hiddenParams = ["schemaVersion", "workflowStatusListenerEnabled", "tasks"];

        return (
            <Modal size="lg" show={this.state.show} onHide={isNameLocked ? this.handleClose : () => false}>
                <Modal.Header>
                    <Modal.Title>{isNameLocked ? "Edit general informations" : "Create new workflow"}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {Object.entries(this.state.finalWf).map(((item, i) => {
                                if (item[0] === "outputParameters") {
                                    outputParameters.push(item);
                                } else if (item[0] === "name") {
                                    return (
                                        <Col sm={6} key={`col2-${i}`}>
                                            <Form.Group>
                                                <Form.Label>{item[0]}</Form.Label>
                                                <InputGroup>
                                                    {isNameLocked ?
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text><i className="fas fa-lock"/></InputGroup.Text>
                                                        </InputGroup.Prepend> : null
                                                    }
                                                <Form.Control
                                                    required
                                                    disabled={isNameLocked}
                                                    type="input"
                                                    onChange={(e) => this.handleInput(e, item, item)}
                                                    value={item[1]}/>
                                                </InputGroup>
                                                    <Form.Text className="text-muted">
                                                        {workflowDescriptions[item[0]]}
                                                    </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    )
                                } else if (!hiddenParams.includes(item[0])) {
                                    return (
                                        <Col sm={6} key={`col2-${i}`}>
                                            <Form.Group>
                                                <Form.Label>{item[0]}</Form.Label>
                                                <Form.Control
                                                    type="input"
                                                    onChange={(e) => this.handleInput(e, item, item)}
                                                    value={item[1]}/>
                                                <Form.Text className="text-muted">
                                                    {workflowDescriptions[item[0]]}
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    )
                                }
                                return null;
                            }))}
                        </Row>
                        <hr className="hr-text" data-content="add custom output parameters"/>
                        <Row>
                            <Form onSubmit={this.handeCustomParam.bind(this)}>
                                <InputGroup style={{padding: "10px 215px 10px"}}>
                                    <Form.Control value={this.state.customParam}
                                                  onChange={(e) => this.setState({customParam: e.target.value})}
                                                  placeholder="Add new output parameter name"/>
                                    <InputGroup.Append>
                                        <Button variant="outline-primary" type="submit">Add</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>
                        </Row>
                        <hr className="hr-text" data-content="existing output parameters"/>
                        <Row>
                            {Object.entries(outputParameters[0][1]).map((entry, i) => {
                                return (
                                    <Col sm={6} key={`col4-${i}`}>
                                        <Form.Group>
                                            <Form.Label>{entry[0]}</Form.Label>
                                            <Form.Control
                                                type="input"
                                                onChange={(e) => this.handleInput(e, ["outputParameters", null], entry)}
                                                value={entry[1]}/>
                                        </Form.Group>
                                    </Col>
                                )
                            })}
                        </Row>
                        <Button type="submit" style={{width: "100%", marginTop: "20px"}} variant="primary">Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default GeneralInfoModal;
