import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col, Tabs, Tab, InputGroup, ButtonGroup} from "react-bootstrap";
import {mountCliTemplate, mountCliTemplateAdv, mountNetconfTemplate, mountNetconfTemplateAdv} from "../../../constants";
const http = require('../../../../server/HttpServerSide').HttpClient;


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: this.props.show,
            mountCliForm: JSON.parse("[" + mountCliTemplate + "]"),
            mountCliFormAdv: JSON.parse("[" + mountCliTemplateAdv + "]"),
            mountNetconfForm: JSON.parse("[" + mountNetconfTemplate + "]"),
            mountNetconfFormAdv: JSON.parse("[" + mountNetconfTemplateAdv + "]"),
            mountType: "Cli",
            connectionStatus: null,
            timeout: null,
            showPass: false,
            isAdv: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
        })
    }

    handleClose() {
        this.props.modalHandler();
        clearTimeout(this.state.timeout);
    }

    mountDevice() {
        let payload = {};
        let data = {};
        let mountType = this.state.mountType;

        if (mountType === "Cli") {
            Object.entries(this.state.mountCliForm[0]).map(item => {
                data[item[0]] = item[1][0];

                Object.entries(this.state.mountCliFormAdv[0]).map(item => {
                    data[item[0]] = item[1][0];
                    return data[item];
                });
                return data[item];
            });
        } else {
            Object.entries(this.state.mountNetconfForm[0]).map(item => {
                data[item[0]] = item[1][0];

                Object.entries(this.state.mountNetconfFormAdv[0]).map(item => {
                    data[item[0]] = item[1][0];
                    return data[item];
                });
                return data[item];
            });
        }

        payload["network-topology:node"] = data;
        let topology = Object.keys(payload["network-topology:node"])[4].split(":")[0].split("-")[0];
        if(topology === "netconf") {
            topology = "topology-netconf";
        }
        let node = Object.values(payload["network-topology:node"])[0];

        console.log(payload);
        http.put("/api/odl/mount/" + topology + "/" + node, payload).then(res => {
            console.log(res);
        }).then(() => {
            setTimeout(() => this.getConnectionStatus(topology, node), 300);
        })
    }

    getConnectionStatus(topology, node) {
        http.get("/api/odl/get/oper/status/" + topology + "/" + node).then(res => {
            let connectionStatus = res;
            if (res === 404) {
                connectionStatus = "connecting";
            } else {
                if (topology === "topology-netconf") {
                    connectionStatus = Object.values(res.node[0])[4] || Object.values(res.node[0])[2];
                } else if (topology === "cli") {
                    connectionStatus = Object.values(res.node[0])[1];
                }
                this.props.addDeviceEntry(node, topology);
            }

            this.setState({connectionStatus: connectionStatus});

            if(connectionStatus !== "connected") {
                this.setState(
                    {timeout: setTimeout(this.getConnectionStatus.bind(this,topology, node), 3000)
                    })
             }
        });
    }

    changeMountType(which) {
        this.setState({
            mountType: which,
            deviceMounted: false,
            connectionStatus: null
        });
        clearTimeout(this.state.timeout);
    }

    handleInput(e, i, formToDisplay) {
        Object.values(formToDisplay).map( (item,idx) => {
            if (idx === i) {
                item[0] = e.target.value
            }
            return null;
        });

        if (this.state.isAdv) {
            let updatedForm = {...this.state.mountCliFormAdv};
            updatedForm[0] = formToDisplay;
            this.setState({
                mountCliFormAdv: updatedForm
            })
        } else {
            let updatedForm = {...this.state.mountCliForm};
            updatedForm[0] = formToDisplay;
            this.setState({
                mountCliForm: updatedForm
            })
        }
    }

    render() {

        let formToDisplay = [];
        if (this.state.mountType === "Cli") {
            formToDisplay = this.state.mountCliForm[0];
            if (this.state.isAdv) {
                formToDisplay = this.state.mountCliFormAdv[0];
            }
        } else {
            formToDisplay = this.state.mountNetconfForm[0];
            if (this.state.isAdv) {
                formToDisplay = this.state.mountNetconfFormAdv[0];
            }
        }

        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Mount Device</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Tabs onSelect={this.changeMountType.bind(this)} style={{marginBottom: "20px"}} defaultActiveKey="Cli" id="mountTabs">
                        <Tab eventKey="Cli" title="CLI">
                            <ButtonGroup style={{marginBottom: "20px"}} size="sm" className="d-flex">
                                <Button onClick={() => this.setState({isAdv: false})}
                                        active={this.state.isAdv ? null : "active"} className="noshadow"
                                        variant="outline-primary"><i className="fas fa-cog"/>&nbsp;&nbsp;Basic</Button>
                                <Button onClick={() => this.setState({isAdv: true})}
                                        active={this.state.isAdv ? "active" : null} className="noshadow"
                                        variant="outline-primary"><i className="fas fa-cogs"/>&nbsp;&nbsp;Advanced</Button>
                            </ButtonGroup>

                            <Form>
                                <Row>
                                    {Object.entries(formToDisplay).map((function (item, i) {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                    {item[0].split(":").pop() === "password" ? (
                                                        <Form.Group
                                                            controlId={`mountCliInput-${item[0].split(":").pop()}`}>
                                                            <Form.Label>{item[0].split(":").pop()}</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Append style={{width: "40px"}} className="clickable" onClick={() => this.setState({showPass: !this.state.showPass})}>
                                                                    <InputGroup.Text>
                                                                        <i className={this.state.showPass ? "fas fa-eye-slash" : "fas fa-eye"}/>
                                                                    </InputGroup.Text>
                                                                </InputGroup.Append>
                                                                <Form.Control
                                                                    type={this.state.showPass ? "input" : "password"}
                                                                    autoComplete="password"
                                                                    onChange={(e) => this.handleInput(e,i,formToDisplay)}
                                                                    value={item[1][0]}/>
                                                            </InputGroup>
                                                            <Form.Text className="text-muted">
                                                                {item[1][1]}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    ) : (
                                                        <Form.Group
                                                            controlId={`mountCliInput-${item[0].split(":").pop()}`}>
                                                            <Form.Label>{item[0].split(":").pop()}</Form.Label>
                                                            <Form.Control
                                                                type="input"
                                                                onChange={(e) => this.handleInput(e,i,formToDisplay)}
                                                                value={item[1][0]}/>
                                                            <Form.Text className="text-muted">
                                                                {item[1][1]}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    )}
                                            </Col>
                                        )
                                    }).bind(this))}
                                </Row>
                            </Form>


                        </Tab>
                        <Tab eventKey="Netconf" title="Netconf">
                            <ButtonGroup style={{marginBottom: "20px"}} size="sm" className="d-flex">
                                <Button onClick={() => this.setState({isAdv: false})}
                                        active={this.state.isAdv ? null : "active"} className="noshadow"
                                        variant="outline-primary"><i className="fas fa-cog"/>&nbsp;&nbsp;Basic</Button>
                                <Button onClick={() => this.setState({isAdv: true})}
                                        active={this.state.isAdv ? "active" : null} className="noshadow"
                                        variant="outline-primary"><i className="fas fa-cogs"/>&nbsp;&nbsp;Advanced</Button>
                            </ButtonGroup>
                            <Form>
                                <Row>
                                    {Object.entries(formToDisplay).map((function (item, i) {
                                        return (
                                            <Col sm={6} key={`col2-${i}`}>
                                                <Form.Group controlId={`mountNetconfInput-${item[0].split(":").pop()}`}>
                                                    <Form.Label>{item[0].split(":").pop()}</Form.Label>
                                                    <Form.Control type="input"
                                                                  onChange={(e) => this.handleInput(e,i,formToDisplay)}
                                                                  value={item[1][0]}/>
                                                    <Form.Text className="text-muted">
                                                        {item[1][1]}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        )
                                    }).bind(this))}
                                </Row>
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                           <Button variant={this.state.connectionStatus === null ?
                               "primary" :
                               this.state.connectionStatus === "connecting" ?
                                   "info" :
                                   this.state.connectionStatus === "connected" ?
                                       "success" : "danger"}
                            onClick={this.mountDevice.bind(this)}>
                               {this.state.connectionStatus === null ?
                                   null :
                                   this.state.connectionStatus === "connecting" ?
                                       <i className="fas fa-spinner fa-spin"/> :
                                       this.state.connectionStatus === "connected" ?
                                           <i className="fas fa-check-circle"/> :
                                           <i className="fas fa-exclamation-circle"/>}
                               &nbsp;&nbsp;
                        {this.state.connectionStatus === null ?
                            "Mount Device" :
                            this.state.connectionStatus === "connecting" ?
                                "Connecting" :
                                this.state.connectionStatus === "connected" ?
                                    "Connected" : "Something went wrong"}
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