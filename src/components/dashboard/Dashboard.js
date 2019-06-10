import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Panel from './panel/Panel';
import { faBookOpen, faCogs, faTasks, faLaptopCode, faBoxOpen, faUsers, faLayerGroup} from '@fortawesome/free-solid-svg-icons';

class Dashboard extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Panel title='Services' desc="Browse and execute services." icon={faBookOpen}
                               style={{background: 'linear-gradient'}}/>
                    </Col>
                    <Col>
                        <Panel title='Workflows' desc="Create, organize and execute workflows." icon={faCogs}
                               style={{background: 'linear-gradient'}}/>
                    </Col>
                    <Col>
                        <Panel title='Tasks' desc="Manage tasks." icon={faTasks}
                               style={{background: 'linear-gradient'}} link='/tasks'/>
                    </Col>
                    <Col>
                        <Panel title='UniConfig UI' desc="Manage network device configurations."
                               icon={faLaptopCode} style={{background: 'linear-gradient'}} link='/devices'/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Panel title='Inventory' desc="Create, view and organize assets." icon={faBoxOpen}
                               style={{background: 'linear-gradient'}} />
                    </Col>
                    <Col>
                        <Panel title='Logs' desc="View system logs." icon={faLayerGroup}
                               style={{background: 'linear-gradient'}} />
                    </Col>
                    <Col>
                        <Panel disabled={true} title='User Managment' desc="Manage users and permissions."
                               icon={faUsers} style={{background: 'linear-gradient'}}/>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        )}
}

export default Dashboard;