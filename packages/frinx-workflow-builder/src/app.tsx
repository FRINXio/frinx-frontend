import { Box, Button, Flex, Grid, Heading, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useSchema } from 'beautiful-react-diagrams';
import ReactFlow from 'react-flow-renderer';
import 'beautiful-react-diagrams/dist/styles.css';
import produce, { castImmutable } from 'immer';
import React, { useCallback, useMemo, useRef, useState, VoidFunctionComponent } from 'react';
import { getElementsFromWorkflow } from './helpers/data.helpers';
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
import { createDiagramController } from './helpers/diagram.helpers';
import { CustomNodeType, ExtendedTask, NodeData, TaskDefinition, Workflow } from './helpers/types';
import unwrap from './helpers/unwrap';
import { createWorkflowHelper, deserializeId } from './helpers/workflow.helpers';
import { getLayoutedElements } from './helpers/layout.helpers';
import { useTaskActions } from './task-actions-context';

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
  const workflowCtrlRef = useRef(useMemo(() => createWorkflowHelper(), []));
  const schemaCtrlRef = useRef(useMemo(() => createDiagramController(workflow), [workflow]));
  const [schema, { onChange, addNode }] = useSchema<NodeData>(
    useMemo(() => schemaCtrlRef.current.createSchemaFromWorkflow(), []),
  );

  console.log(workflow.tasks); // eslint-disable-line no-console
  const elements = getElementsFromWorkflow(workflow);
  const layoutedElements = getLayoutedElements(elements);

  const handleDeleteButtonClick = useCallback(
    (id: string) => {
      // TODO: wait for the library update to fix a bug with removing node with links
      // we use simple `onChange` instead of `removeNode` for now
      onChange({
        links: schema.links?.filter((l) => deserializeId(l.input).id !== id && deserializeId(l.output).id !== id) ?? [],
        nodes: schema.nodes.filter((n) => n.id !== id),
      });
    },
    [schema.nodes, onChange, schema.links],
  );
  const { selectedTask, selectTask } = useTaskActions(handleDeleteButtonClick);

  const { name } = workflow;

  const handleAddButtonClick = (t: ExtendedTask) => {
    addNode(schemaCtrlRef.current.createTaskNode(t));
    setWorkflowTasks((prevTasks) => [...prevTasks, t]);
  };

  const handleFormSubmit = (t: ExtendedTask) => {
    const copiedNodes = castImmutable(
      produce(schema.nodes, (acc) => {
        const index = acc.findIndex((n) => n.id === t.id);

        unwrap(acc[index].data).task = t;

        return acc;
      }),
      // immer.js returns incompatible type, so we have to cast it manually
    ) as CustomNodeType[];
    onChange({ nodes: copiedNodes });
  };

  const handleWorkflowClone = (wfName: string) => {
    const wf: Workflow = workflowCtrlRef.current.convertWorkflow(schema, workflow);
    onWorkflowClone(wf, wfName);
  };

  return (
    <>
      <Grid templateColumns="384px 1fr" templateRows="64px 1fr" minHeight="100%" maxHeight="100%">
        <Flex
          // height={16}
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
                    const { putWorkflow } = callbackUtils.getCallbacks;
                    putWorkflow([workflowCtrlRef.current.convertWorkflow(schema, workflow)]);
                  }}
                  onFileImport={onFileImport}
                  onFileExport={() => {
                    onFileExport(workflowCtrlRef.current.convertWorkflow(schema, workflow));
                  }}
                  onWorkflowDelete={onWorkflowDelete}
                  onWorkflowClone={handleWorkflowClone}
                  workflows={workflows}
                />
              </Box>
              <Button
                colorScheme="blue"
                onClick={() => {
                  const { putWorkflow } = callbackUtils.getCallbacks;
                  putWorkflow([workflowCtrlRef.current.convertWorkflow(schema, workflow)]).then(() => {
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
          <ReactFlow elements={layoutedElements} />
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
        <WorkflowDefinitionModal
          isOpen
          onClose={workflowDefinitionDisclosure.onClose}
          workflow={workflowCtrlRef.current.convertWorkflow(schema, workflow)}
        />
      )}
      <NewWorkflowModal
        isOpen={workflowModalDisclosure.isOpen}
        onClose={workflowModalDisclosure.onClose}
        onConfirm={onNewWorkflowClick}
      />
      {isInputModalShown && (
        <ExecutionModal
          workflow={workflowCtrlRef.current.convertWorkflow(schema, workflow)}
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
