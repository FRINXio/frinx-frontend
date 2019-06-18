import React, {Component} from 'react';
import {Accordion, Button, Card, Col, Form, Row, Spinner, Table} from 'react-bootstrap'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './WorkflowExec.css'
const http = require('../../../../server/HttpServerSide').HttpClient;

class WorkflowExec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: "",
            labels: [],
            data: [],
            table: [],
            highlight: [],
            bulkProcess: null,
            selectedWfs: [],
            processing: false,
            opSuccess: null
        };
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this);
    }

    componentWillMount() {
        this.search();
    }

    componentDidMount() {
        http.get('/api/conductor/executions/?q=&h=&freeText=&start=0').then(res => {
            this.setState({
                data: res.result ? res.result.hits : []
            })
        })
    }

    onEditSearch(event) {
        this.setState({keywords: event.target.value}, () =>{
            this.search()
        })
    }

    onLabelSearch(event) {
        this.setState({labels: event}, () =>{
            this.searchLabel(event[0])
        })
    }

    searchLabel(label) {
        let toBeRendered = [];
        const rows = this.state.keywords !== "" ? this.state.table : this.state.data;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]["status"] === label) {
                toBeRendered.push(rows[i]);
            }
        }
        this.setState({
            table: toBeRendered,
        });
        return null;
    }

    search() {
        let toBeRendered = [];
        let toBeHighlited = [];
        let query = this.state.keywords.toUpperCase();
        if (query !== "") {
            const rows = this.state.table.length > 0 ? this.state.table : this.state.data;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]["workflowType"] && rows[i]["workflowType"].toString().toUpperCase().indexOf(query) !== -1) {
                    toBeRendered.push(rows[i]);
                    toBeHighlited.push(i);
                }
            }
        } else {
            this.searchLabel(this.state.labels[0]);
            return;
        }
        this.setState({
            table: toBeRendered,
            highlight: toBeHighlited,
        })
    }

    calculateHighlight(i) {
        if (this.state.highlight[i] !== null) {
            return 'hilit'
        }
        return ''
    }

    repeat() {
        let output = [];
        let highlight;
        let dataset;
        if (this.state.keywords === "" && this.state.labels.length < 1) {
            dataset = this.state.data;
            highlight = false
        } else {
            dataset = this.state.table;
            highlight = this.state.keywords !== ""
        }
        for (let i = 0; i < dataset.length; i++) {
            output.push(
                <tr key={`row-${i}`} id={`row-${i}`} className="clickable">
                    <td><Form.Check checked={this.state.selectedWfs.includes(dataset[i]["workflowId"])}
                                    onChange={(e) => this.selectWf(e)} style={{marginLeft: "20px"}} id={`chb-${i}`}/>
                    </td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["workflowType"]} / {dataset[i]["version"]}</td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["status"]}</td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["startTime"]}</td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["endTime"]}</td>
                </tr>
            )
        }
        return output
    }

    selectWf(e) {
        let dataset = (this.state.keywords === "" && this.state.labels.length < 1) ? this.state.data : this.state.table;
        let rowNum = e.target.id.split("-")[1];
        let wfId = dataset[rowNum]["workflowId"];
        let wfIds = this.state.selectedWfs;

        if (wfIds.includes(wfId)) {
            let idx = wfIds.indexOf(wfId);
            if (idx !== -1) wfIds.splice(idx, 1);
        } else {
            wfIds.push(wfId);
        }
        this.setState({
            selectedWfs: wfIds
        });
    }

    timeoutStatus() {
        setTimeout(() => this.setState({opSuccess: null}), 1000)
    }

    terminateWfs() {
        this.setState({processing: true});
        http.delete('/api/conductor/bulk/terminate', this.state.selectedWfs).then(res => {
            this.setState({
                processing: false,
                selectedWfs: [],
                opSuccess: res.body.status === 200
            });
            this.refreshTable();
            this.timeoutStatus();
        });
    }

    pauseWfs() {
        this.setState({processing: true});
        http.put('/api/conductor/bulk/pause', this.state.selectedWfs).then(res => {
            this.setState({
                processing: false,
                selectedWfs: [],
                opSuccess: res.body.status === 200
            });
            this.refreshTable();
            this.timeoutStatus();
        })
    }

    resumeWfs() {
        this.setState({processing: true});
        http.put('/api/conductor/bulk/resume', this.state.selectedWfs).then(res => {
            this.setState({
                processing: false,
                selectedWfs: [],
                opSuccess: res.body.status === 200
            });
            this.refreshTable();
            this.timeoutStatus();
        })
    }

    retryWfs() {
        this.setState({processing: true});
        http.post('/api/conductor/bulk/retry', this.state.selectedWfs).then(res => {
            this.setState({
                processing: false,
                selectedWfs: [],
                opSuccess: res.body.status === 200
            });
            this.refreshTable();
            this.timeoutStatus();
        })
    }

    restartWfs() {
        this.setState({processing: true});
        http.post('/api/conductor/bulk/restart', this.state.selectedWfs).then(res => {
            this.setState({
                processing: false,
                selectedWfs: [],
                opSuccess: res.body.status === 200
            });
            this.refreshTable();
            this.timeoutStatus();
        })
    }

    deleteWfs() {
        let deletedWfs = [];
        this.setState({processing: true});
        this.state.selectedWfs.map(wf => {
            http.delete('/api/conductor/workflow/' + wf).then(() => {
                deletedWfs.push(wf);
                console.log(deletedWfs.length);
            });
            return null;
        });
        this.checkDeleted(deletedWfs);
    }

    checkDeleted(deletedWfs) {
        if (deletedWfs.length === this.state.selectedWfs.length) {
            this.setState({
                selectedWfs: [],
                processing: false,
                opSuccess: true
            });
            this.refreshTable();
            this.timeoutStatus();
        } else {
            setTimeout(this.checkDeleted.bind(this,deletedWfs), 200);
        }
    }

    refreshTable() {
        http.get('/api/conductor/executions/?q=&h=&freeText=&start=0').then(res => {
            this.setState({
                data: res.result ? res.result.hits : [],
                table: res.result ? res.result.hits : []
            }, () => this.search());
        });
    }

    render(){
        let wfsCount = this.repeat().length;

        return (
            <div>
                <Accordion activeKey={this.state.bulkProcess} style={{marginBottom: "20px"}}>
                    <Card>
                        <Accordion.Toggle
                            onClick={() => this.setState({bulkProcess: this.state.bulkProcess === "0" ? null : "0"})}
                            className="clickable"
                            as={Card.Header} eventKey="0">
                            Bulk Processing (click to expand)&nbsp;&nbsp;<i className="fas fa-ellipsis-h"/>&nbsp;&nbsp;
                            Displaying <b>{wfsCount}</b> workflows
                            <i style={{float: "right", marginTop: "5px"}}
                               className={this.state.bulkProcess ? "fas fa-chevron-up" : "fas fa-chevron-down"}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <h5>
                                            Workflows selected: {this.state.selectedWfs.length}
                                            <Spinner variant="primary" style={{float: "right", marginRight: "40px"}}
                                                     animation={this.state.processing ? "border" : false}/>
                                            {this.state.opSuccess ?
                                                <i style={{float: "right", marginRight: "40px", color: "green"}}
                                                   className="fas fa-check-circle fa-2x"/>
                                                : this.state.opSuccess === false ?
                                                <i style={{float: "right", marginRight: "40px", color: "#dc3545"}}
                                                   className="fas fa-times-circle fa-2x"/> : null}
                                        </h5>
                                        <p>
                                            <Button size="sm" onClick={() => {
                                                this.setState({selectedWfs: []})
                                            }} variant="outline-secondary" style={{marginRight: "10px"}}>Uncheck
                                                all</Button>
                                            Select workflows from table below
                                        </p>
                                    </Col>
                                    <Col>
                                        <Button variant="outline-primary"
                                                onClick={this.pauseWfs.bind(this)}>Pause</Button>
                                        <Button variant="outline-primary" onClick={this.resumeWfs.bind(this)}
                                                style={{marginLeft: "5px"}}>Resume</Button>
                                        <Button variant="outline-primary" onClick={this.retryWfs.bind(this)}
                                                style={{marginLeft: "5px"}}>Retry</Button>
                                        <Button variant="outline-primary" onClick={this.restartWfs.bind(this)}
                                                style={{marginLeft: "5px"}}>Restart</Button>
                                        <Button variant="outline-danger" onClick={this.terminateWfs.bind(this)}
                                                style={{marginLeft: "5px"}}>Terminate</Button>
                                        <Button variant="outline-secondary" onClick={this.deleteWfs.bind(this)}
                                                style={{marginLeft: "5px"}}>Delete</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <hr style={{marginTop: "-20px"}}/>
                <Row>
                    <Col>
                        <Typeahead
                            id="typeaheadExec"
                            selected={this.state.labels}
                            onChange={this.onLabelSearch.bind(this)} clearButton
                            labelKey="name" options={["RUNNING", "COMPLETED", "FAILED", "TIMED_OUT", "TERMINATED", "PAUSED"]}
                            placeholder="Search by status."/>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Control value={this.state.keywords} onChange={this.onEditSearch}
                                          placeholder="Search by keyword."/>
                        </Form.Group>
                    </Col>
                </Row>
                <div className="execTableWrapper">
                    <Table ref={this.table} striped hover size="sm">
                        <thead>
                        <tr>
                            <th> </th>
                            <th>Name/Version</th>
                            <th>Status</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                        </thead>
                        <tbody className="execTableRows">
                            {this.repeat()}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default WorkflowExec