import * as SRD from "storm-react-diagrams";
import {SimplePortFactory} from "./NodeModels/SimplePortFactory";
import {CirclePortModel} from "./NodeModels/StartEndNode/CirclePortModel";
import {CircleNodeFactory} from "./NodeModels/StartEndNode/CircleNodeFactory";
import {CircleNodeModel} from "./NodeModels/StartEndNode/CircleNodeModel";

export class Application {

    activeModel: SRD.DiagramModel;
    diagramEngine: SRD.DiagramEngine;

    constructor() {
        this.diagramEngine = new SRD.DiagramEngine();
        this.diagramEngine.installDefaultFactories();

        this.diagramEngine.registerPortFactory(new SimplePortFactory("circle", config => new CirclePortModel()));
        this.diagramEngine.registerNodeFactory(new CircleNodeFactory("Start"));

        this.newModel();
    }

    newModel() {
        this.activeModel = new SRD.DiagramModel();
        this.diagramEngine.setDiagramModel(this.activeModel);

        //3-A) create a default node
        var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
        let port = node1.addOutPort("Out");
        node1.setPosition(100, 100);

        //3-B) create another default node
        var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
        let port2 = node2.addInPort("In");
        node2.setPosition(400, 100);

        var node3 = new CircleNodeModel("Node 4");
        node3.addOutPort("Out")
        node3.setPosition(150, 150);

        // link the ports
        let link1 = port.link(port2);

        this.activeModel.addAll(node1, node2, node3, link1);
    }

    getActiveDiagram(): SRD.DiagramModel {
        return this.activeModel;
    }

    getDiagramEngine(): SRD.DiagramEngine {
        return this.diagramEngine;
    }
}