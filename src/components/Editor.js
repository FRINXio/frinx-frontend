import React, { Component } from 'react';
import {Container, Button, Row, Col, Form, Badge, } from 'react-bootstrap'
import './Editor.css'
import 'codemirror/lib/codemirror.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faNetworkWired, faExchangeAlt, faSave, faSync, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import 'codemirror/mode/javascript/javascript'
import {CONFIG, OPER} from "./constants";
import UniConfig from "./UniConfig";

class Editor extends Component {
    constructor(props) {
        super(props);
        library.add(faFolderPlus, faNetworkWired, faArrowLeft);
        this.state= {
            leftEditor: '',
            rightEditor: '',
        }
    }

    redirect(where) {
        window.location.href = where;
    }

    componentDidMount() {
        //pass device name cmp will mount
        fetch(CONFIG)
            .then(response => response.text())
            .then(leftEditor =>  this.setState({leftEditor}));

        fetch(OPER)
            .then(response => response.text())
            .then(rightEditor => this.setState({rightEditor}));



    }

    render(){

        console.log(this.state.leftEditor);
        return(
            <div className='editorWrap'>
            <header className="options">
            <Button className="round floating-btn noshadow" onClick={() => {this.redirect(window.location.protocol + "//" + window.location.href.split('/')[2])}} variant="outline-light"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <Container>
                    <Row>
                        <Col className="child">
                            <Form.Group className="leftAligned">
                            <Form.Control className="snapshotInput" placeholder="Choose a snapshot" type="text"></Form.Control>
                            <Button className="snapshotButton" variant="outline-light"><FontAwesomeIcon icon={faFolderPlus} /> Create snapshot</Button>
                            </Form.Group>
                        </Col>
                        <Col className="child">
                            <Form.Group className="rightAligned">
                            <Button variant="outline-light"><FontAwesomeIcon icon={faNetworkWired} /> Commit to network</Button>
                            <Button variant="outline-light"><FontAwesomeIcon icon={faExchangeAlt} /> Show diff</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
            </header>
            <Container className="margined-top">
                <div className="editor">
                    <UniConfig/>
                </div>
            </Container>
            </div>
        )
    }
}

export default Editor