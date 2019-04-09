import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col, Tabs, Tab, Alert, Badge} from "react-bootstrap";
import { mountCliTemplate, mountNetconfTemplate } from "../../../constants";
const http = require('../../../../server/HttpServerSide').HttpClient;


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: this.props.show,
            mountCliForm: JSON.parse("[" + mountCliTemplate + "]"),
            mountNetconfForm: JSON.parse("[" + mountNetconfTemplate + "]"),
            mountingDevice: false,
            mountType: "Cli",
            connectionStatus: null,
        }
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
                if( item === 'cli-topology:device-type') {
                }
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
        let topology = Object.keys(payload["network-topology:node"])[4].split(":")[0].split("-")[0];
        let node = Object.values(payload["network-topology:node"])[0];


        this.setState({mountingDevice: true});
        http.put("/api/odl/mount/" + topology + "/" + node, payload).then(res => {
            console.log(res);
            this.setState({mountingDevice: false});
        }).then(() => {
            this.getConnectionStatus(topology,node);
        })

    }

    getConnectionStatus(topology, node) {
        http.get("/api/odl/get/status/" + topology + "/" + node).then(res => {
            let connectionStatus = res.node[0]["cli-topology:connection-status"];
            console.log(connectionStatus);
            this.setState({connectionStatus: connectionStatus});
            if(connectionStatus !== "connected") {
                setTimeout(this.getConnectionStatus.bind(this,topology, node), 3000);
            }

        });
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
                    <Badge variant={this.state.connectionStatus === "connecting" ? "primary" : "success" }>{this.state.connectionStatus}</Badge>
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