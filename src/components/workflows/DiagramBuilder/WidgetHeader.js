import React, {Component} from 'react'
import {Col, Container, Dropdown, FormControl, InputGroup, Row} from "react-bootstrap";

class WidgetHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="header">
                <Container fluid>
                    <Row>
                        <Col sm={3}>
                            <InputGroup style={{marginLeft: "-20px"}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <i className="fas fa-search"/>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <InputGroup.Append>
                                    <FormControl placeholder="Search for workflows"/>
                                    <Dropdown style={{marginLeft: "15px"}}>
                                        <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                            Workflows
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Functional</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>


            </div>
        )
    }
}

export default WidgetHeader