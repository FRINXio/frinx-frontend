import { Box, Button, Flex, Grid, Heading, HStack, useDisclosure, Text } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import produce from 'immer';
import { zip } from 'lodash';
import React, { useCallback, useMemo, useState, VoidFunctionComponent } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  updateEdge,
} from 'react-flow-renderer';
import callbackUtils from './callback-utils';
import ActionsMenu from './components/actions-menu/actions-menu';
import ButtonEdge from './components/edges/button-edge';
import ExecuteWorkflowModal from './components/execution-modal/execution-modal';
import ExpandedWorkflowModal from './components/expanded-workflow-modal/expanded-workflow-modal';
import LeftMenu from './components/left-menu/left-menu';
import NewWorkflowModal from './components/new-workflow-modal/new-workflow-modal';
import RightDrawer from './components/right-drawer';
import TaskForm from './components/task-form/task-form';
import WorkflowDefinitionModal from './components/workflow-definition-modal/workflow-definition-modal';
import WorkflowEditorModal from './components/workflow-editor-modal/workflow-editor-modal';
import WorkflowForm from './components/workflow-form/workflow-form';
import BaseNode from './components/workflow-nodes/base-node';
import DecisionNode from './components/workflow-nodes/decision-node';
import StartEndNode from './components/workflow-nodes/start-end-node';
import { EdgeRemoveContext } from './edge-remove-context';
import { getElementsFromWorkflow, getNodeType } from './helpers/api-to-graph.helpers';
import { convertToTasks } from './helpers/graph-to-api.helpers';
import { getLayoutedElements } from './helpers/layout.helpers';
import { ExtendedTask, NodeData, Task, TaskDefinition, Workflow } from './helpers/types';
import { getDynamicInputParametersFromWorkflow, parseInputParameters } from './helpers/workflow.helpers';
import { useTaskActions } from './task-actions-context';

type WorkflowParam = Pick<
  Workflow,
  | 'name'
  | 'description'
  | 'version'
  | 'restartable'
  | 'timeoutPolicy'
  | 'timeoutSeconds'
  | 'outputParameters'
  | 'variables'
>;

