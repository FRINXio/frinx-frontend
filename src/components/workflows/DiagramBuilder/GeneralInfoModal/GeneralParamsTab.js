import React, { Component } from 'react';
import {Col, Form, InputGroup, Row} from "react-bootstrap";
import {workflowDescriptions} from "../../../constants";

class GeneralParamsTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            finalWf: this.props.finalWf,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            finalWf: nextProps.finalWf
        })
    }

    render() {
        let hiddenParams = ["schemaVersion", "workflowStatusListenerEnabled", "tasks", "outputParameters", "inputParameters"];
        let isNameLocked = this.props.isWfNameLocked;

        return (
            <Row>
                {Object.entries(this.state.finalWf).map(((item, i) => {
                    if (item[0] === "name") {
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
                                            onChange={(e) => this.props.handleInput(e, item)}
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
                                        onChange={(e) => this.props.handleInput(e, item)}
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
        );
    }
}

export default GeneralParamsTab;