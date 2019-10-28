import * as SRD from "storm-react-diagrams";
import {fn} from "./builder-utils";
import * as _ from "lodash";
import {DefaultNodeModel} from "./NodeModels/DefaultNodeModel/DefaultNodeModel";
import {ForkNodeModel} from "./NodeModels/ForkNode/ForkNodeModel";
import {JoinNodeModel} from "./NodeModels/JoinNode/JoinNodeModel";
import {DecisionNodeModel} from "./NodeModels/DecisionNode/DecisionNodeModel";

export class WorkflowDiagram {

    definition;
    diagramModel: SRD.DiagramModel;
    nodes: [];
    links: [];
    startPos: {};

    constructor(definition, diagramModel, startPos) {
        this.definition = definition;
        this.diagramModel = diagramModel;
        this.startPos = startPos;
        this.nodes = [];
        this.links = [];
    }

    createDiagram() {
        const definition = this.definition;
        const diagramModel = this.diagramModel;

        const tasks = definition.tasks;

        tasks.forEach(task => {
            this.createNode(task);
        });

        // link nodes together
        this.linkForkJoinNodes();
        this.linkDecisionNodes();
        this.linkRemainingNodes();


        let nodes = this.nodes;
        let links = this.links;

        diagramModel.addAll(...nodes, ...links);
        // setTimeout(() => diagramEngine.repaintCanvas(), 10);
        return this.nodes;
    }

    linkRemainingNodes() {
        this.nodes.forEach((node, i) => {
            _.values(node.ports).forEach(port => {
                if (
                    (port.in || port.name === "left" || port.name === "inputPort") &&
                    _.isEmpty(port.links)
                ) {
                    if (i !== 0) {
                        this.links.push(this.linkNodes(this.nodes[i - 1], node));
                    }
                }
            });
        });
    };

    linkForkJoinNodes() {
        this.nodes.forEach(node => {
            if (node.type === "fork") {
                let forkTasks = node.extras.inputs.forkTasks;
                let firstInBranch = [];
                let lastInBranch = [];

                // find first and last nodes in branches
                forkTasks.forEach(branch => {
                    branch.forEach((branchTask, i) => {
                        if (i === 0) {
                            this.nodes.forEach(node => {
                                if (
                                    node.extras.inputs.taskReferenceName ===
                                    branchTask.taskReferenceName
                                ) {
                                    firstInBranch.push(node);
                                }
                            });
                        }
                        if (i === branch.length - 1) {
                            this.nodes.forEach(node => {
                                if (
                                    node.extras.inputs.taskReferenceName ===
                                    branchTask.taskReferenceName
                                ) {
                                    lastInBranch.push(node);
                                }
                            });
                        }
                    });
                });

                // connect fork -> first nodes
                firstInBranch.forEach(firstNode => {
                    this.links.push(this.linkNodes(node, firstNode));
                });

                // find join node pair for fork node
                let tasks = this.definition.tasks;
                let joinNodes = fn(tasks, "joinOn");
                let joinNodePair = null;
                joinNodes.forEach(joinNode => {
                    if (
                        joinNode.joinOn.includes(
                            lastInBranch[0].extras.inputs.taskReferenceName
                        )
                    ) {
                        this.nodes.forEach(node => {
                            if (
                                node.extras.inputs.taskReferenceName ===
                                joinNode.taskReferenceName
                            ) {
                                joinNodePair = node;
                            }
                        });
                    }
                });

                if (joinNodePair) {
                    // connect last nodes -> join
                    lastInBranch.forEach(lastNode => {
                        this.links.push(this.linkNodes(lastNode, joinNodePair));
                    });
                }
            }
        });
    };

