import React, {Component} from 'react';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import Editor from "./editor/Editor";
import './DeviceView.css'
import {Badge, Button, Col, Container, Dropdown, Form, Row, Spinner } from "react-bootstrap";
import DropdownMenu from "./dropdownMenu/DropdownMenu";
import SnapshotModal from "./snapshotModal/SnapshotModal";
import CustomAlerts from "../customAlerts/CustomAlerts";
import ConsoleModal from "./consoleModal/ConsoleModal";
const http = require('../../../server/HttpServerSide').HttpClient;

const defaultOptions = {
    originalFileName: 'Operational',
    updatedFileName: 'Operational',
    inputFormat: 'diff',
    outputFormat: 'line-by-line',
    showFiles: false,
    matching: 'none',
    matchWordsThreshold: 0.25,
    matchingMaxComparisons: 2500
};

class DeviceView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: '{}',
            operational: '{}',
            device: null,
            snapshots: ["snapshot1","snapshot2"],
            showDiff: false,
            creatingSnap: false,
            syncing: false,
            initializing: true,
            alertType: null,
            commiting: false,
            showConsole: false,
            console: "",
            operation: ""
        }
    }

    redirect(where) {
        window.location.href = where;
    }

    componentDidMount() {
        this.setState({
            device: window.location.href.split("/").pop()
        }, () => this.fetchData(this.state.device));
    }

    fetchData(device){

        http.get('/api/odl/get/conf/uniconfig/' + device).then(res => {
            console.log(res);
            this.setState({
                config: JSON.stringify(res),
                initializing: false
            })
        });

        http.get('/api/odl/get/oper/uniconfig/' + device).then(res => {
            console.log(res);
            this.setState({
                operational: JSON.stringify(res),
                initializing: false
            })
        });
    }

    getEditedConfig(newData) {
        this.setState({
            config: JSON.stringify(newData, null, 2),
        })
    }

    showDiff(){
        this.setState({
            showDiff: !this.state.showDiff,
        });
    }

    commitToNetwork(){

        this.setState({commiting: true});
        let target = JSON.parse(JSON.stringify({"input": {"target-nodes": {"node": [this.state.device]}}}));
        http.post('/api/odl/post/operations/commit/', target).then(res => {
            this.setState({
                alertType: `commit${res.body.status}`,
                commiting: false
            });
            setTimeout( () => this.setState({alertType: null}), 3000);
            this.syncFromNetwork();
        });
    }

    dryRun() {
        let data = JSON.parse(this.state.config);
        http.put('/api/odl/put/conf/uniconfig/' + this.state.device, data).then(res => {
            console.log("PUT status: "+ res.body.status);

            if (res.body.status === 200) {
                let target = JSON.parse(JSON.stringify({"input": {"target-nodes": {"node": [this.state.device]}}}));
                http.post('/api/odl/post/operations/dryrun/', target).then(res => {
                    console.log(res);
                    this.setState({
                        alertType: `dryrun${res.body.status}`,
                        console: res.body.text,
                        operation: "Dry-run"
                    });
                    document.getElementById("consoleButton").classList.add("button--animate");
                    setTimeout( () => {
                        this.setState({alertType: null});
                        document.getElementById("consoleButton").classList.remove("button--animate")
                    }, 2000);

                })
            }
        });
    }

    syncFromNetwork(){
        this.setState({syncing: true});
        http.get('/api/odl/get/oper/uniconfig/' + this.state.device).then(res => {
            console.log(res);
            this.setState({
                operational: JSON.stringify(res),
                initializing: false,
                syncing: false,
            })
        });
    }

    refreshConfig(){
        http.get('/api/odl/get/conf/uniconfig/' + this.state.device).then(res => {
            console.log(res);
            this.setState({
                config: JSON.stringify(res),
            })
        });
    }

    getSnapshots(){
        http.get('/api/odl/get/conf/snapshots/' + this.state.device).then(res => {
            console.log(res);
            this.setState({
                snapshots: res
            })
        })
    }

    loadSnapshot(snapshotId){
        let snapshotName = this.state.snapshots[snapshotId]["topology-id"];
        http.get('/api/odl/get/conf/snapshots/' + snapshotName + '/' + this.state.device).then(res => {
            this.setState({
                config: JSON.stringify(res, null, 2)
            })
        })
    }

    createSnapshot(){
        this.setState({
            creatingSnap: !this.state.creatingSnap,
        })
    }

    consoleHandler() {
        this.setState({
            showConsole: !this.state.showConsole
        })
    }

    render() {

        let configJSON = JSON.stringify(JSON.parse(this.state.config), null, 2);
        let operationalJSON = JSON.stringify(JSON.parse(this.state.operational), null, 2);

        const operational = () => (
            <div>
                <div>
                    <h2 style={{display: "inline-block", marginTop: "5px"}}>Operational</h2>
                    <div style={{float: "right"}}>
                        <Button className="btn btn-primary" style={{marginRight: '5px'}}
                                disabled={this.state.syncing}
                                onClick={this.syncFromNetwork.bind(this)}>
                            <i className={this.state.syncing ? "fas fa-sync fa-spin" : "fas fa-sync"}/>
                            &nbsp;&nbsp;{this.state.syncing ? "Synchronizing..." : "Sync from network"}
                        </Button>
                    </div>
                </div>
                {this.state.showDiff ?
                    <ReactGhLikeDiff
                        options={defaultOptions}
                        past={operationalJSON}
                        current={configJSON}
                    />
                    :
                    <Editor title="" deviceName={this.state.device} editable={false} updateDiff={this.getEditedConfig.bind(this)}
                            wfs={JSON.parse(operationalJSON)}/>
                }
            </div>
        );

        return (
            <div>
                <header className="options">
                    <Button className="round floating-btn noshadow" onClick={() => {
                        this.redirect(window.location.protocol + "//" + window.location.href.split('/')[2])
                    }} variant="outline-light"><i className="fas fa-chevron-left"/></Button>
                    <Container fluid className="container-props">
                        <Row >
                            <Col md={5} className="child">
                                    <Dropdown onClick={this.getSnapshots.bind(this)} className="leftAligned" >
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            <i className="fas fa-file-download"/>&nbsp;&nbsp;Load Snapshot
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu as={DropdownMenu}>
                                            {this.state.snapshots.map((item, i) => {
                                                return <Dropdown.Item onClick={() => this.loadSnapshot(i)} key={i}>{item["topology-id"]}</Dropdown.Item>
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                <Button className="leftAligned" variant="outline-light"
                                        onClick={this.createSnapshot.bind(this)}>
                                    <i className="fas fa-folder-plus"/>&nbsp;&nbsp;Create snapshot</Button>
                            </Col>
                            <Col md={2} className="child">
                                <Badge id="consoleButton" className="button--moema clickable button--size-s" onClick={this.consoleHandler.bind(this)}> {this.state.device}</Badge>
                            </Col>
                            <Col md={5} className="child">
                                <Form.Group className="rightAligned">
                                    <Button variant={this.state.showDiff ? "light" : "outline-light"}
                                            onClick={this.showDiff.bind(this)}>
                                        <i className="fas fa-exchange-alt"/>&nbsp;&nbsp;{this.state.showDiff ? 'Hide Diff' : 'Show Diff'}
                                    </Button>
                                    <Button variant="outline-light" onClick={this.dryRun.bind(this)}>
                                        <i className="fas fa-play"/>&nbsp;&nbsp;Dry run</Button>
                                    <Button variant="outline-light" onClick={this.commitToNetwork.bind(this)}>
                                        {this.state.commiting ? <Spinner size="sm" animation="border"/> : <i className="fas fa-network-wired"/>}
                                        &nbsp;&nbsp;Commit to network</Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </header>

                {this.state.creatingSnap ? <SnapshotModal snapHandler={this.createSnapshot.bind(this)} device={this.state.device}/> : null }
                {this.state.alertType ? <CustomAlerts alertType={this.state.alertType}/> : null}
                {this.state.showConsole ? <ConsoleModal consoleHandler={this.consoleHandler.bind(this)}
                                                        content={this.state.console}
                                                        operation={this.state.operation}/> : null }

                <Container fluid className="container-props">
                    <div className="editor">
                        <div className="uniconfig">
                            <div className="config">
                                {this.state.initializing ?
                                    <i className="fas fa-sync fa-spin fa-8x"
                                       style={{margin: '40%', color: 'lightblue'}}/>
                                    :
                                    <Editor title="Configurational" editable={true} deviceName={this.state.device}
                                            getEditedConfig={this.getEditedConfig.bind(this)}
                                            wfs={JSON.parse(configJSON)}
                                            refreshConfig={this.refreshConfig.bind(this)}/>
                                }
                            </div>
                            <div className="operational">
                                {this.state.initializing ?
                                    <i className="fas fa-sync fa-spin fa-8x"
                                       style={{margin: '40%', color: 'lightblue'}}/>
                                    :
                                    operational()
                                }
                            </div>
                        </div>
                    </div>
                </Container>
            </div>




      );
    }
}

export default DeviceView;
