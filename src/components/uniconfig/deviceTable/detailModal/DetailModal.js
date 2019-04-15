import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col, Tabs, Tab } from "react-bootstrap";
import { mountCliTemplate, mountNetconfTemplate } from "../../../constants";
const http = require('../../../../server/HttpServerSide').HttpClient;


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
        })
    }


    handleClose() {
        this.setState({
            show: false,
        });
        this.props.modalHandler();
    }

    render() {
        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Mount Device</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>

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

export default MountModal;