import { NodeModel } from "storm-react-diagrams";
import * as _ from "lodash";
import {DefaultPortModel} from "storm-react-diagrams";
import {DiagramEngine} from "storm-react-diagrams";
import {DecisionNodePortModel} from "./DecisionNodePortModel";

export class DecisionNodeModel extends NodeModel {

    name: string;
    color: string;
    ports: { [s: string]: DefaultPortModel };
    inputs: {};

    constructor(name: string = "Untitled", color: string = "rgb(0,192,255)", inputs: {}) {
        super("decision");
        this.name = name;
        this.color = color;
        this.inputs = inputs;

        this.addPort(new DecisionNodePortModel("left", "inputPort"));
        this.addPort(new DecisionNodePortModel("right", "neutralPort"));
        this.addPort(new DecisionNodePortModel("bottom", "completePort"));
        this.addPort(new DecisionNodePortModel("top", "failPort"));
    }

    deSerialize(object, engine: DiagramEngine) {
        super.deSerialize(object, engine);
        this.name = object.name;
        this.color = object.color;
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color
        });
    }

    getInputs() {
        return this.inputs;
    }
}
