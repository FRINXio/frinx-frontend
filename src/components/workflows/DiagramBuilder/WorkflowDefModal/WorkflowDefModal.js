import React, { Component } from 'react';
import {Modal, Button, ButtonGroup} from "react-bootstrap";
import Highlight from "react-highlight.js";

class WorkflowDefModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: true,
            def: JSON.stringify(this.props.definition, null, 2) || "{}"
        };
        this.handleClose = this.handleClose.bind(this);
        this.openFileUpload = this.openFileUpload.bind(this)
    }

    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler()
    }

    openFileUpload() {
        document.getElementById('upload-file').click();
        document.getElementById('upload-file').addEventListener('change', this.submitFile.bind(this));
    }

    encode(s) {
        let out = [];
        for ( let i = 0; i < s.length; i++ ) {
            out[i] = s.charCodeAt(i);
        }
        return new Uint8Array(out);
    }

    saveFile() {
        let data = this.encode(this.state.def);
        let blob = new Blob([data], {
            type: 'application/octet-stream'
        });

        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', this.props.definition.name + '.json');

        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }

    submitFile() {
        const fileToLoad = document.getElementById("upload-file").files[0];
        const fileReader = new FileReader();

        fileReader.onload = (() => {
            return function (e) {
                try {
                    let jsonObj = JSON.parse(e.target.result);
                    this.props.renderSelectedWorkflow(jsonObj);
                    this.handleClose()
                } catch (err) {
                    alert('Error when trying to parse json.' + err);
                }
            }
        })(fileToLoad).bind(this);
       fileReader.readAsText(fileToLoad);
    }

    render() {
        return (
            <Modal size="xl" show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Workflow Definition</Modal.Title>
                    <ButtonGroup size="sm">
                        <Button variant="outline-primary" onClick={this.openFileUpload}>
                            <i className="fas fa-file-import"/>&nbsp;&nbsp;Import
                        </Button>
                        <Button id='export-file' variant="outline-primary" onClick={this.saveFile.bind(this)}>
                            <i className="fas fa-file-export"/>&nbsp;&nbsp;Export
                        </Button>
                    </ButtonGroup>
                    <input id='upload-file' type='file' hidden/>
                </Modal.Header>
                <code style={{fontSize: "18px"}}>
                    <pre style={{maxHeight: "600px"}}>
                        <Highlight language="json">
                            {this.state.def}
                        </Highlight>
                    </pre>
                </code>
            </Modal>
        );
    }
}

export default WorkflowDefModal;
