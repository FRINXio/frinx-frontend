import {CircleStartNodeModel} from "./NodeModels/StartNode/CircleStartNodeModel";
import {DefaultNodeModel} from "./NodeModels/DefaultNodeModel/DefaultNodeModel";
import {CircleEndNodeModel} from "./NodeModels/EndNode/CircleEndNodeModel";
import * as _ from "lodash";

export const getWfInputs = (wf) => {
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
};

export const createMountAndCheckExample = (app, props) => {
    let diagramEngine = app.getDiagramEngine();
    let activeModel = diagramEngine.getDiagramModel();

    diagramEngine.setDiagramModel(activeModel);

    let wf1 = {}, wf2 = {};
    props.workflows.forEach(wf => {
        if (wf.name === "Mount_cli_device") {
            wf1 = {
                name: "",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        } else if (wf.name === "Check_connection_cli_device") {
            wf2 = {
                name: "",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        }
    });

    let start = new CircleStartNodeModel("Start");
    let startPort = start.addOutPort("Out");
    start.setPosition(700, 100);

    let node1 = new DefaultNodeModel("Mount_cli_device","rgb(169,74,255)", wf1 );
    let node1InPort = node1.addInPort("In");
    let node1OutPort = node1.addOutPort("Out");
    node1.setPosition(700, 250);

    let node2 = new DefaultNodeModel("Check_connection_cli_device","rgb(169,74,255)", wf2 );
    let node2InPort = node2.addInPort("In");
    let node2OutPort = node2.addOutPort("Out");
    node2.setPosition(700, 350);

    let end = new CircleEndNodeModel("End");
    let endPort = end.addInPort("In");
    end.setPosition(700, 450);

    let link1 = startPort.link(node1InPort);
    let link2 = node1OutPort.link(node2InPort);
    let link3 = node2OutPort.link(endPort);

    activeModel.addAll(start, end, node1, node2, link1, link2, link3);

    return app.getDiagramEngine().getDiagramModel().getNodes();
};