import React, { Component } from "react";
import { Modal, Button, Tab, Tabs } from "react-bootstrap";
import GeneralTab from "./GeneralTab";
import InputsTab from "./InputsTab";

const http = require("../../../../server/HttpServerSide").HttpClient;

class SubwfModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCustomParam = this.handleCustomParam.bind(this);

    this.state = {
      show: true,
      inputs: {},
      inputParameters: [],
      name: "",
      version: "",
      customParam: ""
    };
  }

  componentDidMount() {
    let wfInputs = this.props.inputs.inputs;

    this.setState({
      inputs: wfInputs,
      name: this.props.inputs.inputs.name
    });

    if (wfInputs.subWorkflowParam) {
      let { name, version } = wfInputs.subWorkflowParam;

      this.setState({
        name: name,
        version: version
      });

      http
        .get("/api/conductor/metadata/workflow/" + name + "/" + version)
        .then(res => {
          this.setState({
            inputParameters: res.result.inputParameters
          });
        });
    }
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  handleSave(e) {
    if (e.key === "Enter" || e === "Enter") {
      this.setState({ show: false });
      this.props.saveInputs(this.state.inputs, this.props.inputs.id);
      this.props.modalHandler();
    }
  }

  handleCustomParam(param) {
    let inputs = { ...this.state.inputs };

    let inputParameters = inputs.inputParameters;
    inputs = {
      ...inputs,
      inputParameters: {
        ...inputParameters,
        [param]: "${workflow.input." + param + "}"
      }
    };

    this.setState({
      inputs: inputs
    });
  }

  handleInput(value, key, entry) {
    let inputs = { ...this.state.inputs };
    let objectKeywords = ["template", "body"];

    if (key[0] === "inputParameters") {
      let inputObject = inputs[key[0]];

      if (typeof key[1] === "object") {
        if (objectKeywords.find(e => entry[0].includes(e))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.log(e);
          }
        }
      }

      inputs = {
        ...inputs,
        [key[0]]: {
          ...inputObject,
          [entry[0]]: value
        }
      };
    } else if (key[0] === "http_request") {
      let inputObject = inputs.inputParameters[key[0]];
      let inputParameters = inputs.inputParameters;

      if (typeof key[1] === "object") {
        if (objectKeywords.find(e => entry[0].includes(e))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.log(e);
          }
        } else if (typeof value === "object" && entry[0] === "method") {
          value = value.value;
          if (value === "PUT" || value === "POST")
            inputObject = { ...inputObject, body: "${workflow.input.body}" };
          else delete inputObject["body"];
        }
      }

      inputs = {
        ...inputs,
        inputParameters: {
          ...inputParameters,
          [key[0]]: {
            ...inputObject,
            [entry[0]]: value
          }
        }
      };
    } else if (key[0] === "decisionCases") {
      let decisionCases = { ...inputs.decisionCases };
      let keyNames = Object.keys(decisionCases);
      let falseCase = decisionCases[keyNames[0]] || [];

      decisionCases = {
        [value]: falseCase
      };

      inputs.decisionCases = decisionCases;
    } else {
      inputs = {
        ...inputs,
        [key]: value
      };
    }

    this.setState({
      inputs: inputs
    });
  }

  render() {
    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title style={{ fontSize: "20px" }}>
            {this.state.name} / {this.state.version}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          <Tabs style={{ marginBottom: "20px" }}>
            <Tab eventKey={1} title="General">
              <GeneralTab
                inputs={this.state.inputs}
                handleInput={this.handleInput}
                handleSave={this.handleSave}
              />
            </Tab>
            <Tab eventKey={2} title="Input parameters">
              <InputsTab
                inputs={this.state.inputs}
                handleInput={this.handleInput}
                handleCustomParam={this.handleCustomParam}
                inputParameters={this.state.inputParameters}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => this.handleSave("Enter")}>
            Save
          </Button>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SubwfModal;
