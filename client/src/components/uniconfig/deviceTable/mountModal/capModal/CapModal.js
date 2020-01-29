import React, { Component } from "react";
import { Modal, Tab } from "react-bootstrap";
import Editor from "../../../deviceView/editor/Editor";

class CapModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: this.props.show,
      caps: this.props.caps
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.show,
      caps: nextProps.caps
    });
  }

  handleClose() {
    this.props.modalHandler();
  }

  updateCaps(newData) {
    this.props.getUpdatedCaps(newData);
    this.handleClose();
  }

  render() {
    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Body style={{ padding: "30px" }}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Editor
              title="Override Capabilities"
              editable="cap"
              updateConfig={this.updateCaps.bind(this)}
              wfs={this.state.caps}
            />
          </Tab.Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default CapModal;
