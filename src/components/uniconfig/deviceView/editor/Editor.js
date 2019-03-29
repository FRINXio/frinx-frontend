import React, { Component } from 'react';
import {Button } from 'react-bootstrap';
import '../../../../../node_modules/react-gh-like-diff/lib/diff2html.css'

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingJSON: false,
            modified: false,
            updatedJSON: {},
            wfs: this.convertToString(this.props.wfs),
            isNotParsable: false,
        };
        this.editJSONswitch = this.editJSONswitch.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            wfs: this.convertToString(nextProps.wfs)
        })
    }

    convertToString(object) {
        object = this.updateObject(object, "\r\n");
        this.setState({
            updatedJSON: object
        });
        return JSON.stringify(object, null, 2);
    }

    updateObject(object, search) {
        if (object) {
            Object.keys(object).forEach((k) => {
                if (object[k] && typeof object[k] === 'object') {
                    return this.updateObject(object[k], search)
                }
                if (typeof object[k] === 'string') {
                    if (object[k].includes(search)) {
                        object[k] = "<span class='editable-string' title='Click to edit'/" + object[k] + '>';
                    }
                }
            });
            return object;
        }
    }

    editJSONswitch(e, which) {
        let parseErr = null;
        this.setState({
            isNotParsable: false
        });
        if(which === 1) {
            if(this.state.editingJSON) {
                try {
                    JSON.parse(this.editor.innerText);
                } catch(e) {
                    parseErr = e;
                }
                if(parseErr == null) {
                    this.setState({wfs: this.editor.innerText});
                    let toBeSent = JSON.parse(this.editor.innerText);

                    this.props.getEditedConfig(toBeSent);
                } else {
                    this.setState({isNotParsable : true});
                }
            } else {
               this.editor.focus();
            }
        } else {
            this.editor.innerHTML = this.state.wfs;
        }
        if(parseErr == null) {
            this.setState({
                editingJSON: !this.state.editingJSON
            });
        }
    }

    onClick(e) {
        var element = e.target;
        if (element.className === 'editable-string') {
            this.openPopup(element);
        }
    }

    onKeyPress(e) {
        this.checkIfModified();
    }

    checkIfModified() {
        var current = this.editor.innerHTML.replace(/"/g, "'");
        var original = this.state.wfs.replace(/"/g, "'");

        if (current === original) {
            this.setState({modified: false})
        } else {
            this.setState({modified: true})
        }
    }

    renderButtons = () => (
        <div>
            <h2 style={{display: "inline-block", marginTop: "5px"}}>{this.props.title}</h2>
            <div style={{float: "right"}}>
                <Button className="btn btn-light" onClick={(e) => this.editJSONswitch(e, 2)}
                        style={{display: this.state.editingJSON ? 'inline-block' : 'none'}}>
                    Cancel
                </Button>
                <Button className="btn btn-primary" onClick={(e) => this.editJSONswitch(e, 1)}
                        style={{marginLeft: '5px'}}>
                    {this.state.editingJSON ? <i className="fas fa-save"/> : <i className="fas fa-pen"/> }
                    &nbsp;&nbsp;{this.state.editingJSON ? 'Save' : 'Edit'}
                </Button>
                <Button className="btn btn-light" onClick={() => this.props.refreshConfig()}
                        style={{marginLeft: '5px'}}>
                    Refresh
                </Button>
            </div>
        </div>
    );


    render() {
        return(
            <div>

                {this.props.editable ? this.renderButtons() : null}

                        <div className="d2h-file-header">
                            <span className="d2h-file-name-wrapper">
                                <i className="fas fa-file-alt"/>
                                <span>&nbsp;&nbsp;Datastore of IOS-XR</span>
                                <span className="d2h-tag d2h-changed d2h-changed-tag"
                                      style={{ display: this.state.modified ? 'inline-block' : 'none' }}>MODIFIED</span>
                                <div style={{marginLeft: "10px", display: this.state.isNotParsable ? "block" : "none"}}
                                     className="alert-warning" role="alert">{this.state.isNotParsable ? "Could not parse JSON. Is the syntax correct?" : ""}
                                </div>
                            </span>
                        </div>

                        <pre id="editorWrapper" ref={elem => this.editor = elem}
                                 className={this.state.editingJSON ? 'editingPre' : ''}
                                 contentEditable={this.state.editingJSON}
                                 dangerouslySetInnerHTML= {{ __html: this.state.wfs }}
                                 onClick={this.onClick.bind(this)}
                                 onKeyUp={this.onKeyPress.bind(this)}>
                        </pre>
            </div>
        )
    };
}

export default Editor;