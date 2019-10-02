import React from "react";
import SideMenuItem from "./SideMenuItem";
import {getWfInputsRegex} from "./builder-utils";

const functionalTaks = (props) => {

    let functionalTasks = [];

    props.functional.forEach((func, i) => {
        if (func === "fork") {
            let wfObject = {
                name: "forkTask",
                taskReferenceName: "forkTaskRef",
                type: "FORK_JOIN",
                forkTasks: [],
                optional: false,
                startDelay: 0
            };

            functionalTasks.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func, wfObject}}
                                      name={func.toUpperCase()} color="#0095FF"/>)
        }
        else if (func === "join") {
            let wfObject = {
                name: "joinTask",
                taskReferenceName: "joinTaskRef",
                type: "JOIN",
                joinOn: [],
                optional: false,
                startDelay: 0
            };

            functionalTasks.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func, wfObject}}
                                      name={func.toUpperCase()} color="#0095FF"/>)
        }
        else if (func === "decision") {
            let wfObject = {
                name: "decisionTask",
                taskReferenceName: "decisionTaskRef",
                inputParameters: {
                    case_value_param: ""
                },
                type: "DECISION",
                caseValueParam: "case_value_param",
                decisionCases: {
                    false: [],
                    true: []
                },
                optional: false,
                startDelay: 0
            };

            functionalTasks.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func, wfObject}}
                                      name={func.toUpperCase()} color="#0095FF"/>)

        } else {
            functionalTasks.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func}}
                                      name={func.toUpperCase()} color="#0095FF"/>)
        }
    });
    return functionalTasks;
};

const tasks = (props) => {

    let workflows = props.workflows || [];
    let tasks = [];

    workflows.map((wf, i) => {
        let wfObject = {
            name: wf.name,
            taskReferenceName: wf.name.toLowerCase().trim()
                + "_ref_" + Math.random().toString(36).toUpperCase().substr(2, 4),
            inputParameters: getWfInputsRegex(wf),
            type: "SUB_WORKFLOW",
            subWorkflowParam: {
                name: wf.name,
                version: wf.version
            },
            optional: false,
            startDelay: 0
        };
        return tasks.push(<SideMenuItem key={`wf${i}`} model={{type: "in/out", wfObject, name: wf.name}}
                                 name={wf.name} color="#0095FF"/>)
    });

    return tasks;
};

const SideMenu = (props) => (
    <div>
        {props.show ?
            props.category === "Functional" ?
                <div className="tray">{functionalTaks(props)}</div>
                :
                <div className="tray">{tasks(props)}</div>
            : null}
    </div>
);

export default SideMenu;



