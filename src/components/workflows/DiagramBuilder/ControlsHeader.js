import React, {Component} from 'react'
import {Button, Col, Container, Dropdown, Form, InputGroup, Row} from "react-bootstrap";
import * as builderActions from "../../../store/actions/builder";
import {connect} from "react-redux";

class ControlsHeader extends Component {

    render() {
        return (
            <div className="header">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            <InputGroup style={{marginLeft: "-20px"}}>
                                <InputGroup.Append>
                                    <Form.Control value={this.props.query}
                                                  onChange={(e) => this.props.updateQuery(e.target.value)}
                                                  placeholder={`Search for ${this.props.category.toLowerCase()}.`} />
                                    <InputGroup.Text>
                                        <i className="fas fa-search"/>
                                    </InputGroup.Text>

                                    <Dropdown style={{marginLeft: "10px"}}>
                                        <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                            {this.props.category}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() => this.props.updateCategory(this.props.category === "Functional" ? "Workflows" : "Functional")}>
                                                {this.props.category === "Functional" ? "Workflows" : "Functional"}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup.Append>
                                <Button onClick={() => this.props.updateSidebar()} style={{marginLeft: "5%", borderRadius: "50%"}} variant="outline-light">
                                    {this.props.sidebarShown ? <i className="fas fa-chevron-left"/> : <i className="fas fa-chevron-right"/>}
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button style={{float: "right"}} variant="outline-light" onClick={this.props.createWf}>Create sample Wf</Button>
                            <Button style={{float: "right"}} variant="outline-light" onClick={this.props.executeWf}>Execute</Button>
                        </Col>
                    </Row>
                </Container>


            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        query: state.buildReducer.query,
        category: state.buildReducer.category,
        sidebarShown: state.buildReducer.sidebarShown
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateQuery: (query) => dispatch(builderActions.requestUpdateByQuery(query)),
        updateCategory: (category) => dispatch(builderActions.updateCategory(category)),
        updateSidebar: () => dispatch(builderActions.updateSidebar()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlsHeader)