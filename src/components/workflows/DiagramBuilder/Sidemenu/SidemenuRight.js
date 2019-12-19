import React, { useState, useEffect } from "react";
import { Menu, Sidebar } from "semantic-ui-react";

import "./Sidemenu.css";
import { hash } from "../builder-utils";

const systemTasks = type => {
  switch (type) {
    case "fork": {
      return {
        name: "forkTask",
        taskReferenceName: "forkTaskRef_" + hash(),
        type: "FORK_JOIN",
        forkTasks: [],
        optional: false,
        startDelay: 0
      };
    }
    case "join": {
      return {
        name: "joinTask",
        taskReferenceName: "joinTaskRef_" + hash(),
        type: "JOIN",
        joinOn: [],
        optional: false,
        startDelay: 0
      };
    }
    case "decision": {
      return {
        name: "decisionTask",
        taskReferenceName: "decisionTaskRef_" + hash(),
        inputParameters: {
          param: "true"
        },
        type: "DECISION",
        caseValueParam: "param",
        decisionCases: {
          false: []
        },
        defaultCase: [],
        optional: false,
        startDelay: 0
      };
    }
    case "lambda": {
      return {
        name: "LAMBDA_TASK",
        taskReferenceName: "lambdaTaskRef_" + hash(),
        type: "LAMBDA",
        inputParameters: {
          lambdaValue: "${workflow.input.lambdaValue}",
          scriptExpression:
            "if ($.lambdaValue == 1) {\n  return {testvalue: true} \n} else { \n  return {testvalue: false}\n}"
        },
        optional: false,
        startDelay: 0
      };
    }
    default:
      break;
  }
};

const icons = task => {
  switch (task) {
    case "start":
      return (
        <div className="circle-icon">{task.substring(0, 1).toUpperCase()}</div>
      );
    case "end":
      return (
        <div className="circle-icon">{task.substring(0, 1).toUpperCase()}</div>
      );
    case "lambda":
      return (
        <div className="lambda-icon">{task.substring(0, 1).toUpperCase()}</div>
      );
    case "fork":
      return (
        <div className="fork-icon">{task.substring(0, 1).toUpperCase()}</div>
      );
    case "join":
      return (
        <div className="join-icon">{task.substring(0, 1).toUpperCase()}</div>
      );
    case "decision":
      return (
        <div className="decision-icon">
          <span
            style={{
              position: "absolute",
              transform: "rotate(-45deg)",
              top: "0px",
              left: "10px"
            }}
          >
            {task.substring(0, 1).toUpperCase()}
          </span>
        </div>
      );
    default:
      break;
  }
};

const functional = props => {
  return props.functional.map((task, i) => {
    return (
      <Menu.Item
        as="a"
        title={task.toUpperCase()}
        id={`functionalNode${i}`}
        draggable={true}
        onDragStart={e => {
          e.dataTransfer.setData(
            "storm-diagram-node",
            JSON.stringify({ type: task, wfObject: systemTasks(task) })
          );
        }}
      >
        {icons(task)}
      </Menu.Item>
    );
  });
};

const SidemenuRight = props => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => setExpanded(true), 1300);
  }, []);

  return (
    <div style={{ zIndex: 11 }}>
      <Sidebar
        id="sidebar-right"
        as={Menu}
        direction="right"
        animation="overlay"
        vertical
        icon
        visible={expanded}
      >
        {functional(props)}
      </Sidebar>
    </div>
  );
};

export default SidemenuRight;
