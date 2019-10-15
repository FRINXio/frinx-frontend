import React, { Component } from "react";
import { Modal, Button, Tab, Tabs, ButtonGroup } from "react-bootstrap";
import DefaultsDescsTab from "./DefaultsDescsTab";
import OutputParamsTab from "./OutputParamsTab";
import GeneralParamsTab from "./GeneralParamsTab";
import { getLabelsFromString } from "../builder-utils";

class GeneralInfoModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getExistingLabels = this.getExistingLabels.bind(this);

    this.state = {
      show: true,
      finalWf: this.props.definition,
      isWfNameValid: false
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  handleSave() {
    this.setState({ show: false });
    this.props.saveInputs(this.state.finalWf);
    this.props.lockWorkflowName();
    this.props.modalHandler();
  }

  handleSubmit(e) {
    if (this.props.isWfNameLocked || this.state.isWfNameValid) {
      this.handleSave();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleInput(value, key) {
    let finalWf = { ...this.state.finalWf };

    if (key === "name") {
      this.validateWorkflowName(value);
    }

    finalWf = {
      ...finalWf,
      [key]: value
    };

    this.setState({
      finalWf: finalWf
    });
  }

  validateWorkflowName(name) {
    let isValid = name.length >= 1;
    let workflows = this.props.workflows || [];

    workflows.forEach(wf => {
      if (wf.name === name) {
        isValid = false;
      }
    });
    this.setState({ isWfNameValid: isValid });
  }

  getExistingLabels() {
    let workflows = this.props.workflows || [];
    let labels = [];
    workflows.forEach(wf => {
      if (wf.description) {
        labels.push(...getLabelsFromString(wf.description));
      }
    });
    return new Set(labels);
  }

  handleOutputParam(e, entry) {
    let finalWf = { ...this.state.finalWf };
    let outputParameters = finalWf.outputParameters;

    finalWf = {
      ...finalWf,
      outputParameters: {
        ...outputParameters,
        [entry[0]]: e.target.value
      }
    };

    this.setState({
      finalWf: finalWf
    });
  }

  handleCustomParam(param) {
    let finalWf = { ...this.state.finalWf };
    let outputParameters = finalWf.outputParameters;

    finalWf = {
      ...finalWf,
      outputParameters: {
        ...outputParameters,
        [param]: "provide path"
      }
    };

    this.setState({
      finalWf: finalWf
    });
  }

  handleCustomDefaultAndDesc(param, defaultValue, description) {
    let finalWf = { ...this.state.finalWf };
    let inputParameters = finalWf.inputParameters || [];
    // eslint-disable-next-line no-useless-concat
    let entry = `${param}` + `[${description}]` + `[${defaultValue}]`;
    let isUnique = true;

    if (inputParameters.length > 0) {
      inputParameters.forEach((elem, i) => {
        if (elem.startsWith(param)) {
          inputParameters[i] = entry;
          return (isUnique = false);
        }
      });
    }

    if (isUnique) {
      inputParameters.push(entry);
    }

    finalWf = { ...finalWf, inputParameters };

    this.setState({
      finalWf: finalWf
    });
  }

  deleteDefaultAndDesc(selectedParam) {
    let finalWf = { ...this.state.finalWf };
    let inputParameters = this.state.finalWf.inputParameters || [];

    inputParameters.forEach((param, i) => {
      if (param.match(/^(.*?)\[/)[1] === selectedParam) {
        inputParameters.splice(i, 1);
      }
    });

    finalWf = { ...finalWf, inputParameters };

    this.setState({
      finalWf: finalWf
    });
  }

  deleteOutputParam(selectedParam) {
    let finalWf = { ...this.state.finalWf };
    let outputParameters = this.state.finalWf.outputParameters || [];

    delete outputParameters[selectedParam];

    finalWf = { ...finalWf, outputParameters };

    this.setState({
      finalWf: finalWf
    });
  }

  render() {
    let isNameLocked = this.props.isWfNameLocked;

    return (
      <Modal
        size="lg"
        show={this.state.show}
        onHide={isNameLocked ? this.handleClose : () => false}
      >
        <Modal.Header>
          <Modal.Title>
            {isNameLocked ? "Edit general informations" : "Create new workflow"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          <Tabs style={{ marginBottom: "20px" }}>
            <Tab eventKey={1} title="General">
              <GeneralParamsTab
                finalWf={this.state.finalWf}
                handleInput={this.handleInput}
                isWfNameValid={this.state.isWfNameValid}
                handleSubmit={this.handleSubmit}
                isWfNameLocked={isNameLocked}
                getExistingLabels={this.getExistingLabels}
              />
            </Tab>
            <Tab eventKey={2} title="Output parameters">
              <OutputParamsTab
                finalWf={this.state.finalWf}
                handleSubmit={this.handleSubmit}
                handleOutputParam={this.handleOutputParam.bind(this)}
                handleCustomParam={this.handleCustomParam.bind(this)}
                deleteOutputParam={this.deleteOutputParam.bind(this)}
              />
            </Tab>
            <Tab eventKey={3} title="Defaults & description">
              <DefaultsDescsTab
                finalWf={this.state.finalWf}
                deleteDefaultAndDesc={this.deleteDefaultAndDesc.bind(this)}
                handleCustomDefaultAndDesc={this.handleCustomDefaultAndDesc.bind(
                  this
                )}
              />
            </Tab>
          </Tabs>
          <ButtonGroup style={{ width: "100%", marginTop: "20px" }}>
            {!isNameLocked ? (
              <Button
                variant="outline-secondary"
                onClick={this.props.redirectOnExit}
              >
                Cancel
              </Button>
            ) : null}
            <Button onClick={this.handleSubmit} variant="primary">
              Save
            </Button>
          </ButtonGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

export default GeneralInfoModal;
