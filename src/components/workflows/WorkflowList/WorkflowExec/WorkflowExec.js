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
            allData: true,
            showChildren: []
        };
        this.table = React.createRef();
    }

    componentWillMount() {
        if (this.props.query) {
            this.state.allData
                ? this.props.updateByQuery(this.props.query)
                : this.props.updateHierarchicalByQuery(this.props.query);
        }
        this.props.fetchNewData();
        this.props.fetchParentWorkflows();
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
        let dataset = (query === "" && label < 1) ? data : table;
        if (dataset.length === 1 && query !== "" && !this.state.detailsModal && this.state.closeDetails) {
            this.showDetailsModal(dataset[0].workflowId);
        }
        if (prevState.allData !== this.state.allData || this.props.query !== prevProps.query ) {
            if (this.state.allData) {
                if (data.length < 1)
                    this.props.fetchNewData()
            } else {
                if (parents.length < 1) {
                    this.props.fetchParentWorkflows();
                    this.setState({
                        openParentWfs: [],
                        showChildren: []
                    })
                }
            }
        }
    }
    update(openParents, showChildren) {
        this.setState({
            openParentWfs: openParents,
            showChildren: showChildren
        })
    }

    showChildrenWorkflows(workflow, closeParentWfs, closeChildWfs) {
        let {query, label, child, childTable} = this.props.searchReducer;
        let childrenDataset = (query === "" && label < 1) ? child : childTable;
        childrenDataset.forEach((wf, index) => wf.index = index);
        let showChildren = closeChildWfs ? closeChildWfs : this.state.showChildren;
        let openParents = closeParentWfs ? closeParentWfs : this.state.openParentWfs;
        if (openParents.filter(wfs => wfs.startTime === workflow.startTime).length) {
            let closeParents = openParents.filter(wf => wf.parentWorkflowId === workflow.workflowId);
            this.props.deleteParents(showChildren.filter(wf => wf.parentWorkflowId === workflow.workflowId));
            openParents = openParents.filter(wfs => wfs.startTime !== workflow.startTime);
            showChildren = showChildren.filter(wf => wf.parentWorkflowId !== workflow.workflowId);
            closeParents.length
                ? closeParents.forEach(open => this.showChildrenWorkflows(open, openParents, showChildren))
                : this.update(openParents, showChildren)
        } else {
            openParents.push(workflow);
            showChildren = showChildren.concat(childrenDataset.filter(wf => wf.parentWorkflowId === workflow.workflowId));
            this.props.updateParents(showChildren.filter(wf => wf.parentWorkflowId === workflow.workflowId));
            this.update(openParents, showChildren);
        }
    }

    indent(wf, i) {
        if (wf[i].parentWorkflowId) {
            let layers = 0;
            if (this.state.showChildren.some(child => child.workflowId === wf[i].parentWorkflowId)) {
                let parent = wf[i];
                while (parent.parentWorkflowId) {
                    layers++;
                    parent = wf[wf.findIndex(id => id.workflowId === parent.parentWorkflowId)];
                    if (layers > 10)
                        break;
                }
                return layers*6+'px';
            }
            return '6px';
        }
        return '0px';
    }

    repeat() {
        let {data, table, query, label, parents, parentsTable, child} = this.props.searchReducer;
        let parentsId = child ? child.map(wf => wf.parentWorkflowId) : [];
        let output = [];
        let dataset = this.state.allData
            ? (query === "" && label < 1) ? data : table
            : (query === "" && label < 1) ? parents : parentsTable;
        for (let i = 0; i < dataset.length; i++) {
            output.push(
                <tr key={`row-${i}`} id={`row-${i}`}
                    className={this.state.showChildren.some(wf => wf.workflowId === dataset[i]["workflowId"]) && !this.state.allData ? "childWf" : null }>
                    <td><Form.Check checked={this.state.selectedWfs.includes(dataset[i]["workflowId"])}
                                    onChange={(e) => this.selectWf(e)} style={{marginLeft: "20px"}}
                                    id={`chb-${i}`}/>
                    </td>
                    {this.state.allData
                        ? null
                        : <td className='clickable' onClick={this.showChildrenWorkflows.bind(this, dataset[i], null, null)} style={{textIndent: this.indent(dataset,i)}}>
                            {parentsId.includes(dataset[i]["workflowId"])
                                ? this.state.openParentWfs.filter(wf => wf["startTime"] === dataset[i]["startTime"]).length
                                    ? <i className="fas fa-minus"/> : <i className="fas fa-plus"/>
                                : null
                            }
                        </td>
                    }
                    <td onClick={this.showDetailsModal.bind(this, dataset[i]["workflowId"])} className='clickable'
                        style={{textIndent: this.indent(dataset,i), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                        title={dataset[i]["workflowType"]+ " / " + dataset[i]["version"]}>
                        {dataset[i]["workflowType"]} / {dataset[i]["version"]}
                    </td>
                    <td>{dataset[i]["status"]}</td>
                    <td>{dataset[i]["startTime"]}</td>
                    <td>{dataset[i]["endTime"]}</td>
                </tr>
            );
        }
        return output;
    }

    selectHierarchy() {
        this.setState({
            allData: !this.state.allData
        })
    }

    selectWf(e) {
        const {query, label, data, table, parents, parentsTable} = this.props.searchReducer;
        let dataset = this.state.allData
            ? (query === "" && label < 1) ? data : table
            : (query === "" && label < 1) ? parents : parentsTable;
        let rowNum = e.target.id.split("-")[1];

        let wfIds = this.state.selectedWfs;
        let wfId = dataset[rowNum]["workflowId"];

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
        const {query, label, data, table, parents, parentsTable} = this.props.searchReducer;
        let dataset = this.state.allData
            ? (query === "" && label < 1) ? data : table
            : (query === "" && label < 1) ? parents : parentsTable;
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
                            {this.state.allData ? null : <th>Children</th>}
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
        fetchParentWorkflows : () => dispatch(searchActions.fetchParentWorkflows()),
        updateParents: (children) => dispatch(searchActions.updateParents(children)),
        deleteParents: (children) => dispatch(searchActions.deleteParents(children))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowExec)
