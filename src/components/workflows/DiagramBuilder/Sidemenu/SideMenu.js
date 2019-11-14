import React from "react";
import SideMenuItem from "./SideMenuItem";
import { getWfInputsRegex, hash } from "../builder-utils";
import { Form, InputGroup } from "react-bootstrap";
import SystemTask from "./SystemTask";
import "./Sidemenu.css";

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

const sub_workflow = wf => ({
  name: wf.name,
  taskReferenceName: wf.name.toLowerCase().trim() + "_ref_" + hash(),
  inputParameters: getWfInputsRegex(wf),
  type: "SUB_WORKFLOW",
  subWorkflowParam: {
    name: wf.name,
    version: wf.version
  },
  optional: false,
  startDelay: 0
});

const SideMenu = props => {
  const functionalTaks = () => {
    return props.functional.map((func, i) => {
      return (
        <SystemTask
          id={`functionalNode${i}`}
          model={{ type: func, wfObject: systemTasks(func) }}
          name={func.toUpperCase()}
        />
      );
    });
  };

  const tasks = () => {
    return props.workflows.map((wf, i) => {
      let wfObject = sub_workflow(wf);
      return (
        <SideMenuItem
          key={`wf${i}`}
          model={{
            type: "default",
            wfObject,
            name: wf.name,
            description: wf.hasOwnProperty("description") ? wf.description : ""
          }}
          name={wf.name}
        />
      );
    });
  };

  return (
    <div id="sidemenu" className="tray">
      <div className="tray-header">
        <InputGroup>
          <Form.Control
            value={props.query}
            onChange={e => props.updateQuery(e.target.value)}
            placeholder={`Search for tasks.`}
          />
          <InputGroup.Append>
            <InputGroup.Text>
              <i className="fas fa-search" />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <div className="tray-header-info">
          <span style={{ color: "grey" }}>Drag & drop tasks to canvas</span>
          <span style={{ color: "grey" }}>
            showing {tasks().length} results
          </span>
        </div>
      </div>

      <div className="tray-list">
        <div className="tray-system">{functionalTaks()}</div>
        {tasks()}
      </div>
    </div>
  );
};

export default SideMenu;
