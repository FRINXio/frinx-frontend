import React, {Component} from "react";
import { SideMenu } from "./SideMenu";
import {DiagramWidget} from "storm-react-diagrams";
import ControlsHeader from "./ControlsHeader";
import {Application} from "./Application";
import {CircleStartNodeModel} from "./NodeModels/StartNode/CircleStartNodeModel";
import {CircleEndNodeModel} from "./NodeModels/EndNode/CircleEndNodeModel";
import {DefaultNodeModel} from "./NodeModels/DefaultNodeModel/DefaultNodeModel";
import SubwfModal from "./SubwfModal/SubwfModal";

import * as _ from "lodash";

import './DiagramBuilder.css'
import * as builderActions from "../../../store/actions/builder";
import {connect} from "react-redux";
import {createMountAndCheckExample} from "./builder-utils";

const http = require('../../../server/HttpServerSide').HttpClient;

class DiagramBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSubWfModal: false,
            modalInputs: null,
            app: new Application()
        };
    }

    componentWillMount() {
        this.props.resetToDefaultWorkflow();
    }

    componentDidMount() {
        http.get('/api/conductor/metadata/workflow').then(res => {
            this.props.storeWorkflows(res.result)
        });
    }

    //mock
    createExampleWf() {
        let nodes = createMountAndCheckExample(this.state.app, this.props);

        _.values(nodes).forEach(node => {
            setTimeout(() => this.addEventListeners(node), 100);
        });

        this.forceUpdate();
    }

    subwfModalHandler() {
        this.setState({
            showSubWfModal: !this.state.showSubWfModal
        })
    }

    saveNodeInputsHandler(savedInputs) {
        let nodes = this.state.app.getDiagramEngine().getDiagramModel().getNodes();

        _.values(nodes).forEach(node => {
            if (node.name === savedInputs.subWorkflowParam.name) {
                node.inputs = savedInputs;
            }
        });
    }

    addEventListeners(node) {
        let nodeList = document.getElementsByClassName("srd-default-node__title");

        let doubleClick = () => {
            node.setSelected(false);
            this.setState({
                showSubWfModal: true,
                modalInputs: node.inputs
            });
        };

        //TODO handle duplicating of eventListeners of same nodes
        Array.from(nodeList).forEach(nodeElem => {
            if (node.name === nodeElem.textContent) {
                nodeElem.addEventListener('dblclick', doubleClick, false)
            }
        });
    }

    onDropHandler(e) {
        let data = JSON.parse(e.dataTransfer.getData("storm-diagram-node"));
        let node = null;

        switch (data.type) {
            case "in":
                node = new DefaultNodeModel(data.name, "rgb(192,255,0)", data.wfObject);
                node.addInPort("In");
                break;
            case "in/out":
                node = new DefaultNodeModel(data.name, "rgb(169,74,255)", data.wfObject);
                node.addInPort("In");
                node.addOutPort("Out");
                break;
            case "out":
                node = new DefaultNodeModel(data.name, "rgb(0,192,255)", data.wfObject);
                node.addOutPort("Out");
                break;
            case "start":
                node = new CircleStartNodeModel(data.name );
                node.addOutPort("Out");
                break;
            case "end":
                node = new CircleEndNodeModel(data.name );
                node.addInPort("In");
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
        setTimeout(() => this.addEventListeners(node), 100);
    }

    parseDiagramToJSON() {

        let links = this.state.app.getDiagramEngine().getDiagramModel().getLinks();
        let prevWf = null;
        let tasks = [];

        //find first
        _.values(links).forEach(link => {
            if (link.sourcePort.type === "start") {
                prevWf = link.targetPort.parent;
                tasks.push(link.targetPort.parent.inputs);

            }
        });

        //TODO fork, join, decide ...
        _.values(links).forEach(link => {
            if (link.sourcePort.parent === prevWf && link.targetPort.type !== "end") {
                prevWf = link.targetPort.parent;
                tasks.push(link.targetPort.parent.inputs);
            }
        });

        let finalWf = {...this.props.finalWorkflow};
        finalWf.tasks = tasks;
        this.props.updateFinalWorkflow(finalWf);

        return finalWf;
    }

    render() {

        let subWfModal = this.state.showSubWfModal ?
            <SubwfModal modalHandler={this.subwfModalHandler.bind(this)} inputs={this.state.modalInputs}
                        saveInputs={this.saveNodeInputsHandler.bind(this)}/> : null;

        return (
            <div className="body">
                {subWfModal}
                <div className="builder-header"/>
                <ControlsHeader parseWftoJSON={this.parseDiagramToJSON.bind(this)}
                                createWf={this.createExampleWf.bind(this)}/>
                <div className="content">
                    <SideMenu show={this.props.sidebarShown} category={this.props.category}
                              workflows={this.props.workflows} functional={this.props.functional}/>
                    <div
                        className="diagram-layer"
                        onDrop={(e) => this.onDropHandler(e)}
                        onDragOver={event => {
                            event.preventDefault();
                        }}>
                        <DiagramWidget className="srd-demo-canvas" smartRouting={this.props.smartRouting} diagramEngine={this.state.app.getDiagramEngine()} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        workflows: state.buildReducer.workflows,
        functional: state.buildReducer.functional,
        sidebarShown: state.buildReducer.sidebarShown,
        category: state.buildReducer.category,
        finalWorkflow: state.buildReducer.finalWorkflow,
        smartRouting: state.buildReducer.switchSmartRouting
    }
};

const mapDispatchToProps = dispatch => {
    return {
        storeWorkflows: (wfList) => dispatch(builderActions.storeWorkflows(wfList)),
        updateFinalWorkflow: (finalWorkflow) => dispatch(builderActions.updateFinalWorkflow(finalWorkflow)),
        resetToDefaultWorkflow: () => dispatch(builderActions.resetToDefaultWorkflow())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DiagramBuilder);