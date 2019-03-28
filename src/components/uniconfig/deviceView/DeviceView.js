import React, {Component} from 'react';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import { CONFIG, OPER } from '../../constants';
import Editor from "./editor/Editor";
import './DeviceView.css'
import {Badge, Button, Col, Container, Dropdown, Form, Row} from "react-bootstrap";
import DropdownMenu from "./dropdownMenu/DropdownMenu";
import SnapshotModal from "./snapshotModal/SnapshotModal";

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
            snapshots: ["snapshot1","snapshot2"],
            showDiff: false,
            creatingSnap: false,
            syncing: false,
            initializing: true
        }
    }

    redirect(where) {
        window.location.href = where;
    }

    componentDidMount() {
        setTimeout( this.fetchData.bind(this), 500);
    }

    fetchData(){
        //pass device name cmp will mount
        fetch(CONFIG)
            .then(response => response.text())
            .then(config => this.setState({config}));

        fetch(OPER)
            .then(response => response.text())
            .then(operational => this.setState({operational}));
        this.setState({initializing: false})
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
        this.setState({
            operational: this.state.config,
        });
    }

    syncFromNetwork(){
        this.setState({syncing: true});
        fetch(OPER)
            .then(response => response.text())
            .then(operational => this.setState({operational}))
            .then(() => {
                this.setState({syncing: false});
            })
    }

    refreshConfig(){
        fetch(CONFIG)
            .then(response => response.text())
            .then(config => this.setState({config}));
    }

    loadSnapshot(snapshot){
        if(snapshot.length < 1){
            this.refreshConfig();
        } else {
            this.setState({
                config: JSON.stringify(snapshot, null, 2),
            });
        }

        //if snapshot == null load config from device
    }

    createSnapshot(){
        this.setState({
            creatingSnap: !this.state.creatingSnap,
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
                    <Editor title="" editable={false} updateDiff={this.getEditedConfig.bind(this)}
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
                            <Col className="child">
                                    <Dropdown className="leftAligned" >
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            <i className="fas fa-file-download"/>&nbsp;&nbsp;Load Snapshot
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu as={DropdownMenu}>
                                            {this.state.snapshots.map(function (item, i) {
                                                return <Dropdown.Item key={i}>{item}</Dropdown.Item>
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                <Button className="leftAligned" variant="outline-light"
                                        onClick={this.createSnapshot.bind(this)}>
                                    <i className="fas fa-folder-plus"/>&nbsp;&nbsp;Create snapshot</Button>
                            </Col>
                            <Col md={2} className="child">
                                <h2><Badge variant="primary"> IOS-XR</Badge></h2>
                            </Col>
                            <Col className="child">
                                <Form.Group className="rightAligned">
                                    <Button variant={this.state.showDiff ? "light" : "outline-light"}
                                            onClick={this.showDiff.bind(this)}>
                                        <i className="fas fa-exchange-alt"/>&nbsp;&nbsp;{this.state.showDiff ? 'Hide Diff' : 'Show Diff'}
                                    </Button>
                                    <Button variant="outline-light">
                                        <i className="fas fa-play"/>&nbsp;&nbsp;Dry run</Button>
                                    <Button variant="outline-light" onClick={this.commitToNetwork.bind(this)}>
                                        <i className="fas fa-network-wired"/>&nbsp;&nbsp;Commit to network</Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </header>

                {this.state.creatingSnap ? <SnapshotModal/> : null }

                <Container fluid className="container-props">
                    <div className="editor">
                        <div className="uniconfig">
                            <div className="config">
                                {this.state.initializing ?
                                    <i className="fas fa-sync fa-spin fa-8x"
                                       style={{margin: '40%', color: 'lightblue'}}/>
                                    :
                                    <Editor title="Configurational" editable={true}
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
