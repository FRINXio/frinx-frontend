import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col, Tabs, Tab, InputGroup, ButtonGroup} from "react-bootstrap";
import {
    mountCliTemplate, mountCliTemplateAdv,
    mountNetconfTemplate, mountNetconfTemplateAdv,
    mountCliTemplateLazyOFF, mountCliTemplateLazyON,
    mountCliTemplateDryRunON, mountCliTemplateDryRunOFF, mountNetconfTemplateDryRunOFF, mountNetconfTemplateDryRunON
} from "../../../constants";
const http = require('../../../../server/HttpServerSide').HttpClient;


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: this.props.show,
            mountCliForm: JSON.parse("[" + mountCliTemplate + "]")[0],
            mountCliFormAdv: {...JSON.parse("[" + mountCliTemplateAdv + "]")[0], ...JSON.parse("[" + mountCliTemplateLazyOFF + "]")[0]},
            mountNetconfForm: JSON.parse("[" + mountNetconfTemplate + "]")[0],
            mountNetconfFormAdv: JSON.parse("[" + mountNetconfTemplateAdv + "]")[0],
            mountType: "Cli",
            connectionStatus: null,
            timeout: null,
            showPass: false,
            isAdv: false,
            activeToggles: []
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
            Object.entries(this.state.mountCliForm).map(item => {
                data[item[0]] = item[1][0];

                Object.entries(this.state.mountCliFormAdv).map(item => {
                    data[item[0]] = item[1][0];
                    return data[item];
                });
                return data[item];
            });
        } else {
            Object.entries(this.state.mountNetconfForm).map(item => {
                data[item[0]] = item[1][0];

                Object.entries(this.state.mountNetconfFormAdv).map(item => {
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
        //turn off toggles
        this.state.activeToggles.forEach(value => {
            this.handleToggle(value);
        });
        this.setState({
            mountType: which,
            deviceMounted: false,
            connectionStatus: null,
            isAdv: false
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
            this.setState({
                mountCliFormAdv: formToDisplay
            })
        } else {
            this.setState({
                mountCliForm: formToDisplay
            })
        }
    }

    handleToggle(value) {

        let valueToFormArr = [];
        let topologyForm = null;
        let topologyState = null;
        let valueToFormArrCLI = [[mountCliTemplateLazyOFF, mountCliTemplateLazyON], [mountCliTemplateDryRunOFF, mountCliTemplateDryRunON]];
        let valueToFormArrNETCONF = [[ ], [mountNetconfTemplateDryRunOFF, mountNetconfTemplateDryRunON]];

        if(this.state.mountType === "Cli"){
            valueToFormArr = valueToFormArrCLI;
            topologyForm = "mountCliFormAdv";
            topologyState = this.state.mountCliFormAdv;
        } else {
            valueToFormArr = valueToFormArrNETCONF;
            topologyForm = "mountNetconfFormAdv";
            topologyState = this.state.mountNetconfFormAdv;
        }

        if (this.state.activeToggles.includes(value)) {
            let updatedArr = [...this.state.activeToggles];
            updatedArr.splice(updatedArr.indexOf(value), 1);

            //removing ON/OFF data instead of overwriting for persistence of existing data
            Object.keys(JSON.parse("[" + valueToFormArr[value][1] + "]")[0]).filter(key => {
                if (key in topologyState) {
                    return delete topologyState[key];
                }
                return null;
            });
            this.setState({
                activeToggles: updatedArr,
                [topologyForm]: {...topologyState, ...JSON.parse("[" + valueToFormArr[value][0] + "]")[0]},
            });
        } else {
            Object.keys(JSON.parse("[" + valueToFormArr[value][0] + "]")[0]).filter(key => {
                if (key in topologyState) {
                    return delete topologyState[key];
                }
                return null;
            });
            this.setState({
                activeToggles: [...this.state.activeToggles, value],
                [topologyForm]: {...topologyState, ...JSON.parse("[" + valueToFormArr[value][1] + "]")[0]},
            });
        }
    }

    render() {

        let formToDisplay = [];
        if (this.state.mountType === "Cli") {
            formToDisplay = this.state.mountCliForm;
            if (this.state.isAdv) {
                formToDisplay = this.state.mountCliFormAdv;
            }
        } else {
            formToDisplay = this.state.mountNetconfForm;
            if (this.state.isAdv) {
                formToDisplay = this.state.mountNetconfFormAdv;
            }
        }

        const settingsGroup = () => {
            return (
                <ButtonGroup style={{marginBottom: "20px"}} size="sm" className="d-flex">
                    <Button onClick={() => this.setState({isAdv: false})}
                            style={{width: "50%"}}
                            active={this.state.isAdv ? null : "active"} className="noshadow"
                            variant="outline-primary"><i className="fas fa-cog"/>&nbsp;&nbsp;Basic</Button>
                    <Button onClick={() => this.setState({isAdv: true})}
                            style={{width: "50%"}}
                            active={this.state.isAdv ? "active" : null} className="noshadow"
                            variant="outline-primary"><i className="fas fa-cogs"/>&nbsp;&nbsp;Advanced</Button>
                </ButtonGroup>
            )
        };

        const toggleGroupCli = () => {
            return (
                this.state.isAdv ?
                    <ButtonGroup style={{marginBottom: "20px"}} size="sm" className="d-flex">
                        <Button onClick={() => this.handleToggle(0)}
                                style={{width: "50%"}}
                                active={this.state.activeToggles.includes(0) ? "active" : null} className="noshadow"
                                variant="outline-info">Lazy Connection</Button>
                        <Button onClick={() => this.handleToggle(1)}
                                style={{width: "50%"}}
                                active={this.state.activeToggles.includes(1) ? "active" : null} className="noshadow"
                                variant="outline-info">Dry-run</Button>
                    </ButtonGroup>
                    : null
            )
        };

        const toggleGroupNetconf = () => {
            return (
                this.state.isAdv ?
                    <ButtonGroup style={{marginBottom: "20px"}} size="sm" className="d-flex">
                        <Button onClick={() => this.handleToggle(0)}
                                style={{width: "50%"}}
                                active={this.state.activeToggles.includes(0) ? "active" : null} className="noshadow"
                                disabled
                                variant="outline-info">Override capabilities</Button>
                        <Button onClick={() => this.handleToggle(1)}
                                style={{width: "50%"}}
                                active={this.state.activeToggles.includes(1) ? "active" : null} className="noshadow"
                                variant="outline-info">Dry-run</Button>
                    </ButtonGroup>
                    : null
            )
        };

        const passwordField = (item, i, type) => {
            return (
                <Form.Group
                    controlId={`mount${type}Input-${item[0].split(":").pop()}`}>
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
            )
        };

        const inputField = (item, i, type) => {
            return (
                <Form.Group
                    controlId={`mount${type}Input-${item[0].split(":").pop()}`}>
                    <Form.Label>{item[0].split(":").pop()}</Form.Label>
                    <Form.Control
                        type="input"
                        onChange={(e) => this.handleInput(e,i,formToDisplay)}
                        value={item[1][0]}/>
                    <Form.Text className="text-muted">
                        {item[1][1]}
                    </Form.Text>
                </Form.Group>
            )
        };

        const connectionBtn = () => {
            return (
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
            )
        };

        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Mount Device</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Tabs onSelect={this.changeMountType.bind(this)} style={{marginBottom: "20px"}} defaultActiveKey="Cli" id="mountTabs">
                        <Tab eventKey="Cli" title="CLI">
                            {settingsGroup()}
                            {toggleGroupCli()}
                            <Form>
                                <Row>
                                    {Object.entries(formToDisplay).map((function (item, i) {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                {item[0].split(":").pop() === "password" ?
                                                    passwordField(item, i, "cli")
                                                    :
                                                    inputField(item, i, "cli")}
                                            </Col>
                                        )
                                    }))}
                                </Row>
                            </Form>
                        </Tab>
                        <Tab eventKey="Netconf" title="Netconf">
                            {settingsGroup()}
                            {toggleGroupNetconf()}
                            <Form>
                                <Row>
                                    {Object.entries(formToDisplay).map((function (item, i) {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                {item[0].split(":").pop() === "password" ?
                                                    passwordField(item, i, "netconf")
                                                    :
                                                    inputField(item, i, "netconf")}
                                            </Col>
                                        )
                                    }))}
                                </Row>
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    {connectionBtn()}
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MountModal;