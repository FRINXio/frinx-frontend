import React, { useState } from "react";
import { Col, Row, Modal, Form, Button, Alert } from "react-bootstrap";

const AddTaskModal = props => {
  const [infoIn, setInfoIn] = useState(false);
  const [infoOut, setInfoOut] = useState(false);

  const handleClose = () => {
    props.modalHandler();
  };

  const showInfo = i => {
    return (
      <div>
        <i
          style={{ color: "rgba(0, 149, 255, 0.91)" }}
          className="clickable fas fa-info-circle"
          onMouseEnter={() => {
            i ? setInfoIn(true) : setInfoOut(true);
          }}
          onMouseLeave={() => {
            i ? setInfoIn(false) : setInfoOut(false);
          }}
        />
        <Alert
          variant="info"
          className={
            (i && infoIn) || (!i && infoOut)
              ? "info fadeInInfo"
              : "info fadeOutInfo"
          }
        >
          Please use comma (",") to separate names
        </Alert>
      </div>
    );
  };

  return (
    <Modal dialogClassName="modalWider" show={props.show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Add new Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={props.addTask.bind(this)}>
          <Row>
            {Object.keys(props.taskBody).map((item, i) => {
              return (
                <Col sm={6} key={`col1-${i}`}>
                  <Form.Group>
                    <Form.Label>
                      {item}
                      {i >= 8 ? showInfo(i - 8) : null}
                    </Form.Label>
                    <Form.Control
                      type="input"
                      onChange={e => props.handleInput(e, i)}
                      placeholder="Enter the input"
                      value={
                        Object.values(props.taskBody)[i]
                          ? Object.values(props.taskBody)[i]
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.addTask.bind(this)}>
          Add
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTaskModal;
