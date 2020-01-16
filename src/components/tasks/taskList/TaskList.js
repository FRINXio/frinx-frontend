import React, { Component } from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
import TaskDefinitions from "./TaskDefinitions/TaskDefinitions";
import PollData from "./PollData/PollData";
import { withRouter } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTaskModal: false
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

  render() {
    let addTaskModal = this.state.addTaskModal ? (
      <AddTaskModal
        modalHandler={this.handleAddTaskModal.bind(this)}
        refresh={this.refreshPage.bind(this)}
      />
    ) : null;
    return (
      <Container style={{ textAlign: "left", marginTop: "20px" }}>
        {addTaskModal}
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
