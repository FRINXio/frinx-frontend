import React from "react";
import {wfLabelsColor} from "../../../constants";
import {getLabelsFromString} from "../builder-utils";

const SideMenuItem = (props) => {

    let description = null;
    let labels = [];
    let version = null;

    if (props.model.description) {
        description = props.model.description.split('-')[0];
        labels = getLabelsFromString(props.model.description);
        version = props.model.wfObject.subWorkflowParam.version;
    }

    return (
    <div draggable={true} onDragStart={e => {e.dataTransfer.setData("storm-diagram-node", JSON.stringify(props.model));}}
         className="tray-item">
        <div title={props.name} className='tray-item-name'>
            <b>{props.name}</b>
        </div>
        <div className='tray-item-content'>
            <div className='tray-item-description'>
                <b>version {version}</b>{description ? `- ${description}` : <i> - no description available</i>}
            </div>
            {labels.map((label,i) => {
                let color = i >= wfLabelsColor.length ? wfLabelsColor[0] : wfLabelsColor[i];
                return (
                    <div className='wfLabel' style={{backgroundColor: color}}>{label}</div>
                )
            })}
        </div>
    </div>
    )
};

export default SideMenuItem
