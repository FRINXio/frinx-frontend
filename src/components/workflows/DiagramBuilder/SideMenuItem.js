import React from "react";

const SideMenuItem = () => (
    <div
        draggable={true} onDragStart={e => {
        e.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
    }} className="tray-item">
        {this.props.name}
    </div>
);

export default SideMenuItem
