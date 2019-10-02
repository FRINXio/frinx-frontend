import {DefaultNodeModel} from "./NodeModels/DefaultNodeModel/DefaultNodeModel";
import {ForkNodeModel} from "./NodeModels/ForkNode/ForkNodeModel";
import {JoinNodeModel} from "./NodeModels/JoinNode/JoinNodeModel";
import * as _ from "lodash";
import {DecisionNodeModel} from "./NodeModels/DecisionNode/DecisionNodeModel";

const http = require('../../../server/HttpServerSide').HttpClient;

export const getWfInputsRegex = (wf) => {
    let def = JSON.stringify(wf);
    let matchArray = def.match(/\workflow.input([\w.])+}/igm);
    let inputsArray = [];
    let inputParameters = {};

    if (matchArray) {
        let sortedArray = matchArray.join().match(/[^.]+(?=})/igm);
        inputsArray = [...new Set(sortedArray)];
    }

    inputsArray.forEach(el => {
        inputParameters[el] = "${workflow.input." + el + "}"
    });

    return inputParameters;
};

export const getWfInputs = (wf) => {
    let taskArray = wf.tasks;
    let inputParams = [];
    let inputParameters = {};

    taskArray.forEach(task => {
        if (task !== undefined) {
            let nonSystemTask = fn(task, "inputParameters");

            if (_.isArray(nonSystemTask)) {
                nonSystemTask.forEach(el => {
                    if (el.inputParameters) {
                        inputParams.push(el.inputParameters)
                    }
                })
            } else if (nonSystemTask.inputParameters) {
                inputParams.push(task.inputParameters)
            }
        }
    });

    for (let i = 0; i < inputParams.length; i++) {
        inputParameters = {...inputParameters, ...inputParams[i]}
    }

    return inputParameters;
};

// function to get nested key (inputParameters) from system tasks
function fn(obj, key) {
    if (_.has(obj, key))
        return obj;

    return _.flatten(_.map(obj, function (v) {
        return typeof v == "object" ? fn(v, key) : [];
    }), true);
}

export const getLinksArray = (type, node) => {
    let linksArray = [];
    _.values(node.ports).forEach(port => {
        if (type === "in" || type === "inputPort") {
            if (port.in || port.name === "left") {
                linksArray = _.values(port.links);
            }
        } else if (type === "out") {
            if (!port.in || port.name === "right") {
                linksArray = _.values(port.links);
            }
        }
    });
    return linksArray;
};

export const getStartNode = (links) => {
    for (let i = 0; i < _.values(links).length; i++) {
        let link = _.values(links)[i];
        if (link.sourcePort.type === "start") {
            return link.sourcePort.parent;
        }
    }
};

export const getEndNode = (links) => {
    for (let i = 0; i < _.values(links).length; i++) {
        let link = _.values(links)[i];
        if (link.targetPort.type === "end") {
            return link.targetPort.parent;
        }
    }
};

export const handleForkNode = (forkNode) => {
    let joinNode = null;
    let forkTasks = [];
    let joinOn = [];
    let forkBranches = forkNode.ports.right.links;

    //for each branch chain tasks
    _.values(forkBranches).forEach(link => {
        let tmpBranch = [];
        let parent = link.targetPort.getNode();
        let current = link.targetPort.getNode();

        //iterate trough tasks in each branch till join node
        while (current) {
            let outputLinks = getLinksArray("out", current);
            switch (current.type) {
                case "join":
                    joinOn.push(parent.extras.inputs.taskReferenceName);
                    joinNode = current;
                    current = null;
                    break;
                case "fork":
                    let innerForkNode = handleForkNode(current).forkNode;
                    let innerJoinNode = handleForkNode(current).joinNode;
                    let innerJoinOutLinks = getLinksArray("out", innerJoinNode);
                    tmpBranch.push(innerForkNode.extras.inputs, innerJoinNode.extras.inputs);
                    parent = innerJoinNode;
                    current = innerJoinOutLinks[0].targetPort.getNode();
                    break;
                case "decision":
                    let {decideNode, firstNeutralNode} = handleDecideNode(current);
                    tmpBranch.push(decideNode.extras.inputs);
                    current = firstNeutralNode;
                    break;
                default:
                    tmpBranch.push(current.extras.inputs);
                    parent = current;
                    if (outputLinks.length > 0) {
                        current = outputLinks[0].targetPort.getNode();
                    } else {
                        current = null;
                    }
                    break;
            }
        }
        forkTasks.push(tmpBranch);
    });

    forkNode.extras.inputs.forkTasks = forkTasks;
    joinNode.extras.inputs.joinOn = joinOn;

    return {forkNode, joinNode}
};

