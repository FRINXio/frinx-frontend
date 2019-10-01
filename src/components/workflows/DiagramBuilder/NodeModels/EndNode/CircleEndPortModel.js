import * as _ from "lodash";
import { LinkModel, DiagramEngine, PortModel, DefaultLinkModel } from "storm-react-diagrams";

export class CircleEndPortModel extends PortModel {
    position: string | "top" | "bottom" | "left" | "right";

    constructor(pos: string = "left") {
        super(pos, "end");
        this.position = pos;
    }

    serialize() {
        return _.merge(super.serialize(), {
            position: this.position
        });
    }

    deSerialize(data: any, engine: DiagramEngine) {
        super.deSerialize(data, engine);
        this.position = data.position;
    }

    createLinkModel(): LinkModel {
        return new DefaultLinkModel();
    }
}
