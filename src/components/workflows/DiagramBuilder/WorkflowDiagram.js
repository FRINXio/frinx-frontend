import * as SRD from "storm-react-diagrams";
import {
  fn,
  getEndNode,
  getLinksArray,
  getStartNode,
  getWfInputs,
  handleDecideNode,
  handleForkNode,
  linkNodes
} from "./builder-utils";
import * as _ from "lodash";
import { DefaultNodeModel } from "./NodeModels/DefaultNodeModel/DefaultNodeModel";
import { ForkNodeModel } from "./NodeModels/ForkNode/ForkNodeModel";
import { JoinNodeModel } from "./NodeModels/JoinNode/JoinNodeModel";
import { DecisionNodeModel } from "./NodeModels/DecisionNode/DecisionNodeModel";
import { CircleStartNodeModel } from "./NodeModels/StartNode/CircleStartNodeModel";
import { CircleEndNodeModel } from "./NodeModels/EndNode/CircleEndNodeModel";
import { Application } from "./Application";
const http = require("../../../server/HttpServerSide").HttpClient;

export class WorkflowDiagram {
  definition;
  diagramModel: SRD.DiagramModel;
  startPos: {};

  constructor(app = null, definition = null, startPos = null) {
    this.app = app;
    this.definition = definition;
    this.diagramEngine = app.getDiagramEngine();
    this.diagramModel = app.getDiagramEngine().getDiagramModel();
    this.startPos = startPos;
  }

  setDefinition(definition) {
    this.definition = definition;
    return this;
  }

  setStartPosition(startPos) {
    this.startPos = startPos;
    return this;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }

  getDiagramModel() {
    return this.diagramModel;
  }

  getNodes() {
    return _.toArray(this.diagramModel.getNodes());
  }

  getLinks() {
    return _.toArray(this.diagramModel.getLinks());
  }

  saveWorkflow(finalWorkflow) {
    return new Promise((resolve, reject) => {
      const definition = this.parseDiagramToJSON(finalWorkflow);
      http
        .put("/api/conductor/metadata", [definition])
        .then(() => {
          resolve(definition);
        })
        .catch(err => {
          const errObject = JSON.parse(err.response.text);
          if (errObject.validationErrors) {
            reject(errObject.validationErrors[0]);
          }
        });
    });
  }

  createDiagram() {
    const definition = this.definition;
    const tasks = definition.tasks;
    this.clearDiagram();

    tasks.forEach(task => {
      this.createNode(task);
    });

    // link nodes together
    this.linkForkJoinNodes();
    this.linkDecisionNodes();
    this.linkRemainingNodes();

    return this;
  }

  renderDiagram() {
    this.diagramEngine.repaintCanvas();
    this.diagramEngine.repaintCanvas();
    return this;
  }

  dropNewNode(e) {
    const data = JSON.parse(e.dataTransfer.getData("storm-diagram-node"));
    const points = this.diagramEngine.getRelativeMousePoint(e);
    const task = { name: data.name, ...data.wfObject };
    const { diagramModel, diagramEngine } = this;

    let node = null;

    switch (data.type) {
      case "default":
        node = this.placeDefaultNode(task, points.x, points.y);
        break;
      case "start":
        node = this.placeStartNode(points.x, points.y);
        break;
      case "end":
        node = this.placeEndNode(points.x, points.y);
        break;
      case "fork":
        node = this.placeForkNode(task, points.x, points.y);
        break;
      case "join":
        node = this.placeJoinNode(task, points.x, points.y);
        break;
      case "decision":
        node = this.placeDecisionNode(task, points.x, points.y);
        break;
      default:
        break;
    }

    diagramModel.addNode(node);
    diagramEngine.repaintCanvas();
  }

  clearDiagram() {
    _.values(this.diagramModel.getNodes()).forEach(node => {
      this.diagramModel.removeNode(node);
    });

    _.values(this.diagramModel.getLinks()).forEach(link => {
      this.diagramModel.removeLink(link);
    });
  }

  placeDefaultNodes() {
    this.diagramEngine.setDiagramModel(this.diagramModel);
    this.diagramModel.addAll(
      this.placeStartNode(900, 300),
      this.placeEndNode(1200, 300)
    );
    return this;
  }