export const handleDecideNode = (decideNode) => {
    let completeBranchLink = _.values(decideNode.ports.completePort.links)[0];
    let failBranchLink = _.values(decideNode.ports.failPort.links)[0];
    let neutralBranchLink = _.values(decideNode.ports.neutralPort.links)[0];
    let firstNeutralNode = null;

    [completeBranchLink, failBranchLink].forEach((branch, i) => {
        if (branch) {
            let branchArray = [];
            let currentNode = branch.targetPort.getNode();
            let inputLinks = getLinksArray("in", currentNode);
            let outputLink = getLinksArray("out", currentNode)[0];

            while ((inputLinks.length === 1 || currentNode.type === "join" || currentNode.type === "decision") && outputLink) {
                switch (currentNode.type) {
                    case "fork":
                        let {forkNode, joinNode} = handleForkNode(currentNode);
                        branchArray.push(forkNode.extras.inputs, joinNode.extras.inputs);
                        currentNode = getLinksArray("out",  joinNode)[0].targetPort.getNode();
                        break;
                    case "decision":
                        let innerDecideNode = handleDecideNode(currentNode).decideNode;
                        let innerFirstNeutralNode = handleDecideNode(currentNode).firstNeutralNode;
                        let innerFirstNeutralLinks = getLinksArray("out", innerFirstNeutralNode);
                        branchArray.push(innerDecideNode.extras.inputs);

                        if (innerFirstNeutralNode && innerFirstNeutralNode.extras.inputs) {
                            branchArray.push(innerFirstNeutralNode.extras.inputs);
                        }
                        currentNode = innerFirstNeutralLinks[0].targetPort.getNode();
                        break;
                    default:
                        branchArray.push(currentNode.extras.inputs);
                        currentNode = outputLink.targetPort.getNode();
                        break;
                }
                inputLinks = getLinksArray("in", currentNode);
                outputLink = getLinksArray("out", currentNode)[0];
            }

            let casesValues = Object.keys(decideNode.extras.inputs.decisionCases);

            switch (i) {
                case 0:
                    decideNode.extras.inputs.decisionCases[casesValues[1]] = branchArray;
                    break;
                case 1:
                    decideNode.extras.inputs.decisionCases[casesValues[0]] = branchArray;
                    break;
                default:
                    break
            }
        }
    });
    if (neutralBranchLink) {
        firstNeutralNode = neutralBranchLink.targetPort.getNode();
    }
    return {decideNode, firstNeutralNode}
};

export const clearCanvas = (diagramEngine) => {

    let activeModel = diagramEngine.getDiagramModel();
    diagramEngine.setDiagramModel(activeModel);

    _.values(activeModel.getNodes()).forEach(node => {
        activeModel.removeNode(node);
    });

    _.values(activeModel.getLinks()).forEach(link => {
        activeModel.removeLink(link);
    });
};

///////////// JSON TO DIAGRAM PARSER /////////////////////

export const get_workflow_subworkflows = (workflowDef) => {
    let subWorkflows = [];
    let name = "";
    let version = "";

    workflowDef.tasks.forEach(task => {
        let subWorkflowParam = fn(task, "subWorkflowParam");

        if (task.subWorkflowParam) {
            name = task.subWorkflowParam.name;
            version = task.subWorkflowParam.version;
        } else if (subWorkflowParam) {
            subWorkflowParam.forEach(nestedTask => {
                name = nestedTask.subWorkflowParam.name;
                version = nestedTask.subWorkflowParam.version;
            })
        }
        subWorkflows.push({name, version});
    });

    return _.uniqWith(subWorkflows, _.isEqual);
};

