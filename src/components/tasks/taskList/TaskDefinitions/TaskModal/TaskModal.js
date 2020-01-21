import React, { useEffect, useState } from "react";
import {
  Accordion, Button,
  Card,
  Col,
  Modal,
  Row,
  Tab,
  Table,
  Tabs
} from "react-bootstrap";
import moment from "moment";
import Highlight from "react-highlight.js";
const http = require("../../../../../server/HttpServerSide").HttpClient;

const TaskModal = props => {
  const [response, setResponse] = useState({});
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const name = props.name;
    http.get("/api/conductor/metadata/taskdef/" + name).then(res => {
      if (res.result) {
        setResponse(res.result);
      }
    });
  }, []);

  const handleClose = () => {
    props.modalHandler();
  };

  const formatDate = dt => {
    if (dt == null || dt === "") {
      return "";
    }
    return moment(dt).format("DD/MM/YYYY, HH:mm:ss:SSS");
  };

  const renderKeys = variable => {
    let output = [];
    let keys = response[variable] ? response[variable] : 0;
    for (let i = 0; i < keys.length; i++) {
      output.push(
        <tr key={`${variable}-${i}`}>
          <td>{keys[i]}</td>
        </tr>
      );
    }
    return output;
  };

  const headerInfo = () => (
    <div className="headerInfo">
      <Row>
        <Col md="auto">
          <div>
            <b>Retry Count</b>
            <br />
            {response.retryCount}
          </div>
        </Col>
        <Col md="auto">
          <div>
            <b>Timeout Seconds</b>
            <br />
            {response.timeoutSeconds}
          </div>
        </Col>
        <Col md="auto">
          <div>
            <b>Timeout Policy</b>
            <br />
            {response.timeoutPolicy}
          </div>
        </Col>
        <Col md="auto">
          <div>
            <b>Retry Logic</b>
            <br />
            {response.retryLogic}
          </div>
        </Col>
        <Col md="auto">
          <div>
            <b>Retry Delay Seconds</b>
            <br />
            {response.retryDelaySeconds}
          </div>
        </Col>
        <Col md="auto">
          <div>
            <b>Response Timeout Seconds</b>
            <br />
            {response.responseTimeoutSeconds}
          </div>
        </Col>
      </Row>
    </div>
  );

  const iokeys = () => (
    <Row>
      <Col>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th>Input keys</th>
            </tr>
          </thead>
          <tbody>{renderKeys("inputKeys")}</tbody>
        </Table>
      </Col>
      <Col>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th>Output keys</th>
            </tr>
          </thead>
          <tbody>{renderKeys("outputKeys")}</tbody>
        </Table>
      </Col>
    </Row>
  );

  const def = () => (
    <div>
      <h4>
        Task JSON&nbsp;&nbsp;
        <i
          title="copy to clipboard"
          className="clp far fa-clipboard clickable"
          data-clipboard-target="#json"
        />
      </h4>
      <code>
        <pre id="json" className="heightWrapper">
          <Highlight language="json">
            {JSON.stringify(response, null, 2)}
          </Highlight>
        </pre>
      </code>
    </div>
  );

  return (
    <Modal dialogClassName="modalWider" show={props.show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>
          Details of {response.name ? response.name : null}
          <br />
          <p className="text-muted">
            {response.description ? response.description : ""}
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion>
          <Accordion.Toggle as={Card.Header}>
            <b>{response.name ? response.name : null}</b>
            &nbsp;&nbsp;
            <b>
              <p style={{ float: "right" }}>
                Create time: {formatDate(response.createTime)}
                &nbsp;&nbsp;
              </p>
            </b>
          </Accordion.Toggle>
          <Card.Body style={{ padding: "0px" }}>{headerInfo()}</Card.Body>
        </Accordion>
        <Tabs
          className="heightWrapper"
          onSelect={e => setActiveTab(e)}
          style={{ marginBottom: "20px" }}
          id="detailTabs"
        >
          <Tab mountOnEnter eventKey="inputOutput" title="Input/Output">
            {iokeys()}
          </Tab>
          <Tab mountOnEnter eventKey="JSON" title="Task JSON">
            {def()}
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
