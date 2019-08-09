import React, {Component} from "react";
import {SideMenuItem} from "./SideMenuItem";
import {getWfInputs} from "./builder-utils";

export class SideMenu extends Component {

    appendedWfList() {
        let wfList = [];

        if (this.props.category === "Functional") {
            this.props.functional.map((func, i) => {
                if (func === "fork") {
                    let wfObject = {
                        name: "forkTask",
                        taskReferenceName: "forkTaskRef",
                        type: "FORK_JOIN",
                        forkTasks: [],
                        optional: false,
                        startDelay: 0
                    };
                    return (
                        wfList.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func, wfObject}}
                                                  name={func.toUpperCase()} color="#0095FF"/>)
                    )
                }
                if (func === "join") {
                    let wfObject = {
                        name: "joinTask",
                        taskReferenceName: "joinTaskRef",
                        type: "JOIN",
                        joinOn: [],
                        optional: false,
                        startDelay: 0
                    };
                    return (
                        wfList.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func, wfObject}}
                                                  name={func.toUpperCase()} color="#0095FF"/>)
                    )
                } if (func === "decision") {
                    let wfObject = {
                        name: "",
                        taskReferenceName: "",
                        inputParameters: {
                            case_value_param: ""
                        },
                        type: "DECISION",
                        caseValueParam: "case_value_param",
                        decisionCases: {
                            fail: [],
                            complete: []
                        },
                        optional: false,
                        startDelay: 0
                    };
                    return (
                        wfList.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func, wfObject}}
                                                  name={func.toUpperCase()} color="#0095FF"/>)
                    )
                }
                else {
                    return (
                        wfList.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func}}
                                                  name={func.toUpperCase()} color="#0095FF"/>)
                    )
                }
            });
            return wfList;
        }

        this.props.workflows.map((wf, i) => {
            let wfObject = {
                name: "",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false,
                startDelay: 0
            };
            return (
                wfList.push(<SideMenuItem id={`wf${i}`} model={{type: "in/out", wfObject, name: wf.name}}
                                          name={wf.name} color="#0095FF"/>)
            )
        });

        return wfList;
    }

    render() {
        return <div>{this.props.show ? <div className="tray">{this.appendedWfList()}</div> : null}</div>
    }

}



