import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col, Tabs, Tab} from "react-bootstrap";
import { mountCliTemplate, mountNetconfTemplate } from "../../../constants";


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: this.props.show,
            mountCliForm: JSON.parse("[" + mountCliTemplate + "]"),
            mountNetconfForm: JSON.parse("[" + mountNetconfTemplate + "]"),
            mountingDevice: false,
            mountType: "Cli"
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show
        })
    }

    mountDevice() {
        let payload = {};
        let data = {};
        let mountType = this.state.mountType;

        if (mountType === "Cli") {
            Object.keys(this.state.mountCliForm[0]).map(function (item, i) {
                let targetField = item.split(":").pop();
                data[item] = document.getElementById(`mount${mountType}Input-${targetField}`).value;
                return data[item];
            });
        } else {
            Object.keys(this.state.mountNetconfForm[0]).map(function (item, i) {
                let targetField = item.split(":").pop();
                data[item] = document.getElementById(`mount${mountType}Input-${targetField}`).value;
                return data[item];
            });
        }

        payload["network-topology:node"] = data;
        payload = JSON.stringify(payload);
        console.log(payload)

        //TODO Make a request to ODL

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
            }
        });

        xhr.open("PUT", "http://localhost:8181/restconf/config/network-topology:network-topology/topology/cli/node/xr5");
        xhr.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(payload);
    }


    changeMountType(which) {
        this.setState({
            mountType: which
        })
    }

    handleClose() {
        this.setState({ show: false });
    }

    render() {
        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Mount Device</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Tabs onSelect={this.changeMountType.bind(this)} style={{marginBottom: "20px"}} defaultActiveKey="Cli" id="mountTabs">
                        <Tab eventKey="Cli" title="CLI">
                            <Form>
                                <Row>
                                    {Object.entries(this.state.mountCliForm[0]).map((function (item, i) {
                                        return (
                                            <Col sm={6}>
                                                <Form.Group controlId={`mountCliInput-${item[0].split(":").pop()}`}>
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
                        </Tab>
                        <Tab eventKey="Netconf" title="Netconf">
                            <Form>
                                <Row>
                                    {Object.entries(this.state.mountNetconfForm[0]).map((function (item, i) {
                                        return (
                                            <Col sm={6}>
                                                <Form.Group controlId={`mountNetconfInput-${item[0].split(":").pop()}`}>
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
                        </Tab>
                    </Tabs>
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