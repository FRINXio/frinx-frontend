import React from "react";
import { wfLabelsColor } from "../constants";

const WfLabels = props => {
  let color =
    props.index >= wfLabelsColor.length
      ? wfLabelsColor[0]
      : wfLabelsColor[props.index];
  return (
    <div
      style={{ backgroundColor: color }}
      className="wfLabel"
      onClick={e => {
        e.stopPropagation();
        if (props.search)
            props.search();
      }}
    >
      {props.label}
    </div>
  );
};

export default WfLabels;
