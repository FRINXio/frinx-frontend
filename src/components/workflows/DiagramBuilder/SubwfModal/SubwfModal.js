import React, { Component } from 'react';
import {Modal, Button, Form, Row, Col} from "react-bootstrap";

class SubwfModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            show: true,
            inputs: {}
        };
    }

    componentDidMount() {
        console.log(this.props.inputs)
        this.setState({
            inputs: this.props.inputs
        })
    }

    handleClose() {
        this.setState({show: false});
        this.props.modalHandler()
    }

    handleSave() {
        this.setState({show: false});
        this.props.saveInputs(this.state.inputs);
        this.props.modalHandler()
    }

    handleInput(e, item, entry) {
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
                                    })
                                } else if (item[0] !== "type" && item[0] !== "optional" && item[0] !== "subWorkflowParam"){
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
