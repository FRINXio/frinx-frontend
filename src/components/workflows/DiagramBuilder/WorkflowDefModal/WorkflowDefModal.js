import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";
import Highlight from "react-highlight.js";

class WorkflowDefModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            def: JSON.stringify(this.props.definition, null, 2) || "{}"
        };
    }

    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler()
    }

    render() {
        return (
            <Modal size="xl" show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Workflow Definition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <code style={{fontSize: "17px"}}>
                            <pre style={{maxHeight: "600px"}}>
                                <Highlight language="json">
                                   {this.state.def}
                                </Highlight>
                            </pre>
                    </code>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default WorkflowDefModal;