export const place_defaultNode = (task, posX, posY) => {
    let color = task.type === "SUB_WORKFLOW" ? "rgb(34,144,255)" : "rgb(134,210,255)";
    let node = new DefaultNodeModel(task.name, color, task);
    node.addInPort("In");
    node.addOutPort("Out");
    node.setPosition(posX, posY);
    return node;
};

export const place_forkNode = (task, posX, posY) => {
    let node = new ForkNodeModel(task.name, "rgb(11,60,139)", task);
    node.setPosition(posX, posY);
    return node;
};

export const place_joinNode = (task, posX, posY) => {
    let node = new JoinNodeModel(task.name, "rgb(11,60,139)", task);
    node.setPosition(posX, posY);
    return node;
};

export const place_decisionNode = (task, posX, posY) => {
    let node = new DecisionNodeModel(task.name, "rgb(11,60,139)", task);
    node.setPosition(posX, posY);
    return node;
};

export const find_mostRightNode = (nodes) => {
    let max = 0;
    nodes.forEach(node => {
        if (node.x > max) {
            max = node.x
        }
    });
    return max;
};

export const linkNodes = (node1, node2) => {

    if (node1.type === "fork" || node1.type === "join" || node1.type === "start") {
        const fork_join_start_outPort = node1.getPort("right");

        if (node2.type === "default") {
            return fork_join_start_outPort.link(node2.getInPorts()[0])
        }
        if (node2.type === "fork") {
            return fork_join_start_outPort.link(node2.getPort("left"))
        }
        if (node2.type === "join") {
            return fork_join_start_outPort.link(node2.getPort("left"))
        }
        if (node2.type === "decision") {
            return fork_join_start_outPort.link(node2.getPort("inputPort"))
        }
        if (node2.type === "end") {
            return fork_join_start_outPort.link(node2.getPort("left"))
        }
    } else if (node1.type === "default") {
        const defaultOutPort = node1.getOutPorts()[0];

        if (node2.type === "default") {
            return defaultOutPort.link(node2.getInPorts()[0])
        }
        if (node2.type === "fork") {
            return defaultOutPort.link(node2.getPort("left"))
        }
        if (node2.type === "join") {
            return defaultOutPort.link(node2.getPort("left"))
        }
        if (node2.type === "decision") {
            return defaultOutPort.link(node2.getPort("inputPort"))
        }
        if (node2.type === "end") {
            return defaultOutPort.link(node2.getPort("left"))
        }
    }
    //TODO decision node
};