    linkDecisionNodes() {
        this.nodes.forEach((node, pos) => {
            if (node.type === "decision") {
                let decisionCases = _.values(node.extras.inputs.decisionCases);
                let firstInBranch = [];
                let lastInBranch = [];

                // find first and last nodes in branches
                decisionCases.forEach(branch => {
                    branch.forEach((branchTask, i) => {
                        if (i === 0) {
                            this.nodes.forEach(node => {
                                if (
                                    node.extras.inputs.taskReferenceName ===
                                    branchTask.taskReferenceName
                                ) {
                                    firstInBranch.push(node);
                                }
                            });
                        }
                        if (i === branch.length - 1) {
                            this.nodes.forEach(node => {
                                if (
                                    node.extras.inputs.taskReferenceName ===
                                    branchTask.taskReferenceName
                                ) {
                                    lastInBranch.push(node);
                                }
                            });
                        }
                    });
                });

                // find neutral node (first node after decision block)
                let decisionCaseTasksArray = [];
                let neutralNode = null;

                decisionCases.forEach(branch => {
                    branch.forEach(task => {
                        if (task.type === "FORK_JOIN") {
                            decisionCaseTasksArray.push(task);
                            decisionCaseTasksArray.push(...fn(task.forkTasks, "name"));
                        } else {
                            decisionCaseTasksArray.push(task);
                        }
                    });
                });

                neutralNode = this.nodes[pos + decisionCaseTasksArray.length + 1];

                // connect decision -> first nodes
                firstInBranch.forEach((firstNode, k) => {
                    if (firstNode.type === "fork") {
                        this.links.push(
                            node
                                .getPort(k === 0 ? "failPort" : "completePort")
                                .link(firstNode.getPort("left"))
                        );
                    } else if (firstNode.type === "decision") {
                        this.links.push(
                            node
                                .getPort(k === 0 ? "failPort" : "completePort")
                                .link(firstNode.getPort("inputPort"))
                        );
                    } else {
                        this.links.push(
                            node
                                .getPort(k === 0 ? "failPort" : "completePort")
                                .link(firstNode.getInPorts()[0])
                        );
                    }
                });

                // connect last nodes -> neutral node
                if (neutralNode) {
                    lastInBranch.forEach(lastNode => {
                        this.links.push(this.linkNodes(lastNode, neutralNode));
                    });

                    // connect neutral port -> neutral node
                    if (neutralNode.type === "fork") {
                        this.links.push(
                            node.getPort("neutralPort").link(neutralNode.getPort("left"))
                        );
                    } else if (neutralNode.type === "decision") {
                        this.links.push(
                            node.getPort("neutralPort").link(neutralNode.getPort("inputPort"))
                        );
                    } else {
                        this.links.push(
                            node.getPort("neutralPort").link(neutralNode.getInPorts()[0])
                        );
                    }
                }
            }
        });
    };

    linkNodes(node1, node2, whichPort) {
        if (
            node1.type === "fork" ||
            node1.type === "join" ||
            node1.type === "start"
        ) {
            const fork_join_start_outPort = node1.getPort("right");

            if (node2.type === "default") {
                return fork_join_start_outPort.link(node2.getInPorts()[0]);
            }
            if (node2.type === "fork") {
                return fork_join_start_outPort.link(node2.getPort("left"));
            }
            if (node2.type === "join") {
                return fork_join_start_outPort.link(node2.getPort("left"));
            }
            if (node2.type === "decision") {
                return fork_join_start_outPort.link(node2.getPort("inputPort"));
            }
            if (node2.type === "end") {
                return fork_join_start_outPort.link(node2.getPort("left"));
            }
        } else if (node1.type === "default") {
            const defaultOutPort = node1.getOutPorts()[0];

            if (node2.type === "default") {
                return defaultOutPort.link(node2.getInPorts()[0]);
            }
            if (node2.type === "fork") {
                return defaultOutPort.link(node2.getPort("left"));
            }
            if (node2.type === "join") {
                return defaultOutPort.link(node2.getPort("left"));
            }
            if (node2.type === "decision") {
                return defaultOutPort.link(node2.getPort("inputPort"));
            }
            if (node2.type === "end") {
                return defaultOutPort.link(node2.getPort("left"));
            }
        } else if (node1.type === "decision") {
            const currentPort = node1.getPort(whichPort);

            if (node2.type === "default") {
                return currentPort.link(node2.getInPorts()[0]);
            }
            if (node2.type === "fork") {
                return currentPort.link(node2.getPort("left"));
            }
            if (node2.type === "join") {
                return currentPort.link(node2.getPort("left"));
            }
            if (node2.type === "decision") {
                return currentPort.link(node2.getPort("inputPort"));
            }
            if (node2.type === "end") {
                return currentPort.link(node2.getPort("left"));
            }
        }
    };

    calculatePosition(branchX, branchY) {
        const nodes = this.nodes;
        const startPos = this.startPos;
        let x = 0;
        let y = 0;

        if (_.isEmpty(nodes)) {
            x = startPos.x;
            y = startPos.y;
        } else {
            x = this.mostRightNodeX() + this.getNodeWidth(nodes[nodes.length - 1]) + 50;
            y = startPos.y
        }

        if (branchX) {
            x = branchX
        }
        if (branchY) {
            y = branchY
        }

        return {x, y}
    }


