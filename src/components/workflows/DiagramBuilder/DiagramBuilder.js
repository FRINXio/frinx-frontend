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
    getEndNode,
    getStartNode,
    getWfInputs,
    handleDecideNode,
    handleForkNode
} from "./builder-utils";
import {ForkNodeModel} from "./NodeModels/ForkNode/ForkNodeModel";
import {JoinNodeModel} from "./NodeModels/JoinNode/JoinNodeModel";
import {Toolkit} from "storm-react-diagrams";
import {DecisionNodeModel} from "./NodeModels/DecisionNode/DecisionNodeModel";
import CustomAlert from "./CustomAlert";

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
        this.props.showCustomAlert(true, "primary", "Start to drag & drop tasks from left menu on canvas.")
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
        let end = new CircleEndNodeModel("End");

        start.setPosition(900, 100);
        end.setPosition(1200, 100);
        activeModel.addAll(start, end);
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

        this.props.showCustomAlert(false)

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
            let parentNode = getStartNode(links);
            let endNode = getEndNode(links);
            let linksArray = _.values(links);
            let tasks = [];

            this.props.showCustomAlert(false);

            if (!parentNode) {
                return this.props.showCustomAlert(true, "danger", "Start node is not connected.");
            }
            if (!endNode) {
                return this.props.showCustomAlert(true, "danger", "End node is not connected.");
            }

            while (parentNode.type !== "end") {
                for (let i = 0; i < linksArray.length; i++) {
                    let link = linksArray[i];

                    if (link.sourcePort.parent === parentNode) {
                        switch (link.targetPort.type) {
                            case "fork":
                                let {forkNode, joinNode} = handleForkNode(link.targetPort.getNode());
                                tasks.push(forkNode.extras.inputs, joinNode.extras.inputs);
                                parentNode = joinNode;
                                break;
                            case "decision":
                                let {decideNode, firstNeutralNode} = handleDecideNode(link.targetPort.getNode());
                                tasks.push(decideNode.extras.inputs);
                                if (firstNeutralNode) {
                                    if (firstNeutralNode.extras.inputs) {
                                        tasks.push(firstNeutralNode.extras.inputs);
                                    }
                                    parentNode = firstNeutralNode;
                                } else {
                                    return this.props.showCustomAlert(true, "danger", "Default decision route is missing.");
                                }
                                break;
                            case "end":
                                parentNode = link.targetPort.parent;
                                break;
                            default:
                                parentNode = link.targetPort.parent;
                                tasks.push(parentNode.extras.inputs);
                                break;
                        }
                    }
                }
            }

            let finalWf = {...this.props.finalWorkflow};

            // handle input params
            if (Object.keys(getWfInputs(finalWf)).length < 1) {
                finalWf.inputParameters = [];
            }

            // handle tasks
            finalWf.tasks = tasks;

            this.props.updateFinalWorkflow(finalWf);

            return finalWf;
        } catch (e) {
            return this.props.showCustomAlert(true, "danger", "Could not parse JSON.");
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

                    <CustomAlert showCustomAlert={this.props.showCustomAlert} show={this.props.customAlert.show}
                                 msg={this.props.customAlert.msg} alertVariant={this.props.customAlert.variant}/>

                    <div
                        className="diagram-layer"
                        onDrop={(e) => this.onDropHandler(e)}
                        onDragOver={event => {
                            event.preventDefault();
                        }}>

                        <DiagramWidget className="srd-demo-canvas" smartRouting={this.props.smartRouting}
                                       diagramEngine={this.state.app.getDiagramEngine()}/>
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
        smartRouting: state.buildReducer.switchSmartRouting,
        customAlert: state.buildReducer.customAlert
    }
};

const mapDispatchToProps = dispatch => {
    return {
        storeWorkflows: (wfList) => dispatch(builderActions.storeWorkflows(wfList)),
        updateFinalWorkflow: (finalWorkflow) => dispatch(builderActions.updateFinalWorkflow(finalWorkflow)),
        resetToDefaultWorkflow: () => dispatch(builderActions.resetToDefaultWorkflow()),
        updateSidebar: (isShown) => dispatch(builderActions.updateSidebar(isShown)),
        showCustomAlert: (show, variant, msg) => dispatch(builderActions.showCustomAlert(show, variant, msg))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DiagramBuilder);
