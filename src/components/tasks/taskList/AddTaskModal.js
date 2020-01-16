import React, { Component } from "react";
import { Col, Row, Modal, Form, Button, Alert } from "react-bootstrap";
import { withRouter } from "react-router-dom";
const http = require("../../../server/HttpServerSide").HttpClient;

class AddTaskModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      taskBody: {
        name: "",
        description: "",
        retryCount: "0",
        retryLogic: "FIXED",
        retryDelaySeconds: "0",
        timeoutPolicy: "TIME_OUT_WF",
        timeoutSeconds: "60",
        responseTimeoutSeconds: "10",
        inputKeys: [],
        outputKeys: []
      },
      invalidName: false,
      info: [false, false]
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  handleInput(e, i) {
    let taskBody = this.state.taskBody;
    let key = Object.keys(taskBody)[i];
    if (i >= 8) {
      taskBody[key] = e.target.value;
      taskBody[key] = taskBody[key]
        .replace(/ /g, "")
        .split(",")
        .filter(e => {
          return e !== "";
        });
      taskBody[key] = [...new Set(taskBody[key])];
    } else {
      taskBody[key] = e.target.value;
      if (taskBody["name"] !== "" && this.state.invalidName)
        this.setState({ invalidName: false });
    }
    this.setState({
      taskBody: taskBody
    });
  }

  addTask() {
    let taskBody = this.state.taskBody;
    if (taskBody["name"] === "") {
      this.setState({ invalidName: true });
    } else {
      http.post("/api/conductor/metadata/taskdef", [taskBody]).then(() => {
        this.handleClose();
        this.props.refresh();
      });
    }
  }

  render() {
    let taskBody = this.state.taskBody;
    const info = (i) => {
      let info = this.state.info;
      return (
        <div>
          <i
            style={{ color: "rgba(0, 149, 255, 0.91)" }}
            className="clickable fas fa-info-circle"
            onMouseEnter={() => { info[i] = true; this.setState({ info: info })}}
            onMouseLeave={() => { info[i] = false; this.setState({ info: info })}}
          />
          <Alert
            variant="info"
            className={this.state.info[i] ? "info fadeInInfo" : "info fadeOutInfo"}
          >
            Please use comma (",") to separate names
          </Alert>
        </div>
      );
    };

    return (
      <Modal
        dialogClassName="modalWider"
        show={this.state.show}
        onHide={this.handleClose}
      >
        <Modal.Header>
          <Modal.Title>Add new Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.addTask.bind(this)}>
            <Row>
              {Object.keys(taskBody).map((item, i) => {
                return (
                  <Col sm={6} key={`col1-${i}`}>
                    <Form.Group>
                      <Form.Label>
                        {item}{i >= 8 ? info(i - 8) : null}
                      </Form.Label>
                      {i === 0 && this.state.invalidName ? (
                        <div
                          style={{
                            color: "red",
                            fontSize: "12px",
                            float: "right",
                            marginTop: "5px"
                          }}
                        >
                          Fill the name field
                        </div>
                      ) : null}
                      <Form.Control
                        type="input"
                        onChange={e => this.handleInput(e, i)}
                        placeholder="Enter the input"
                        value={
                          Object.values(taskBody)[i]
                            ? Object.values(taskBody)[i]
                            : ""
                        }
                        isInvalid={i === 0 && this.state.invalidName}
                      />
                    </Form.Group>
                  </Col>
                );
              })}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.addTask.bind(this)}>
            Add
          </Button>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(AddTaskModal);
