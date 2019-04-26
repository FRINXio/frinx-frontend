import React, { Component } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
const http = require('../../../../server/HttpServerSide').HttpClient;

class SnapshotModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.setSnapshotName = this.setSnapshotName.bind(this);

        this.state = {
            show: true,
            savingSnapshot: 0,
            device: this.props.device,
            snapshotName: ""
        };
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            device: nextProps.device
        })
    }

    setSnapshotName() {
        let name = document.getElementById("snapshotNameInput").value;
        this.setState({
            snapshotName: name
        });

        console.log(this.state.snapshotName);
    }

    handleClose() {
        this.setState({ show: false });
        this.props.snapHandler()
    }

    handleSave(){

        let name = document.getElementById("snapshotNameInput").value;
        let target = JSON.parse(JSON.stringify({
            "input":
                {
                    "name": name,
                    "target-nodes": {
                        "node": [this.state.device]
                    }
                }
        }));

        this.setState({
            savingSnapshot: 1
        });
        http.post('/api/odl/post/operations/snapshot', target).then( res => {
            console.log(res);
            this.setState({
                savingSnapshot: res.body.status
            });
        });

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
                            <Form.Control type="input" placeholder="snapshot1"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant={this.state.savingSnapshot === 1 ? "info" : this.state.savingSnapshot === 200 ? "success" : "primary" } onClick={this.handleSave}>
                        {this.state.savingSnapshot === 1 ? (<i className="fas fa-spinner fa-spin"/>) : this.state.savingSnapshot === 200 ? <i className="fas fa-check-circle"/> : null }
                        &nbsp;&nbsp;
                        {this.state.savingSnapshot === 1 ? "Saving..." : this.state.savingSnapshot === 200 ? "Saved" : "Save Snapshot"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default SnapshotModal;