import React, { Component } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Tab,
  Nav,
  InputGroup,
  FormControl,
  Table
} from "react-bootstrap";
import "./DetailModal.css";

class DetailModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: this.props.show,
      deviceDetails: this.props.deviceDetails
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.show,
      deviceDetails: nextProps.deviceDetails
    });
  }

  handleClose() {
    this.props.modalHandler();
  }

  render() {
    let device = this.state.deviceDetails || [];
    let commit_patterns = device["commit_patterns"] || [];
    let error_patterns = device["err_patterns"] || [];
    let a_cap = device["a_cap"] || [];
    let u_cap = device["u_cap"] || [];
    a_cap = a_cap["available-capability"] || [];
    u_cap = u_cap["unavailable-capability"] || [];
    error_patterns = error_patterns["error-pattern"] || [];

    let labelPattern = [
      ["Node ID:", "node_id"],
      ["Host:", "host"],
      ["Port:", "port"],
      ["Transport-type:", "transport_type"],
      ["Protocol:", "protocol"],
      ["Status:", "status"]
    ];

    if (device["transport_type"] === false) {
      labelPattern[3][0] = "Tcp-only:";
    }

    if (device["connected_message"]) {
      labelPattern.push(["Connected message:", "connected_message"]);
    }

    return (
      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title>
            <i
              style={{
                color: this.state.deviceDetails
                  ? this.state.deviceDetails.status === "connected"
                    ? "#007bff"
                    : "lightblue"
                  : "lightblue"
              }}
              className="fas fa-circle"
            />
            &nbsp;&nbsp;Details of {device.node_id} ({device.host})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={4}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first">Basic</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">
                      Available capabilities
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item style={{ marginBottom: "30px" }}>
                    <Nav.Link eventKey="third">
                      Unavailable capabilities
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      disabled={error_patterns.length === 0}
                      eventKey="fourth"
                    >
                      Commit error patterns
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      disabled={error_patterns.length === 0}
                      eventKey="fifth"
                    >
                      Error patterns
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={7}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    {labelPattern.map((label, i) => {
                      return (
                        <InputGroup className="mb-3" key={`inputGroup${i}`}>
                          <InputGroup.Prepend>
                            <InputGroup.Text id={`label${i}`}>
                              <b>{label[0]}</b>
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl value={device[label[1]]} readOnly />
                        </InputGroup>
                      );
                    })}
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Table
                      className="details-table"
                      style={{ display: "block" }}
                      striped
                      bordered
                      hover
                    >
                      <thead>
                        <tr>
                          <th>Available capabilities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(a_cap).map((cap, i) => {
                          if (cap["capability"]) {
                            return (
                              <tr key={`tr${i}`}>
                                <td>{cap["capability"]}</td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={`tr${i}`}>
                                <td>{cap}</td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Table
                      className="details-table"
                      style={{ display: "block" }}
                      striped
                      bordered
                      hover
                    >
                      <thead>
                        <tr>
                          <th>Unavailable capabilities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(u_cap).map((cap, i) => {
                          if (cap["capability"]) {
                            return (
                              <tr key={`tr${i}`}>
                                <td>{cap["capability"]}</td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={`tr${i}`}>
                                <td>{cap}</td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <Table className="details-table" striped bordered hover>
                      <thead>
                        <tr>
                          <th>Commit patterns</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(commit_patterns).map((pattern, i) => {
                          return (
                            <tr key={`tr${i}`}>
                              <td>{pattern}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fifth">
                    <Table className="details-table" striped bordered hover>
                      <thead>
                        <tr>
                          <th>Error patterns</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error_patterns.map((pattern, i) => {
                          return (
                            <tr key={`tr${i}`}>
                              <td>{pattern}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
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

export default DetailModal;