    calculateNestedPosition(branchTask, parentX, parentY, k, branchSpread, branchMargin, branchNum, forkDepth) {
        let branchPosX = 0;
        let yOffset = branchTask.type === "FORK_JOIN" ? 25 - k * 11 : 27;
        yOffset = branchTask.type === "JOIN" ? 25 - (k - 1) * 11 : yOffset;

        const branchPosY = parentY + yOffset - branchSpread / 2 + ((branchMargin + 47) * branchNum) / forkDepth;
        const lastNode = this.nodes[this.nodes.length - 1];

        if (branchTask.type === "JOIN") {
            branchPosX = this.mostRightNodeX() + 220
        } else {
            branchPosX = parentX + 220 + k * (this.getNodeWidth(lastNode) + 50)
        }
        return {branchPosX, branchPosY}
    }

    createNode(task, branchX, branchY, forkDepth = 1) {
        switch (task.type) {
            case "SUB_WORKFLOW": {
                const {x, y} = this.calculatePosition(branchX, branchY);
                const node = this.placeDefaultNode(task, x, y);

                this.nodes.push(node);

                break;

            }
            case "FORK_JOIN": {
                const {x, y} = this.calculatePosition(branchX, branchY);

                const branchCount = task.forkTasks.length;
                const branchMargin = 100;
                const nodeHeight = 47;

                const node = this.placeForkNode(task, x, y);
                this.nodes.push(node);

                // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
                const branchSpread =
                    (branchCount * nodeHeight + (branchCount - 1) * branchMargin) / forkDepth; //branches size in parallel

                task.forkTasks.forEach((branch, branchNum) => {
                    branch.forEach((branchTask, k) => {
                        const {branchPosX, branchPosY} = this.calculateNestedPosition(branchTask, x, y, k, branchSpread, branchMargin, branchNum, forkDepth);
                        this.createNode(
                            branchTask,
                            branchPosX,
                            branchPosY,
                            forkDepth + 1,
                        );
                    });
                });
                break;
            }
            case "JOIN": {
                const {x, y} = this.calculatePosition(branchX, branchY);

                const node = this.placeJoinNode(task, x, y);
                this.nodes.push(node);

                break;
            }
            case "DECISION": {
                const {x, y} = this.calculatePosition(branchX, branchY);
                const caseCount = _.values(task.decisionCases).length;
                const branchMargin = 250;
                const nodeHeight = 47;

                const node = this.placeDecisionNode(task, x, y);
                this.nodes.push(node);

                // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
                const branchSpread =
                    (caseCount * nodeHeight + (caseCount - 1) * branchMargin) / forkDepth; //branches size in parallel

                _.values(task.decisionCases).forEach((caseBranch, caseNum) => {
                    caseBranch.forEach((branchTask, k) => {
                        const branchPosX =
                            branchTask.type === "JOIN"
                                ? this.mostRightNodeX() + 200
                                : x + 100 + k * 200;
                        const branchPosY = y + 30 - branchSpread / 2 + ((branchMargin + 47) * caseNum) / forkDepth;
                        this.createNode(
                            branchTask,
                            branchPosX,
                            branchPosY,
                            forkDepth + 1
                        );
                    });
                });
                break;
            }
            default: {
                const {x, y} = this.calculatePosition(branchX, branchY);
                const node = this.placeDefaultNode(task, x, y);
                this.nodes.push(node);
                break;
            }
        }
    }

    placeDefaultNode(task, x, y) {
        const color = task.type === "SUB_WORKFLOW" ? "rgb(34,144,255)" : "rgb(134,210,255)";
        const node = new DefaultNodeModel(task.name, color, task);
        node.setPosition(x, y);
        return node;
    }

    placeForkNode = (task, x, y) => {
        let node = new ForkNodeModel(task.name, "rgb(11,60,139)", task);
        node.setPosition(x, y);
        return node;
    };

    placeJoinNode = (task, x, y) => {
        let node = new JoinNodeModel(task.name, "rgb(11,60,139)", task);
        node.setPosition(x, y);
        return node;
    };

    placeDecisionNode = (task, x, y) => {
        let node = new DecisionNodeModel(task.name, "rgb(11,60,139)", task);
        node.setPosition(x, y);
        return node;
    };

    mostRightNodeX() {
        let max = 0;
        this.nodes.forEach(node => {
            if (node.x > max) {
                max = node.x;
            }
        });
        return max;
    };

    getNodeWidth(node) {
        if (node.name.length > 6) {
            return node.name.length * 6;
        }
        return node.name.length * 12;
    };

}