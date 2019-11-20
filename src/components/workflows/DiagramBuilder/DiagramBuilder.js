import React, { Component } from "react";
import { connect } from "react-redux";
import { Toolkit } from "storm-react-diagrams";
import { Button, Modal } from "react-bootstrap";
import { DiagramWidget } from "storm-react-diagrams";
import { Application } from "./Application";
import { WorkflowDiagram } from "./WorkflowDiagram";
import CustomAlert from "./CustomAlert";
import WorkflowDefModal from "./WorkflowDefModal/WorkflowDefModal";
import GeneralInfoModal from "./GeneralInfoModal/GeneralInfoModal";
import ControlsHeader from "./ControlsHeader/ControlsHeader";
import SideMenu from "./Sidemenu/SideMenu";
import DetailsModal from "../WorkflowList/WorkflowExec/DetailsModal/DetailsModal";
import InputModal from "../WorkflowList/WorkflowDefs/InputModal/InputModal";
import SubwfModal from "./SubwfModal/SubwfModal";
import { encode } from "./builder-utils";
import * as builderActions from "../../../store/actions/builder";
import * as _ from "lodash";
import "./DiagramBuilder.css";

const http = require("../../../server/HttpServerSide").HttpClient;

class DiagramBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNodeModal: false,
      showDefinitionModal: false,
      showGeneralInfoModal: false,
      showInputModal: false,
      showDetailsModal: false,
      showExitModal: false,
      modalInputs: null,
      workflowDiagram: new WorkflowDiagram(
        new Application(),
        this.props.finalWorkflow,
        { x: 900, y: 300 }
      )
    };

    this.onNodeDrop = this.onNodeDrop.bind(this);
    this.importFile = this.importFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
    this.saveWorkflow = this.saveWorkflow.bind(this);
    this.showExitModal = this.showExitModal.bind(this);
    this.showNodeModal = this.showNodeModal.bind(this);
    this.showInputModal = this.showInputModal.bind(this);
    this.saveAndExecute = this.saveAndExecute.bind(this);
    this.redirectOnExit = this.redirectOnExit.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);
    this.showDetailsModal = this.showDetailsModal.bind(this);
    this.parseDiagramToJSON = this.parseDiagramToJSON.bind(this);
    this.showDefinitionModal = this.showDefinitionModal.bind(this);
    this.expandNodeToWorkflow = this.expandNodeToWorkflow.bind(this);
    this.showGeneralInfoModal = this.showGeneralInfoModal.bind(this);
    this.saveNodeInputsHandler = this.saveNodeInputsHandler.bind(this);
    this.createDiagramByDefinition = this.createDiagramByDefinition.bind(this);
  }

  componentDidMount() {
    document.addEventListener("dblclick", this.doubleClickListener.bind(this));
    setTimeout(
      () => (document.getElementsByClassName("tray")[0].style.width = "370px"),
      500
    );

    http.get("/api/conductor/metadata/workflow").then(res => {
      this.props.storeWorkflows(res.result || []);
    });

    if (!_.isEmpty(this.props.match.params)) {
      this.createExistingWorkflow();
    } else {
      this.createNewWorkflow();
    }
  }

  componentWillUnmount() {
    this.props.resetToDefaultWorkflow();
  }

  createNewWorkflow() {
    this.setState({ showGeneralInfoModal: true });
    this.state.workflowDiagram.placeDefaultNodes();
    this.props.showCustomAlert(
      true,
      "primary",
      "Start to drag & drop tasks from left menu on canvas."
    );
  }

  createExistingWorkflow() {
    const { name, version } = this.props.match.params;
    http
      .get("/api/conductor/metadata/workflow/" + name + "/" + version)
      .then(res => {
        this.createDiagramByDefinition(res.result);
      })
      .catch(() => {
        return this.props.showCustomAlert(
          true,
          "danger",
          `Cannot find selected sub-workflow: ${name}.`
        );
      });
  }

  createDiagramByDefinition(definition) {
    this.props.updateFinalWorkflow(definition);
    this.props.showCustomAlert(
      true,
      "info",
      `Editing workflow ${definition.name} / ${definition.version}.`
    );
    this.props.lockWorkflowName();

    this.state.workflowDiagram
      .setDefinition(definition)
      .createDiagram()
      .withStartEnd()
      .renderDiagram();
  }

  onNodeDrop(e) {
    this.props.showCustomAlert(false);
    this.state.workflowDiagram.dropNewNode(e);
  }

  doubleClickListener(event) {
    let diagramModel = this.state.workflowDiagram.getDiagramModel();
    let element = Toolkit.closest(event.target, ".node[data-nodeid]");
    let node = null;

    if (element) {
      node = diagramModel.getNode(element.getAttribute("data-nodeid"));
      if (node && node.type !== "start" && node.type !== "end") {
        node.setSelected(false);
        this.setState({
          showNodeModal: true,
          modalInputs: { inputs: node.extras.inputs, id: node.id }
        });
      }
    }
  }

  parseDiagramToJSON() {
    try {
      this.props.showCustomAlert(false);
      const finalWf = this.state.workflowDiagram.parseDiagramToJSON(
        this.props.finalWorkflow
      );
      this.props.updateFinalWorkflow(finalWf);
      return finalWf;
    } catch (e) {
      this.props.showCustomAlert(true, "danger", e.message);
    }
  }

  expandNodeToWorkflow() {
    try {
      this.props.showCustomAlert(false);
      this.state.workflowDiagram.expandSelectedNodes();
    } catch (e) {
      this.props.showCustomAlert(true, "danger", e.message);
    }
  }

  saveWorkflow() {
    this.state.workflowDiagram
      .saveWorkflow(this.props.finalWorkflow)
      .then(res => {
        this.props.showCustomAlert(
          true,
          "info",
          `Workflow ${res.name} saved successfully.`
        );
      })
      .catch(e => {
        this.props.showCustomAlert(
          true,
          "danger",
          e.path + ":\xa0\xa0\xa0" + e.message
        );
      });
  }

  saveAndExecute() {
    this.state.workflowDiagram
      .saveWorkflow(this.props.finalWorkflow)
      .then(() => {
        this.showInputModal();
      })
      .catch(e => {
        this.props.showCustomAlert(
          true,
          "danger",
          e.path + ":\xa0\xa0\xa0" + e.message
        );
      });
  }

  /*** MODAL HANDLERS ***/

  // NODE MODAL
  showNodeModal() {
    this.setState({
      showNodeModal: !this.state.showNodeModal
    });
  }

  // DEFINITION MODAL
  showDefinitionModal() {
    this.parseDiagramToJSON();
    this.setState({
      showDefinitionModal: !this.state.showDefinitionModal
    });
  }

  // GENERAL INFO MODAL
  showGeneralInfoModal() {
    this.parseDiagramToJSON();
    this.setState({
      showGeneralInfoModal: !this.state.showGeneralInfoModal
    });
  }

  // WORKFLOW EXECUTION INPUT MODAL
  showInputModal() {
    this.setState({
      showInputModal: true
    });
  }

  closeInputModal() {
    this.setState({
      showInputModal: false
    });
    this.showDetailsModal();
  }

  // WORKFLOW EXECUTION DETAILS MODAL
  showDetailsModal() {
    this.setState({
      showDetailsModal: !this.state.showDetailsModal
    });
  }

  // EXIT MODAL
  showExitModal() {
    this.setState({
      showExitModal: !this.state.showExitModal
    });
  }
  /*************** ***************/

  saveNodeInputsHandler(savedInputs, id) {
    let nodes = this.state.workflowDiagram.getNodes();

    nodes.forEach(node => {
      if (node.id === id) {
        node.extras.inputs = savedInputs;
      }
    });
  }

  importFile() {
    const fileToLoad = document.getElementById("upload-file").files[0];
    const fileReader = new FileReader();

    fileReader.onload = (() => {
      return function(e) {
        try {
          let jsonObj = JSON.parse(e.target.result);
          this.createDiagramByDefinition(jsonObj);
        } catch (err) {
          alert("Error when trying to parse json." + err);
        }
      };
    })(fileToLoad).bind(this);
    fileReader.readAsText(fileToLoad);
  }

  exportFile() {
    const definition = this.parseDiagramToJSON();

    if (!definition) {
      return null;
    }

    const data = encode(JSON.stringify(definition, null, 2));
    const blob = new Blob([data], {
      type: "application/octet-stream"
    });

    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", this.props.finalWorkflow.name + ".json");

    let event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window);
    link.dispatchEvent(event);
  }

  redirectOnExit() {
    this.props.history.push("/workflows/defs");
  }

  render() {
    let inputsModal = this.state.showInputModal ? (
      <InputModal
        wf={
          this.props.finalWorkflow.name +
          " / " +
          this.props.finalWorkflow.version
        }
        modalHandler={this.closeInputModal}
        fromBuilder
        show={this.state.showInputModal}
      />
    ) : null;

    let detailsModal = this.state.showDetailsModal ? (
      <DetailsModal
        wfId={this.props.workflowId}
        modalHandler={this.showDetailsModal}
      />
    ) : null;

    let nodeModal = this.state.showNodeModal ? (
      <SubwfModal
        modalHandler={this.showNodeModal}
        inputs={this.state.modalInputs}
        saveInputs={this.saveNodeInputsHandler}
        show={this.state.showNodeModal}
      />
    ) : null;

    let generalInfoModal = this.state.showGeneralInfoModal ? (
      <GeneralInfoModal
        finalWorkflow={this.props.finalWorkflow}
        workflows={this.props.workflows}
        closeModal={this.showGeneralInfoModal}
        saveInputs={this.props.updateFinalWorkflow}
        show={this.state.showGeneralInfoModal}
        lockWorkflowName={this.props.lockWorkflowName}
        isWfNameLocked={this.props.isWfNameLocked}
        redirectOnExit={this.redirectOnExit}
      />
    ) : null;

    let workflowDefModal = this.state.showDefinitionModal ? (
      <WorkflowDefModal
        definition={this.props.finalWorkflow}
        closeModal={this.showDefinitionModal}
        show={this.state.showDefinitionModal}
      />
    ) : null;

    let exitModal = this.state.showExitModal ? (
      <Modal show={this.state.showExitModal}>
        <Modal.Header>
          <Modal.Title>Do you want to exit builder?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          All changes since last <b>Save</b> or <b>Execute</b> operation will be lost
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={this.showExitModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={this.redirectOnExit}>
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
    ) : null;

    return (
      <div className="body">
        {workflowDefModal}
        {nodeModal}
        {inputsModal}
        {detailsModal}
        {generalInfoModal}
        {exitModal}

        <ControlsHeader
          showDefinitionModal={this.showDefinitionModal}
          showGeneralInfoModal={this.showGeneralInfoModal}
          showExitModal={this.showExitModal}
          saveAndExecute={this.saveAndExecute}
          saveWorkflow={this.saveWorkflow}
          expandNodeToWorkflow={this.expandNodeToWorkflow}
          updateQuery={this.props.updateQuery}
          submitFile={this.importFile}
          saveFile={this.exportFile}
          workflowDiagram={this.state.workflowDiagram}
        />

        <div className="content">
          <SideMenu
            workflows={this.props.workflows}
            functional={this.props.functional}
            query={this.props.query}
            updateQuery={this.props.updateQuery}
          />

          <CustomAlert
            showCustomAlert={this.props.showCustomAlert}
            show={this.props.customAlert.show}
            msg={this.props.customAlert.msg}
            alertVariant={this.props.customAlert.variant}
          />

          <div
            className="diagram-layer"
            onDrop={e => this.onNodeDrop(e)}
            onDragOver={event => {
              event.preventDefault();
            }}
          >
            <DiagramWidget
              className="srd-demo-canvas"
              diagramEngine={this.state.workflowDiagram.getDiagramEngine()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    workflows: state.buildReducer.workflows,
    functional: state.buildReducer.functional,
    sidebarShown: state.buildReducer.sidebarShown,
    query: state.buildReducer.query,
    finalWorkflow: state.buildReducer.finalWorkflow,
    customAlert: state.buildReducer.customAlert,
    isWfNameLocked: state.buildReducer.workflowNameLock,
    workflowId: state.buildReducer.executedWfId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeWorkflows: wfList => dispatch(builderActions.storeWorkflows(wfList)),
    updateFinalWorkflow: finalWorkflow =>
      dispatch(builderActions.updateFinalWorkflow(finalWorkflow)),
    resetToDefaultWorkflow: () =>
      dispatch(builderActions.resetToDefaultWorkflow()),
    updateQuery: query => dispatch(builderActions.requestUpdateByQuery(query)),
    showCustomAlert: (show, variant, msg) =>
      dispatch(builderActions.showCustomAlert(show, variant, msg)),
    lockWorkflowName: () => dispatch(builderActions.lockWorkflowName())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiagramBuilder);
