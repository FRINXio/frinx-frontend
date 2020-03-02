import React, { Component } from "react";
import {Modal, Button, Form, Row, Col, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import { connect } from "react-redux";
import * as builderActions from "../../../../../store/actions/builder";
import * as mountedDevicesActions from "../../../../../store/actions/mountedDevices";
import { Typeahead } from "react-bootstrap-typeahead";
const http = require("../../../../common/HttpServerSide").HttpClient;

// FIXME rework this class :)
class InputModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      def: "{}",
      workflowForm: [],
      wfdesc: "",
      status: "Execute",
      wfId: null,
      name: this.props.wf.split(" / ")[0],
      version: Number(this.props.wf.split(" / ")[1]),
      warning: []
    };
  }

  componentDidMount() {
    let name = this.props.wf.split(" / ")[0];
    let version = this.props.wf.split(" / ")[1];
    this.getWaitingWorkflows()
    http
      .get("/api/conductor/metadata/workflow/" + name + "/" + version)
      .then(res => {
        this.setState(
          {
            def: JSON.stringify(res.result, null, 2),
            wfdesc: res.result["description"]
              ? res.result["description"].split("-")[0]
              : ""
          },
          () => this.getWorkflowInputDetails()
        );
      })
      .then(() => {
        if (
          this.state.workflowForm.descs.some(
            rx => rx && rx.match(/.*#node_id.*/g)
          )
        ) {
          this.props.getMountedDevices();
        }
      });
  }

  getWorkflowInputDetails() {
    this.setState(
      {
        workflowForm: {
          labels: this.getInputs(this.state.def)
        }
      },
      () => {
        this.setState({
          workflowForm: {
            labels: this.state.workflowForm.labels,
            ...this.getDetails(this.state.def, this.state.workflowForm.labels)
          }
        });
      }
    );
  }

  getWaitingWorkflows() {
    let q = 'status:"RUNNING"';
    http.get(
            "/api/conductor/executions/?q=&h=&freeText=" +
            q +
            "&start=" +
            0 +
            "&size="
        ).then(res => {
          let runningWfs = res.result?.hits;
          runningWfs.forEach(wf => {
            http.get('/api/conductor/id/' + wf.workflowId).then(res => {
              console.log(res.result)
              // todo filter only waits
            })
          })
    })
  }

  getInputs(def) {
    let matchArray = def.match(/(?<=workflow\.input\.)([a-zA-Z0-9-_]+)/gim);
    return [...new Set(matchArray)];
  }

  getDetails(def, inputsArray) {
    let [detailsArray, tmpDesc, tmpValue, descs, values] = [[], [], [], [], []];

    if (inputsArray.length > 0) {
      for (let i = 0; i < inputsArray.length; i++) {
        let RegExp3 = new RegExp(`\\b${inputsArray[i]}\\[.*?]"`, "igm");
        detailsArray[i] = def.match(RegExp3);
      }
    }
    for (let i = 0; i < detailsArray.length; i++) {
      if (detailsArray[i]) {
        tmpDesc[i] = detailsArray[i][0].match(/\[.*?\[/);
        tmpValue[i] = detailsArray[i][0].match(/].*?]/);
        if (tmpDesc[i] == null) {
          tmpDesc[i] = detailsArray[i][0].match(/\[(.*?)]/);
          descs[i] = tmpDesc[i][1];
          values[i] = null;
        } else {
          tmpDesc[i] = tmpDesc[i][0].match(/[^[\]"]+/);
          tmpValue[i] = tmpValue[i][0].match(/[^[\]*]+/);
          descs[i] = tmpDesc[i] ? tmpDesc[i][0] : null;
          values[i] = tmpValue[i] ? tmpValue[i][0].replace(/\\/g, "") : null;
        }
      } else {
        descs[i] = null;
        values[i] = null;
      }
    }
    return { descs, values };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  handleInput(e, i) {
    const { workflowForm, warning } = this.state;

    workflowForm.values[i] = e.target.value;
    warning[i] = !!(workflowForm.values[i].match(/^\s.*$/) || workflowForm.values[i].match(/^.*\s$/));

    this.setState({
      workflowForm,
      warning
    });
  }

  handleTypahead(e, i) {
    const { workflowForm } = this.state;
    workflowForm.values[i] = e.toString();

    this.setState({
      workflowForm
    });
  }

  handleSwitch(e, i){
    const { workflowForm} = this.state;
    workflowForm.values[i] = e ? "true" : "false";

    this.setState({
      workflowForm
    });
  }

  executeWorkflow() {
    let { labels, values } = this.state.workflowForm;
    let input = {};
    let payload = {
      name: this.state.name,
      version: this.state.version,
      input
    };

    for (let i = 0; i < labels.length; i++) {
      if (values[i]) {
        input[labels[i]] = values[i].startsWith("{")
          ? JSON.parse(values[i])
          : values[i];
      }
    }
    this.setState({ status: "Executing..." });
    http.post("/api/conductor/workflow", JSON.stringify(payload)).then(res => {
      this.setState({
        status: res.statusText,
        wfId: res.body.text
      });
      this.props.storeWorkflowId(res.body.text);
      this.timeoutBtn();

      if (this.props.fromBuilder) {
        this.handleClose();
      }
    });
  }

  timeoutBtn() {
    setTimeout(() => this.setState({ status: "Execute" }), 1000);
  }

  render() {
    let values = this.state.workflowForm.values || [];
    let descs = this.state.workflowForm.descs || [];
    let labels = this.state.workflowForm.labels || [];
    let warning = this.state.warning;

    let inputModel = (type, i) => {
      switch (true) {
        case /node_id.*/g.test(type):
          return (
            <Typeahead
              id={`input-${i}`}
              onChange={e => this.handleTypahead(e, i)}
              placeholder="Enter the node id"
              multiple={!!type.match(/node_ids/g)}
              options={this.props.devices}
              selected={this.props.devices.filter(
                device => device === values[i]
              )}
              onInputChange={e => this.handleTypahead(e, i)}
            />
          );
        case /template/g.test(type):
          return (
            <Form.Control
              type="input"
              as="textarea"
              rows="2"
              onChange={e => this.handleInput(e, i)}
              placeholder="Enter the input"
              value={values[i] ? values[i] : ""}
              isInvalid={warning[i]}
            />
          );
        case /bool/g.test(type):
          return (
              <ToggleButtonGroup
                  type="radio"
                  value={values[i] === "true"}
                  name={`switch-${i}`}
                  onChange={e => this.handleSwitch(e, i)}
                  style={{
                    height: "calc(1.5em + .75rem + 2px)",
                    width: "100%",
                    paddingTop: ".375rem"
                  }}
              >
                <ToggleButton size="sm" variant="outline-primary" value={true}>
                  On
                </ToggleButton>
                <ToggleButton size="sm" variant="outline-primary" value={false}>
                  Off
                </ToggleButton>
              </ToggleButtonGroup>
          );
        default:
          return (
            <Form.Control
              type="input"
              onChange={e => this.handleInput(e, i)}
              placeholder="Enter the input"
              value={values[i] ? values[i] : ""}
              isInvalid={warning[i]}
            />
          );
      }
    };
    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Body style={{ padding: "30px" }}>
          <h4>
            {this.state.name} / {this.state.version}
          </h4>
          <p className="text-muted">{this.state.wfdesc}</p>
          <hr />
          <Form onSubmit={this.executeWorkflow.bind(this)}>
            <Row>
              {labels.map((item, i) => {
                return (
                  <Col sm={6} key={`col1-${i}`}>
                    <Form.Group>
                      <Form.Label>{item}</Form.Label>
                      {warning[i] ? (
                        <div
                          style={{
                            color: "red",
                            fontSize: "12px",
                            float: "right",
                            marginTop: "5px"
                          }}
                        >
                          Unnecessary space
                        </div>
                      ) : null}
                      {inputModel(descs[i] ? descs[i].split("#")[1] : null, i)}
                      <Form.Text className="text-muted">
                        {descs[i] ? descs[i].split("#")[0] : null}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                );
              })}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <a
            style={{ float: "left", marginRight: "50px" }}
            href={`/workflows/exec/${this.state.wfId}`}
          >
            {this.state.wfId}
          </a>
          <Button
            variant={
              this.state.status === "OK"
                ? "success"
                : this.state.status === "Executing..."
                ? "info"
                : this.state.status === "Execute"
                ? "primary"
                : "danger"
            }
            onClick={this.executeWorkflow.bind(this)}
          >
            {this.state.status === "Execute" ? (
              <i className="fas fa-play" />
            ) : null}
            {this.state.status === "Executing..." ? (
              <i className="fas fa-spinner fa-spin" />
            ) : null}
            {this.state.status === "OK" ? (
              <i className="fas fa-check-circle" />
            ) : null}
            &nbsp;&nbsp;{this.state.status}
          </Button>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    storeWorkflowId: id => dispatch(builderActions.storeWorkflowId(id)),
    getMountedDevices: () => dispatch(mountedDevicesActions.getMountedDevices())
  };
};

const mapStateToProps = state => {
  return {
    devices: state.mountedDeviceReducer.devices
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputModal);
