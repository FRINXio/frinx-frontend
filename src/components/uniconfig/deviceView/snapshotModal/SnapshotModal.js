import React, { Component } from 'react';
import { Modal, Button, Form } from "react-bootstrap";


class SnapshotModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            show: true,
            savingSnapshot: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleSelect(e){
        console.log(e.target.value);
    }

    handleSave(){
        //rest call to save and also directly update list?
        this.setState({
            savingSnapshot: true
        });

        setTimeout( () => {
            this.setState({
                savingSnapshot: false
            });
            this.handleClose();
        }, 1000);
    }

    render() {

        return (

            <Modal show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Create New Snapshot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="snapshotNameInput">
                            <Form.Label>Snapshot Name</Form.Label>
                            <Form.Control type="input" placeholder="snapshot1" />
                        </Form.Group>
                        <Form.Group controlId="targetNodeSelect">
                            <Form.Label>Select target nodes</Form.Label>
                            <Form.Control as="select" onChange={this.handleSelect.bind(this)} multiple>
                                <option>R1</option>
                                <option>R2</option>
                                <option>R3</option>
                                <option>R4</option>
                                <option>R5</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSave}>
                        {this.state.savingSnapshot ? (<i className="fas fa-spinner fa-spin"/>) : null}
                        {this.state.savingSnapshot ? "    Saving..." : "Save Snapshot"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default SnapshotModal;