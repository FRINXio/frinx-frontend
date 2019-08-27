import React, {Component} from 'react';
import {Button, Form, Row, Col, InputGroup} from "react-bootstrap";

class InputsTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            customParam: "",
            inputs: this.props.inputs
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            inputs: nextProps.inputs
        })
    }

    getDescriptionAndDefault(selectedParam) {
        let inputParameters = this.state.inputParameters || [];
        let result = [];

        inputParameters.forEach(param => {
            if (param.match(/^(.*?)\[/)[1] === selectedParam) {
                param.match(/\[(.*?)]/g).map(group => {
                    result.push(group.replace(/[\[\]']+/g,''))
                });
            }
        });

        return result.length > 0 ? result : ['','']
    }

    handleCustomParam(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.handleCustomParam(this.state.customParam);
        this.setState({
            customParam: ""
        })
    }


    render() {
        let textFieldParams = [];

        return (
            <div>
                <Row>
                    <Form onSubmit={this.handleCustomParam.bind(this)}>
                        <InputGroup style={{padding: "10px 215px 10px"}}>
                            <Form.Control value={this.state.customParam}
                                          onChange={(e) => this.setState({customParam: e.target.value})}
                                          placeholder="Add new parameter name"/>
                            <InputGroup.Append>
                                <Button type="submit" variant="outline-primary">Add</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Row>
                <hr className="hr-text" data-content="Existing input parameters"/>
                <Form>
                    <Row>
                        {Object.entries(this.state.inputs).map(item => {
                            if (item[0] === "inputParameters") {
                                return Object.entries(item[1]).map((entry, i) => {
                                    if (entry[0].includes("template") || entry[0].includes("uri")) {
                                        let value = entry[1];

                                        if (entry[0].includes("template")) {
                                            if (typeof entry[1] === 'object') {
                                                value = JSON.stringify(entry[1], null, 5);
                                            }
                                        }

                                        textFieldParams.push(
                                            <Col sm={12} key={`col1-${i}`}>
                                                <Form.Group>
                                                    <Form.Label>{entry[0]}</Form.Label>
                                                    <InputGroup size="sm" style={{
                                                        minHeight: entry[0] === "template" ? "200px" : "60px"
                                                    }}>
                                                        <Form.Control
                                                            as="textarea"
                                                            type="input"
                                                            onChange={(e) => this.props.handleInput(e.target.value, item[0], entry)}
                                                            value={value}/>
                                                    </InputGroup>
                                                    <Form.Text className="text-muted">
                                                        {this.getDescriptionAndDefault(entry[0])[0]}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        )
                                    } else {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                <Form.Group>
                                                    <Form.Label>{entry[0]}</Form.Label>
                                                    <Form.Control
                                                        type="input"
                                                        onChange={(e) => this.props.handleInput(e.target.value, item[0], entry)}
                                                        value={entry[1]}/>
                                                    <Form.Text className="text-muted">
                                                        {this.getDescriptionAndDefault(entry[0])[0]}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        )
                                    }
                                })
                            }
                            return null;
                        })}
                    </Row>
                    <Row>
                        {textFieldParams}
                    </Row>
                </Form>
            </div>
        );
    }
}

export default InputsTab;
