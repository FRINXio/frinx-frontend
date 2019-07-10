import * as SRD from "storm-react-diagrams";
import { CircleNodeWidget } from "./CircleNodeWidget";
import { CircleNodeModel } from "./CircleNodeModel";
import * as React from "react";

export class CircleNodeFactory extends SRD.AbstractNodeFactory {

    constructor() {
        super("circle");
    }

    generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.NodeModel): JSX.Element {
        return <CircleNodeWidget node={node} />;
    }

    getNewInstance() {
        return new CircleNodeModel();
    }
}