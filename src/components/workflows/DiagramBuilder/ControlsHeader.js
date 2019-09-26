import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import * as builderActions from "../../../store/actions/builder";
import {connect} from "react-redux";
import WorkflowDefModal from "./WorkflowDefModal/WorkflowDefModal";
import GeneralInfoModal from "./GeneralInfoModal/GeneralInfoModal";
import DetailsModal from "../WorkflowList/WorkflowExec/DetailsModal/DetailsModal";
import InputModal from "../WorkflowList/WorkflowDefs/InputModal/InputModal";
import {withRouter} from "react-router-dom";
import {getLinksArray, linkNodes, transform_workflow_to_diagram} from "./builder-utils";

const http = require('../../../server/HttpServerSide').HttpClient;

class ControlsHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defModal: false,
            generalInfoModal: true,
            inputModal: false,
            detailsModal: false,
            exitModal: false,
            saveExecuteError: null
        }
    }

    keyBindings(e) {
        // CTRL + S
        if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
            e.preventDefault();
            this.saveAndExecute()
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickInside.bind(this), true);
        document.addEventListener("keydown", this.keyBindings.bind(this), false)
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickInside.bind(this), true);
        this.props.updateQuery("")
    };

    handleClickInside(event) {
        //const domNode = ReactDOM.findDOMNode(this);
        const headerEl = document.getElementById("controls-header");
        const expandBtn = document.getElementById("expand");

        // workaround to prevent deleting nodes while typing
        if (headerEl && headerEl.contains(event.target) && !expandBtn.contains(event.target)) {
            this.props.app.getDiagramEngine().getDiagramModel()
                .clearSelection();
            setTimeout(() =>  this.props.app.getDiagramEngine().repaintCanvas(), 10);
        }
    }

    showDefinitionModal() {
        this.props.parseWftoJSON();
        this.setState({
            defModal: !this.state.defModal
        })
    }

    showGeneralInfoModal() {
        if (this.props.isWfNameLocked && this.state.generalInfoModal === false) {
            this.props.parseWftoJSON()
        }
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

    redirectOnExit() {
        this.props.history.push('/workflows/defs');
    }

    expandNodeToWorkflow() {
        const diagramModel = this.props.app.getDiagramEngine().getDiagramModel();
        let selectedNodes = diagramModel.getSelectedItems();

        selectedNodes = selectedNodes.filter(item => {
            return item.getType() === "default"
        });

        selectedNodes.forEach(selectedNode => {

            if (!selectedNode.extras.inputs.subWorkflowParam) {
                return console.log("Simple task can't be expanded.")
            }

            const {name, version} = selectedNode.extras.inputs.subWorkflowParam;
            const {x, y} = selectedNode;

            const inputLink = getLinksArray("in", selectedNode)[0];
            const outputLink = getLinksArray("out", selectedNode)[0];

            if (!inputLink || !outputLink) {
                return console.log("Node is not connected.")
            }

            const inputLinkParent = inputLink.sourcePort.getNode();
            const outputLinkParent = outputLink.targetPort.getNode();

            transform_workflow_to_diagram(name, version, {x, y}, this.props).then(expandedNodes => {
                selectedNode.remove();
                diagramModel.removeNode(selectedNode);
                diagramModel.removeLink(inputLink);
                diagramModel.removeLink(outputLink);

                let firstNode = expandedNodes[0];
                let lastNode = expandedNodes[expandedNodes.length - 1];

                diagramModel.addAll(linkNodes(inputLinkParent,firstNode), linkNodes(lastNode, outputLinkParent));
                this.props.app.getDiagramEngine().setDiagramModel(diagramModel);
                setTimeout(() => this.props.app.getDiagramEngine().repaintCanvas(), 10);
                this.forceUpdate()
            }).catch(e => {
                console.log(e)
            })

        });
    }

    render() {

        let definitionModal = this.state.defModal ?
            <WorkflowDefModal definition={this.props.finalWorkflow} modalHandler={this.showDefinitionModal.bind(this)}
                              show={this.state.defModal}/> : null;

        let generalInfoModal = this.state.generalInfoModal ?
            <GeneralInfoModal definition={this.props.finalWorkflow}
                              workflows={this.props.workflows}
                              modalHandler={this.showGeneralInfoModal.bind(this)}
                              saveInputs={this.props.updateFinalWorkflow} show={this.state.generalInfoModal}
                              lockWorkflowName={this.props.lockWorkflowName}
                              isWfNameLocked={this.props.isWfNameLocked}
                              redirectOnExit={this.redirectOnExit.bind(this)}/> : null;

        let detailsModal = this.state.detailsModal ?
            <DetailsModal wfId={this.props.workflowId} modalHandler={this.showDetailsModal.bind(this)}
                          show={this.state.detailsModal} fromBuilder/> : null;

        let inputModal = this.state.inputModal ?
            <InputModal wf={this.props.finalWorkflow.name + " / " + this.props.finalWorkflow.version}
                        modalHandler={this.showInputModal.bind(this)}
                        show={this.state.inputModal} fromBuilder/> : null;

        let exitModal = this.state.exitModal ?
            <Modal show={this.state.exitModal}>
                <Modal.Header>
                    <Modal.Title>Do you want to exit builder?</Modal.Title>
                </Modal.Header>
                <Modal.Body>All changes will be lost.</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => this.setState({exitModal: false})}>Cancel</Button>
                    <Button variant="danger" onClick={this.redirectOnExit.bind(this)}>Exit</Button>
                </Modal.Footer>
            </Modal> : null;

        return (
            <div id="controls-header" className="header">
                {inputModal}
                {detailsModal}
                {definitionModal}
                {generalInfoModal}
                {exitModal}
                <Container fluid>
                    <Row>
                        <InputGroup style={{width: "490px", marginLeft: "-5px"}}>
                            <InputGroup.Prepend>
                                <InputGroup.Text className="clickable"
                                                 onClick={() => this.props.updateSidebar(!this.props.sidebarShown)}>
                                    {this.props.sidebarShown ? <i className="fas fa-chevron-left"/> :
                                        <i className="fas fa-chevron-right"/>}
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control value={this.props.query}
                                          onChange={(e) => this.props.updateQuery(e.target.value)}
                                          placeholder={`Search for ${this.props.category.toLowerCase()}.`}/>
                            <InputGroup.Append>
                                <InputGroup.Text>
                                    <i className="fas fa-search"/>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i className="fas fa-chevron-down clickable"
                                       onClick={() => this.props.updateCategory(this.props.category === "Functional" ? "Workflows" : "Functional")}/>
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                        <Col md>
                            <div className="right-controls">
                                <Button variant="outline-light" onClick={() => this.setState({exitModal: true})}>
                                    Exit</Button>
                                <Button variant="outline-light" onClick={this.showDefinitionModal.bind(this)}>
                                    <i className="fas fa-file-export"/></Button>
                                <Button variant="outline-light" onClick={this.showGeneralInfoModal.bind(this)}>
                                    <i className="fas fa-edit"/>&nbsp;&nbsp;Edit general</Button>
                                <Button
                                    variant={this.state.saveExecuteError ? "danger" : "outline-light"}
                                    onClick={this.saveAndExecute.bind(this)}>
                                    <i className="fas fa-save"/>&nbsp;&nbsp;Save & Execute</Button>
                                <Button id="expand" variant="outline-light" onClick={this.expandNodeToWorkflow.bind(this)}>
                                    <i className="fas fa-expand"/>&nbsp;&nbsp;Expand</Button>
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
        workflowId: state.buildReducer.executedWfId,
        workflows: state.buildReducer.workflows,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ControlsHeader))
