import React from 'react';
import {Row, Form, Col, Table} from 'react-bootstrap'
import moment from "moment";
import {connect} from "react-redux";
import './PollData.css'
const http = require('../../../../server/HttpServerSide').HttpClient;

class PollData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queueData: [],
            sorted : false,
            search : ''
        };
        this.table = React.createRef();
    }

    componentWillMount() {
        http.get('/api/conductor/queue/data')
            .then(data =>
                this.setState({
                    queueData: data.polldata,
                })
            );
    }

    componentWillReceiveProps({ queueData }) {
        this.setState({ queueData });
    }

    sortAscBy = function (key) {
        return function (x,y) {
            return ((x[key] === y[key]) ? 0 : ((x[key] > y[key]) ? 1 : -1));
        };
    };

    sortDescBy = function (key) {
        return function (x,y) {
            return ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1));
        };
    };

    sortArray(key) {
        let sortedArray = this.state.queueData;

        if(this.state.sorted){
            sortedArray.sort(this.sortDescBy(key));
            this.setState({sorted : false});
        }
        if(!this.state.sorted) {
            sortedArray.sort(this.sortAscBy(key));
            this.setState({sorted : true});
        }

        this.setState({queueData : sortedArray });
    }

    repeat() {
        let output = [];
        let dataset = [];
        let currentArray = [];

        if(this.state.search !== "") {
            currentArray = this.state.queueData;
            dataset = currentArray.filter(item => {
                return item["queueName"].toString().toLowerCase().includes(this.state.search.toString().toLowerCase()) ||
                    item["workerId"].toString().toLowerCase().includes(this.state.search.toString().toLowerCase());
            });
        } else {
            dataset = this.state.queueData;
        }
        for(let i = 0; i < dataset.length; i++) {
            output.push(
                     <tr key={`row-${i}`} id={`row-${i}`}>
                        <td>{dataset[i]["queueName"]}</td>
                        <td>{dataset[i]["qsize"]}</td>
                         <td>{moment(dataset[i]["lastPollTime"]).fromNow()}</td>
                        <td>{dataset[i]["workerId"]}</td>
                    </tr>
            );
        }
        return output;
    }

    render() {
        let output = this.repeat();
        output = output.length === 0 ? <tr><td/><td colSpan="2">Please wait for data</td><td/></tr> : output;

        return (
            <div>
            <Row>
                <Col><h4>Queues</h4></Col>
                <Col>
                    <Form.Group className="searchGroup">
                        <Form.Control value = {this.state.search}
                                      onChange={(e) => {this.setState({search: e.target.value})}}
                                      placeholder="Search"/>
                    </Form.Group>
                </Col>
            </Row>
            <div className="ui-content">
                <Table ref={this.table}  striped hover size="sm">
                    <thead>
                    <tr>
                        <th onClick={ () => this.sortArray('queueName')}>Name (Domain)</th>
                        <th onClick={ () => this.sortArray('qsize')}>Size</th>
                        <th onClick={ () => this.sortArray('lastPollTime')}>Last Poll Time</th>
                        <th onClick={ () => this.sortArray('workerId')}>Last Polled By</th>
                    </tr>
                    </thead>
                        <tbody className="polltable">
                            {output}
                        </tbody>
                </Table>
            </div>
            </div>
        );
    }
}

export default connect()(PollData);