export const handleTask = (task, nodes, startPosition, branchNum = 1, forkNode, branchPosX, branchPosY = startPosition.y, forkDepth = 1) => {

    switch (task.type) {
        case "SUB_WORKFLOW": {
            let posX = nodes.length === 0 ? startPosition.x : find_mostRightNode(nodes) + nodes[nodes.length - 1].name.length * 7 + 30;
            let posY = nodes.length === 0 ? startPosition.y : branchPosY;

            if (branchPosX) {
                posX = branchPosX
            }

            let node = place_defaultNode(task, posX, posY);
            nodes.push(node);
            break;
        }
        case "FORK_JOIN": {
            let posX = nodes.length === 0 ? startPosition.x : find_mostRightNode(nodes) + 200;
            let posY = nodes.length === 0 ? startPosition.y : branchPosY;
            let branchCount = task.forkTasks.length;
            let branchMargin = 100;

            // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
            let branchSpread = (branchCount * 47 + (branchCount - 1) * branchMargin) / forkDepth; //branches size in parallel

            if (branchPosX) {
                posX = branchPosX
            }

            let node = place_forkNode(task, posX, posY);
            nodes.push(node);

            task.forkTasks.forEach((branch, branchNum) => {
                branch.forEach((branchTask, k) => {
                    let branchPosX = branchTask.type === "JOIN" ? find_mostRightNode(nodes) + 200 : posX + 200 + k * 200;
                    handleTask(branchTask, nodes, posY, branchNum, node, branchPosX, posY + 30 - (branchSpread / 2) + (branchMargin + 47) * branchNum / forkDepth, forkDepth + 1);
                })
            });
            break;
        }
        case "JOIN": {
            let posX = find_mostRightNode(nodes) + 200;
            let posY = nodes.length === 0 ? startPosition.y : branchPosY;

            if (branchPosX) {
                posX = branchPosX
            }

            let node = place_joinNode(task, posX, posY);
            nodes.push(node);

            break;
        }
        case "DECISION": {
            let posX = nodes.length === 0 ? startPosition.x : find_mostRightNode(nodes) + 200;
            let posY = nodes.length === 0 ? startPosition.y : branchPosY;
            let caseCount = _.values(task.decisionCases).length;
            let branchMargin = 100;

            // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
            let branchSpread = (caseCount * 47 + (caseCount - 1) * branchMargin) / forkDepth; //branches size in parallel

            if (branchPosX) {
                posX = branchPosX
            }

            let node = place_decisionNode(task, posX, posY);
            nodes.push(node);

            _.values(task.decisionCases).forEach((caseBranch, caseNum) => {
                caseBranch.forEach((branchTask, k) => {
                    let branchPosX = branchTask.type === "JOIN" ? find_mostRightNode(nodes) + 200 : posX + 200 + k * 200;
                    handleTask(branchTask, nodes, posY, caseNum, node, branchPosX, posY + 30 - (branchSpread / 2) + (branchMargin + 47) * caseNum / forkDepth, forkDepth + 1);
                })
            });
            break;
        }
        default: {
            let posX = nodes.length === 0 ? startPosition.x : find_mostRightNode(nodes) + nodes[nodes.length - 1].name.length * 7 + 30;
            let posY = nodes.length === 0 ? startPosition.y : branchPosY;

            if (branchPosX) {
                posX = branchPosX
            }

            nodes.push(place_defaultNode(task, posX, posY));
            break;
        }
    }
};

export const createLinks_remaining_nodes = (nodes, tasks, links) => {
    nodes.forEach((node, i) => {
        _.values(node.ports).forEach(port => {
            if ((port.in || port.name === "left" || port.name === "inputPort") && _.isEmpty(port.links)) {
                if ( i !== 0) {
                    links.push(linkNodes(nodes[i - 1], node))
                }
            }
        });
    })
};

export const createLinks_fork_join_nodes = (nodes, tasks, links) => {
    nodes.forEach(node => {
        if (node.type === "fork") {
            let forkTasks = node.extras.inputs.forkTasks;
            let firstInBranch = [];
            let lastInBranch = [];

            // find first and last nodes in branches
            forkTasks.forEach(branch => {
                branch.forEach((branchTask, i) => {
                    if (i === 0) {
                        nodes.forEach(node => {
                            if (node.extras.inputs.taskReferenceName === branchTask.taskReferenceName) {
                                firstInBranch.push(node)
                            }
                        })
                    }
                    if (i === branch.length - 1) {
                        nodes.forEach(node => {
                            if (node.extras.inputs.taskReferenceName === branchTask.taskReferenceName) {
                                lastInBranch.push(node)
                            }
                        })
                    }
                })
            });

            // connect fork -> first nodes
            firstInBranch.forEach(firstNode => {
                links.push(linkNodes(node, firstNode))
            });

            // find join node pair for fork node
            let joinNodes = fn(tasks, "joinOn");
            let joinNodePair = null;
            joinNodes.forEach(joinNode => {
                if (joinNode.joinOn.includes(lastInBranch[0].extras.inputs.taskReferenceName)) {
                    nodes.forEach(node => {
                        if (node.extras.inputs.taskReferenceName === joinNode.taskReferenceName) {
                            joinNodePair = node;
                        }
                    })
                }
            });

            if (joinNodePair) {
                // connect last nodes -> join
                lastInBranch.forEach(lastNode => {
                    links.push(linkNodes(lastNode, joinNodePair))
                });
            }

        }

    })
};

