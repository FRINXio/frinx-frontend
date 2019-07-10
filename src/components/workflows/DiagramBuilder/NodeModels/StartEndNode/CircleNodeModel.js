import { NodeModel } from "storm-react-diagrams";
import { CirclePortModel } from "./CirclePortModel";
import * as _ from "lodash";
import {DefaultPortModel} from "storm-react-diagrams";
import {DiagramEngine} from "storm-react-diagrams";

export class CircleNodeModel extends NodeModel {

    name: string;
    color: string;
    ports: { [s: string]: DefaultPortModel };

    constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
        super("circle");
        this.name = name;
        this.color = color;
    }

    addOutPort(label: string): DefaultPortModel {
        return this.addPort(new CirclePortModel("bottom"));
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
}