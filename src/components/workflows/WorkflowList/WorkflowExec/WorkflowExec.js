import React, {Component} from 'react';
import {Col, Container, Form, Row, Table} from 'react-bootstrap'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './WorkflowExec.css'
import DetailsModal from "./DetailsModal/DetailsModal";
import WorkflowBulk from "./WorkflowBulk/WorkflowBulk";
import * as searchActions from "../../../../store/actions/searchExecs";
import {connect} from "react-redux";
import PageCount from "../../../common/PageCount";
import PageSelect from "../../../common/PageSelect";

class WorkflowExec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWfs: [],
            detailsModal: false,
            wfId: {},
            defaultPages: 20,
            pagesCount: 1,
            viewedPage: 1
        };
        this.table = React.createRef();
    }

    componentWillMount() {
        this.props.fetchNewData();
    }

    componentDidMount() {
        console.log(this.props.searchReducer.data.length);
        this.setState({
            pagesCount: this.props.searchReducer.data
                ? ~~(this.props.searchReducer.data.length / this.state.defaultPages) + 1
                : 0
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    setCountPages(defaultPages, pagesCount){
        this.setState({
            defaultPages : defaultPages,
            pagesCount: pagesCount,
            viewedPage: 1
        })
    }

    setViewPage(page){
        this.setState({
            viewedPage: page
        })
    }

    repeat() {
        let output = [];
        let dataset = [];
        let defaultPages = this.state.defaultPages;
        let viewedPage = this.state.viewedPage;
        let {data, table, query, label } = this.props.searchReducer;

        if (query === "" && label.length < 1) {
            dataset = data
        } else {
            dataset = table
        }
        for (let i = 0; i < dataset.length; i++) {
            if (i >= (viewedPage - 1) * defaultPages && i < viewedPage * defaultPages) {
                output.push(
                    <tr key={`row-${i}`} id={`row-${i}`}>
                        <td><Form.Check checked={this.state.selectedWfs.includes(dataset[i]["workflowId"])}
                                        onChange={(e) => this.selectWf(e)} style={{marginLeft: "20px"}}
                                        id={`chb-${i}`}/>
                        </td>
                        <td onClick={this.showDetailsModal.bind(this, i)} className='clickable'>
                            {dataset[i]["workflowType"]} / {dataset[i]["version"]}
                        </td>
                        <td>{dataset[i]["status"]}</td>
                        <td>{dataset[i]["startTime"]}</td>
                        <td>{dataset[i]["endTime"]}</td>
                    </tr>
                )
            }
        }
        return output
    }

    selectWf(e) {
        const {query, label, data, table} = this.props.searchReducer;
        let dataset = (query === "" && label < 1) ? data : table;
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

    selectAllWfs() {
        const {query, label, data, table} = this.props.searchReducer;
        let dataset = (query === "" && label < 1) ? data : table;
        let wfIds = [];

        if (this.state.selectedWfs.length > 0) {
            this.setState({selectedWfs: []})
        } else {
            dataset.map(entry => {
                if (!this.state.selectedWfs.includes(entry["workflowId"])) {
                    wfIds.push(entry["workflowId"])
                }
                return null;
            });
            this.setState({selectedWfs: wfIds})
        }
    }

    showDetailsModal(i) {
        const {query, label, data, table} = this.props.searchReducer;
        let dataset = (query === "" && label < 1) ? data : table;
        let wfId = i !== undefined ? dataset[i]["workflowId"] : null;

        this.setState({
            detailsModal: !this.state.detailsModal,
            wfId: wfId
        })
    }

    render(){

        let detailsModal = this.state.detailsModal ?
            <DetailsModal wfId={this.state.wfId} modalHandler={this.showDetailsModal.bind(this)}
                        refreshTable={this.props.fetchNewData} show={this.state.detailsModal}/> : null;

        return (
            <div>
                {detailsModal}
                <WorkflowBulk wfsCount={this.repeat().length} selectedWfs={this.state.selectedWfs}
                              selectAllWfs={this.selectAllWfs.bind(this)}/>

                <hr style={{marginTop: "-20px"}}/>
                <Row>
                    <Col>
                        <Typeahead
                            id="typeaheadExec"
                            selected={this.props.searchReducer.labels}
                            onChange={(e) => this.props.updateByLabel(e[0])} clearButton
                            labelKey="name" options={["RUNNING", "COMPLETED", "FAILED", "TIMED_OUT", "TERMINATED", "PAUSED"]}
                            placeholder="Search by status."/>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Control value={this.props.searchReducer.query}
                                          onChange={(e) => this.props.updateByQuery(e.target.value)}
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
                <Container style={{marginTop: "5px"}}>
                    <Row>
                        <Col sm={2}>
                            <PageCount data={this.props.searchReducer.query === "" && this.props.searchReducer.label.length < 1
                                ? this.props.searchReducer.data
                                : this.props.searchReducer.table}
                                       defaultPages={this.state.defaultPages}
                                       handler={this.setCountPages.bind(this)}/>
                        </Col>
                        <Col sm={8}/>
                        <Col sm={2}>
                            <PageSelect viewedPage={this.state.viewedPage} count={this.state.pagesCount} handler={this.setViewPage.bind(this)}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        searchReducer: state.searchReducer,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateByQuery: (query) => dispatch(searchActions.updateByQuery(query)),
        updateByLabel: (label) => dispatch(searchActions.updateByLabel(label)),
        fetchNewData: () => dispatch(searchActions.fetchNewData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowExec)
