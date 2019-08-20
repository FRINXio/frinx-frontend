import React, { Component } from 'react';
import {Modal, Button, Form, Tab, Tabs} from "react-bootstrap";
import DefaultsDescsTab from "./DefaultsDescsTab";
import OutputParamsTab from "./OutputParamsTab";
import GeneralParamsTab from "./GeneralParamsTab";

class GeneralInfoModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            show: true,
            finalWf: this.props.definition
        };
    }

    handleClose() {
        this.setState({show: false});
        this.props.modalHandler()
    }

    handleSave() {
        this.setState({show: false});
        this.props.saveInputs(this.state.finalWf);
        this.props.lockWorkflowName();
        this.props.modalHandler()
    }

    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            this.handleSave();
        }
    };

    handleInput(e, entry) {
        let finalWf = {...this.state.finalWf};

        finalWf = {
            ...finalWf,
            [entry[0]]: e.target.value
        };

        this.setState({
            finalWf: finalWf
        });
    }

    handleOutputParam(e, entry) {
        let finalWf = {...this.state.finalWf};
        let outputParameters = finalWf.outputParameters;

        finalWf = {
            ...finalWf,
            outputParameters: {
                ...outputParameters,
                [entry[0]]: e.target.value
            }
        };

        this.setState({
            finalWf: finalWf
        });
    }

    handleCustomParam(param) {
        let finalWf = {...this.state.finalWf};
        let outputParameters = finalWf.outputParameters;

        finalWf = {
            ...finalWf,
            outputParameters: {
                ...outputParameters,
                [param]: "provide path"
            }
        };

        this.setState({
            finalWf: finalWf,
        });
    }

    handleCustomDefault(param, defaultValue, description) {
        let finalWf = {...this.state.finalWf};
        let inputParameters = finalWf.inputParameters || [];
        // eslint-disable-next-line no-useless-concat
        let entry = `${param}` + `[${description}]` + `[${defaultValue}]`;
        let isUnique = true;

        if (inputParameters.length > 0) {
            inputParameters.forEach((elem, i) => {
                if (elem.startsWith(param)) {
                    inputParameters[i] = entry;
                    return isUnique = false;
                }
            });
        }

        if (isUnique) {
            inputParameters.push(entry);
        }

        finalWf = {...finalWf, inputParameters};

        this.setState({
            finalWf: finalWf,
        });
    }

    render() {
        let isNameLocked = this.props.isWfNameLocked;

        return (
            <Modal size="lg" show={this.state.show} onHide={isNameLocked ? this.handleClose : () => false}>
                <Modal.Header>
                    <Modal.Title>{isNameLocked ? "Edit general informations" : "Create new workflow"}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "30px"}}>
                    <Form onSubmit={this.handleSubmit}>
                        <Tabs style={{marginBottom: "20px"}}>
                            <Tab eventKey={1} title="General">
                                <GeneralParamsTab finalWf={this.state.finalWf} handleInput={this.handleInput}
                                                  isWfNameLocked={isNameLocked}/>
                            </Tab>
                            <Tab eventKey={2} title="Output parameters">
                                <OutputParamsTab finalWf={this.state.finalWf} handleSubmit={this.handleSubmit}
                                                 handleOutputParam={this.handleOutputParam.bind(this)}
                                                 handleCustomParam={this.handleCustomParam.bind(this)}/>
                            </Tab>
                            <Tab eventKey={3} title="Defaults & description">
                                <DefaultsDescsTab finalWf={this.state.finalWf}
                                                  handleCustomDefault={this.handleCustomDefault.bind(this)}/>
                            </Tab>
                        </Tabs>
                        <Button type="submit" style={{width: "100%", marginTop: "20px"}} variant="primary">Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default GeneralInfoModal;
