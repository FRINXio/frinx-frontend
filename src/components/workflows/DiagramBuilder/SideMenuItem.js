import React from "react";

const SideMenuItem = (props) => (
    <div
        draggable={true} onDragStart={e => {
        e.dataTransfer.setData("storm-diagram-node", JSON.stringify(props.model));
    }} className="tray-item">
        {props.name}
    </div>
);

export default SideMenuItem
