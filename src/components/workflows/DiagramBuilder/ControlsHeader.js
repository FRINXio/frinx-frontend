import React, {Component} from 'react'
import {Badge, Button, Col, Container, Dropdown, Form, InputGroup, Row} from "react-bootstrap";
import * as builderActions from "../../../store/actions/builder";
import {connect} from "react-redux";
import WorkflowDefModal from "./WorkflowDefModal/WorkflowDefModal";
import GeneralInfoModal from "./GeneralInfoModal/GeneralInfoModal";
import DetailsModal from "../WorkflowList/WorkflowExec/DetailsModal/DetailsModal";
import InputModal from "../WorkflowList/WorkflowDefs/InputModal/InputModal";

const http = require('../../../server/HttpServerSide').HttpClient;

class ControlsHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defModal: false,
            generalInfoModal: true,
            inputModal: false,
            detailsModal: false,
            saveExecuteError: null,
            exampleList: ["Create P2P L2VPN in uniconfig", "Sample Batch inventory retrieval workflow", "Mount and check"]
        }
    }

    keyBindings(e) {
        // CTRL + S
        if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
            e.preventDefault();
            this.saveAndExecute()
        }
    }

    componentWillMount() {
        document.addEventListener("keydown", this.keyBindings.bind(this), false)
    }

    showDefinitionModal() {
        this.props.parseWftoJSON();
        this.setState({
            defModal: !this.state.defModal
        })
    }

    showGeneralInfoModal() {
        this.setState({
            generalInfoModal: !this.state.generalInfoModal
        })
    }

    showDetailsModal() {
        this.setState({
            detailsModal: !this.state.detailsModal
        })
    }

    showInputModal() {
        if (this.state.inputModal) {
            this.showDetailsModal()
        }
        this.setState({
            inputModal: !this.state.inputModal
        });
    }

    saveAndExecute() {
        let finalWf = this.props.parseWftoJSON();
        http.put('/api/conductor/metadata', [finalWf]).then(res => {
            this.setState({saveExecuteError: false});
            this.showInputModal();
        }).catch(err => {
            this.setState({saveExecuteError: true});
        })
    }

    render() {

        let definitionModal = this.state.defModal ?
            <WorkflowDefModal definition={this.props.finalWorkflow} modalHandler={this.showDefinitionModal.bind(this)}
                              show={this.state.defModal}/> : null;

        let executeAndSaveModal = this.state.generalInfoModal ?
            <GeneralInfoModal definition={this.props.finalWorkflow}
                              modalHandler={this.showGeneralInfoModal.bind(this)}
                              saveInputs={this.props.updateFinalWorkflow} show={this.state.generalInfoModal}
                              lockWorkflowName={this.props.lockWorkflowName} isWfNameLocked={this.props.isWfNameLocked}/> : null;

        let detailsModal = this.state.detailsModal ?
            <DetailsModal wfId={this.props.workflowId} modalHandler={this.showDetailsModal.bind(this)}
                          show={this.state.detailsModal} fromBuilder/> : null;

        let inputModal = this.state.inputModal ?
            <InputModal wf={this.props.finalWorkflow.name + " / " + this.props.finalWorkflow.version} modalHandler={this.showInputModal.bind(this)}
                        show={this.state.inputModal} fromBuilder/> : null;

        return (
            <div className="header">
                {inputModal}
                {detailsModal}
                {definitionModal}
                {executeAndSaveModal}
                <Container fluid>
                    <Row>
                        <Col md={4}>
                            <InputGroup style={{marginLeft: "-20px"}}>
                                <InputGroup.Append>
                                    <Form.Control value={this.props.query}
                                                  onChange={(e) => this.props.updateQuery(e.target.value)}
                                                  placeholder={`Search for ${this.props.category.toLowerCase()}.`} />
                                    <InputGroup.Text>
                                        <i className="fas fa-search"/>
                                    </InputGroup.Text>

                                    <Dropdown style={{marginLeft: "10px"}}>
                                        <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                            {this.props.category}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() => this.props.updateCategory(this.props.category === "Functional" ? "Workflows" : "Functional")}>
                                                {this.props.category === "Functional" ? "Workflows" : "Functional"}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup.Append>
                                <Button onClick={() => this.props.updateSidebar(!this.props.sidebarShown)} style={{marginLeft: "5%", borderRadius: "50%"}} variant="outline-light">
                                    {this.props.sidebarShown ? <i className="fas fa-chevron-left"/> : <i className="fas fa-chevron-right"/>}
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col style={{position: "absolute", marginLeft: "28%"}}>
                            <h4 style={{float: "left", lineHeight: 0, marginTop: "5px"}}><Badge variant="light">{this.props.finalWorkflow.name}</Badge></h4>
                        </Col>
                        <Col md>
                            <div className="right-controls">
                                <Button variant="outline-light" onClick={this.showDefinitionModal.bind(this)}>
                                    <i className="fas fa-file-export"/></Button>
                                <Button variant="outline-light" onClick={this.showGeneralInfoModal.bind(this)}>
                                    <i className="fas fa-edit"/>&nbsp;&nbsp;Edit general</Button>
                                <Button
                                    variant={this.state.saveExecuteError ? "danger" : "outline-light"}
                                    onClick={this.saveAndExecute.bind(this)}>
                                    <i className="fas fa-save"/>&nbsp;&nbsp;Save & Execute (CTRL + S)
                                </Button>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                        <i className="fas fa-vial"/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {this.state.exampleList.map((wf,i) => {
                                            return (
                                                <Dropdown.Item
                                                    onClick={() => this.props.createWf(i)}>
                                                    {this.state.exampleList[i]}
                                                </Dropdown.Item>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                </Container>


            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        query: state.buildReducer.query,
        category: state.buildReducer.category,
        sidebarShown: state.buildReducer.sidebarShown,
        finalWorkflow: state.buildReducer.finalWorkflow,
        isWfNameLocked: state.buildReducer.workflowNameLock,
        smartRouting: state.buildReducer.switchSmartRouting,
        workflowId: state.buildReducer.executedWfId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateQuery: (query) => dispatch(builderActions.requestUpdateByQuery(query)),
        updateCategory: (category) => dispatch(builderActions.updateCategory(category)),
        updateSidebar: (isShown) => dispatch(builderActions.updateSidebar(isShown)),
        updateFinalWorkflow: (finalWf) => dispatch(builderActions.updateFinalWorkflow(finalWf)),
        lockWorkflowName: () => dispatch(builderActions.lockWorkflowName()),
        switchSmartRouting: () => dispatch(builderActions.switchSmartRouting())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlsHeader)