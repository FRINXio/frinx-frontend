import {CircleStartNodeModel} from "./NodeModels/StartNode/CircleStartNodeModel";
import {DefaultNodeModel} from "./NodeModels/DefaultNodeModel/DefaultNodeModel";
import {CircleEndNodeModel} from "./NodeModels/EndNode/CircleEndNodeModel";
import * as _ from "lodash";
import {ForkNodeModel} from "./NodeModels/ForkNode/ForkNodeModel";
import {JoinNodeModel} from "./NodeModels/JoinNode/JoinNodeModel";
import {DecisionNodeModel} from "./NodeModels/DecisionNode/DecisionNodeModel";

export const getWfInputsRegex = (wf) => {
    let def = JSON.stringify(wf);
    let matchArray = def.match(/\workflow.input([\w.])+}/igm);
    let inputsArray = [];
    let inputParameters = {};

    if (matchArray) {
        let sortedArray =  matchArray.join().match(/[^.]+(?=})/igm);
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

    return _.flatten(_.map(obj, function(v) {
        return typeof v == "object" ? fn(v, key) : [];
    }), true);
}

export const getLinksArray = (type, node) => {
    let linksArray = [];
    _.values(node.ports).forEach(port => {
        if (type === "in" || type === "inputPort") {
            if (port.in) {
                linksArray = _.values(port.links);
            }
        } else if (type === "out") {
            if (!port.in) {
                linksArray = _.values(port.links);
            }
        }
    });
    return linksArray;
};

export const getFirstNode = (links) => {
    let parentNode = null;
    _.values(links).forEach(link => {
        if (link.sourcePort.type === "start") {
            parentNode = link.sourcePort.parent;
        }
    });
    return parentNode;
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
                    joinOn.push(parent.inputs.taskReferenceName);
                    joinNode = current;
                    current = null;
                    break;
                case "fork":
                    let innerForkNode = handleForkNode(current).forkNode;
                    let innerJoinNode = handleForkNode(current).joinNode;
                    let innerJoinOutLinks = getLinksArray("out", innerJoinNode);
                    tmpBranch.push(innerForkNode.inputs, innerJoinNode.inputs);
                    parent = innerJoinNode;
                    current = innerJoinOutLinks[0].targetPort.getNode();
                    break;
                case "decision":
                    let {decideNode, firstNeutralNode} = handleDecideNode(current);
                    tmpBranch.push(decideNode.inputs);
                    current = firstNeutralNode;
                    break;
                default:
                    tmpBranch.push(current.inputs);
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

    forkNode.inputs.forkTasks = forkTasks;
    joinNode.inputs.joinOn = joinOn;

    return {forkNode, joinNode}
};

export const handleDecideNode = (decideNode) => {
    let completeBranchLink = _.values(decideNode.ports.completePort.links)[0];
    let failBranchLink = _.values(decideNode.ports.failPort.links)[0];
    let neutralBranchLink = _.values(decideNode.ports.neutralPort.links)[0];
    let firstNeutralNode = null;

    [completeBranchLink, failBranchLink].forEach( (branch, i) => {
        if (branch) {
            let branchArray = [];
            let currentNode = branch.targetPort.getNode();
            let inputLinks = getLinksArray("in", currentNode);
            let outputLink = getLinksArray("out", currentNode)[0];

            while ((inputLinks.length === 1 || currentNode.type === "join" || currentNode.type === "decision") && outputLink) {
                switch (currentNode.type) {
                    case "fork":
                        let {forkNode, joinNode} = handleForkNode(currentNode);
                        branchArray.push(forkNode.inputs, joinNode.inputs);
                        currentNode = joinNode;
                        break;
                    case "decision":
                        let innerDecideNode = handleDecideNode(currentNode).decideNode;
                        let innerFirstNeutralNode = handleDecideNode(currentNode).firstNeutralNode;
                        let innerFirstNeutralLinks = getLinksArray("out", innerFirstNeutralNode);
                        branchArray.push(innerDecideNode.inputs);
                        branchArray.push(innerFirstNeutralNode.inputs);
                        currentNode = innerFirstNeutralLinks[0].targetPort.getNode();
                        break;
                    default:
                        branchArray.push(currentNode.inputs);
                        currentNode = outputLink.targetPort.getNode();
                        break;
                }
                inputLinks = getLinksArray("in", currentNode);
                outputLink = getLinksArray("out", currentNode)[0];
            }

            let casesValues = Object.keys(decideNode.inputs.decisionCases);

            switch (i) {
                case 0: decideNode.inputs.decisionCases[casesValues[1]] = branchArray; break;
                case 1: decideNode.inputs.decisionCases[casesValues[0]] = branchArray; break;
                default: break
            }
        }
    });
    if (neutralBranchLink) {
        firstNeutralNode = neutralBranchLink.targetPort.getNode();
    }
    return {decideNode, firstNeutralNode}
};

export const createMountAndCheckExample = (app, props) => {
    let diagramEngine = app.getDiagramEngine();
    let activeModel = diagramEngine.getDiagramModel();

    diagramEngine.setDiagramModel(activeModel);
    _.values(activeModel.getNodes()).forEach(node => {
        activeModel.removeNode(node);
    });

    _.values(activeModel.getLinks()).forEach(link => {
        activeModel.removeLink(link);
    });

    let wf1 = {}, wf2 = {};
    props.workflows.forEach(wf => {
        if (wf.name === "Mount_cli_device") {
            wf1 = {
                name: "",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        } else if (wf.name === "Check_connection_cli_device") {
            wf2 = {
                name: "",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        }
    });

    let start = new CircleStartNodeModel("Start");
    start.setPosition(700, 120);

    let node1 = new DefaultNodeModel("Mount_cli_device","rgb(169,74,255)", wf1 );
    let node1InPort = node1.addInPort("In");
    let node1OutPort = node1.addOutPort("Out");
    node1.setPosition(start.x + 200, 100);

    let node2 = new DefaultNodeModel("Check_connection_cli_device","rgb(169,74,255)", wf2 );
    let node2InPort = node2.addInPort("In");
    let node2OutPort = node2.addOutPort("Out");
    node2.setPosition(node1.x + 200, 100);

    let end = new CircleEndNodeModel("End");
    end.setPosition(node2.x + 250, 120);

    let link1 = start.getPort("right").link(node1InPort);
    let link2 = node1OutPort.link(node2InPort);
    let link3 = node2OutPort.link(end.getPort("left"));

    activeModel.setZoomLevel(100);
    activeModel.setOffsetX(0);
    activeModel.setOffsetY(0);

    activeModel.addAll(start, end, node1, node2, link1, link2, link3);
    setTimeout(() => diagramEngine.repaintCanvas(), 10);

    return app.getDiagramEngine().getDiagramModel().getNodes();
};

export const createSampleBatchInventoryRetrievalExample = (app, props) => {
    let diagramEngine = app.getDiagramEngine();
    let activeModel = diagramEngine.getDiagramModel();

    diagramEngine.setDiagramModel(activeModel);
    _.values(activeModel.getNodes()).forEach(node => {
        activeModel.removeNode(node);
    });

    _.values(activeModel.getLinks()).forEach(link => {
        activeModel.removeLink(link);
    });

    let wf1 = {}, wf2 = {}, wf3 = {};
    props.workflows.forEach(wf => {
        if (wf.name === "Mount_and_check") {
            wf1 = {
                name: "sub_mount",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        } if (wf.name === "Read_structured_device_data_in_unified") {
            wf2 = {
                name: "sub_read",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        } if (wf.name === "Unmount_cli_device") {
            wf3 = {
                name: "sub_unmount",
                taskReferenceName: "",
                inputParameters: getWfInputs(wf),
                type: "SUB_WORKFLOW",
                subWorkflowParam: {
                    name: wf.name,
                    version: 1
                },
                optional: false
            };
        }

    });

    let forkObject = {
        name: "forkTask",
        taskReferenceName: "forkTaskRef",
        type: "FORK_JOIN",
        forkTasks: [],
        optional: false,
        startDelay: 0
    };

    let joinObject = {
        name: "joinTask",
        taskReferenceName: "joinTaskRef",
        type: "JOIN",
        joinOn: [],
        optional: false,
        startDelay: 0
    };

    let start = new CircleStartNodeModel("Start");
    start.setPosition(700, 122);

    let fork1 = new ForkNodeModel("fork", null, {...forkObject, taskReferenceName: "fork_mount"});
    fork1.setPosition(start.x + 150, 135);
    let fork1Left = fork1.getPort("left");
    let fork1Right = fork1.getPort("right");

    let mount1 = new DefaultNodeModel("Mount_and_check","rgb(169,74,255)", {...wf1, taskReferenceName: "mount1"});
    let mount1InPort = mount1.addInPort("In");
    let mount1OutPort = mount1.addOutPort("Out");
    mount1.setPosition(fork1.x + 200, 70);

    let mount2 = new DefaultNodeModel("Mount_and_check","rgb(169,74,255)", {...wf1, taskReferenceName: "mount2"});
    let mount2InPort = mount2.addInPort("In");
    let mount2OutPort = mount2.addOutPort("Out");
    mount2.setPosition(fork1.x + 200, 135);

    let mount3 = new DefaultNodeModel("Mount_and_check","rgb(169,74,255)", {...wf1, taskReferenceName: "mount3"});
    let mount3InPort = mount3.addInPort("In");
    let mount3OutPort = mount3.addOutPort("Out");
    mount3.setPosition(fork1.x + 200, 200);

    let join1 = new JoinNodeModel("join", null, {...joinObject, taskReferenceName: "join_mount"});
    join1.setPosition(mount2.x + 200, 135);
    let join1Left = join1.getPort("left");
    let join1Right = join1.getPort("right");

    let fork2 = new ForkNodeModel("fork", null, {...forkObject, taskReferenceName: "fork_read"});
    fork2.setPosition(join1.x + 120, 135);
    let fork2Left = fork2.getPort("left");
    let fork2Right = fork2.getPort("right");

    let read1 = new DefaultNodeModel("Read_structured_device_data_in_unified","rgb(169,74,255)", {...wf2, taskReferenceName: "read1"});
    let read1InPort = read1.addInPort("In");
    let read1OutPort = read1.addOutPort("Out");
    read1.setPosition(fork2.x + 200, 70);

    let read2 = new DefaultNodeModel("Read_structured_device_data_in_unified","rgb(169,74,255)", {...wf2, taskReferenceName: "read2"});
    let read2InPort = read2.addInPort("In");
    let read2OutPort = read2.addOutPort("Out");
    read2.setPosition(fork2.x + 200, 135);

    let read3 = new DefaultNodeModel("Read_structured_device_data_in_unified","rgb(169,74,255)", {...wf2, taskReferenceName: "read3"});
    let read3InPort = read3.addInPort("In");
    let read3OutPort = read3.addOutPort("Out");
    read3.setPosition(fork2.x + 200, 200);

    let join2 = new JoinNodeModel("join", null, {...joinObject, taskReferenceName: "join_read"});
    join2.setPosition(read2.x + 300, 135);
    let join2Left = join2.getPort("left");
    let join2Right = join2.getPort("right");

    let fork3 = new ForkNodeModel("join", null, {...forkObject, taskReferenceName: "fork_unmount"});
    fork3.setPosition(join2.x + 120, 135);
    let fork3Left = fork3.getPort("left");
    let fork3Right = fork3.getPort("right");

    let unmount1 = new DefaultNodeModel("Unmount_cli_device","rgb(169,74,255)", {...wf3, taskReferenceName: "unmount1"});
    let unmount1InPort = unmount1.addInPort("In");
    let unmount1OutPort = unmount1.addOutPort("Out");
    unmount1.setPosition(fork3.x + 200, 70);

    let unmount2 = new DefaultNodeModel("Unmount_cli_device","rgb(169,74,255)", {...wf3, taskReferenceName: "unmount2"} );
    let unmount2InPort = unmount2.addInPort("In");
    let unmount2OutPort = unmount2.addOutPort("Out");
    unmount2.setPosition(fork3.x + 200, 135);

    let unmount3 = new DefaultNodeModel("Unmount_cli_device","rgb(169,74,255)", {...wf3, taskReferenceName: "unmount3"} );
    let unmount3InPort = unmount3.addInPort("In");
    let unmount3OutPort = unmount3.addOutPort("Out");
    unmount3.setPosition(fork3.x + 200, 200);

    let join3 = new JoinNodeModel("join", null, {...joinObject, taskReferenceName: "join_unmount"});
    join3.setPosition(unmount2.x + 200, 135);
    let join3Left = join3.getPort("left");
    let join3Right = join3.getPort("right");

    let end = new CircleEndNodeModel("End");
    end.setPosition(join3.x + 150, 122);


    let link1 = start.getPort("right").link(fork1Left);

    let link2 = fork1Right.link(mount1InPort);
    let link3 = fork1Right.link(mount2InPort);
    let link4 = fork1Right.link(mount3InPort);

    let link5 = mount1OutPort.link(join1Left);
    let link6 = mount2OutPort.link(join1Left);
    let link7 = mount3OutPort.link(join1Left);

    let link8 = join1Right.link(fork2Left);

    let link9 = fork2Right.link(read1InPort);
    let link10 = fork2Right.link(read2InPort);
    let link11 = fork2Right.link(read3InPort);

    let link12 = read1OutPort.link(join2Left);
    let link13 = read2OutPort.link(join2Left);
    let link14 = read3OutPort.link(join2Left);

    let link15 = join2Right.link(fork3Left);

    let link16 = fork3Right.link(unmount1InPort);
    let link17 = fork3Right.link(unmount2InPort);
    let link18 = fork3Right.link(unmount3InPort);

    let link19 = unmount1OutPort.link(join3Left);
    let link20 = unmount2OutPort.link(join3Left);
    let link21 = unmount3OutPort.link(join3Left);

    let link22 = join3Right.link(end.getPort("left"));

    activeModel.addAll(link1, link2, link3, link4, link5, link6, link7, link8, link9, link10, link11, link12, link13, link14, link15, link16, link17, link18, link19, link20, link21, link22);
    activeModel.addAll(start, mount1, mount2, mount3, fork1, join1, fork2, read1, read2, read3, join2, fork3, unmount1, unmount2, unmount3, join3, end);

    activeModel.setZoomLevel(95);
    activeModel.setOffsetX(-630);
    activeModel.setOffsetY(200);

    setTimeout(() => diagramEngine.repaintCanvas(), 10);

    return app.getDiagramEngine().getDiagramModel().getNodes();
};

export const create_L2VPN_P2P_OC_Uniconfig_Example_Workflow = (app, props) => {
    let diagramEngine = app.getDiagramEngine();
    let activeModel = diagramEngine.getDiagramModel();

    diagramEngine.setDiagramModel(activeModel);
    _.values(activeModel.getNodes()).forEach(node => {
        activeModel.removeNode(node);
    });

    _.values(activeModel.getLinks()).forEach(link => {
        activeModel.removeLink(link);
    });

    let wfs = [];
    let wfNames = ["UNICONFIG_sync_from_network", "UNICONFIG_replace_config_with_oper",
        "UNICONFIG_write_structured_device_data", "UNICONFIG_commit", "Read_journal_cli_device"];

    props.workflows.forEach((wf,i) => {
        if (wfNames.includes(wf.name)) {
            wfs.push({
                name: wf.name,
                taskReferenceName: wf.name.toLowerCase() + "_ref" + i,
                inputParameters: getWfInputs(wf),
                type: "SIMPLE",
                startDelay: 0,
                optional: false
            })
        }
    });

    let decideObject = {
        name: "decide_task",
        taskReferenceName: "decide1",
        inputParameters: {
            case_value_param: "${UNICONFIG_commit.output.response_body.output.overall-configuration-status}"
        },
        type: "DECISION",
        caseValueParam: "case_value_param",
        decisionCases: {
            fail: [],
            complete: []
        },
        optional: false,
        startDelay: 0
    };

    console.log(wfs);

    let start = new CircleStartNodeModel("Start");
    start.setPosition(700, 118);

    let sync = new DefaultNodeModel("UNICONFIG_sync_from_network","rgb(169,74,255)", wfs[3]);
    let syncInPort = sync.addInPort("In");
    let syncOutPort = sync.addOutPort("Out");
    sync.setPosition(start.x + 180, 135);

    let replace = new DefaultNodeModel("UNICONFIG_replace_config_with_oper","rgb(169,74,255)", wfs[1]);
    let replaceInPort = replace.addInPort("In");
    let replaceOutPort = replace.addOutPort("Out");
    replace.setPosition(sync.x + 280, 135);

    let write1_obj = {
            name: "UNICONFIG_write_structured_device_data",
            taskReferenceName: "UNICONFIG_write_structured_device_data_on_first_node",
            inputParameters: {
                node01: "${workflow.input.node01}",
                id: "${workflow.input.node01}",
                interface01: "${workflow.input.interface01}",
                VCID: "${workflow.input.vcid}",
                uri: "/frinx-openconfig-network-instance:network-instances/network-instance/conn1233",
                template: "{\r\n      \"frinx-openconfig-network-instance:network-instance\": [\r\n        {\r\n          \"name\": \"conn1233\",\r\n          \"config\": {\r\n            \"name\": \"conn1233\",\r\n            \"type\": \"frinx-openconfig-network-instance-types:L2P2P\"\r\n          },\r\n          \"connection-points\": {\r\n            \"connection-point\": [\r\n              {\r\n                \"connection-point-id\": \"1\",\r\n                \"config\": {\r\n                  \"connection-point-id\": \"1\"\r\n                },\r\n                \"endpoints\": {\r\n                  \"endpoint\": [\r\n                    {\r\n                      \"endpoint-id\": \"default\",\r\n                      \"config\": {\r\n                        \"endpoint-id\": \"default\",\r\n                        \"precedence\": 0,\r\n                        \"type\": \"frinx-openconfig-network-instance-types:LOCAL\"\r\n                      },\r\n                      \"local\": {\r\n                        \"config\": {\r\n                          \"interface\": \"${workflow.input.interface01}\"\r\n                        }\r\n                      }\r\n                    }\r\n                  ]\r\n                }\r\n              },\r\n              {\r\n                \"connection-point-id\": \"2\",\r\n                \"config\": {\r\n                  \"connection-point-id\": \"2\"\r\n                },\r\n                \"endpoints\": {\r\n                  \"endpoint\": [\r\n                    {\r\n                      \"endpoint-id\": \"default\",\r\n                      \"config\": {\r\n                        \"endpoint-id\": \"default\",\r\n                        \"precedence\": 0,\r\n                        \"type\": \"frinx-openconfig-network-instance-types:REMOTE\"\r\n                      },\r\n                      \"remote\": {\r\n                        \"config\": {\r\n                          \"remote-system\": \"8.8.8.8\",\r\n                          \"virtual-circuit-identifier\": ${workflow.input.vcid}\r\n                        }\r\n                      }\r\n                    }\r\n                  ]\r\n                }\r\n              }\r\n            ]\r\n          }\r\n        }\r\n      ]\r\n    \r\n  }",
                params: "{}"
            },
            type: "SIMPLE",
            startDelay: 0,
            optional: false
        };

    let write2_obj = {
            name: "UNICONFIG_write_structured_device_data",
            taskReferenceName: "UNICONFIG_write_structured_device_data_on_second_node",
            inputParameters: {
                node02: "${workflow.input.node02}",
                id: "${workflow.input.node02}",
                interface02: "${workflow.input.interface02}",
                uri: "/frinx-openconfig-network-instance:network-instances/network-instance/conn1233",
                template: "{\r\n      \"frinx-openconfig-network-instance:network-instance\": [\r\n        {\r\n          \"name\": \"conn1233\",\r\n          \"config\": {\r\n            \"name\": \"conn1233\",\r\n            \"type\": \"frinx-openconfig-network-instance-types:L2P2P\"\r\n          },\r\n          \"connection-points\": {\r\n            \"connection-point\": [\r\n              {\r\n                \"connection-point-id\": \"1\",\r\n                \"config\": {\r\n                  \"connection-point-id\": \"1\"\r\n                },\r\n                \"endpoints\": {\r\n                  \"endpoint\": [\r\n                    {\r\n                      \"endpoint-id\": \"default\",\r\n                      \"config\": {\r\n                        \"endpoint-id\": \"default\",\r\n                        \"precedence\": 0,\r\n                        \"type\": \"frinx-openconfig-network-instance-types:LOCAL\"\r\n                      },\r\n                      \"local\": {\r\n                        \"config\": {\r\n                          \"interface\": \"${workflow.input.interface02}\"\r\n                        }\r\n                      }\r\n                    }\r\n                  ]\r\n                }\r\n              },\r\n              {\r\n                \"connection-point-id\": \"2\",\r\n                \"config\": {\r\n                  \"connection-point-id\": \"2\"\r\n                },\r\n                \"endpoints\": {\r\n                  \"endpoint\": [\r\n                    {\r\n                      \"endpoint-id\": \"default\",\r\n                      \"config\": {\r\n                        \"endpoint-id\": \"default\",\r\n                        \"precedence\": 0,\r\n                        \"type\": \"frinx-openconfig-network-instance-types:REMOTE\"\r\n                      },\r\n                      \"remote\": {\r\n                        \"config\": {\r\n                          \"remote-system\": \"7.7.7.7\",\r\n                          \"virtual-circuit-identifier\": ${workflow.input.vcid}\r\n                        }\r\n                      }\r\n                    }\r\n                  ]\r\n                }\r\n              }\r\n            ]\r\n          }\r\n        }\r\n      ]\r\n    \r\n  }",
                params: "{}"
            },
            type: "SIMPLE",
            startDelay: 0,
            optional: false
        };

    let write1 = new DefaultNodeModel("UNICONFIG_write_structured_device_data","rgb(169,74,255)", write1_obj);
    let writeInPort = write1.addInPort("In");
    let writeOutPort = write1.addOutPort("Out");
    write1.setPosition(replace.x + 280, 135);

    let write2 = new DefaultNodeModel("UNICONFIG_write_structured_device_data", "rgb(169,74,255)", write2_obj);
    let write2Left = write2.addInPort("In");
    let write2Right = write2.addOutPort("Out");
    write2.setPosition(write1.x + 300, 135);

    let commit = new DefaultNodeModel("UNICONFIG_commit", "rgb(169,74,255)", wfs[0]);
    let commitLeft = commit.addInPort("In");
    let commitRight = commit.addOutPort("Out");
    commit.setPosition(write2.x + 300, 135);

    let decide = new DecisionNodeModel("decision",null, decideObject);
    let decideLeft = decide.getPort("inputPort");
    let decideRight = decide.getPort("neutralPort");
    let decideTop = decide.getPort("failPort");
    let decideBottom = decide.getPort("completePort");
    decide.setPosition(commit.x + 200, 135);

    let http_generic1 = {
        name: "http_get_generic",
        taskReferenceName: "http_get_generic_instance_fail",
        inputParameters: {
            http_request: {
                uri: "https://hooks.slack.com/services/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",
                method: "POST",
                contentType: "application/json",
                body: "{\"text\":\"The configuration attempt on ${workflow.input.node01} and ${workflow.input.node02} failed and the configurations on both nodes have been reverted back to the state before the configuration attempt.\"}",
                connectionTimeOut: "3600",
                readTimeOut: "3600"
            }
        },
        type: "HTTP",
        startDelay: 0,
        optional: false
    };

    let http1 = new DefaultNodeModel("http_get_generic","rgb(169,74,255)", http_generic1);
    let http1InPort = http1.addInPort("In");
    let http1OutPort = http1.addOutPort("Out");
    http1.setPosition(decide.x + 110, 20);

    let http2 = new DefaultNodeModel("http_get_generic","rgb(169,74,255)",
        {...http_generic1, taskReferenceName: "http_get_generic_instance_complete",
            body: "{\"text\":\"Nodes ${workflow.input.node01} and ${workflow.input.node02} were successfully configured with an L2VPN service !\"}"});
    let http2InPort = http2.addInPort("In");
    let http2OutPort = http2.addOutPort("Out");
    http2.setPosition(decide.x + 110, 270);

    let getcli1 = new DefaultNodeModel("Read_journal_cli_device","rgb(169,74,255)", {...wfs[2], inputParameters: {id: "${workflow.input.node01}"}});
    let getcli1InPort = getcli1.addInPort("In");
    let getcli1OutPort = getcli1.addOutPort("Out");
    getcli1.setPosition(http2.x + 250, 135);

    let getcli2 = new DefaultNodeModel("Read_journal_cli_device","rgb(169,74,255)", {...wfs[2], inputParameters: {id: "${workflow.input.node02}"}});
    let getcli2InPort = getcli2.addInPort("In");
    let getcli2OutPort = getcli2.addOutPort("Out");
    getcli2.setPosition(getcli1.x + 200, 135);

    let end = new CircleEndNodeModel("End");
    end.setPosition(getcli2.x + 150, 118);


    let link1 = start.getPort("right").link(syncInPort);

    let link2 = syncOutPort.link(replaceInPort);
    let link3 = replaceOutPort.link(writeInPort);
    let link4 = writeOutPort.link(write2Left);

    let link5 = write2Right.link(commitLeft);
    let link6 = commitRight.link(decideLeft);

    let link7 = decideTop.link(http1InPort);
    let link8 = decideBottom.link(http2InPort);
    let link9 = decideRight.link(getcli1InPort);

    let link10 = http1OutPort.link(getcli1InPort);
    let link11 = http2OutPort.link(getcli1InPort);

    let link12 = getcli1OutPort.link(getcli2InPort);
    let link13 = getcli2OutPort.link(end.getPort("left"));

    activeModel.addAll(link1, link2, link3, link4, link5, link6, link7, link8, link9, link10, link11, link12, link13);
    activeModel.addAll(start, sync, replace, write1, write2, commit, decide, http1, http2, getcli1, getcli2, end);

    activeModel.setZoomLevel(78);
    activeModel.setOffsetX(-520);
    activeModel.setOffsetY(200);

    setTimeout(() => diagramEngine.repaintCanvas(), 10);

    return app.getDiagramEngine().getDiagramModel().getNodes();
};

