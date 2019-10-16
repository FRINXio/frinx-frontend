import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import WorkflowDia from "../../WorkflowExec/DetailsModal/WorkflowDia/WorkflowDia";

const http = require("../../../../../server/HttpServerSide").HttpClient;

class DiagramModal extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
      meta: []
    };
  }

  componentDidMount() {
    let name = this.props.wf.split(" / ")[0];
    let version = this.props.wf.split(" / ")[1];
    http
      .get("/api/conductor/metadata/workflow/" + name + "/" + version)
      .then(res => {
        this.setState({
          meta: res.result
        });
      });
  }

  handleClose() {
    this.setState({ show: false });
    this.props.modalHandler();
  }

  render() {
    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title>Workflow Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WorkflowDia meta={this.state.meta} tasks={[]} def={true} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DiagramModal;