  withStartEnd() {
    const diagramModel = this.diagramModel;
    const firstNode = _.first(this.getNodes());
    const lastNode = _.last(this.getNodes());

    const startNode = this.placeStartNode(firstNode.x - 150, firstNode.y);
    const endNode = this.placeEndNode(
      lastNode.x + this.getNodeWidth(lastNode) + 150,
      lastNode.y
    );

    // decision special case
    if (_.last(this.definition.tasks).type === "DECISION") {
      const decisionNode = this.getMatchingNode(
        _.last(this.definition.tasks).taskReferenceName
      );

      Object.values(decisionNode.extras.inputs.decisionCases).forEach(branch =>
        diagramModel.addLink(
          this.linkNodes(
            this.getMatchingNode(_.last(branch).taskReferenceName),
            endNode
          )
        )
      );
      diagramModel.addLink(
        this.linkNodes(decisionNode, endNode, "neutralPort")
      );
      endNode.setPosition(this.getMostRightNodeX() + 150, decisionNode.y);
    }

    this.diagramModel.addAll(
      this.linkNodes(startNode, firstNode),
      this.linkNodes(lastNode, endNode)
    );
    diagramModel.addAll(startNode, endNode);

    return this;
  }

  placeStartNode(x, y) {
    const node = new CircleStartNodeModel("Start");
    node.setPosition(x, y);
    return node;
  }

  placeEndNode(x, y) {
    const node = new CircleEndNodeModel("End");
    node.setPosition(x, y);
    return node;
  }

  placeDefaultNode(task, x, y) {
    const color =
      task.type === "SUB_WORKFLOW" ? "rgb(34,144,255)" : "rgb(134,210,255)";
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

  getMostRightNodeX() {
    let max = 0;
    this.getNodes().forEach(node => {
      if (node.x > max) {
        max = node.x;
      }
    });
    return max;
  }

  getNodeWidth(node) {
    if (node.name.length > 6) {
      return node.name.length * 6;
    }
    return node.name.length * 12;
  }

  getMatchingNode(taskName) {
    return _.toArray(this.getNodes()).find(
      x => x.extras.inputs.taskReferenceName === taskName
    );
  }

  linkRemainingNodes() {
    this.getNodes().forEach((node, i) => {
      _.values(node.ports).forEach(port => {
        if (
          (port.in || port.name === "left" || port.name === "inputPort") &&
          _.isEmpty(port.links)
        ) {
          if (i !== 0) {
            this.diagramModel.addLink(
              this.linkNodes(this.getNodes()[i - 1], node)
            );
          }
        }
      });
    });
  }

  linkForkJoinNodes() {
    this.getNodes().forEach(node => {
      if (node.type === "fork") {
        let forkTasks = node.extras.inputs.forkTasks;
        let firstInBranch = [];
        let lastInBranch = [];

        // find first and last nodes in branches
        forkTasks.forEach(branch => {
          let firstBranchNode = this.getMatchingNode(
            _.first(_.toArray(branch)).taskReferenceName
          );
          let lastBranchNode = this.getMatchingNode(
            _.last(_.toArray(branch)).taskReferenceName
          );

          firstInBranch.push(firstBranchNode);
          lastInBranch.push(lastBranchNode);
        });

        // connect fork -> first nodes
        firstInBranch.forEach(firstNode => {
          this.diagramModel.addLink(this.linkNodes(node, firstNode));
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
            joinNodePair = this.getMatchingNode(joinNode.taskReferenceName);
          }
        });

        // connect last nodes -> join
        if (joinNodePair) {
          lastInBranch.forEach(lastNode => {
            this.diagramModel.addLink(this.linkNodes(lastNode, joinNodePair));
          });
        }
      }
    });
  }

