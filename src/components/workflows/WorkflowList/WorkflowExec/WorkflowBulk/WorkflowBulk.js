import React, { Component } from 'react'
import {Accordion, Button, Card, Col, ProgressBar, Row, Spinner, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import * as bulkActions from "../../../../../store/actions/bulk";
import {connect} from "react-redux";
import {isEmpty} from "codemirror/src/util/misc";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

class WorkflowBulk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBulk: null
        }
    }

    performOperation(e) {
        const {performBulkOperation, selectedWfs} = this.props;

        if (isEmpty(selectedWfs)) {
           return
        }

        let operation = e.target.value;
        performBulkOperation(operation, selectedWfs);
        this.props.selectAllWfs();
    }

    render() {

        let {selectedWfs, bulkReducer, wfsCount, wfView} = this.props;

        const progressInstance = <ProgressBar max={100} now={bulkReducer.loading} label={`${bulkReducer.loading}%`} />;

        return (

            <Accordion activeKey={this.state.showBulk} style={{marginBottom: "20px"}}>
                <Card>
                    <Accordion.Toggle
                        onClick={() => this.setState({showBulk: this.state.showBulk === "0" ? null : "0"})}
                        className="clickable"
                        as={Card.Header} eventKey="0">
                        Bulk Processing (click to expand)&nbsp;&nbsp;<i className="fas fa-ellipsis-h"/>&nbsp;&nbsp;
                        Displaying <b>{wfsCount}</b> workflows
                        <i style={{float: "right", marginTop: "5px"}}
                           className={this.state.showBulk ? "fas fa-chevron-up" : "fas fa-chevron-down"}/>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <h5>
                                        Workflows selected: {selectedWfs.length}
                                        <Spinner variant="primary" style={{float: "right", marginRight: "40px"}}
                                                 animation={bulkReducer.isFetching ? "border" : false}/>
                                        {!bulkReducer.isFetching ?
                                            (bulkReducer.successfulResults.length > 0 && Object.entries(bulkReducer.errorResults).length === 0 ?
                                                <i style={{float: "right", marginRight: "40px", color: "green"}}
                                                   className="fas fa-check-circle fa-2x"/>
                                                : Object.entries(bulkReducer.errorResults).length > 0 ?
                                                    <i style={{float: "right", marginRight: "40px", color: "#dc3545"}}
                                                       className="fas fa-times-circle fa-2x"/> : null) : null}
                                    </h5>
                                    <p>
                                        <Button size="sm" onClick={this.props.selectAllWfs}
                                                variant="outline-secondary" style={{marginRight: "10px"}}>
                                            {selectedWfs.length > 0 ? "Uncheck all" : "Check all"}
                                        </Button>
                                        Select workflows from table below
                                    </p>
                                    <p>
                                        <ButtonToolbar>
                                            <ToggleButtonGroup type="radio" value={wfView ? 1 : 2} name="Workflow view" onChange={this.props.selectWfView}>
                                                <ToggleButton size="sm" variant="outline-secondary" value={1}>Flat</ToggleButton>
                                                <ToggleButton size="sm" variant="outline-secondary" value={2}>Hierarchy</ToggleButton>
                                            </ToggleButtonGroup>&nbsp;&nbsp;workflow view
                                        </ButtonToolbar>

                                    </p>
                                </Col>
                                <Col>
                                    <Button variant="outline-primary" value="pause"
                                            onClick={(e) => this.performOperation(e)}>Pause</Button>
                                    <Button variant="outline-primary" value="resume"
                                            onClick={(e) => this.performOperation(e)}
                                            style={{marginLeft: "5px"}}>Resume</Button>
                                    <Button variant="outline-primary" value="retry"
                                            onClick={(e) => this.performOperation(e)}
                                            style={{marginLeft: "5px"}}>Retry</Button>
                                    <Button variant="outline-primary" value="restart"
                                            onClick={(e) => this.performOperation(e)}
                                            style={{marginLeft: "5px"}}>Restart</Button>
                                    <Button variant="outline-danger" value="terminate"
                                            onClick={(e) => this.performOperation(e)}
                                            style={{marginLeft: "5px"}}>Terminate</Button>
                                    <Button variant="outline-secondary" value="delete"
                                            onClick={(e) => this.performOperation(e)}
                                            style={{marginLeft: "5px"}}>Delete</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {bulkReducer.loading === 0 ? null : progressInstance}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

const mapStateToProps = state => {
    return {
        bulkReducer: state.bulkReducer,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        performBulkOperation: (operation, wfs) => dispatch(bulkActions.performBulkOperation(operation, wfs)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowBulk)
