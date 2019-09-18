import React, {Component} from "react";
import SideMenu from "./SideMenu";
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
import {
    getFirstNode, getWfInputs,
    handleDecideNode,
    handleForkNode
} from "./builder-utils";
import {ForkNodeModel} from "./NodeModels/ForkNode/ForkNodeModel";
import {JoinNodeModel} from "./NodeModels/JoinNode/JoinNodeModel";
import {Toolkit} from "storm-react-diagrams";
import {DecisionNodeModel} from "./NodeModels/DecisionNode/DecisionNodeModel";

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
        document.addEventListener('dblclick', this.doubleClickListener.bind(this));

        http.get('/api/conductor/metadata/workflow').then(res => {
            this.props.storeWorkflows(res.result || [])
        });
        this.putDefaultsOnCanvas();
    }

    doubleClickListener(event) {
        let diagramEngine = this.state.app.getDiagramEngine();
        let diagramModel = diagramEngine.getDiagramModel();
        let element = Toolkit.closest(event.target, ".node[data-nodeid]");
        let node = null;

        if (element) {
            node = diagramModel.getNode(element.getAttribute("data-nodeid"));
            if (node && node.type !== "start" && node.type !== "end") {
                node.setSelected(false);
                this.setState({
                    showSubWfModal: true,
                    modalInputs: {inputs: node.extras.inputs, id: node.id}
                });
            }
        }
    }

    putDefaultsOnCanvas() {
        let diagramEngine = this.state.app.getDiagramEngine();
        let activeModel = diagramEngine.getDiagramModel();

        diagramEngine.setDiagramModel(activeModel);

        let start = new CircleStartNodeModel("Start");
        start.setPosition(900, 100);
        activeModel.addAll(start);
    }

    subwfModalHandler() {
        this.setState({
            showSubWfModal: !this.state.showSubWfModal
        })
    }

    saveNodeInputsHandler(savedInputs, id) {
        let nodes = this.state.app.getDiagramEngine().getDiagramModel().getNodes();

        _.values(nodes).forEach(node => {
            if (node.id === id) {
                node.extras.inputs = savedInputs;
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
                node = new CircleStartNodeModel(data.name);
                break;
            case "end":
                node = new CircleEndNodeModel(data.name);
                break;
            case "fork":
                node = new ForkNodeModel(data.wfObject.name, "rgb(108,49,160)", data.wfObject);
                break;
            case "join":
                node = new JoinNodeModel(data.wfObject.name, "rgb(108,49,160)", data.wfObject);
                break;
            case "decision":
                node = new DecisionNodeModel(data.wfObject.name, "rgb(108,49,160)", data.wfObject);
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

    parseDiagramToJSON() {
        try {
            let links = this.state.app.getDiagramEngine().getDiagramModel().getLinks();
            let parentNode = getFirstNode(links);
            let tasks = [];

            // handle regular/system nodes
            while (parentNode.type !== "end" ) {
                _.values(links).forEach(link => {
                    console.log("PARENT", parentNode);
                    console.log("link", link);
                    if (link.sourcePort.parent === parentNode) {
                        console.log("TARGET", link.targetPort.type);

                        switch (link.targetPort.type) {
                            case "fork":
                                let {forkNode, joinNode} = handleForkNode(link.targetPort.getNode());
                                tasks.push(forkNode.extras.inputs, joinNode.extras.inputs);
                                parentNode = joinNode;
                                break;
                            case "decision":
                                let {decideNode, firstNeutralNode} = handleDecideNode(link.targetPort.getNode());
                                tasks.push(decideNode.extras.inputs);
                                if (firstNeutralNode && firstNeutralNode.extras.inputs) {
                                    tasks.push(firstNeutralNode.extras.inputs);
                                    parentNode = firstNeutralNode;
                                }
                                break;
                            default:
                                parentNode = link.targetPort.parent;
                                tasks.push(parentNode.extras.inputs);
                                break;
                        }
                    }
                });
            }

            let finalWf = {...this.props.finalWorkflow};

            // handle input params
            if (Object.keys(getWfInputs(finalWf)).length < 1) {
                finalWf.inputParameters = [];
            }

            console.log("tasks",tasks)
            // handle tasks
            finalWf.tasks = tasks;

            this.props.updateFinalWorkflow(finalWf);

            return finalWf;
        } catch (e) {
            console.log("COULD NOT PARSE", e)
        }
    }

    render() {

        let subWfModal = this.state.showSubWfModal ?
            <SubwfModal modalHandler={this.subwfModalHandler.bind(this)} inputs={this.state.modalInputs}
                        saveInputs={this.saveNodeInputsHandler.bind(this)}/> : null;

        return (
            <div className="body">
                {subWfModal}
                <div className="builder-header"/>
                <ControlsHeader parseWftoJSON={this.parseDiagramToJSON.bind(this)} app={this.state.app}/>
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
        resetToDefaultWorkflow: () => dispatch(builderActions.resetToDefaultWorkflow()),
        updateSidebar: (isShown) => dispatch(builderActions.updateSidebar(isShown))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DiagramBuilder);
