import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import 'beautiful-react-diagrams/dist/styles.css';
import Diagram, { useSchema, Canvas, useCanvasState, CanvasControls } from 'beautiful-react-diagrams';
import { Box, Button, Flex, Heading, HStack, Text, useDisclosure, useTheme } from '@chakra-ui/react';
import produce, { castImmutable } from 'immer';
import { createDiagramController } from './helpers/diagram.helpers';
import unwrap from './helpers/unwrap';
import RightDrawer from './components/right-drawer';
import TaskForm from './components/task-form/task-form';
import LeftMenu from './components/left-menu';
import NewWorkflowModal from './components/new-workflow-modal/new-workflow-modal';
import WorkflowDefinitionModal from './components/workflow-definition-modal/workflow-definition-modal';
import ExecutionModal from './components/execution-modal/execution-modal';
import WorkflowForm from './components/workflow-form/workflow-form';
import ActionsMenu from './components/actions-menu/actions-menu';
import { createWorkflowHelper, deserializeId } from './helpers/workflow.helpers';
import { NodeData, ExtendedTask, Workflow, CustomNodeType, TaskDefinition } from './helpers/types';
import { useTaskActions } from './task-actions-context';
import ExpandedWorkflowModal from './components/expanded-workflow-modal/expanded-workflow-modal';
import callbackUtils from './callback-utils';

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
};

const App: FC<Props> = ({
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
}) => {
  const theme = useTheme();
  const workflowDefinitionDisclosure = useDisclosure();
  const workflowModalDisclosure = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [isInputModalShown, setIsInputModalShown] = useState(false);
  const workflowCtrlRef = useRef(useMemo(() => createWorkflowHelper(), []));
  const schemaCtrlRef = useRef(useMemo(() => createDiagramController(workflow), [workflow]));
  const [schema, { onChange, addNode }] = useSchema<NodeData>(
    useMemo(() => schemaCtrlRef.current.createSchemaFromWorkflow(), []),
  );
  const [canvasStates, handlers] = useCanvasState(); // creates canvas state

  console.log('fail');

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

  return (
    <Flex height="100%" flexDirection="column">
      <Flex
        height={16}
        alignItems="center"
        px={4}
        boxShadow="base"
        position="relative"
        zIndex="modal"
        background="white"
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
                onEditWorkflowBtnClick={() => {
                  setIsEditing(true);
                }}
                onSaveWorkflowBtnClick={() => {
                  const onWorkflowSave = callbackUtils.saveWorkflowCallback();
                  onWorkflowSave([workflowCtrlRef.current.convertWorkflow(schema, workflow)]);
                }}
                onFileImport={onFileImport}
                onFileExport={() => {
                  onFileExport(workflowCtrlRef.current.convertWorkflow(schema, workflow));
                }}
                onWorkflowDelete={onWorkflowDelete}
              />
            </Box>
            <Button
              colorScheme="blue"
              onClick={() => {
                const onWorkflowSave = callbackUtils.saveWorkflowCallback();
                onWorkflowSave([workflowCtrlRef.current.convertWorkflow(schema, workflow)]).then(() => {
                  setIsInputModalShown(true);
                });
              }}
            >
              Save and execute
            </Button>
          </HStack>
        </Box>
      </Flex>
      <Flex
        flex={1}
        position="relative"
        justifyContent="stretch"
        style={{
          height: `calc(100vh - ${theme.space[16]} - ${theme.space[16]})`, // viewport - app header - builder header
        }}
      >
        <LeftMenu onTaskAdd={handleAddButtonClick} workflows={workflows} taskDefinitions={taskDefinitions} />
        <Box flex={1}>
          <Box position="relative" height="100%">
            <Canvas {...canvasStates} {...handlers}>
              <Diagram
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                schema={schema}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onChange={onChange}
                style={{
                  boxShadow: 'none',
                  border: 'none',
                  flex: 1,
                }}
              />
              <CanvasControls />
            </Canvas>
          </Box>
        </Box>
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
              />
            </Box>
          </RightDrawer>
        )}
      </Flex>
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
    </Flex>
  );
};

export default App;
