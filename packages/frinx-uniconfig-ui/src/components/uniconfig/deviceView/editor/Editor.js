import React, { Component } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import "../../../../../node_modules/react-gh-like-diff/lib/diff2html.css";
import CodeMirror from "react-codemirror";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold";
import "../DeviceView.css";
import "./Codemirror.css";
require("codemirror/mode/javascript/javascript");

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modified: false,
      inputJSON: this.props.inputJSON,
      prevJSON: this.props.inputJSON,
      isNotParsable: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.cm.codeMirror.setValue(nextProps.inputJSON);
    this.setState({
      inputJSON: nextProps.inputJSON,
      prevJSON: nextProps.inputJSON
    });
  }

  updateJson(newCode) {
    this.checkSyntax(newCode);
    if (!this.state.isNotParsable) {
      this.checkModified(newCode);
      this.setState({
        inputJSON: newCode
      });
    }
  }

  checkModified(newCode) {
    this.setState({
      modified: this.state.prevJSON !== newCode
    });
  }

  checkSyntax(newCode) {
    try {
      this.setState({ isNotParsable: false });
      JSON.parse(newCode);
    } catch (e) {
      this.setState({
        isNotParsable: true
      });
    }
  }

  refresh() {
    this.setState({
      modified: false
    });
    this.props.refreshConfig();
  }

  sendConfig() {
    if (!this.state.isNotParsable) {
      this.props.updateConfig(JSON.parse(this.state.inputJSON));
      this.setState({
        modified: false,
        prevJSON: this.state.inputJSON
      });
    }
  }

  renderHeaders = () => (
    <div>
      {this.props.editable ? (
        <div>
          <h2 style={{ display: "inline-block", marginTop: "5px" }}>
            {this.props.title}
          </h2>
          <div style={{ float: "right" }}>
            <Button
              className="btn btn-primary gradientBtn"
              onClick={this.sendConfig.bind(this)}
              style={{ marginLeft: "5px" }}
            >
              <i className="fas fa-save" />
              &nbsp;&nbsp;Save
            </Button>
            {this.props.editable === "cap" ? null : (
              <Dropdown as={ButtonGroup}>
                <Button
                  className="btn btn-light"
                  onClick={this.refresh.bind(this)}
                  style={{ marginLeft: "5px" }}
                >
                  &nbsp;&nbsp;{this.state.modified ? "Cancel" : "Refresh"}
                </Button>
                {!this.state.modified ? (
                  <div>
                    <Dropdown.Toggle
                      split
                      variant="btn btn-light"
                      id="dropdown-split-basic"
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={this.props.replaceConfig}>
                        Replace with Operational
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </div>
                ) : null}
              </Dropdown>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ display: "inline-block", marginTop: "5px" }}>
            {this.props.title}
          </h2>
          <div style={{ float: "right" }}>
            <Button
              className="btn btn-primary gradientBtn"
              style={{ marginRight: "5px" }}
              disabled={this.props.syncing}
              onClick={this.props.syncFromNetwork}
            >
              <i
                className={
                  this.props.syncing ? "fas fa-sync fa-spin" : "fas fa-sync"
                }
              />
              &nbsp;&nbsp;
              {this.props.syncing ? "Synchronizing..." : "Sync from network"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  render() {
    return (
      <div>
        {this.renderHeaders()}
        <div className="d2h-file-header">
          <span className="d2h-file-name-wrapper">
            <i className="fas fa-file-alt" />
            <span>
              &nbsp;&nbsp;
              {this.props.editable === "cap"
                ? "Capabilities"
                : this.props.editable
                ? "ODL config data store of "
                : "ODL operational data store of "}{" "}
              {this.props.deviceName}
            </span>
            <span
              className="d2h-tag d2h-changed d2h-changed-tag"
              style={{ display: this.state.modified ? "inline-block" : "none" }}
            >
              MODIFIED
            </span>
            <div
              style={{
                marginLeft: "10px",
                display: this.state.isNotParsable ? "block" : "none"
              }}
              className="alert-warning"
              role="alert"
            >
              {this.state.isNotParsable
                ? "Could not parse JSON. Check syntax."
                : ""}
            </div>
          </span>
        </div>

        <CodeMirror
          ref={el => (this.cm = el)}
          value={this.state.inputJSON}
          onChange={this.updateJson.bind(this)}
          options={{
            mode: "application/ld+json",
            lineNumbers: true,
            readOnly: !this.props.editable,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
          }}
        />
      </div>
    );
  }
}

export default Editor;
