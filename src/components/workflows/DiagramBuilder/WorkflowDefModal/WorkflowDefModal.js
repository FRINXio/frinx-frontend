import React, { Component } from 'react';
import {Modal} from "react-bootstrap";
import Highlight from "react-highlight.js";

class WorkflowDefModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: true,
            def: JSON.stringify(this.props.definition, null, 2) || "{}"
        };
        this.handleClose = this.handleClose.bind(this);
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
                <code style={{fontSize: "18px"}}>
                    <pre style={{maxHeight: "600px"}}>
                        <Highlight language="json">
                            {this.state.def}
                        </Highlight>
                    </pre>
                </code>
            </Modal>
        );
    }
}

export default WorkflowDefModal;
