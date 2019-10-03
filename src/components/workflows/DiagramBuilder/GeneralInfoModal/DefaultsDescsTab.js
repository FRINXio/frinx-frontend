import React, { Component } from 'react';
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import {getWfInputs, getWfInputsRegex} from "../builder-utils";
import _ from 'lodash'

class DefaultsDescsTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            finalWf: this.props.finalWf,
            selectedParam: Object.keys(getWfInputs(this.props.finalWf))[0]
        };
    }

    getDescriptionAndDefault(selectedParam) {
        let inputParameters = this.state.finalWf.inputParameters || [];
        let result = [];

        inputParameters.forEach(param => {
            if (param.match(/^(.*?)\[/)[1] === selectedParam) {
                param.match(/\[(.*?)]/g).forEach(group => {
                    result.push(group.replace(/[[\]']+/g,''))
                });
            }
        });
        return result.length > 0 ? result : ['','']
    }

    changeSelected(e) {
        this.setState({selectedParam: e.target.value})
    }

    render() {
        let inputParametersKeys = Object.keys(getWfInputsRegex(this.state.finalWf)) || [];
        let existingInputParameters = this.state.finalWf.inputParameters || [];

        existingInputParameters.forEach(param => {
            inputParametersKeys.push(param.match(/^(.*?)\[/)[1])
        });

        inputParametersKeys = _.uniq(inputParametersKeys);

        let currentDescription = this.getDescriptionAndDefault(this.state.selectedParam)[0];
        let currentDefault = this.getDescriptionAndDefault(this.state.selectedParam)[1];
        let noInputParams = inputParametersKeys.length < 1;

        return (
            <div>
                <Form>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Available input parameters:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control disabled={noInputParams} onClick={(e) => this.changeSelected(e)} as="select">
                                {inputParametersKeys.map(param => <option>{param}</option>)}
                            </Form.Control>
                            <InputGroup.Append>
                                <Button disabled={noInputParams}
                                        title="delete parameter's default and description"
                                        onClick={() => this.props.deleteDefaultAndDesc(this.state.selectedParam)}
                                        variant="outline-danger"><i
                                    className="fas fa-times"/></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    <Form.Row>
                        <Col>
                            <Form.Label>default value</Form.Label>
                            <Form.Control placeholder="default value"
                                          disabled={noInputParams}
                                          value={currentDefault}
                                          onChange={(e) => this.props.handleCustomDefaultAndDesc(
                                              this.state.selectedParam,
                                              e.target.value,
                                              currentDescription)}/>
                        </Col>
                        <Col>
                            <Form.Label>description</Form.Label>
                            <Form.Control placeholder="description"
                                          disabled={noInputParams}
                                          value={currentDescription}
                                          onChange={(e) => this.props.handleCustomDefaultAndDesc(
                                              this.state.selectedParam,
                                              currentDefault,
                                              e.target.value)}/>
                        </Col>
                    </Form.Row>
                </Form>
            </div>
        );
    }
}

export default DefaultsDescsTab;