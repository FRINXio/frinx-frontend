import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Panel from './panel/Panel';
import { faCogs, faTasks, faLaptopCode, faBoxOpen, faUsers} from '@fortawesome/free-solid-svg-icons';

class Dashboard extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Panel title='UniConfig' desc="Manage network device configurations."
                               icon={faLaptopCode} style={{background: 'linear-gradient'}} link='/devices'/>
                    </Col>
                    <Col>
                        <Panel title='Workflows' desc="Create, organize and execute workflows." icon={faCogs}
                               style={{background: 'linear-gradient'}} link='/workflows/defs' />
                    </Col>
                    <Col>
                        <Panel title='Tasks' desc="Manage tasks." icon={faTasks}
                               style={{background: 'linear-gradient'}} link='/tasks/defs'/>
                    </Col>
                    <Col>
                        <Panel title='Inventory & Logs' desc="Create, view and organize assets. View system logs." icon={faBoxOpen}
                               style={{background: 'linear-gradient'}} link="/inventory" />
                    </Col>
                </Row>
                <Row>
                    <Col/>
                    <Col/>
                    <Col/>
                    <Col>
                        <Panel disabled={true} title='User Managment' desc="Manage users and permissions."
                               icon={faUsers} style={{background: 'linear-gradient'}}/>
                    </Col>
                </Row>
            </Container>
        )}
}

export default Dashboard;