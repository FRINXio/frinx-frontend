import * as SRD from "storm-react-diagrams";
import {SimplePortFactory} from "./NodeModels/SimplePortFactory";
import {CircleStartPortModel} from "./NodeModels/StartNode/CircleStartPortModel";
import {CircleStartNodeFactory} from "./NodeModels/StartNode/CircleStartNodeFactory";
import {CircleEndPortModel} from "./NodeModels/EndNode/CircleEndPortModel";
import {CircleEndNodeFactory} from "./NodeModels/EndNode/CircleEndNodeFactory";
import {ForkNodeFactory} from "./NodeModels/ForkNode/ForkNodeFactory";
import {ForkNodePortModel} from "./NodeModels/ForkNode/ForkNodePortModel";

export class Application {

    activeModel: SRD.DiagramModel;
    diagramEngine: SRD.DiagramEngine;

    constructor() {
        this.diagramEngine = new SRD.DiagramEngine();
        this.diagramEngine.installDefaultFactories();

        this.diagramEngine.registerPortFactory(new SimplePortFactory("start", config => new CircleStartPortModel()));
        this.diagramEngine.registerPortFactory(new SimplePortFactory("end", config => new CircleEndPortModel()));
        this.diagramEngine.registerPortFactory(new SimplePortFactory("fork", config => new ForkNodePortModel()));

        this.diagramEngine.registerNodeFactory(new CircleStartNodeFactory());
        this.diagramEngine.registerNodeFactory(new CircleEndNodeFactory());
        this.diagramEngine.registerNodeFactory(new ForkNodeFactory());
    }

    getActiveDiagram(): SRD.DiagramModel {
        return this.activeModel;
    }

    getDiagramEngine(): SRD.DiagramEngine {
        return this.diagramEngine;
    }
}
