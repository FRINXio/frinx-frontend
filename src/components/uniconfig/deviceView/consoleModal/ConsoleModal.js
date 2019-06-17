import React, { Component } from 'react';
import { Modal, Button, ListGroup } from "react-bootstrap";
import Highlight from "react-highlight.js";
import UnescapeButton from "./UnescapeButton";

class ConsoleModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            content: this.props.content,
            operation: this.props.operation
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            operation: nextProps.operation,
            content: nextProps.content
        })
    }

    handleClose() {
        this.setState({ show: false });
        this.props.consoleHandler()
    }

    parseDryRun() {
        let output = this.state.content;
        if (output) {
            output = output.substring(1, output.length - 1);
            output = output.split('\\n').map(i => {
                return i !== "" ? <ListGroup.Item>{i}</ListGroup.Item> : ""
            });
        }
        return output;
    }

    render() {

        let content = this.state.content || "{}";
        return (

            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Console output of {this.state.operation}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.operation === "Dry-run"
                        ? <ListGroup>
                            {this.parseDryRun()}
                        </ListGroup>
                        : <code style={{fontSize: "20px"}}>
                            <UnescapeButton target='content' />
                            <pre id='content' style={{marginTop: "20px"}}>
                                <Highlight language="json">
                                    {JSON.stringify(JSON.parse(content), null, 2)}
                                </Highlight>
                            </pre>
                        </code>
                    }
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

export default ConsoleModal;