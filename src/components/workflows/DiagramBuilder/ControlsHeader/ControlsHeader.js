import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Nav, Navbar} from "react-bootstrap";
import "./ControlsHeader.css"

const ControlsHeader = (props) => {
    const [sideMenu, showSideMenu] = useState(true);

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

    const openCloseSideMenu = () => {
        if (sideMenu) {
            document.getElementsByClassName("tray")[0].style.width = "0";
        } else {
            document.getElementsByClassName("tray")[0].style.width = "370px";
        }
        showSideMenu(!sideMenu);
    };

    const openFileUpload = () => {
        document.getElementById('upload-file').click();
        document.getElementById('upload-file').addEventListener('change', props.submitFile);
    };

    return (
        <Navbar id="controls-header" style={{backgroundColor: "#0087e9", border: "0.01em solid rgba(0, 0, 0, 0.17)", zIndex: 15}}
                variant="dark" expand="lg">
                    <Navbar.Brand>
                        <i className="fas fa-bars clickable" style={{marginRight: "30px"}}
                        onClick={() => openCloseSideMenu()}/>
                        Workflow Builder
                    </Navbar.Brand>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={props.saveWorkflow}>Save</Nav.Link>
                            <Nav.Link onClick={openFileUpload}>Import</Nav.Link>
                            <input id='upload-file' type='file' hidden/>
                            <Nav.Link onClick={props.saveFile}>Export</Nav.Link>
                            <Nav.Link onClick={props.clearCanvas}>Clear</Nav.Link>
                            <hr/>
                            <Nav.Link onClick={props.showExitModal}>Exit</Nav.Link>
                        </Nav>
                        <Nav>
                            <ButtonGroup>
                                <Button id="expand" variant="outline-light"
                                        onClick={props.expandNodeToWorkflow}>
                                    <i className="fas fa-expand"/>&nbsp;&nbsp;Expand</Button>
                                <Button variant="outline-light" onClick={props.saveAndExecute}>
                                    <i className="fas fa-play-circle"/>&nbsp;&nbsp;Execute</Button>
                                <Button variant="outline-light" onClick={props.showGeneralInfoModal}>
                                    <i className="fas fa-edit"/>&nbsp;&nbsp;Edit general</Button>
                                <Button variant="outline-light" onClick={props.showDefinitionModal}>
                                    <i className="fas fa-file-code"/>&nbsp;&nbsp;Definition</Button>
                            </ButtonGroup>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
    )
};

export default ControlsHeader
