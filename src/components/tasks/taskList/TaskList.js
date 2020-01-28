import React, { useState } from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
import TaskDefinitions from "./TaskDefinitions/TaskDefinitions";
import PollData from "./PollData/PollData";
import { withRouter } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import { taskDefinition } from "../../constants";
const http = require("../../../server/HttpServerSide").HttpClient;

const TaskList = props => {
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [taskBody, setTaskBody] = useState(taskDefinition);

  const changeUrl = e => {
    props.history.push("/tasks/" + e);
  };

  const handleAddTaskModal = () => {
    setAddTaskModal(!addTaskModal);
  };

  const handleInput = e =>
    setTaskBody({
      ...taskBody,
      [e.target.name]: e.target.value
    });

  const addTask = () => {
    Object.keys(taskBody).forEach((key, i) => {
      if (key === "inputKeys" || key === "outputKeys") {
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
        window.location.reload();
      });
    }
  };

  return (
    <Container style={{ textAlign: "left", marginTop: "20px" }}>
      <AddTaskModal
        modalHandler={handleAddTaskModal.bind(this)}
        show={addTaskModal}
        taskBody={taskBody}
        handleInput={handleInput.bind(this)}
        addTask={addTask.bind(this)}
      />
      <h1 style={{ marginBottom: "20px" }}>
        <i style={{ color: "grey" }} className="fas fa-tasks" />
        &nbsp;&nbsp;Tasks
        <Button
          variant="outline-primary"
          style={{ marginLeft: "30px" }}
          onClick={handleAddTaskModal.bind(this)}
        >
          <i className="fas fa-plus" />
          &nbsp;&nbsp;New
        </Button>
      </h1>
      <Tabs
        onSelect={e => changeUrl(e)}
        defaultActiveKey={props.match.params.type || "defs"}
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
};

export default withRouter(TaskList);
