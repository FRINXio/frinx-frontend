import React, {Component} from "react";
import {SideMenuItem} from "./SideMenuItem";
import {getWfInputs} from "./builder-utils";

export class SideMenu extends Component {

    appendedWfList() {
        let wfList = [];

        if (this.props.category === "Functional") {
            this.props.functional.map((func, i) => {
                return (
                    wfList.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func}}
                                              name={func.toUpperCase()} color="#0095FF"/>)
                )
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
                optional: false

            };
            return (
                wfList.push(<SideMenuItem id={`wf${i}`} model={{type: "in/out", wfObject, name: wf.name}}
                                          name={wf.name} color="#0095FF"/>)
            )
        });

        this.props.functional.map((func, i) => {
            return (
                wfList.push(<SideMenuItem id={`functionalNode${i}`} model={{type: func}}
                                          name={func.toUpperCase()} color="#0095FF"/>)
            )
        });

        return wfList;
    }

    render() {
        return <div>{this.props.show ? <div className="tray">{this.appendedWfList()}</div> : null}</div>
    }

}



