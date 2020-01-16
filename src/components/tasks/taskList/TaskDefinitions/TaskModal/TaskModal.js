import React, { Component } from "react";
import {
  Accordion,
  Card,
  Col,
  Modal,
  Row,
  Tab,
  Table,
  Tabs
} from "react-bootstrap";
import moment from "moment";
import Highlight from "react-highlight.js";
const http = require("../../../../../server/HttpServerSide").HttpClient;

class TaskModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      response: {}
    };
  }

  componentDidMount() {
    http.get("/api/conductor/metadata/taskdef/" + this.props.name).then(res => {
      if (res.result) {
        this.setState({
          response: res.result
        });
      }
    });
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  formatDate(dt) {
    if (dt == null || dt === "") {
      return "";
    }
    return moment(dt).format("DD/MM/YYYY, HH:mm:ss:SSS");
  }

  inputKeys() {
    let output = [];
    let inputKeys = this.state.response.inputKeys
      ? this.state.response.inputKeys
      : 0;
    for (let i = 0; i < inputKeys.length; i++) {
      output.push(
        <tr id={`inputKey-${i}`}>
          <td>{inputKeys[i]}</td>
        </tr>
      );
    }
    return output;
  }

  outputKeys() {
    let output = [];
    let outputKeys = this.state.response.outputKeys
      ? this.state.response.outputKeys
      : 0;
    for (let i = 0; i < outputKeys.length; i++) {
      output.push(
        <tr id={`outputKeys-${i}`}>
          <td>{outputKeys[i]}</td>
        </tr>
      );
    }
    return output;
  }

  render() {
    const headerInfo = () => (
      <div className="headerInfo">
        <Row>
          <Col md="auto">
            <div>
              <b>Retry Count</b>
              <br />
              {this.state.response.retryCount}
            </div>
          </Col>
          <Col md="auto">
            <div>
              <b>Timeout Seconds</b>
              <br />
              {this.state.response.timeoutSeconds}
            </div>
          </Col>
          <Col md="auto">
            <div>
              <b>Timeout Policy</b>
              <br />
              {this.state.response.timeoutPolicy}
            </div>
          </Col>
          <Col md="auto">
            <div>
              <b>Retry Logic</b>
              <br />
              {this.state.response.retryLogic}
            </div>
          </Col>
          <Col md="auto">
            <div>
              <b>Retry Delay Seconds</b>
              <br />
              {this.state.response.retryDelaySeconds}
            </div>
          </Col>
          <Col md="auto">
            <div>
              <b>Response Timeout Seconds</b>
              <br />
              {this.state.response.responseTimeoutSeconds}
            </div>
          </Col>
        </Row>
      </div>
    );

    const iokeys = () => (
      <Row>
        <Col>
          <Table ref={this.table} striped hover size="sm">
            <thead>
              <tr>
                <th>Input keys</th>
              </tr>
            </thead>
            <tbody>{this.inputKeys()}</tbody>
          </Table>
        </Col>
        <Col>
          <Table ref={this.table} striped hover size="sm">
            <thead>
              <tr>
                <th>Output keys</th>
              </tr>
            </thead>
            <tbody>{this.outputKeys()}</tbody>
          </Table>
        </Col>
      </Row>
    );

    const def = () => (
      <div>
        <h4>
          Task JSON&nbsp;&nbsp;
          <i
            title="copy to clipboard"
            className="clp far fa-clipboard clickable"
            data-clipboard-target="#json"
          />
        </h4>
        <code>
          <pre id="json" className="heightWrapper">
            <Highlight language="json">
              {JSON.stringify(this.state.response, null, 2)}
            </Highlight>
          </pre>
        </code>
      </div>
    );

    return (
      <Modal
        dialogClassName="modalWider"
        show={this.state.show}
        onHide={this.handleClose}
      >
        <Modal.Header>
          <Modal.Title>
            Details of{" "}
            {this.state.response.name ? this.state.response.name : null}
            <br />
            <p className="text-muted">
              {this.state.response.description
                ? this.state.response.description
                : ""}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            <Accordion.Toggle as={Card.Header}>
              <b>
                {this.state.response.name ? this.state.response.name : null}
              </b>
              &nbsp;&nbsp;
              <b>
                <p style={{ float: "right" }}>
                  Create time: {this.formatDate(this.state.response.createTime)}
                  &nbsp;&nbsp;
                </p>
              </b>
            </Accordion.Toggle>
            <Card.Body style={{ padding: "0px" }}>{headerInfo()}</Card.Body>
          </Accordion>
          <Tabs
            className="heightWrapper"
            onSelect={e => this.setState({ activeTab: e })}
            style={{ marginBottom: "20px" }}
            id="detailTabs"
          >
            <Tab mountOnEnter eventKey="inputOutput" title="Input/Output">
              {iokeys()}
            </Tab>
            <Tab mountOnEnter eventKey="JSON" title="Task JSON">
              {def()}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

export default TaskModal;
