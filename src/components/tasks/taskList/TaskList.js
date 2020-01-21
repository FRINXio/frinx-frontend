import React, { Component } from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
import TaskDefinitions from "./TaskDefinitions/TaskDefinitions";
import PollData from "./PollData/PollData";
import { withRouter } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import { taskDefinition } from "../../constants";
const http = require("../../../server/HttpServerSide").HttpClient;

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTaskModal: false,
      taskBody: taskDefinition
    };
  }

  changeUrl(e) {
    this.props.history.push("/tasks/" + e);
  }

  handleAddTaskModal() {
    this.setState({
      addTaskModal: !this.state.addTaskModal
    });
  }

  refreshPage() {
    this.props.history.push("/");
    this.props.history.push("/tasks/");
  }

  handleInput(e, i) {
    let taskBody = this.state.taskBody;
    taskBody[Object.keys(taskBody)[i]] = e.target.value;
    this.setState({
      taskBody: taskBody
    });
  }

  addTask() {
    let taskBody = this.state.taskBody;
    Object.keys(taskBody).forEach((key, i) => {
      if (i >= 8) {
        taskBody[key] = taskBody[key]
          .replace(/ /g, "")
          .split(",")
          .filter(e => {
            return e !== "";
          });
        taskBody[key] = [...new Set(taskBody[key])];
      }
    });
    if (taskBody["name"] !== "") {
      http.post("/api/conductor/metadata/taskdef", [taskBody]).then(() => {
        this.setState({
          taskBody: taskDefinition,
          addTaskModal: !this.state.addTaskModal
        });
        this.refreshPage();
      });
    }
  }

  render() {
    return (
      <Container style={{ textAlign: "left", marginTop: "20px" }}>
        <AddTaskModal
            modalHandler={this.handleAddTaskModal.bind(this)}
            show={this.state.addTaskModal}
            taskBody={this.state.taskBody}
            handleInput={this.handleInput.bind(this)}
            addTask={this.addTask.bind(this)}
        />
        <h1 style={{ marginBottom: "20px" }}>
          <i style={{ color: "grey" }} className="fas fa-tasks" />
          &nbsp;&nbsp;Tasks
          <Button
            variant="outline-primary"
            style={{ marginLeft: "30px" }}
            onClick={this.handleAddTaskModal.bind(this)}
          >
            <i className="fas fa-plus" />
            &nbsp;&nbsp;New
          </Button>
        </h1>
        <Tabs
          onSelect={e => this.changeUrl(e)}
          defaultActiveKey={this.props.match.params.type || "defs"}
          style={{ marginBottom: "20px" }}
        >
          <Tab eventKey="defs" title="Task Definitions">
            <TaskDefinitions />
          </Tab>
          <Tab mountOnEnter eventKey="poll" title="Poll Data">
            <PollData />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default withRouter(TaskList);
