import React, {Component} from 'react'
import {Button, Col, Container, Dropdown, Form, InputGroup, Row} from "react-bootstrap";
import * as builderActions from "../../../store/actions/builder";
import {connect} from "react-redux";
import WorkflowDefModal from "./WorkflowDefModal/WorkflowDefModal";
import GeneralInfoModal from "./GeneralInfoModal/GeneralInfoModal";

const http = require('../../../server/HttpServerSide').HttpClient;

class ControlsHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defModal: false,
            generalInfoModal: true,
            saveExecuteError: null
        }
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

    saveAndExecute() {
        //this.props.updateFinalWorkflow();
        let workflowDef = [this.props.finalWorkflow];
        http.put('/api/conductor/metadata', workflowDef).then(res => {
            this.setState({saveExecuteError: false});
            console.log(res);
        }).catch(err => {
            this.setState({saveExecuteError: true});
            console.log(err);
        })
    }

    render() {

        let definitionModal = this.state.defModal ?
            <WorkflowDefModal definition={this.props.finalWorkflow} modalHandler={this.showDefinitionModal.bind(this)}
                              show={this.state.defModal}/> : null;

        let executeAndSaveModal = this.state.generalInfoModal ?
            <GeneralInfoModal definition={this.props.parseWftoJSON}
                              modalHandler={this.showGeneralInfoModal.bind(this)}
                              saveInputs={this.props.updateFinalWorkflow} show={this.state.generalInfoModal}
                              lockWorkflowName={this.props.lockWorkflowName} isWfNameLocked={this.props.isWfNameLocked}/> : null;

        return (
            <div className="header">
                {definitionModal}
                {executeAndSaveModal}
                <Container fluid>
                    <Row>
                        <Col sm={6}>
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
                                <Button onClick={() => this.props.updateSidebar()} style={{marginLeft: "5%", borderRadius: "50%"}} variant="outline-light">
                                    {this.props.sidebarShown ? <i className="fas fa-chevron-left"/> : <i className="fas fa-chevron-right"/>}
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col>
                            <div className="right-controls">
                                <Button variant="outline-light" onClick={this.props.createWf}>
                                    <i className="fas fa-vial"/>&nbsp;&nbsp;Create sample workflow</Button>
                                <Button variant="outline-light" onClick={this.showDefinitionModal.bind(this)}>
                                    <i className="fas fa-file-export"/>&nbsp;&nbsp;Export to JSON</Button>
                                <Button variant="outline-light" onClick={this.showGeneralInfoModal.bind(this)}>
                                    <i className="fas fa-edit"/>&nbsp;&nbsp;Edit general</Button>
                                <Button
                                    variant={this.state.saveExecuteError ? "danger" : "outline-light"}
                                    onClick={this.saveAndExecute.bind(this)}>
                                    <i className="fas fa-save"/>&nbsp;&nbsp;Save & Execute
                                </Button>
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
        isWfNameLocked: state.buildReducer.workflowNameLock
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateQuery: (query) => dispatch(builderActions.requestUpdateByQuery(query)),
        updateCategory: (category) => dispatch(builderActions.updateCategory(category)),
        updateSidebar: () => dispatch(builderActions.updateSidebar()),
        updateFinalWorkflow: (finalWf) => dispatch(builderActions.updateFinalWorkflow(finalWf)),
        lockWorkflowName: () => dispatch(builderActions.lockWorkflowName())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlsHeader)