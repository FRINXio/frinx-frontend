import React from 'react';
import {Container, Tab, Tabs} from 'react-bootstrap'
import WorkflowDefs from "./WorkflowDefs/WorkflowDefs";
import WorkflowExec from "./WorkflowExec/WorkflowExec";

const workflowList = () => (
    <Container style={{textAlign: "left", marginTop: "20px"}}>
        <h1 style={{marginBottom: "20px"}}><i style={{color: 'grey'}} className="fas fa-cogs"/>&nbsp;&nbsp;Workflows
        </h1>
        <Tabs defaultActiveKey="definitions" style={{marginBottom: "20px"}}>
            <Tab eventKey="definitions" title="Definitions">
                <WorkflowDefs/>
            </Tab>
            <Tab mountOnEnter eventKey="executed" title="Executed">
                <WorkflowExec/>
            </Tab>
            <Tab eventKey="contact" title="Scheduled" disabled>
            </Tab>
        </Tabs>
    </Container>
);

export default workflowList
