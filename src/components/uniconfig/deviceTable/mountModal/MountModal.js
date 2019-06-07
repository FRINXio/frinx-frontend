import React, { Component } from 'react';
import {Button, Form, Modal, Row, Col, Tabs, Tab, InputGroup, ButtonGroup} from "react-bootstrap";
import Dropdown from 'react-dropdown';
import './MountModal.css'
import 'react-dropdown/style.css';
import {
    mountCliTemplate,
    mountCliTemplateAdv,
    mountNetconfTemplate,
    mountNetconfTemplateAdv,
    mountCliTemplateLazyOFF,
    mountCliTemplateLazyON,
    mountCliTemplateDryRunOFF,
    mountCliTemplateDryRunON,
    mountNetconfTemplateDryRunOFF,
    mountNetconfTemplateDryRunON,
    mountNetconfTemplateOverrideOFF,
    mountNetconfTemplateOverrideON,
    mountNetconfTemplateCapabilities,
    netconfXRwhitelist,
    netconfJUNOSwhitelist,
    netconfXRblacklist,
    netconfJUNOSblacklist
} from "../../../constants";
import CapModal from "./capModal/CapModal";
const http = require('../../../../server/HttpServerSide').HttpClient;


class MountModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: this.props.show,
            mountCliForm: [],
            mountCliFormAdv: [],
            mountNetconfForm: [],
            mountNetconfFormAdv: [],
            mountNetconfFormCaps: [],
            whitelist: {},
            blacklist: {},
            enableBlacklist: false,
            deviceTypeVersion: {},
            deviceType: null,
            mountType: "Cli",
            nativeUc: false,
            nativeDevice: "XR",
            connectionStatus: null,
            timeout: null,
            showPass: false,
            showCapModal: false,
            isAdv: false,
            isSsh: true,
            activeToggles: [],
        }
    }

    componentWillMount() {
        this.getPredefinedForm();

        this.setState({
            mountCliForm: JSON.parse("[" + mountCliTemplate + "]")[0],
            mountCliFormAdv: {...JSON.parse("[" + mountCliTemplateAdv + "]")[0], ...JSON.parse("[" + mountCliTemplateLazyOFF + "]")[0]},
            mountNetconfForm: JSON.parse("[" + mountNetconfTemplate + "]")[0],
            mountNetconfFormAdv: JSON.parse("[" + mountNetconfTemplateAdv + "]")[0],
            mountNetconfFormCaps: JSON.parse("[" + mountNetconfTemplateCapabilities + "]")[0],
            deviceType: JSON.parse("[" + mountCliTemplate + "]")[0]["cli-topology:device-type"][0],
            whitelist: this.state.nativeDevice === "XR" ? JSON.parse(netconfXRwhitelist) : JSON.parse(netconfJUNOSwhitelist),
            blacklist: this.state.nativeDevice === "XR" ? JSON.parse(netconfXRblacklist) : JSON.parse(netconfJUNOSblacklist)
        });
        this.getSupportedDevices();
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

    getPredefinedForm() {
        if (this.props.device.length === 1) {
            let device = this.props.device[0]["node_id"];
            let topology = "cli";
            if (this.props.device[0]["topology"] === "netconf") {
                topology = "topology-netconf";
                this.setState({mountType: "Netconf"})
            }

            http.get("/api/odl/get/conf/status/" + topology + "/" + device).then(res => {
                let values = Object.entries(res["node"][0]);
                let mountForm = topology === "cli" ?
                    JSON.parse("[" + mountCliTemplate + "]")[0] : JSON.parse("[" + mountNetconfTemplate + "]")[0];
                Object.entries(mountForm).map(field => {
                    values.forEach(value => {
                        if (field[0].split(":").pop() === value[0].split(":").pop()) {
                            mountForm[field[0]][0] = value[1];
                        }
                    });
                    return null;
                });

                if (topology === "cli") {
                    this.setState({mountCliForm: mountForm
                    })
                } else {
                    this.setState({
                        mountNetconfForm: mountForm,
                        mountType: "Netconf"
                    })
                }
            })
        }
    }

    async parsePayload() {
        let payload = {};
        let data = {};
        let mountType = this.state.mountType;
        let listingRes = false;

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
            //append overridden capabilities
            if (this.state.activeToggles.includes(0)) {
               data = {...data, ...this.state.mountNetconfFormCaps}
            }
            //if uniconfig native, send blacklist and whitelist first
            if (this.state.nativeUc) {
                listingRes = await this.sendLists()
            }
        }

        payload["network-topology:node"] = data;
        let topology = Object.keys(payload["network-topology:node"])[4].split(":")[0].split("-")[0];
        if (topology === "netconf") {
            topology = "topology-netconf";
        }
        let node = Object.values(payload["network-topology:node"])[0];

        if (this.state.nativeUc) {
            if (listingRes) {
                this.mountDevice(node, payload, topology)
            }
        } else {
            this.mountDevice(node, payload, topology)
        }
    }

    async sendLists() {
        this.setState({
            connectionStatus: "Sending Whitelist ..."
        });
        let target = this.state.nativeDevice.toLowerCase();
        return http.put("/api/odl/put/conf/native/whitelist/" + target, this.state.whitelist).then( res => {
            if (this.state.enableBlacklist) {
                this.setState({
                    connectionStatus: "Sending Blacklist ..."
                });
                return http.put("/api/odl/put/conf/native/blacklist/" + target, this.state.blacklist).then(res2 => {
                    return res2.body.status === 200;
                })
            } else {
                return res.body.status === 200;
            }
        });
    }

    mountDevice(node, payload, topology) {
        console.log(JSON.stringify(payload, null, 2));
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

    getSupportedDevices() {
        try {
            http.get('/api/odl/get/oper/registry/cli-devices/').then(res => {
                let objArray = Object.values(Object.entries(res)[0][1]);
                objArray = [...objArray[0]];
                this.setState({deviceTypeVersion: objArray})
            });
        } catch (e) {
            console.log(e);
        }
    }

    changeMountType(which) {
        //reset forms and turn off settings
        this.setState({
            mountType: which,
            deviceMounted: false,
            connectionStatus: null,
            isAdv: false,
            activeToggles: [],
            mountCliFormAdv: {...JSON.parse("[" + mountCliTemplateAdv + "]")[0], ...JSON.parse("[" + mountCliTemplateLazyOFF + "]")[0]},
            mountNetconfFormAdv: JSON.parse("[" + mountNetconfTemplateAdv + "]")[0],
        });
        clearTimeout(this.state.timeout);
    }

    handleInput(e, i, formToDisplay, which) {
        Object.values(formToDisplay).map( (item,idx) => {
            if (idx === i) {
                if(e.target){
                    item[0] = e.target.value;
                } else {
                    item[0] = e.value;
                    if (which === "type") {
                        this.setState({deviceType: e.value});
                    }
                }
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

    handleNative(e, list) {
        if (list === "whitelist") {
            let updated = this.state.whitelist;
            updated["direct-unit-matcher"]["0"]["capability-regex-matcher"] =  e.target.value;
            this.setState({
                whitelist: updated
            })
        } else {
            let updated = this.state.blacklist;
            updated["blacklisted-read"].paths.path =  e.target.value;
            this.setState({
                blacklist: updated
            })
        }
    }

    showNativeSettings() {
        let options = ["XR", "Junos"];
        let whitelistArr = this.state.nativeDevice === "Junos" ? JSON.parse(netconfXRwhitelist) : JSON.parse(netconfJUNOSwhitelist);
        let blacklistArr = this.state.nativeDevice === "Junos" ? JSON.parse(netconfXRblacklist) : JSON.parse(netconfJUNOSblacklist);

        return (
                <Form style={{marginTop: "20px"}}>
                    <Form.Label><b>UniConfig Native Settings</b></Form.Label>
                    <hr/>
                    <Row>
                        <Col>
                            <Form.Label>Device</Form.Label>
                            <Dropdown options={options} onChange={() =>
                                this.setState({
                                    nativeDevice: this.state.nativeDevice === "XR" ? "Junos" : "XR",
                                    whitelist: whitelistArr,
                                    blacklist: blacklistArr
                                })}
                                      value={this.state.nativeDevice}/>
                            <Form.Text className="text-muted">
                                Select device
                            </Form.Text>
                        </Col>
                        <Col>
                            <Form.Label>Whitelist</Form.Label>
                            <Form.Control type="input" onChange={(e) => this.handleNative(e, "whitelist")} value={this.state.whitelist["direct-unit-matcher"]["0"]["capability-regex-matcher"]}/>
                            <Form.Text className="text-muted">
                                Whitelisted strings
                            </Form.Text>
                        </Col>
                        <Col>
                            <Form.Label>Blacklist</Form.Label>
                            <InputGroup>
                                <InputGroup.Append style={{width: "40px"}} >
                                    <InputGroup.Text>
                                        <input className="clickable" type="checkbox" onClick={() => this.setState({enableBlacklist: !this.state.enableBlacklist})}/>
                                    </InputGroup.Text>
                                </InputGroup.Append>
                                <Form.Control disabled={!this.state.enableBlacklist} type="input"  onChange={(e) => this.handleNative(e, "blacklist")} value={this.state.blacklist["blacklisted-read"].paths.path}/>
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Blacklisted things
                            </Form.Text>
                        </Col>
                    </Row>
                </Form>
        )
    }

    handleToggle(value) {

        let valueToFormArr = [];
        let topologyForm = null;
        let topologyState = null;
        let valueToFormArrCLI = [[mountCliTemplateLazyOFF, mountCliTemplateLazyON], [mountCliTemplateDryRunOFF, mountCliTemplateDryRunON]];
        let valueToFormArrNETCONF = [[mountNetconfTemplateOverrideOFF, mountNetconfTemplateOverrideON], [mountNetconfTemplateDryRunOFF, mountNetconfTemplateDryRunON]];

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

    showCapModal() {
            this.setState({
                showCapModal: !this.state.showCapModal,
            })
    }

    getUpdatedCaps(data) {
        console.log(data);
        this.setState({
            mountNetconfFormCaps: data,
        });
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

        let capModal = this.state.showCapModal ?
            <CapModal getUpdatedCaps={this.getUpdatedCaps.bind(this)}
                      caps={this.state.mountNetconfFormCaps}
                      modalHandler={this.showCapModal.bind(this)} show={this.state.showCapModal}/> : null;

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
                                variant="outline-info">Override capabilities</Button>
                        <Button onClick={() => this.handleToggle(1)}
                                style={{width: "50%"}}
                                active={this.state.activeToggles.includes(1) ? "active" : null} className="noshadow"
                                variant="outline-info">Dry-run</Button>
                        <Button onClick={() => this.setState({nativeUc: !this.state.nativeUc})}
                                style={{width: "50%"}}
                                active={this.state.nativeUc ? "active" : null} className="noshadow"
                                variant="outline-info">UniConfig Native</Button>
                    </ButtonGroup>
                    : null
            )
        };

        const transportField = (item, i, type) => {
            const options = [{ value: 'ssh', label: 'ssh' }, { value: 'telnet', label: 'telnet' },];
            return (
                <Form.Group
                    controlId={`mount${type}Input-${item[0].split(":").pop()}`}>
                    <Form.Label>{item[0].split(":").pop()}</Form.Label>
                    <Dropdown options={options} onChange={(e) => {
                        this.handleInput(e, i, formToDisplay);
                        this.setState({isSsh: !this.state.isSsh})
                    }} value={this.state.isSsh ? "ssh" : "telnet"}/>
                    <Form.Text className="text-muted">
                        {item[1][1]}
                    </Form.Text>
                </Form.Group>
            )
        };

        const deviceTypeVersionField = (item, i, type, which) => {
            let options = [];
            if (which === "type") {
                Object.values(this.state.deviceTypeVersion).map(obj => {
                    return options.push({value: obj["device-type"], label: obj["device-type"]})
                });
            } else {
                Object.values(this.state.deviceTypeVersion).map(obj => {
                    if (obj["device-type"] === this.state.deviceType) {
                        return options.push({value: obj["device-version"], label: obj["device-version"]})
                    }
                    return null;
                });
            }
            options = Array.from(new Set(options.map(JSON.stringify))).map(JSON.parse);
            return (
                <Form.Group
                    controlId={`mount${type}Input-${item[0].split(":").pop()}`}>
                    <Form.Label>{item[0].split(":").pop()}</Form.Label>
                    <Dropdown options={options} onChange={(e) =>
                        this.handleInput(e, i, formToDisplay, which)} value={item[1][0]}/>
                    <Form.Text className="text-muted">
                        {item[1][1]}
                    </Form.Text>
                </Form.Group>
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

        const capabilitiesField = (item, i, type) => {
            return (
                <Form.Group
                    controlId={`mount${type}Input-${item[0].split(":").pop()}`}>
                    <Form.Label>{item[0].split(":").pop()}</Form.Label>
                    <InputGroup>
                        <InputGroup.Append style={{width: "40px"}} className="clickable" onClick={this.showCapModal.bind(this)}>
                            <InputGroup.Text>
                                <i className="fas fa-plus-circle"/>
                            </InputGroup.Text>
                        </InputGroup.Append>
                        <Form.Control
                            type="input"
                            disabled
                            value={item[1][0]}/>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        &nbsp;&nbsp;<i className="fas fa-chevron-up"/>&nbsp;&nbsp;{item[1][1]}
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

        const whichField = (item, i, type) => {
            let id = item[0].split(":").pop();
            switch (id) {
                case "password": return passwordField(item, i, type);
                case "transport-type": return transportField(item, i, type);
                case "override": return capabilitiesField(item, i, type);
                case "device-type": return deviceTypeVersionField(item, i, type, "type");
                case "device-version": return deviceTypeVersionField(item, i, type, "version");
                default: return inputField(item, i , type);
            }
        };

        const connectionBtn = () => {
            return (
                <Button variant={this.state.connectionStatus === null ?
                    "primary" :
                    this.state.connectionStatus === "connecting" || this.state.connectionStatus.startsWith("Sending") ?
                        "info" :
                        this.state.connectionStatus === "connected" ?
                            "success" : "danger"}
                        onClick={this.parsePayload.bind(this)}>
                    {this.state.connectionStatus === null ?
                        null :
                        this.state.connectionStatus === "connecting" || this.state.connectionStatus.startsWith("Sending") ?
                            <i className="fas fa-spinner fa-spin"/> :
                            this.state.connectionStatus === "connected" ?
                                <i className="fas fa-check-circle"/> :
                                <i className="fas fa-exclamation-circle"/>}
                    &nbsp;&nbsp;
                    {this.state.connectionStatus === null ?
                        "Mount Device" : this.state.connectionStatus.charAt(0).toUpperCase() + this.state.connectionStatus.slice(1)}
                </Button>
            )
        };

        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title>Mount Device</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Tabs onSelect={this.changeMountType.bind(this)} style={{marginBottom: "20px"}} defaultActiveKey={this.state.mountType} id="mountTabs">
                        <Tab eventKey="Cli" title="CLI">
                            {settingsGroup()}
                            {toggleGroupCli()}
                            <Form>
                                <Row>
                                    {Object.entries(formToDisplay).map((function (item, i) {
                                        return (
                                            <Col sm={6} key={`col1-${i}`}>
                                                {whichField(item, i, "cli")}
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
                                                {whichField(item, i, "netconf")}
                                            </Col>
                                        )
                                    }))}
                                </Row>
                            </Form>

                            {this.state.nativeUc && this.state.isAdv ? this.showNativeSettings() : null}

                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    {connectionBtn()}
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>

                {capModal}
            </Modal>
        );
    }
}

export default MountModal;