import React from "react";

const SystemTask = props => {
  return (
    <div
      draggable={true}
      onDragStart={e => {
        e.dataTransfer.setData(
          "storm-diagram-node",
          JSON.stringify(props.model)
        );
      }}
      className="system-task"
    >
      <div title={props.name} className="tray-item-name">
        <b>{props.name}</b>
      </div>
    </div>
  );
};

export default SystemTask;
