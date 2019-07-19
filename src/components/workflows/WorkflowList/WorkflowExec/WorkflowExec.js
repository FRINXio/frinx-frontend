import React, {Component} from 'react';
import {Col, Form, Row, Table} from 'react-bootstrap'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './WorkflowExec.css'
import DetailsModal from "./DetailsModal/DetailsModal";
import WorkflowBulk from "./WorkflowBulk/WorkflowBulk";
import * as searchActions from "../../../../store/actions/searchExecs";
import {connect} from "react-redux";

class WorkflowExec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWfs: [],
            detailsModal: false,
            wfId: {},
            openParentWfs: [],
            closeDetails: true,
            allData: !!this.props.query
        };
        this.table = React.createRef();
    }

    componentWillMount() {
        if (this.props.query) {
            this.props.updateByQuery(this.props.query);
        }
        this.state.allData ? this.props.fetchNewData() : this.props.fetchParentWorkflows();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.query !== prevProps.query) {
            this.setState({
                allData: this.props.query,
                wfId: this.props.query,
                detailsModal: false,
                closeDetails: true
            });
            if (this.props.query) {
                this.props.updateByQuery(this.props.query);
            }
        }
        let {data, table, query, label, parents } = this.props.searchReducer;
        if (prevState.allData !== this.state.allData || this.props.query !== prevProps.query ) {
            if (this.state.allData) {
                if (data.length < 1)
                    this.props.fetchNewData()
            } else {
                if (parents.length < 1)
                    this.props.fetchParentWorkflows();
            }
        }
        let dataset = (query === "" && label < 1) ? data : table;
        if (dataset.length === 1 && query !== "" && !this.state.detailsModal && this.state.closeDetails) {
            this.showDetailsModal(0);
        }
    }

    showChildWorkflows(wfId) {
        let openParents = this.state.openParentWfs;
        openParents.filter(wfs => wfs.startTime === wfId.startTime).length
            ? openParents = openParents.filter(wfs => wfs.startTime !== wfId.startTime)
            : openParents.push(wfId);
        this.setState({
            openParentWfs: openParents
        })
    }

    output(dataset, i, parentsIdFromChild) {
        let {parents} = this.props.searchReducer;
        let parentsId = parents ? parents.map(wf => wf.workflowId) : [];
        return <tr key={`row-${i}`} id={`row-${i}`} className={parentsId.includes(dataset["workflowId"]) || this.state.allData ? null : "childWf"}>
            <td><Form.Check checked={this.state.selectedWfs.includes(dataset["workflowId"])}
                            onChange={(e) => this.selectWf(e)} style={{marginLeft: "20px"}}
                            id={`chb-${i}`}/>
            </td>
            {this.state.allData
                ? null
                : <td className='clickable' style={{textAlign: 'center'}} onClick={this.showChildWorkflows.bind(this, dataset)}>
                    {parentsIdFromChild.includes(dataset["workflowId"])
                        ? this.state.openParentWfs.filter(wf => wf["startTime"] === dataset["startTime"]).length
                            ? <i className="fas fa-minus"/> : <i className="fas fa-plus"/>
                        : null
                    }
                </td>}
            <td onClick={this.showDetailsModal.bind(this, dataset["workflowId"])} className='clickable'>
                {dataset["workflowType"]} / {dataset["version"]}
            </td>
            <td>{dataset["status"]}</td>
            <td>{dataset["startTime"]}</td>
            <td>{dataset["endTime"]}</td>
        </tr>
    }

    repeat() {
        let {data, table, query, label, parents, parentsTable, child, childTable} = this.props.searchReducer;
        let parentsId = child ? child.map(wf => wf.parentWorkflowId) : [];
        let output = [];
        let dataset = this.state.allData
            ? (query === "" && label < 1) ? data : table
            : (query === "" && label < 1) ? parents : parentsTable;
        for (let i = 0; i < dataset.length; i++) {
            if (dataset[i]["workflowType"]) {
                output.push(this.output(dataset[i], i, parentsId));
                if (this.state.openParentWfs.filter(wf => wf.startTime === dataset[i]["startTime"]).length) {
                    let childDataset = (query === "" && label < 1) ? child : childTable;
                    childDataset.forEach((wf, index) => wf.index = index);
                    let childArray = childDataset.filter(wf => wf.parentWorkflowId === dataset[i]["workflowId"]);
                    childArray.forEach((wf, index) => output.push(this.output(wf, index+"ch"+wf["index"], parentsId)));
                }
            }
        }
        return output
    }

    selectHierarchy() {
        this.setState({
            allData: !this.state.allData
        })
    }

    selectWf(e) {
        const {query, label, data, table, parents, parentsTable, child, childTable} = this.props.searchReducer;
        let dataset = this.state.allData
            ? (query === "" && label < 1) ? data : table
            : (query === "" && label < 1) ? parents : parentsTable;
        let childDataset = (query === "" && label < 1) ? child : childTable;
        let rowNum = e.target.id.split("-")[1];
        let wfId;
        let wfIds = this.state.selectedWfs;
        if (rowNum.includes('ch')) {
            rowNum = rowNum.split("ch")[1];
            wfId = childDataset[rowNum]["workflowId"]
        } else {
            wfId = dataset[rowNum]["workflowId"];
        }

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
        const {query, label, data, table, parents, parentsTable, child, childTable} = this.props.searchReducer;
        let dataset = this.state.allData
            ? (query === "" && label < 1) ? data : table
            : (query === "" && label < 1) ? parents : parentsTable;
        let childDataset = (query === "" && label < 1) ? child : childTable;
        let wfIds = [];

        if (this.state.selectedWfs.length > 0) {
            this.setState({selectedWfs: []})
        } else {
            dataset.map(entry => {
                if (!this.state.selectedWfs.includes(entry["workflowId"])) {
                    wfIds.push(entry["workflowId"])
                }
                if (this.state.openParentWfs.filter(wf => wf.startTime === entry["startTime"]).length) {
                    let childArray = childDataset.filter(wf => wf.parentWorkflowId === entry["workflowId"]);
                    childArray.map(child => {
                        if (!this.state.selectedWfs.includes(child["workflowId"])) {
                            wfIds.push(child["workflowId"])
                        }
                        return null;
                    });
                }
                return null;
            });
            this.setState({selectedWfs: wfIds})
        }
    }

    showDetailsModal(workflowId) {
        let wfId = workflowId !== undefined ? workflowId : null;

        this.setState({
            detailsModal: !this.state.detailsModal,
            wfId: wfId,
            closeDetails: !this.state.detailsModal
        })
    }

    render(){

        let detailsModal = this.state.detailsModal ?
            <DetailsModal wfId={this.state.wfId} modalHandler={this.showDetailsModal.bind(this)}
                        refreshTable={this.state.allData ? this.props.fetchNewData : this.props.fetchParentWorkflows} show={this.state.detailsModal}/> : null;

        return (
            <div>
                {detailsModal}
                <WorkflowBulk wfsCount={this.repeat().length} selectedWfs={this.state.selectedWfs}
                              selectAllWfs={this.selectAllWfs.bind(this)} showHierarchy={this.state.allData}
                              selectHierarchy={this.selectHierarchy.bind(this)}/>

                <hr style={{marginTop: "-20px"}}/>
                <Row>
                    <Col>
                        <Typeahead
                            id="typeaheadExec"
                            selected={this.props.searchReducer.labels}
                            clearButton onChange={(e) => this.state.allData
                            ? this.props.updateByLabel(e[0])
                            : this.props.updateHierarchicalByLabel(e[0])}
                            labelKey="name" options={["RUNNING", "COMPLETED", "FAILED", "TIMED_OUT", "TERMINATED", "PAUSED"]}
                            placeholder="Search by status."/>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Control value={this.props.searchReducer.query}
                                          onChange={(e) => this.state.allData
                                              ? this.props.updateByQuery(e.target.value)
                                              : this.props.updateHierarchicalByQuery(e.target.value)}
                                          placeholder="Search by keyword."/>
                        </Form.Group>
                    </Col>
                </Row>
                <div className="execTableWrapper">
                    <Table ref={this.table} striped={this.state.allData} hover size="sm">
                        <thead>
                        <tr>
                            <th> </th>
                            {this.state.allData ? null : <th>Childs</th>}
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


const mapStateToProps = state => {
    return {
        searchReducer: state.searchReducer,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateByQuery: (query) => dispatch(searchActions.updateByQuery(query)),
        updateByLabel: (label) => dispatch(searchActions.updateByLabel(label)),
        updateHierarchicalByQuery: (query) => dispatch(searchActions.updateHierarchicalDataByQuery(query)),
        updateHierarchicalByLabel: (label) => dispatch(searchActions.updateHierarchicalDataByLabel(label)),
        fetchNewData: () => dispatch(searchActions.fetchNewData()),
        fetchParentWorkflows : () => dispatch(searchActions.fetchParentWorkflows())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowExec)
