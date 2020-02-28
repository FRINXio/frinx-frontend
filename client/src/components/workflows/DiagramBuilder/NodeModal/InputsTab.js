import React, { useState } from "react";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import Dropdown from "react-dropdown";

const TEXTFIELD_KEYWORDS = ["template", "uri", "body"];
const CODEFIELD_KEYWORDS = ["scriptExpression"];
const SELECTFIELD_KEYWORDS = ["method"];

// FIXME simplify conditional rendering of different input fields

const InputsTab = props => {
  const [customParam, setCustomParam] = useState("");

  const getDescriptionAndDefault = selectedParam => {
    let inputParameters = props.inputParameters || [];
    let result = [];

    inputParameters.forEach(param => {
      if (param.match(/^(.*?)\[/)[1] === selectedParam) {
        param.match(/\[(.*?)]/g).forEach(group => {
          result.push(group.replace(/[[\]']+/g, ""));
        });
      }
    });
    return result.length > 0 ? result : ["", ""];
  };

  const addNewInputParam = e => {
    e.preventDefault();
    e.stopPropagation();

    props.addNewInputParam(customParam);
    setCustomParam("");
  };

  const handleTextField = (entry, item, i, textFieldParams) => {
    let value = entry[1];

    if (!entry[0].includes("uri")) {
      if (typeof entry[1] === "object") {
        value = JSON.stringify(entry[1], null, 5);
      }
    }

    textFieldParams.push(
      <Col sm={12} key={`colTf-${entry[0]}`}>
        <Form.Group>
          <Form.Label>
            {entry[0]}
            <i
              title="copy to clipboard"
              className="btn fa fa-clipboard"
              data-clipboard-target={"#textfield" + i}
            />
          </Form.Label>
          <InputGroup
            size="sm"
            style={{
              minHeight:
                entry[0] === "uri" || entry[0] === "headers" ? "60px" : "200px"
            }}
          >
            <Form.Control
              id={"textfield" + i}
              as="textarea"
              type="input"
              onChange={e => props.handleInput(e.target.value, item, entry)}
              value={value}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            {getDescriptionAndDefault(entry[0])[0]}
          </Form.Text>
        </Form.Group>
      </Col>
    );
  };

  const handleCodeField = (entry, item, i, textFieldParams) => {
    let value = entry[1];

    textFieldParams.push(
      <Col sm={12} key={`colTf-${entry[0]}`}>
        <Form.Group>
          <Form.Label>{entry[0]}</Form.Label>
          <AceEditor
            mode="javascript"
            theme="tomorrow"
            width="100%"
            height="300px"
            onChange={val => props.handleInput(val, item, entry)}
            fontSize={16}
            value={value}
            wrapEnabled={true}
            setOptions={{
              showPrintMargin: true,
              highlightActiveLine: true,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
          <Form.Text className="text-muted">
            {getDescriptionAndDefault(entry[0])[0]}
          </Form.Text>
        </Form.Group>
      </Col>
    );
  };

  const handleSelectField = (entry, item, i, textFieldParams) => {
    let value = entry[1];

    textFieldParams.push(
      <Col sm={12} key={`colTf-${entry[0]}`}>
        <Form.Group>
          <Form.Label>{entry[0]}</Form.Label>
          <Dropdown
            options={["GET", "PUT", "POST", "DELETE"]}
            onChange={val => props.handleInput(val, item, entry)}
            value={value}
          />
          <Form.Text className="text-muted">
            {getDescriptionAndDefault(entry[0])[0]}
          </Form.Text>
        </Form.Group>
      </Col>
    );
  };

  const handleKeyField = (entry, item, i, textFieldParams) => {
    textFieldParams.push(
      <Col sm={12} key={`colTf-${entry[0]}`}>
        <Form.Label>
          {entry[0]}&nbsp;&nbsp;
          <Button onClick={props.addRemoveHeader.bind(this, true)}>
            <i className="fas fa-plus" />
          </Button>
        </Form.Label>
        {Object.entries(entry[1]).map((header, i) => {
          return (
            <Row key={`header-${i}`}>
              <Col sm={6}>
                <Form.Group controlId={`header-key-${i}`}>
                  {i === 0 ? (
                    <Form.Label className="text-muted">Key</Form.Label>
                  ) : null}
                  <Form.Control
                    style={{ marginBottom: "2px" }}
                    type="input"
                    onChange={e =>
                      props.handleInput(e.target.value, item, entry, i, true)
                    }
                    value={header[0]}
                  />
                </Form.Group>
              </Col>
              <Col sm={5}>
                <Form.Group controlId={`header-value-${i}`}>
                  {i === 0 ? (
                    <Form.Label className="text-muted">Value</Form.Label>
                  ) : null}
                  <Form.Control
                    style={{ marginBottom: "2px" }}
                    type="input"
                    onChange={e =>
                      props.handleInput(e.target.value, item, entry, i, false)
                    }
                    value={header[1]}
                  />
                </Form.Group>
              </Col>
              <Col sm={1}>
                {i === 0 ? (
                  <Form.Label className="text-muted">Delete</Form.Label>
                ) : null}
                <Button onClick={props.addRemoveHeader.bind(this, false, i)}>
                  <i className="fas fa-minus" />
                </Button>
              </Col>
            </Row>
          );
        })}
      </Col>
    );
  };

  let textFieldParams = [];

  return (
    <div>
      <Row>
        <Form onSubmit={addNewInputParam}>
          <InputGroup style={{ padding: "10px 215px 10px" }}>
            <Form.Control
              value={customParam}
              onChange={e => setCustomParam(e.target.value)}
              placeholder="Add new parameter name"
            />
            <InputGroup.Append>
              <Button type="submit" variant="outline-primary">
                Add
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Row>
      <hr className="hr-text" data-content="Existing input parameters" />
      <Form>
        <Row>
          {Object.entries(props.inputs).map(item => {
            if (item[0] === "inputParameters") {
              return Object.entries(item[1]).map((entry, i) => {
                if (
                  TEXTFIELD_KEYWORDS.find(keyword => entry[0].includes(keyword))
                ) {
                  return handleTextField(entry, item, i, textFieldParams);
                } else if (
                  CODEFIELD_KEYWORDS.find(keyword => entry[0].includes(keyword))
                ) {
                  return handleCodeField(entry, item, i, textFieldParams);
                } else if (typeof entry[1] === "object") {
                  return Object.entries(entry[1]).map(innerEntry => {
                    if (
                      SELECTFIELD_KEYWORDS.find(keyword =>
                        innerEntry[0].includes(keyword)
                      )
                    ) {
                      return handleSelectField(
                        innerEntry,
                        entry,
                        i,
                        textFieldParams
                      );
                    } else if (
                      innerEntry[0] === "body" &&
                      Object.keys(entry[1]).includes("method")
                    ) {
                      if (
                        entry[1].method === "PUT" ||
                        entry[1].method === "POST"
                      )
                        return handleTextField(
                          innerEntry,
                          entry,
                          i,
                          textFieldParams
                        );
                      else return null;
                    } else if (
                      TEXTFIELD_KEYWORDS.find(keyword =>
                        innerEntry[0].includes(keyword)
                      )
                    ) {
                      return handleTextField(
                        innerEntry,
                        entry,
                        i,
                        textFieldParams
                      );
                    } else if (innerEntry[0] === "headers") {
                      return handleKeyField(
                        innerEntry,
                        entry,
                        i,
                        textFieldParams
                      );
                    } else {
                      return (
                        <Col sm={6} key={`col-${innerEntry[0]}`}>
                          <Form.Group>
                            <Form.Label>{innerEntry[0]}</Form.Label>
                            <Form.Control
                              type="input"
                              onChange={e =>
                                props.handleInput(
                                  e.target.value,
                                  entry,
                                  innerEntry
                                )
                              }
                              value={innerEntry[1]}
                            />
                            <Form.Text className="text-muted">
                              {getDescriptionAndDefault(innerEntry[0])[0]}
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      );
                    }
                  });
                } else {
                  return (
                    <Col sm={6} key={`colDefault-${i}`}>
                      <Form.Group>
                        <Form.Label>{entry[0]}</Form.Label>
                        <Form.Control
                          type="input"
                          onChange={e =>
                            props.handleInput(e.target.value, item, entry)
                          }
                          value={entry[1]}
                        />
                        <Form.Text className="text-muted">
                          {getDescriptionAndDefault(entry[0])[0]}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  );
                }
              });
            }
            return null;
          })}
        </Row>
        <Row>{textFieldParams}</Row>
      </Form>
    </div>
  );
};

export default InputsTab;