  linkDecisionNodes() {
    this.getNodes().forEach((node, pos) => {
      if (node.type === "decision") {
        let decisionCases = _.values(node.extras.inputs.decisionCases);
        let firstInBranch = [];
        let lastInBranch = [];

        // find first and last nodes in branches
        decisionCases.forEach(branch => {
          let firstBranchNode = this.getMatchingNode(
            _.first(_.toArray(branch)).taskReferenceName
          );
          let lastBranchNode = this.getMatchingNode(
            _.last(_.toArray(branch)).taskReferenceName
          );

          firstInBranch.push(firstBranchNode);
          lastInBranch.push(lastBranchNode);
        });

        // find neutral node (first node after decision block)
        let decisionCaseTasksArray = [];

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

        let neutralNode = this.getNodes()[
          pos + decisionCaseTasksArray.length + 1
        ];

        // connect decision -> first nodes
        firstInBranch.forEach((firstNode, k) => {
          let whichPort = k === 0 ? "failPort" : "completePort";
          this.diagramModel.addLink(this.linkNodes(node, firstNode, whichPort));
        });

        // connect last nodes -> neutral node
        if (neutralNode) {
          lastInBranch.forEach(lastNode => {
            this.diagramModel.addLink(this.linkNodes(lastNode, neutralNode));
          });

          // connect neutral port -> neutral node
          this.diagramModel.addLink(
            this.linkNodes(node, neutralNode, "neutralPort")
          );
        }
      }
    });
  }

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
  }

  calculatePosition(branchX, branchY) {
    const nodes = this.getNodes();
    const startPos = this.startPos;
    let x = 0;
    let y = 0;

    if (_.isEmpty(nodes)) {
      x = startPos.x;
      y = startPos.y;
    } else {
      x =
        this.getMostRightNodeX() +
        this.getNodeWidth(nodes[nodes.length - 1]) +
        50;
      y = startPos.y;
    }

    if (branchX) {
      x = branchX;
    }
    if (branchY) {
      y = branchY;
    }

    return { x, y };
  }

  calculateNestedPosition(
    branchTask,
    parentX,
    parentY,
    k,
    branchSpread,
    branchMargin,
    branchNum,
    forkDepth
  ) {
    let branchPosX = 0;
    let yOffset = branchTask.type === "FORK_JOIN" ? 25 - k * 11 : 27;
    yOffset = branchTask.type === "JOIN" ? 25 - (k - 1) * 11 : yOffset;

    const branchPosY =
      parentY +
      yOffset -
      branchSpread / 2 +
      ((branchMargin + 47) * branchNum) / forkDepth;
    const lastNode = this.getNodes()[this.getNodes().length - 1];

    if (branchTask.type === "JOIN") {
      branchPosX = this.getMostRightNodeX() + 220;
    } else {
      branchPosX = parentX + 220 + k * (this.getNodeWidth(lastNode) + 50);
    }
    return { branchPosX, branchPosY };
  }

  createNode(task, branchX, branchY, forkDepth = 1) {
    switch (task.type) {
      case "SUB_WORKFLOW": {
        const { x, y } = this.calculatePosition(branchX, branchY);
        const node = this.placeDefaultNode(task, x, y);
        this.diagramModel.addNode(node);
        break;
      }
      case "FORK_JOIN": {
        const { x, y } = this.calculatePosition(branchX, branchY);
        const branchCount = task.forkTasks.length;
        const branchMargin = 100;
        const nodeHeight = 47;

        const node = this.placeForkNode(task, x, y);
        this.diagramModel.addNode(node);

        // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
        const branchSpread =
          (branchCount * nodeHeight + (branchCount - 1) * branchMargin) /
          forkDepth;

        task.forkTasks.forEach((branch, branchNum) => {
          branch.forEach((branchTask, k) => {
            const { branchPosX, branchPosY } = this.calculateNestedPosition(
              branchTask,
              x,
              y,
              k,
              branchSpread,
              branchMargin,
              branchNum,
              forkDepth
            );
            this.createNode(branchTask, branchPosX, branchPosY, forkDepth + 1);
          });
        });
        break;
      }
      case "JOIN": {
        const { x, y } = this.calculatePosition(branchX, branchY);
        const node = this.placeJoinNode(task, x, y);
        this.diagramModel.addNode(node);
        break;
      }
      case "DECISION": {
        const { x, y } = this.calculatePosition(branchX, branchY);
        const caseCount = _.values(task.decisionCases).length;
        const branchMargin = 250;
        const nodeHeight = 47;
        const node = this.placeDecisionNode(task, x, y);
        this.diagramModel.addNode(node);

        // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
        const branchSpread =
          (caseCount * nodeHeight + (caseCount - 1) * branchMargin) / forkDepth;

        _.values(task.decisionCases).forEach((caseBranch, caseNum) => {
          caseBranch.forEach((branchTask, k) => {
            const branchPosX =
              branchTask.type === "JOIN"
                ? this.getMostRightNodeX() + 200
                : x + 100 + k * 200;
            const branchPosY =
              y +
              30 -
              branchSpread / 2 +
              ((branchMargin + 47) * caseNum) / forkDepth;
            this.createNode(branchTask, branchPosX, branchPosY, forkDepth + 1);
          });
        });
        break;
      }
      default: {
        const { x, y } = this.calculatePosition(branchX, branchY);
        const node = this.placeDefaultNode(task, x, y);
        this.diagramModel.addNode(node);
        break;
      }
    }
  }

  parseDiagramToJSON(finalWorkflow) {
    let parentNode = getStartNode(this.getLinks());
    let endNode = getEndNode(this.getLinks());
    let linksArray = this.getLinks();
    let tasks = [];

    if (!parentNode) {
      throw new Error("Start node is not connected.");
    }
    if (!endNode) {
      throw new Error("End node is not connected.");
    }

    while (parentNode.type !== "end") {
      for (let i = 0; i < linksArray.length; i++) {
        let link = linksArray[i];

        if (link.sourcePort.parent === parentNode) {
          switch (link.targetPort.type) {
            case "fork":
              let { forkNode, joinNode } = handleForkNode(
                link.targetPort.getNode()
              );
              tasks.push(forkNode.extras.inputs, joinNode.extras.inputs);
              parentNode = joinNode;
              break;
            case "decision":
              let { decideNode, firstNeutralNode } = handleDecideNode(
                link.targetPort.getNode()
              );
              tasks.push(decideNode.extras.inputs);
              if (firstNeutralNode) {
                if (firstNeutralNode.extras.inputs) {
                  tasks.push(firstNeutralNode.extras.inputs);
                }
                parentNode = firstNeutralNode;
              } else {
                throw new Error("Default decision route is missing.");
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

    let finalWf = { ...finalWorkflow };

    // handle input params
    if (Object.keys(getWfInputs(finalWf)).length < 1) {
      finalWf.inputParameters = [];
    }

    // handle tasks
    finalWf.tasks = tasks;
    this.definition = finalWf;

    return finalWf;
  }

  expandSelectedNodes() {
    const selectedNodes = this.diagramModel.getSelectedItems().filter(item => {
      return item.getType() === "default";
    });

    selectedNodes.forEach(selectedNode => {
      if (!selectedNode.extras.inputs.subWorkflowParam) {
        throw new Error("Simple task can't be expanded");
      }

      const { name, version } = selectedNode.extras.inputs.subWorkflowParam;
      const inputLink = getLinksArray("in", selectedNode)[0];
      const outputLink = getLinksArray("out", selectedNode)[0];

      if (!inputLink || !outputLink) {
        throw new Error("Selected node is not connected.");
      }

      const inputLinkParent = inputLink.sourcePort.getNode();
      const outputLinkParent = outputLink.targetPort.getNode();

      http
        .get("/api/conductor/metadata/workflow/" + name + "/" + version)
        .then(res => {
          const subworkflowDiagram = new WorkflowDiagram(
            new Application(),
            res.result,
            selectedNode
          );

          subworkflowDiagram.createDiagram();

          const firstNode = _.first(subworkflowDiagram.getNodes());
          const lastNode = _.last(subworkflowDiagram.getNodes());

          selectedNode.remove();
          this.diagramModel.removeNode(selectedNode);
          this.diagramModel.removeLink(inputLink);
          this.diagramModel.removeLink(outputLink);

          this.diagramModel.addAll(
            ...subworkflowDiagram.getNodes(),
            ...subworkflowDiagram.getLinks(),
            linkNodes(inputLinkParent, firstNode, inputLink.sourcePort.name),
            linkNodes(lastNode, outputLinkParent)
          );
          this.diagramEngine.setDiagramModel(this.diagramModel);
          this.diagramEngine.repaintCanvas();
          this.renderDiagram();
        })
        .catch(() => {
          console.log(`Subworkflow ${name} doesn't exit.`);
        });
    });
  }
}
