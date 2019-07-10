import React, { Component } from 'react';
import {Modal, Button, Form, Row, Col} from "react-bootstrap";

class ExecuteAndSaveModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            show: true,
            finalWf: this.props.definition()
        };
    }

    handleClose() {
        this.setState({show: false});
        this.props.modalHandler()
    }

    handleSave() {
        this.setState({show: false});
        this.props.saveInputs(this.state.finalWf);
        this.props.modalHandler()
    }

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

    render() {
        console.log(this.state.finalWf);
        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose}>  <Modal.Header>
                <Modal.Title>Execute & Save Workflow</Modal.Title>
            </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Form>
                        <Row>
                            {Object.entries(this.state.finalWf).map(((item, i) => {
                                if (item[0] === "outputParameters") {
                                    return Object.entries(item[1]).map((entry, i) => {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                <Form.Group>
                                                    <Form.Label><b>Output parameter:</b> {entry[0]}</Form.Label>
                                                    <Form.Control
                                                        type="input"
                                                        onChange={(e) => this.handleInput(e, item, entry)}
                                                        value={entry[1]}/>
                                                </Form.Group>
                                            </Col>
                                        )
                                    })
                                } else if (item[0] !== "tasks") {
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
                    <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ExecuteAndSaveModal;
