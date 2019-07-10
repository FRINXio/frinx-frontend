import { NodeModel } from "storm-react-diagrams";
import { CircleStartPortModel } from "./CircleStartPortModel";
import * as _ from "lodash";
import {DefaultPortModel} from "storm-react-diagrams";
import {DiagramEngine} from "storm-react-diagrams";

export class CircleStartNodeModel extends NodeModel {

    name: string;
    color: string;
    ports: { [s: string]: DefaultPortModel };

    constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
        super("start");
        this.name = name;
        this.color = color;
    }

    addOutPort(label: string): DefaultPortModel {
        return this.addPort(new CircleStartPortModel("bottom"));
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
