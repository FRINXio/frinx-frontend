import React, { Component } from 'react';
import {Container, Button, Row, Col, Form, Badge, } from 'react-bootstrap'
import './Editor.css'
import 'codemirror/lib/codemirror.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faNetworkWired, faExchangeAlt, faSave, faSync, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'

class Editor extends Component {
    constructor(props) {
        super(props);
        library.add(faFolderPlus, faNetworkWired, faArrowLeft);
        this.state= {
            leftEditor: '',
            rightEditor: ''
        }
    }

    redirect(where) {
        window.location.href = where;
    }

    render(){
        return(
            <div className='editorWrap'>
            <header className="options">
            <Button className="round floating-btn noshadow" onClick={() => {this.redirect(window.location.protocol + "//" + window.location.href.split('/')[2])}} variant="outline-light"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <Container>
                    <Row>
                        <Col className="child">
                            <Form.Group className="leftGroup">
                            <Form.Control className="snapshotInput" placeholder="Choose a snapshot" type="text"></Form.Control>
                            <Button className="snapshotButton" variant="outline-light"><FontAwesomeIcon icon={faFolderPlus} /> Create snapshot</Button>
                            </Form.Group>
                        </Col>
                        <Col className="child">
                            <Form.Group className="rightGroup">
                            <Button variant="outline-light"><FontAwesomeIcon icon={faNetworkWired} /> Commit to network</Button>
                            <Button variant="outline-light"><FontAwesomeIcon icon={faExchangeAlt} /> Show diff {this.props.datasetId} </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
            </header>
            <Container className="margined-top">
                
                <Row>
                    <Col className="leftAligned">
                        <h4>Config <Badge variant="danger">Edited</Badge></h4>
                    </Col>
                    <Col className="rightAligned">
                        <Button variant="outline-primary">Refresh</Button>
                        <Button><FontAwesomeIcon icon={faSave} /> Save</Button>
                    </Col>
                    <Col className="leftAligned">
                        <h4>Operational</h4>
                    </Col>
                    <Col className="rightAligned">
                        <Button variant="outline-primary">Refresh</Button>
                        <Button><FontAwesomeIcon icon={faSync} /> Sync w/ network</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <CodeMirror className="editor" value={this.state.leftEditor} options={{lineNumbers: true, direction: 'ltr', lineWrapping: true, mode:{name: 'javascript', json: true}}} />
                        </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                            <CodeMirror className="editor" value={this.state.rightEditor} options={{lineNumbers: true, direction: 'ltr', lineWrapping: true, mode:{name: 'javascript', json: true}}} /> 
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            </div>
        )
    }
}

export default Editor