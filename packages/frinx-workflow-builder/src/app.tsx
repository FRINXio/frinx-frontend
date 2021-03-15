import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import 'beautiful-react-diagrams/styles.css';
import Diagram, { useSchema } from 'beautiful-react-diagrams';
import { Box, Button, Flex, Heading, HStack, Text, useDisclosure, useTheme } from '@chakra-ui/react';
import ScrollContainer from 'react-indiana-drag-scroll';
import produce, { castImmutable } from 'immer';
import { createDiagramController } from './helpers/diagram.helpers';
import unwrap from './helpers/unwrap';
import RightDrawer from './components/right-drawer';
import TaskForm from './components/task-form/task-form';
import LeftMenu from './components/left-menu';
import NewWorkflowModal from './components/new-workflow-modal/new-workflow-modal';
import WorkflowDefinitionModal from './components/workflow-definition-modal/workflow-definition-modal';
import EditWorkflowForm from './components/edit-workflow-form/edit-workflow-form';
import ActionsMenu from './components/actions-menu/actions-menu';
import BgSvg from './img/bg.svg';
import { createWorkflowHelper, deserializeId } from './helpers/workflow.helpers';
import { NodeData, ExtendedTask, Workflow, CustomNodeType, TaskDefinition } from './helpers/types';
import { useTaskActions } from './task-actions-context';
import ExpandedWorkflowModal from './components/expanded-workflow-modal/expanded-workflow-modal';

type Props = {
  onClose: () => void;
  workflow: Workflow<ExtendedTask>;
  workflows: Workflow[];
  taskDefinitions: TaskDefinition[];
  onWorkflowChange: (workflow: Workflow<ExtendedTask>) => void;
  onWorkflowSave: (workflows: Workflow[]) => Promise<unknown>;
};

const App: FC<Props> = ({ workflow, onWorkflowChange, workflows, taskDefinitions }) => {
  const theme = useTheme();
  const workflowDefinitionDisclosure = useDisclosure();
  const workflowModalDisclosure = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const workflowCtrlRef = useRef(useMemo(() => createWorkflowHelper(workflow), [workflow]));
  const schemaCtrlRef = useRef(useMemo(() => createDiagramController(workflow), [workflow]));
  const [schema, { onChange, addNode, removeNode }] = useSchema<NodeData>(
    useMemo(() => schemaCtrlRef.current.createSchemaFromWorkflow(), []),
  );
  const handleDeleteButtonClick = useCallback(
    (id: string) => {
      // TODO: wait for the library update to fix a bug with removing node with links
      onChange({
        links: schema.links?.filter((l) => deserializeId(l.input).id !== id && deserializeId(l.output).id !== id) ?? [],
        nodes: schema.nodes,
      });
      const nodeToRemove = schema.nodes.find((node) => node.id === id);
      if (nodeToRemove) {
        removeNode(nodeToRemove);
      }
    },
    [removeNode, schema.nodes, onChange, schema.links],
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
    <Flex height="100vh" flexDirection="column">
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
              />
            </Box>
            <Button
              colorScheme="blue"
              onClick={() => {
                console.log(workflowCtrlRef.current.convertWorkflow(schema));
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
          height: `calc(100vh - ${theme.space[24]})`,
        }}
      >
        <LeftMenu onTaskAdd={handleAddButtonClick} workflows={workflows} taskDefinitions={taskDefinitions} />
        <Box flex={1}>
          <Box
            position="relative"
            height="100%"
            // style={{
            //   width: schemaCtrlRef.current.getCanvasWidth(),
            // }}
          >
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
                background: theme.colors.gray[100],
                backgroundImage: `url(${BgSvg})`,
                flex: 1,
                // width: copiedSchema.nodes.length * 270,
              }}
            />
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
              <EditWorkflowForm
                workflow={workflow}
                onSubmit={(wf) => {
                  onWorkflowChange(wf);
                }}
                onClose={() => {
                  onWorkflowChange(workflow);
                  setIsEditing(false);
                }}
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
        />
      )}
      {/* <WorkflowDefinitionModal
        isOpen={workflowDefinitionDisclosure.isOpen}
        onClose={workflowDefinitionDisclosure.onClose}
        // workflow={convertDiagramWorkflow(copiedSchema, workflow)}
      /> */}
      <NewWorkflowModal
        isOpen={workflowModalDisclosure.isOpen}
        onClose={workflowModalDisclosure.onClose}
        onConfirm={() => console.log('NEW WORKFLOW')}
      />
    </Flex>
  );
};

export default App;
