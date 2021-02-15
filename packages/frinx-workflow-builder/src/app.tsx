import React, { FC, useState } from 'react';
import 'beautiful-react-diagrams/styles.css';
import Diagram, { useSchema } from 'beautiful-react-diagrams';
import { v4 as uuid } from 'uuid';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useTheme,
} from '@chakra-ui/react';
import produce, { castDraft } from 'immer';
import { AddIcon, ChevronDownIcon, DeleteIcon, DownloadIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { NodeData, Task, TaskWithId, Workflow } from './helpers/types';
import { createSchemaFromWorkflow, createWorkflowNode } from './helpers/diagram.helpers';
import unwrap from './helpers/unwrap';
import RightDrawer from './components/right-drawer';
import TaskForm from './components/task-form/task-form';
import LeftMenu from './components/left-menu';
import NewWorkflowModal from './components/new-workflow-modal/new-workflow-modal';
import WorkflowDefinitionModal from './components/workflow-definition-modal/workflow-definition-modal';
import EditWorkflowForm from './components/edit-workflow-form/edit-workflow-form';
import BgSvg from './img/bg.svg';
import { convertDiagramWorkflow } from './helpers/workflow.helpers';


type Props = {
  onClose: () => void;
  workflow: Workflow;
  onWorkflowSave: (workflows: Workflow[]) => Promise<unknown>;
};

function convertWorkflow(wf: Workflow): Workflow<TaskWithId> {
  const { tasks, ...rest } = wf;
  return {
    ...rest,
    tasks: tasks.map((t) => ({
      ...t,
      id: uuid(),
    })),
  };
}

const App: FC<Props> = ({ workflow, onWorkflowSave }) => {
  const theme = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [workflowState, setWorkflowState] = useState<Workflow>(workflow);
  const workflowDefinitionDisclosure = useDisclosure();
  const workflowModalDisclosure = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const onClick = (data?: NodeData) => {
    setTask(data?.task ?? null);
  };
  console.log(createSchemaFromWorkflow(convertWorkflow(workflow), onClick));
  const schemaRef = React.useRef(createSchemaFromWorkflow(convertWorkflow(workflow), onClick));
  const [schema, { onChange, addNode, removeNode }] = useSchema<NodeData>(schemaRef.current);
  const copiedSchema = {
    ...schema,
    nodes: schema.nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        isSelected: n.id === task?.id,
      },
    })),
  };
  const { name, description } = workflow;

  const handleAddButtonClick = (t: Task) => {
    addNode(createWorkflowNode(onClick, t));
  };

  const handleFormSubmit = (t: Task) => {
    const copiedNodes = castDraft(
      produce(copiedSchema.nodes, (acc) => {
        const index = acc.findIndex((n) => n.id === t.id);
        unwrap(acc[index].data).task = t;

        return acc;
      }),
    );
    onChange({ nodes: copiedNodes });
  };


  return (
    <Flex height="100vh" flexDirection="column">
      <Flex height={24} alignItems="center" px={4} boxShadow="base" position="relative" zIndex="modal">
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
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem>Save workflow</MenuItem>
              <MenuItem icon={<ViewIcon />} onClick={workflowDefinitionDisclosure.onOpen}>Show definition</MenuItem>
              <Divider />
              <MenuGroup title="Create">
                <MenuItem icon={<AddIcon />} onClick={workflowModalDisclosure.onOpen}>New workflow</MenuItem>
                <MenuItem icon={<DownloadIcon style={{ transform: 'rotate(180deg)' }} />}>Import workflow</MenuItem>
                <MenuItem icon={<DownloadIcon />}>Export workflow</MenuItem>
              </MenuGroup>
              <MenuGroup title="Edit">
                <MenuItem icon={<EditIcon />} onClick={() => {
                  setIsEditing(true);
                }}>Edit workflow</MenuItem>
              </MenuGroup>
              <Divider />
              <MenuItem icon={<DeleteIcon />} color="red.500">Delete workflow</MenuItem>
            </MenuList>
          </Menu>
          <Button
            colorScheme="blue"
            onClick={() => {
              const wf = convertDiagramWorkflow(copiedSchema, workflowState);
              console.log(wf)
              // onWorkflowSave([wf]);
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
        <LeftMenu onTaskAdd={handleAddButtonClick} />
        <Diagram
          schema={copiedSchema}
          onChange={onChange}
          style={{
            boxShadow: 'none',
            border: 'none',
            background: theme.colors.gray[100],
            backgroundImage: `url(${BgSvg})`,
            flex: 1,
          }}
        />
        {task && (
          <RightDrawer>
            <Box px={6} py={10}>
              <Heading as="h2" size="md" mb={10}>
                {task.name}
              </Heading>
              <TaskForm
                key={task.id}
                task={task}
                onClose={() => {
                  setTask(null);
                }}
                onFormSubmit={handleFormSubmit}
              />
            </Box>
          </RightDrawer>
        )}
        {isEditing && (
          <RightDrawer>
            <Box px={6} py={10}>
              <Heading as="h2" size="md" mb={10}>Edit workflow</Heading>
              <EditWorkflowForm workflow={workflowState} onSubmit={wf => {
                setWorkflowState(wf);
              }} onClose={() => {
                setWorkflowState(workflow);
                setIsEditing(false);
              }} />
            </Box>
          </RightDrawer>
        )}
      </Flex>
      {/* <WorkflowDefinitionModal isOpen={workflowDefinitionDisclosure.isOpen} onClose={workflowDefinitionDisclosure.onClose} workflow={convertDiagramWorkflow(copiedSchema, workflowState)} /> */}
      <NewWorkflowModal isOpen={workflowModalDisclosure.isOpen} onClose={workflowModalDisclosure.onClose} onConfirm={() => console.log('NEW WORKFLOW')} />
    </Flex>
  );
};

export default App;
