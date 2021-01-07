import React, { CSSProperties, FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./Panel.css";

type Props = {
  title: string;
  description: string;
  icon: IconDefinition;
  style: CSSProperties;
  url: string | undefined;
  isExternal: boolean;
  isDisabled: boolean;
};

const Panel: FC<Props> = (props) => {
  const [highlight, setHighlight] = useState(false);

  return props.isDisabled ? (
    <div style={{ boxShadow: "none" }} className="panel disabledPanel">
      <div className="title">{props.title}</div>
      <div className="desc">{props.description}</div>
      <div className={!highlight ? "icon" : "icon lightened"}>
        <FontAwesomeIcon icon={props.icon} />
      </div>
    </div>
  ) : (
    <a
      href={props.url}
      target={props.isExternal ? "_blank" : undefined}
      rel={props.isExternal ? "noopener noreferrer" : undefined}
    >
      <div
        className="panel"
        style={props.style}
        onMouseEnter={() => {
          setHighlight(true);
        }}
        onMouseLeave={() => {
          setHighlight(false);
        }}
      >
        <div className="title">{props.title}</div>
        <div className="desc">{props.description}</div>
        <div className={!highlight ? "icon" : "icon lightened"}>
          <FontAwesomeIcon icon={props.icon} />
        </div>
        <div className={!highlight ? "goButton" : "goButton highlighted"}>
          <FontAwesomeIcon icon={faPlay} />
        </div>
      </div>
    </a>
  );
};

export default Panel;