const nodeTypes = {
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
  base: BaseNode,
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

type Props = {
  workflow: Workflow<ExtendedTask>;
  workflows: Workflow[];
  taskDefinitions: TaskDefinition[];
  onWorkflowChange: (workflow: WorkflowParam) => void;
  onFileImport: (file: File) => void;
  onFileExport: (workflow: Workflow) => void;
  onWorkflowDelete: () => void;
  onWorkflowClone: (workflow: Workflow, name: string) => void;
};

const App: VoidFunctionComponent<Props> = ({
  workflow,
  onWorkflowChange,
  workflows,
  taskDefinitions,
  onFileImport,
  onFileExport,
  onWorkflowDelete,
  onWorkflowClone,
}) => {
  const { addToastNotification } = useNotifications();
  const workflowDefinitionDisclosure = useDisclosure();
  const workflowModalDisclosure = useDisclosure();
  const workflowEditorDisclosure = useDisclosure();
  const executeWorkflowModal = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [workflowTasks, setWorkflowTasks] = useState(workflow.tasks);
  const [elements, setElements] = useState<{ nodes: Node<NodeData>[]; edges: Edge[] }>(
    getLayoutedElements(getElementsFromWorkflow(workflowTasks, false)),
  );
  const [isWorkflowEdited, setIsWorkflowEdited] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleConnect = (edge: Edge<unknown> | Connection) => {
    setElements((els) => ({
      ...els,
      edges: addEdge({ ...edge, type: 'buttonedge' }, els.edges),
    }));
  };

  const handleEdgeUpdate = (oldEdge: Edge<unknown>, newConnection: Connection) => {
    setElements((els) => ({
      ...els,
      edges: updateEdge(oldEdge, newConnection, els.edges),
    }));
  };

  const onNodesChange = useCallback((changes) => {
    setElements((els) => ({
      ...els,
      nodes: applyNodeChanges(changes, els.nodes),
    }));
  }, []);
  const onEdgesChange = useCallback(
    (changes) =>
      setElements((els) => ({
        ...els,
        edges: applyEdgeChanges(changes, els.edges),
      })),
    [],
  );

  const handleDeleteButtonClick = (id: string) => {
    setElements((els) => {
      return {
        ...els,
        nodes: applyNodeChanges(
          [{ id, type: 'remove' }],
          els.nodes.filter((n) => n.data.task?.id !== id),
        ),
      };
    });
  };

  const { selectedTask, selectTask } = useTaskActions(handleDeleteButtonClick);

  const { name } = workflow;

  const handleAddButtonClick = (t: ExtendedTask) => {
    setElements((els) => {
      const newElement: Node = {
        id: t.taskReferenceName,
        type: getNodeType(t.type),
        position: { x: 0, y: 0 },
        data: {
          label: t.taskReferenceName,
          task: t,
          isReadOnly: false,
        },
      };

      if (t.type === 'DECISION') {
        newElement.data = {
          ...newElement.data,
          handles: ['default', 'other'],
        };
      }

      return {
        ...elements,
        nodes: [...els.nodes, newElement],
      };
    });
    setWorkflowTasks((prevTasks) => [...prevTasks, t]);
  };

  const handleFormSubmit = (t: ExtendedTask) => {
    const newElements = produce(elements, (acc) => {
      const index = acc.nodes.findIndex((n) => n.data?.task?.id === t.id);
      acc.nodes[index].data.task = t;

      if (t.type === 'DECISION') {
        const { handles } = acc.nodes[index].data;
        acc.nodes[index].data.handles = [...Object.keys(t.decisionCases), 'default'];
        const oldDecisionCases = handles ? handles.filter((h) => h !== 'default') : [];
        const newDecisionCases = [...Object.keys(t.decisionCases)];
        const decisionMapping = zip(oldDecisionCases, newDecisionCases);
        decisionMapping.forEach((dm) => {
          const edgeIndex = acc.edges.findIndex((e) => e.source === t.taskReferenceName && e.sourceHandle === dm[0]);
          if (edgeIndex === -1) {
            return;
          }
          // edit existing decision case - keep edge connected
          if (dm[0] !== undefined && dm[1] !== undefined) {
            const newEdge: Edge = {
              ...acc.edges[edgeIndex],
              sourceHandle: dm[1],
            };
            acc.edges.splice(edgeIndex, 1, newEdge);
          }
          // delete decision case - delete edge
          if (dm[0] !== undefined && dm[1] === undefined) {
            acc.edges.splice(edgeIndex, 1);
          }
        });
      }

      return acc;
    });

    setElements(newElements);
  };

  const handleWorkflowClone = (wfName: string) => {
    const newTasks = convertToTasks(elements);
    const { tasks, ...rest } = workflow;
    onWorkflowClone(
      {
        ...rest,
        tasks: newTasks,
      },
      wfName,
    );
  };

  const removeEdgeContextValue = useMemo(
    () => ({
      removeEdge: (id: string) => {
        setElements((els) => {
          return {
            ...els,
            edges: applyEdgeChanges([{ id, type: 'remove' }], els.edges),
          };
        });
      },
    }),
    [],
  );

  const handleOnWorkflowChange = (editedWorkflow: Workflow<Task>, isWorkflowChanged: boolean) => {
    onWorkflowChange(editedWorkflow);
    setHasUnsavedChanges(isWorkflowChanged);
  };

  const handleOnSaveWorkflow = (editedWorkflow: Workflow<Task>, shouldOpenExecuteModal = false) => {
    try {
      const { tasks, ...rest } = editedWorkflow;
      const newTasks = convertToTasks(elements);

      const { putWorkflow } = callbackUtils.getCallbacks;
      putWorkflow([
        {
          ...rest,
          tasks: newTasks,
        },
      ])
        .then(() => {
          setHasUnsavedChanges(false);
          shouldOpenExecuteModal && executeWorkflowModal.onOpen();
          addToastNotification({
            title: 'Workflow Saved',
            content: 'Workflow was successfully saved',
            type: 'success',
          });
        })
        .catch((e) => {
          addToastNotification({
            title: 'Saving wofklow error',
            content: `Workflow could not be saved: ${e}`,
            type: 'error',
          });
        });
    } catch (e) {
      addToastNotification({
        title: 'Conversion workflow error',
        content: 'Workflow could not be converted/wrong definition',
        type: 'error',
      });
    }
  };

  const handleOnExecuteWorkflow = (values: Record<string, string>) => {
    if (workflow == null) {
      addToastNotification({
        content: 'We cannot execute undefined workflow',
        type: 'error',
      });

      return null;
    }

    const { executeWorkflow } = callbackUtils.getCallbacks;

    return executeWorkflow({
      input: values,
      name: workflow.name,
      version: workflow.version,
    })
      .then((res) => {
        addToastNotification({ content: 'We successfully executed workflow', type: 'success' });
        return res.text;
      })
      .catch(() => {
        addToastNotification({ content: 'We have a problem to execute selected workflow', type: 'error' });
        return null;
      });
  };

  return (
    <>
      <Grid templateColumns="384px 1fr" templateRows="64px 1fr" minHeight="100%" height="calc(100vh - 64px)">
        <Flex
          alignItems="center"
          px={4}
          // boxShadow="base"
          position="relative"
          zIndex="modal"
          background="white"
          // borderTop="1px solid gray.100"
          gridColumnStart={1}
          gridColumnEnd={3}
          borderBottomColor="gray.100"
          borderBottomStyle="solid"
          borderBottomWidth={1}
        >
          <Box>
            <Heading size="lg">{name}</Heading>
          </Box>
          <Box ml="auto">
            <HStack spacing={2}>
              <Box>
                <ActionsMenu
                  onShowDefinitionBtnClick={workflowDefinitionDisclosure.onOpen}
                  onNewWorkflowBtnClick={workflowModalDisclosure.onOpen}
                  onWorkflowEditorBtnClick={workflowEditorDisclosure.onOpen}
                  onEditWorkflowBtnClick={() => {
                    setIsEditing(true);
                  }}
                  onSaveWorkflowBtnClick={() => handleOnSaveWorkflow(workflow)}
                  onFileImport={onFileImport}
                  onFileExport={() => {
                    const newTasks = convertToTasks(elements);
                    const { tasks, ...rest } = workflow;
                    onFileExport({
                      ...rest,
                      tasks: newTasks,
                    });
                  }}
                  onWorkflowDelete={onWorkflowDelete}
                  onWorkflowClone={handleWorkflowClone}
                  workflows={workflows}
                />
              </Box>
              <HStack>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    const newTasks = convertToTasks(elements);
                    const { tasks, ...rest } = workflow;

                    handleOnSaveWorkflow(
                      {
                        ...rest,
                        tasks: newTasks,
                      },
                      true,
                    );
                  }}
                >
                  Save and execute
                </Button>
                {hasUnsavedChanges && isWorkflowEdited && (
                  <Text textColor="red" fontSize="sm">
                    You have unsaved changes
                  </Text>
                )}
              </HStack>
            </HStack>
          </Box>
        </Flex>
        <Box minHeight="60vh" maxHeight="100vh">
          <LeftMenu onTaskAdd={handleAddButtonClick} workflows={workflows} taskDefinitions={taskDefinitions} />
        </Box>
        <Box minHeight="60vh" maxHeight="100vh" position="relative">
          <EdgeRemoveContext.Provider value={removeEdgeContextValue}>
            <ReactFlow
              nodes={elements.nodes}
              edges={elements.edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              snapToGrid
              onConnect={handleConnect}
              onEdgeUpdate={handleEdgeUpdate}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={(instance) => instance.fitView()}
            >
              <Background variant={BackgroundVariant.Dots} gap={15} size={0.8} />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </EdgeRemoveContext.Provider>
          {selectedTask?.task && selectedTask?.actionType === 'edit' && (
            <RightDrawer>
              <Box px={6} py={10}>
                <Heading as="h2" size="md" mb={10}>
                  {selectedTask.task.name}
                </Heading>
                <TaskForm
                  key={selectedTask.task.id}
                  task={selectedTask.task}
                  onClose={() => {
                    selectTask(null);
                  }}
                  onFormSubmit={handleFormSubmit}
                  tasks={workflowTasks}
                />
              </Box>
            </RightDrawer>
          )}
          {isEditing && (
            <RightDrawer>
              <Box px={6} py={10}>
                <Heading as="h2" size="md" mb={10}>
                  Edit workflow
                </Heading>
                <WorkflowForm
                  workflow={workflow}
                  onSubmit={(partialWorkflow) => {
                    handleOnWorkflowChange({ ...workflow, ...partialWorkflow }, true);
                    setIsEditing(false);
                  }}
                  onClose={() => {
                    handleOnWorkflowChange(workflow, false);
                    setIsEditing(false);
                  }}
                  canEditName={false}
                  workflows={workflows}
                  isCreatingWorkflow={false}
                  onChangeNotify={() => setIsWorkflowEdited(true)}
                />
              </Box>
            </RightDrawer>
          )}
        </Box>
      </Grid>
      {selectedTask?.actionType === 'expand' && (
        <ExpandedWorkflowModal
          onClose={() => {
            selectTask(null);
          }}
          workflowName={selectedTask.task.subWorkflowParam.name}
          workflowVersion={selectedTask.task.subWorkflowParam.version}
        />
      )}
      {workflowDefinitionDisclosure.isOpen && (
        <WorkflowDefinitionModal isOpen onClose={workflowDefinitionDisclosure.onClose} workflow={workflow} />
      )}
      <NewWorkflowModal isOpen={workflowModalDisclosure.isOpen} onClose={workflowModalDisclosure.onClose} />
      <ExecuteWorkflowModal
        parsedInputParameters={parseInputParameters(workflow.inputParameters)}
        dynamicInputParameters={getDynamicInputParametersFromWorkflow(workflow)}
        onClose={executeWorkflowModal.onClose}
        isOpen={executeWorkflowModal.isOpen}
        workflowName={workflow.name}
        workflowDescription={workflow.description}
        onSubmit={handleOnExecuteWorkflow}
      />
      {workflowEditorDisclosure.isOpen && (
        <WorkflowEditorModal
          workflow={workflow}
          isOpen={workflowEditorDisclosure.isOpen}
          onSave={(editedWorkflow) => handleOnWorkflowChange(editedWorkflow, true)}
          onClose={workflowEditorDisclosure.onClose}
          onChangeNotify={() => setIsWorkflowEdited(true)}
        />
      )}
    </>
  );
};

export default App;
