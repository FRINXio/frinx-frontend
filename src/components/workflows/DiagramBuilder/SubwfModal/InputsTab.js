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
        let inputParameters = this.props.inputParameters || [];
        let result = [];

        inputParameters.forEach(param => {
            if (param.match(/^(.*?)\[/)[1] === selectedParam) {
                param.match(/\[(.*?)]/g).map(group => {
                    result.push(group.replace(/[\[\]']+/g, ''))
                });
            }
        });

        return result.length > 0 ? result : ['', '']
    }

    handleCustomParam(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.handleCustomParam(this.state.customParam);
        this.setState({
            customParam: ""
        })
    }

    handleTextField(entry, item, i, textFieldParams) {
        let value = entry[1];

        if (!entry[0].includes("uri")) {
            if (typeof entry[1] === 'object') {
                value = JSON.stringify(entry[1], null, 5);
            }
        }

        textFieldParams.push(
            <Col sm={12} key={`colTf-${entry[0]}`}>
                <Form.Group>
                    <Form.Label>{entry[0]}<i title="copy to clipboard"
                                             className="btn fa fa-clipboard"
                                             data-clipboard-target={"#textfield" + i}/>
                    </Form.Label>
                    <InputGroup size="sm" style={{
                        minHeight: entry[0] === "uri" ? "60px" : "200px"
                    }}>
                        <Form.Control
                            id={"textfield" + i}
                            as="textarea"
                            type="input"
                            onChange={(e) => this.props.handleInput(e.target.value, item, entry)}
                            value={value}/>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        {this.getDescriptionAndDefault(entry[0])[0]}
                    </Form.Text>
                </Form.Group>
            </Col>
        )
    }


    render() {
        let textFieldKeywords = ["template", "uri", "body"];
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
                                    if (textFieldKeywords.find(keyword => entry[0].includes(keyword))) {
                                        this.handleTextField(entry, item, i, textFieldParams)
                                    } else if (typeof entry[1] === 'object') {
                                        return Object.entries(entry[1]).map(innerEntry => {
                                            if (textFieldKeywords.find(keyword => innerEntry[0].includes(keyword))) {
                                                this.handleTextField(innerEntry, entry, i, textFieldParams);
                                            } else {
                                                return (
                                                    <Col sm={6} key={`col-${innerEntry[0]}`}>
                                                        <Form.Group>
                                                            <Form.Label>{innerEntry[0]}</Form.Label>
                                                            <Form.Control
                                                                type="input"
                                                                onChange={(e) => this.props.handleInput(e.target.value, entry, innerEntry)}
                                                                value={innerEntry[1]}/>
                                                            <Form.Text className="text-muted">
                                                                {this.getDescriptionAndDefault(innerEntry[0])[0]}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                )
                                            }
                                        })
                                    } else {
                                        return (
                                            <Col sm={6} key={`colDefault-${i}`}>
                                                <Form.Group>
                                                    <Form.Label>{entry[0]}</Form.Label>
                                                    <Form.Control
                                                        type="input"
                                                        onChange={(e) => this.props.handleInput(e.target.value, item, entry)}
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
