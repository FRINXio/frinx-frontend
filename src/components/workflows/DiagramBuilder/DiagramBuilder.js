import React, {Component} from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
import WidgetHeader from "./WidgetHeader";
import {Application} from "./Application";

import './style.css'
import './DiagramBuilder.css'

const http = require('../../../server/HttpServerSide').HttpClient;

class DiagramBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wfs: [],
            app: new Application()
        };
    }

    componentDidMount() {
        http.get('/api/conductor/metadata/workflow').then(res => {
            this.setState({
                wfs: res.result || []
            })
        })
    }

    getWfInputs(wf) {
        let taskArray = wf.tasks;
        let inputParams = [];
        let inputParameters = {};

        taskArray.forEach(task => {
            if (task !== undefined) {
                if (task.inputParameters) {
                    inputParams.push(task.inputParameters)
                }
            }
        });

        for (let i = 0; i < inputParams.length; i++) {
            inputParameters = {...inputParameters, ...inputParams[i]}
        }

        return inputParameters;
    }

    renderWfList() {
        let wfList = [];

        this.state.wfs.map((wf, i) => {

            let wfObject = {
                name: "",
                taskReferenceName: "",
                inputParameters: this.getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false

            };

            return (
                wfList.push(<TrayItemWidget id={`wf${i}`}
                                            model={{type: "in/out", wfObject, name: wf.name}}
                                            name={wf.name} color="#0095FF"/>)
            )
        });
        return wfList;
    }

    onDropHandler(e) {
        let data = JSON.parse(e.dataTransfer.getData("storm-diagram-node"));
        let node = null;
        console.log(data);

        switch (data.type) {
            case "in":
                node = new DefaultNodeModel(data.name, "rgb(192,255,0)");
                node.addInPort("In");
                break;
            case "in/out":
                node = new DefaultNodeModel(data.name, "rgb(169,74,255)");
                node.addInPort("In");
                node.addOutPort("Out");
                break;
            case "out":
                node = new DefaultNodeModel(data.name, "rgb(0,192,255)");
                node.addOutPort("Out");
                break;
            default:
                break
        }

        let points = this.state.app.getDiagramEngine().getRelativeMousePoint(e);
        node.x = points.x;
        node.y = points.y;
        this.state.app
            .getDiagramEngine()
            .getDiagramModel()
            .addNode(node);
        this.forceUpdate();
    }

    render() {
        return (
            <div className="body">
                <div className="builder-header"/>
                <WidgetHeader/>
                <div className="content">
                    <TrayWidget>
                        {this.renderWfList()}
                    </TrayWidget>
                    <div
                        className="diagram-layer"
                        onDrop={(e) => this.onDropHandler(e)}
                        onDragOver={event => {
                            event.preventDefault();
                        }}>
                        <DiagramWidget className="srd-demo-canvas" diagramEngine={this.state.app.getDiagramEngine()} />
                    </div>
                </div>
            </div>
        );
    }
}

export default DiagramBuilder;