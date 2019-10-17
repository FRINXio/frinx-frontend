import React, { Component } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import TaskDefinitions from "./TaskDefinitions/TaskDefinitions";
import PollData from "./PollData/PollData";
import { withRouter } from "react-router-dom";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeUrl(e) {
    this.props.history.push("/tasks/" + e);
  }

  render() {
    return (
      <Container style={{ textAlign: "left", marginTop: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>
          <i style={{ color: "grey" }} className="fas fa-tasks" />
          &nbsp;&nbsp;Tasks
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
