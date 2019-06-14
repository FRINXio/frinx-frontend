import React, {Component} from 'react';
import {Col, Form, Row, Table} from 'react-bootstrap'
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
            highlight: []
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
                data: res.result.hits || []
            })
        })
    }

    onEditSearch(event) {
        this.setState({keywords: event.target.value}, () =>{
            this.search()
        })
    }

    onLabelSearch(event) {
        console.log(event);
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
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["workflowType"]} / {dataset[i]["version"]}</td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["status"]}</td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["startTime"]}</td>
                    <td className={highlight ? this.calculateHighlight(i) : ''}>{dataset[i]["endTime"]}</td>
                </tr>
            )
        }
        return output
    }

    render(){

        return (
            <div>
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
                <div className="scrollWrapper">
                    <Table ref={this.table} striped hover size="sm">
                        <thead>
                        <tr>
                            <th>Name/Version</th>
                            <th>Status</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                        </thead>
                        <tbody className="exectable">
                            {this.repeat()}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default WorkflowExec