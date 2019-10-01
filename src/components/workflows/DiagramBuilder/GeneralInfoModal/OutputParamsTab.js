import React, { Component } from 'react';
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";

class OutputParamsTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            customParam: "",
            finalWf: this.props.finalWf
        };

        this.handleCustomParam = this.handleCustomParam.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.finalWf !== state.finalWf) {
            return {
                finalWf: props.finalWf
            }
        }
        return null
    }

    renderOutputParams() {
        let outputParameters = [];

        Object.entries(this.state.finalWf).map(item => {
            if (item[0] === "outputParameters") {
                outputParameters.push(item);
            }
            return null;
        });

        return outputParameters;
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
        let outputParameters = this.renderOutputParams();

        return (
            <div>
                <Row>
                    <Form onSubmit={this.handleCustomParam}>
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
                <Form onSubmit={this.props.handleSubmit}>
                    <Row>
                        {Object.entries(outputParameters[0][1]).map((key, i) => {
                            return (
                                <Col sm={6} key={`col4-${i}`}>
                                    <Form.Group>
                                        <Form.Label>
                                            {key[0]}&nbsp;&nbsp;
                                            <i className="fas fa-times clickable" style={{color: "red"}}
                                               onClick={() => this.props.deleteOutputParam(key[0])}/>
                                        </Form.Label>
                                        <Form.Control
                                            type="input"
                                            onChange={(e) => this.props.handleOutputParam(e, key)}
                                            value={key[1]}/>
                                    </Form.Group>
                                </Col>
                            )
                        })}
                    </Row>
                </Form>
            </div>
        );
    }
}

export default OutputParamsTab;