export const createLinks_decision_nodes = (nodes, tasks, links) => {
    nodes.forEach(node => {
        if (node.type === "decision") {
            let decisionCases = _.values(node.extras.inputs.decisionCases);
            let firstInBranch = [];
            let lastInBranch = [];

            // find first and last nodes in branches
            decisionCases.forEach(branch => {
                branch.forEach((branchTask, i) => {
                    if (i === 0) {
                        nodes.forEach(node => {
                            if (node.extras.inputs.taskReferenceName === branchTask.taskReferenceName) {
                                firstInBranch.push(node)
                            }
                        })
                    }
                    if (i === branch.length - 1) {
                        nodes.forEach(node => {
                            if (node.extras.inputs.taskReferenceName === branchTask.taskReferenceName) {
                                lastInBranch.push(node)
                            }
                        })
                    }
                })
            });

            // find neutral node (first node after decision block)
            let decisionCaseTasksCount = 0;
            let decisionCaseTasksArray = [];
            let neutralNode = null;

            decisionCases.forEach(branch => {
                branch.forEach(task => {
                    if (task.type === "FORK_JOIN") {
                        decisionCaseTasksArray.push(task);
                        decisionCaseTasksArray.push(...fn(task.forkTasks, "name"))
                    } else {
                        decisionCaseTasksArray.push(task)
                    }
                });
            });

            decisionCaseTasksCount = decisionCaseTasksArray.length;

            nodes.forEach((node, i) => {
                if (node.type === "decision") {
                    neutralNode = nodes[i + decisionCaseTasksCount + 1]
                }
            });

            // connect decision -> first nodes
            firstInBranch.forEach((firstNode, k) => {
                if (firstNode.type === "fork") {
                    links.push(node.getPort(k === 0 ? "failPort" : "completePort").link(firstNode.getPort("left")))
                } else if (firstNode.type === "decision") {
                    links.push(node.getPort(k === 0 ? "failPort" : "completePort").link(firstNode.getPort("inputPort")))
                } else {
                    links.push(node.getPort(k === 0 ? "failPort" : "completePort").link(firstNode.getInPorts()[0]))
                }
            });

            // connect last nodes -> neutral node
            if (neutralNode) {
                lastInBranch.forEach(lastNode => {
                    links.push(linkNodes(lastNode, neutralNode))
                });

                // connect neutral port -> neutral node
                if (neutralNode.type === "fork") {
                    links.push(node.getPort("neutralPort").link(neutralNode.getPort("left")))
                } else if (neutralNode.type === "decision") {
                    links.push(node.getPort("neutralPort").link(neutralNode.getPort("inputPort")))
                } else {
                    links.push(node.getPort("neutralPort").link(neutralNode.getInPorts()[0]))
                }
            }
        }
    })
};

// in case subworkflow is not found in DB
export const transform_workflow_to_diagram = (name, version, startPosition, app) => {
    let diagramEngine = app.getDiagramEngine();
    let diagramModel = diagramEngine.getDiagramModel();

    return http.get('/api/conductor/metadata/workflow/' + name + '/' + version).then(res => {
        let tasks = res.result.tasks;
        let nodes = [];
        let links = [];

        if (!tasks) {
            throw new Error(`Cannot find selected sub-workflow: ${name}.`)
        }

        // create nodes + append inputs
        tasks.forEach((task) => {
            handleTask(task, nodes, startPosition, links)
        });

        // link nodes together
        createLinks_fork_join_nodes(nodes, tasks, links);
        createLinks_decision_nodes(nodes, tasks, links);
        createLinks_remaining_nodes(nodes, tasks, links);

        diagramModel.addAll(...nodes, ...links);
        setTimeout(() => diagramEngine.repaintCanvas(), 10);
        return nodes
    })
};