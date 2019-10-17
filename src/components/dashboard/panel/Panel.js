import React, { Component } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import "./Panel.css";

class Panel extends Component {
  constructor(props) {
    super(props);
    if (this.props.disabled) {
    } else {
      library.add(this.props.icon);
    }
    this.state = {
      highlight: false
    };
  }

  hoverAction() {
    this.setState({
      highlight: true
    });
  }

  hoverOver() {
    this.setState({
      highlight: false
    });
  }

  render() {
    const disabled = this.props.disabled;
    return (
      <div onClick={() => this.props.history.push(this.props.link)}>
        {!disabled ? (
          <div
            className="panel"
            style={this.props.style}
            onMouseEnter={() => this.hoverAction()}
            onMouseLeave={() => this.hoverOver()}
          >
            <div className="title">{this.props.title}</div>
            <div className="desc">{this.props.desc}</div>
            <div className={!this.state.highlight ? "icon" : "icon lightened"}>
              <FontAwesomeIcon icon={this.props.icon} />
            </div>
            <div
              className={
                !this.state.highlight ? "goButton" : "goButton highlighted"
              }
            >
              <FontAwesomeIcon icon={faPlay} />
            </div>
          </div>
        ) : (
          <div style={{ boxShadow: "none" }} className="panel disabledPanel">
            <div className="title">{this.props.title}</div>
            <div className="desc">{this.props.desc}</div>
            <div className={!this.state.highlight ? "icon" : "icon lightened"}>
              <FontAwesomeIcon icon={this.props.icon} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Panel);
