import React, { Component } from 'react';
import {Button, Modal, Row, Col, Tab, Nav, InputGroup, FormControl, Table, Spinner} from "react-bootstrap";
import './DetailModal.css';

class DetailModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
            deviceDetails: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
            deviceDetails: nextProps.deviceDetails
        })
    }

    handleClose() {
        this.setState({
            show: false,
        });
        this.props.modalHandler();
    }

    render() {
        let device = this.state.deviceDetails || [];
        let commit_patterns = device['commit_patterns'] || [];
        let error_patterns = device['err_patterns'] || [];
        let a_cap = device['a_cap'] || [];
        let u_cap = device['u_cap'] || [];
        a_cap = a_cap['available-capability'] || [];
        u_cap = u_cap['unavailable-capability'] || [];
        error_patterns = error_patterns["error-pattern"] || [];

        return (
            <Modal size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Header>
                    <Modal.Title><i style={{color: this.state.deviceDetails.status === "connected" ? "#007bff" : "lightblue"}} className="fas fa-circle"/>
                        &nbsp;&nbsp;Details of {device.node_id} ({device.host})</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col sm={4}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">Basic</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Commit Patterns</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">Error Patterns</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fourth">Available Capabilities</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fifth">Unavailable Capabilities</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={7}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        {[["Node ID:","node_id"], ["Host:", "host"], ["Port:", "port"], ["Status:", "status"]]
                                            .map((label, i) => {
                                            return (
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id={`label${i}`}><b>{label[0]}</b></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    value={device[label[1]]}
                                                    readOnly
                                                />
                                            </InputGroup>
                                            )
                                        })}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <Table className="details-table" striped bordered hover >
                                            <thead><tr><th>Commit patterns</th></tr></thead>
                                            <tbody>
                                            {Object.values(commit_patterns).map(pattern => {
                                                return <tr><td>{pattern}</td></tr>
                                            })}
                                            </tbody>
                                        </Table>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                        <Table className="details-table" striped bordered hover >
                                            <thead><tr><th>Error patterns</th></tr></thead>
                                            <tbody>
                                            {error_patterns.map(pattern => {
                                                return <tr><td>{pattern}</td></tr>
                                            })}
                                            </tbody>
                                        </Table>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fourth" >
                                        <Table className="details-table" style={{display: "block"}} striped bordered hover >
                                            <thead><tr><th>Available capabilities</th></tr></thead>
                                            <tbody>
                                            {Object.values(a_cap).map(cap => {
                                             if(cap["capability"]){
                                                 return <tr><td>{cap["capability"]}</td></tr>
                                             } else {
                                                 return <tr><td>{cap}</td></tr>
                                             }
                                            })}
                                            </tbody>
                                        </Table>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fifth" >
                                        <Table className="details-table" style={{display: "block"}} striped bordered hover >
                                            <thead><tr><th>Unavailable capabilities</th></tr></thead>
                                            <tbody>
                                            {Object.values(u_cap).map(cap => {
                                                if(cap["capability"]){
                                                    return <tr><td>{cap["capability"]}</td></tr>
                                                } else {
                                                    return <tr><td>{cap}</td></tr>
                                                }
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