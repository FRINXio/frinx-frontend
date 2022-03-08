import { Box, Button, Flex, Grid, Heading, HStack, Text, useDisclosure } from '@chakra-ui/react';
import produce from 'immer';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Elements,
  MiniMap,
  ReactFlowProvider,
  removeElements,
  updateEdge,
} from 'react-flow-renderer';
import callbackUtils from './callback-utils';
import ActionsMenu from './components/actions-menu/actions-menu';
import ExecutionModal from './components/execution-modal/execution-modal';
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
import { convertToTasks } from './helpers/api.helpers';
import { getElementsFromWorkflow, getNodeType } from './helpers/data.helpers';
import { getLayoutedElements } from './helpers/layout.helpers';
import { ExtendedTask, TaskDefinition, Workflow } from './helpers/types';
import unwrap from './helpers/unwrap';
import { useTaskActions } from './task-actions-context';

const nodeTypes = {
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
  base: BaseNode,
};

type Props = {
  onClose: () => void;
  workflow: Workflow<ExtendedTask>;
  workflows: Workflow[];
  taskDefinitions: TaskDefinition[];
  onWorkflowChange: (
    workflow: Pick<
      Workflow,
      | 'name'
      | 'description'
      | 'version'
      | 'ownerEmail'
      | 'restartable'
      | 'timeoutPolicy'
      | 'timeoutSeconds'
      | 'outputParameters'
      | 'variables'
    >,
  ) => void;
  onExecuteSuccessClick: (workflowId: string) => void;
  onEditWorkflowClick: (name: string, version: string) => void;
  onNewWorkflowClick: () => void;
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
  onExecuteSuccessClick,
  onEditWorkflowClick,
  onNewWorkflowClick,
  onFileImport,
  onFileExport,
  onWorkflowDelete,
  onWorkflowClone,
}) => {
  const workflowDefinitionDisclosure = useDisclosure();
  const workflowModalDisclosure = useDisclosure();
  const workflowEditorDisclosure = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [isInputModalShown, setIsInputModalShown] = useState(false);
  const [workflowTasks, setWorkflowTasks] = useState(workflow.tasks);
  const [elements, setElements] = useState(getElementsFromWorkflow(workflowTasks, false));

  const handleConnect = (edge: Edge<unknown> | Connection) => {
    setElements((els) => addEdge(edge, els));
  };

  const handleEdgeUpdate = (oldEdge: Edge<unknown>, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
  };

  const handleElementsRemove = (elementsToRemove: Elements<unknown>) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const handleDeleteButtonClick = (id: string) => {
    setElements((els) => {
      const elementsToRemove = els.filter((e) => e.data?.task?.id === id);
      return removeElements(elementsToRemove, els);
    });
  };

  const { selectedTask, selectTask } = useTaskActions(handleDeleteButtonClick);

  const { name } = workflow;

  const handleAddButtonClick = (t: ExtendedTask) => {
    setElements((els) => {
      return [
        ...els,
        {
          id: t.taskReferenceName,
          type: getNodeType(t.type),
          position: { x: 0, y: 0 },
          data: {
            label: t.taskReferenceName,
            task: t,
            isReadOnly: false,
          },
        },
      ];
    });
    setWorkflowTasks((prevTasks) => [...prevTasks, t]);
  };

  const handleFormSubmit = (t: ExtendedTask) => {
    setElements((els) => {
      return produce(els, (acc) => {
        const index = acc.findIndex((n) => n.data?.task?.id === t.id);
        unwrap(acc[index].data).task = t;
        return acc;
      });
    });
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

  const layoutedElements = useMemo(() => getLayoutedElements(elements), [elements]);

  return (
    <>
      <Grid templateColumns="384px 1fr" templateRows="64px 1fr" minHeight="100%" maxHeight="100%">
        <Flex
          alignItems="center"
          px={4}
          boxShadow="base"
          position="relative"
          zIndex="modal"
          background="white"
          gridColumnStart={1}
          gridColumnEnd={3}
        >
          <Box>
            <Heading size="lg" mb={2}>
              {name}
            </Heading>
            <Text color="gray.700" size="sm">
              {/* {JSON.parse(description).description} */}
            </Text>
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
                  onSaveWorkflowBtnClick={() => {
                    const newTasks = convertToTasks(elements);
                    const { tasks, ...rest } = workflow;
                    const { putWorkflow } = callbackUtils.getCallbacks;
                    putWorkflow([
                      {
                        ...rest,
                        tasks: newTasks,
                      },
                    ]);
                  }}
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
              <Button
                colorScheme="blue"
                onClick={() => {
                  const newTasks = convertToTasks(elements);
                  const { tasks, ...rest } = workflow;
                  const { putWorkflow } = callbackUtils.getCallbacks;
                  putWorkflow([
                    {
                      ...rest,
                      tasks: newTasks,
                    },
                  ]).then(() => {
                    setIsInputModalShown(true);
                  });
                }}
              >
                Save and execute
              </Button>
            </HStack>
          </Box>
        </Flex>
        <Box minHeight="60vh" maxHeight="100vh">
          <LeftMenu onTaskAdd={handleAddButtonClick} workflows={workflows} taskDefinitions={taskDefinitions} />
        </Box>
        <Box minHeight="60vh" maxHeight="100vh" position="relative">
          <ReactFlowProvider>
            <ReactFlow
              elements={layoutedElements}
              nodeTypes={nodeTypes}
              snapToGrid
              onConnect={handleConnect}
              onEdgeUpdate={handleEdgeUpdate}
              onElementsRemove={handleElementsRemove}
              onLoad={(instance) => instance.fitView()}
            >
              <Background variant={BackgroundVariant.Dots} gap={15} size={0.8} />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
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
                  onSubmit={(wf) => {
                    onWorkflowChange(wf);
                  }}
                  onClose={() => {
                    onWorkflowChange(workflow);
                    setIsEditing(false);
                  }}
                  canEditName={false}
                  workflows={workflows}
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
          onEditBtnClick={onEditWorkflowClick}
        />
      )}
      {workflowDefinitionDisclosure.isOpen && (
        <WorkflowDefinitionModal isOpen onClose={workflowDefinitionDisclosure.onClose} workflow={workflow} />
      )}
      <NewWorkflowModal
        isOpen={workflowModalDisclosure.isOpen}
        onClose={workflowModalDisclosure.onClose}
        onConfirm={onNewWorkflowClick}
      />
      {isInputModalShown && (
        <ExecutionModal
          workflow={workflow}
          onClose={() => setIsInputModalShown(false)}
          shouldCloseAfterSubmit={false}
          isOpen={isInputModalShown}
          onSuccessClick={onExecuteSuccessClick}
        />
      )}
      {workflowEditorDisclosure.isOpen && (
        <WorkflowEditorModal
          workflow={workflow}
          isOpen={workflowEditorDisclosure.isOpen}
          onSave={onWorkflowChange}
          onClose={workflowEditorDisclosure.onClose}
        />
      )}
    </>
  );
};

export default App;
