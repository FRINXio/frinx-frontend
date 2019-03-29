import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col} from "react-bootstrap";
import { mountFormTemplate } from "../../../constants";


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: this.props.show,
            mountForm: JSON.parse("[" + mountFormTemplate + "]"),
            mountingDevice: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show
        })
    }

    componentDidMount() {
        this.setState({
            mountForm: JSON.parse("[" + mountFormTemplate + "]")
        });
    }

    mountDevice() {
        console.log(document.getElementById('mountInput-port').value);
    }


    handleClose() {
        this.setState({ show: false });
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Mount Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            {Object.entries(this.state.mountForm[0]).map((function (item, i) {
                                return (
                                    <Col sm={6}>
                                        <Form.Group controlId={`mountInput-${item[0].split(":").pop()}`}>
                                            <Form.Label>{item[0].split(":").pop()}</Form.Label>
                                            <Form.Control type="input" defaultValue={item[1]}/>
                                            <Form.Text className="text-muted">
                                                Some description.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                )
                            }))}
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.mountDevice.bind(this)}>
                        {this.state.mountingDevice ? (<i className="fas fa-spinner fa-spin"/>) : null}
                        {this.state.mountingDevice ? "    Mounting..." : "Mount Device"}
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MountModal;