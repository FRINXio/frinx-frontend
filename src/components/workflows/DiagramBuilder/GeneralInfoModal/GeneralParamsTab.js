import React, { Component } from 'react';
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
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
        let hiddenParams = ["name", "description", "schemaVersion", "workflowStatusListenerEnabled", "tasks", "outputParameters", "inputParameters"];
        let nameFieldValue = this.state.finalWf["name"];
        let descFieldValue = this.state.finalWf["description"];
        let {isWfNameLocked, isWfNameValid} = this.props;

        const lockedNameField = (nameFieldValue) => (
            <Form.Group>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                        <InputGroup.Text><i className="fas fa-lock"/>&nbsp;&nbsp;name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        disabled
                        type="input"
                        onChange={(e) => this.props.handleInput(e.target.value, "name")}
                        value={nameFieldValue}/>
                </InputGroup>
            </Form.Group>
        );

        const unlockedNameField = (nameFieldValue) => (
            <Form.Group>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                        <InputGroup.Text>name:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        isValid={isWfNameValid}
                        isInvalid={!isWfNameValid}
                        type="input"
                        onChange={(e) => this.props.handleInput(e.target.value, "name")}
                        value={nameFieldValue}/>
                    <Form.Control.Feedback type={isWfNameValid ? "valid" : "invalid"}>
                        {isWfNameValid ?
                            "unique name of workflow" :
                            (nameFieldValue.length < 1 ? "unique name of workflow" : "workflow with this name already exits")}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
        );

        const description = (descFieldValue) => (
            <Form.Group>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>description:</InputGroup.Text>
                    </InputGroup.Prepend>
                <Form.Control
                    type="input"
                    onChange={(e) => this.props.handleInput(e.target.value, "description")}
                    value={descFieldValue}/>
                </InputGroup>

                <Form.Text className="text-muted">
                    {workflowDescriptions["description"]}
                </Form.Text>
            </Form.Group>
        );

        const buttonWrappedField = (item, left, right) => (
            <Form.Group>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>{item[0]}:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="input"
                        value={item[1]}/>
                    <InputGroup.Append>
                        <ButtonGroup>
                        <Button variant="outline-primary"
                                onClick={() => this.props.handleInput(left[1], item[0])}>{left[0]}</Button>
                        <Button variant="outline-primary"
                                onClick={() => this.props.handleInput(right[1], item[0])}>{right[0]}</Button>
                        </ButtonGroup>
                    </InputGroup.Append>
                </InputGroup>
                <Form.Text className="text-muted">
                    {workflowDescriptions[item[0]]}
                </Form.Text>
            </Form.Group>

        );

        return (
            <div>
                {isWfNameLocked ? lockedNameField(nameFieldValue) : unlockedNameField(nameFieldValue)}
                {description(descFieldValue)}
                <Form.Row>
                {Object.entries(this.state.finalWf).map((item, i) => {
                    if (!hiddenParams.includes(item[0])) {
                        if (item[0] === "version") {
                            return (
                                <Col sm={6} key={`col2-${i}`}>
                                    {buttonWrappedField(item, ["-", item[1] - 1], ["+", item[1] + 1])}
                                </Col>
                            )
                        }
                        if (item[0] === "restartable") {
                            return (
                                <Col sm={6} key={`col2-${i}`}>
                                    {buttonWrappedField(item, ["<", !item[1]], [">", !item[1]])}
                                </Col>
                            )
                        }
                        else {
                            return (
                                <Col sm={6} key={`col3-${i}`}>
                                    <Form.Group>
                                        <Form.Label>{item[0]}</Form.Label>
                                        <Form.Control
                                            type="input"
                                            onChange={(e) => this.props.handleInput(e.target.value, item[0])}
                                            value={item[1]}/>
                                        <Form.Text className="text-muted">
                                            {workflowDescriptions[item[0]]}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            )
                        }
                    }
                    return null;
                })}
                </Form.Row>
            </div>
        );
    }
}

export default GeneralParamsTab;