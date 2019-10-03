import React, {useEffect} from 'react';
import {Button, ButtonGroup, Col, Container, Form, InputGroup, Row} from "react-bootstrap";

const ControlsHeader = (props) => {
    useEffect(() => {
        document.addEventListener('click', handleClickInside, true);
        return () => {
            document.removeEventListener('click', handleClickInside, true);
            props.updateQuery("")
        }
    }, []);

    const handleClickInside = (event) => {
        const headerEl = document.getElementById("controls-header");
        const expandBtn = document.getElementById("expand");

        // workaround to prevent deleting nodes while typing
        if (headerEl && headerEl.contains(event.target) && !expandBtn.contains(event.target)) {
            props.app.getDiagramEngine().getDiagramModel().clearSelection();
            setTimeout(() => props.app.getDiagramEngine().repaintCanvas(), 10);
        }
    };

    return (
        <div id="controls-header" className="header">
            <Container fluid>
                <Row>
                    <InputGroup style={{width: "490px", marginLeft: "-5px"}}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="clickable"
                                             onClick={() => props.updateSidebar(!props.sidebarShown)}>
                                {props.sidebarShown ? <i className="fas fa-chevron-left"/> :
                                    <i className="fas fa-chevron-right"/>}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control value={props.query}
                                      onChange={(e) => props.updateQuery(e.target.value)}
                                      placeholder={`Search for ${props.category.toLowerCase()}.`}/>
                        <InputGroup.Append>
                            <InputGroup.Text>
                                <i className="fas fa-search"/>&nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="fas fa-chevron-down clickable"
                                   onClick={() => props.updateCategory(props.category === "Functional" ? "Workflows" : "Functional")}/>
                            </InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <Col md>
                        <div className="right-controls">
                            <ButtonGroup>
                                <Button id="expand" variant="outline-light"
                                        onClick={props.expandNodeToWorkflow}>
                                    <i className="fas fa-expand"/>&nbsp;&nbsp;Expand</Button>
                                <Button variant="outline-light" onClick={props.saveAndExecute}>
                                    <i className="fas fa-save"/>&nbsp;&nbsp;Save & Execute</Button>
                                <Button variant="outline-light" onClick={props.showGeneralInfoModal}>
                                    <i className="fas fa-edit"/>&nbsp;&nbsp;Edit general</Button>
                                <Button variant="outline-light" onClick={props.showDefinitionModal}>
                                    <i className="fas fa-file-code"/>&nbsp;&nbsp;Def</Button>
                                <Button variant="outline-light" onClick={props.showExitModal}>
                                    <i className="fas fa-door-open"/></Button>
                            </ButtonGroup>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};

export default ControlsHeader
