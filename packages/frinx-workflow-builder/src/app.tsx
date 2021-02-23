import React, { FC, useState } from 'react';
import 'beautiful-react-diagrams/styles.css';
import Diagram, { useSchema } from 'beautiful-react-diagrams';
import { DiagramSchema } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { Box, Button, Flex, Heading, HStack, Text, useDisclosure, useTheme } from '@chakra-ui/react';
import produce, { castImmutable } from 'immer';
import { createSchemaFromWorkflow, createWorkflowNode } from './helpers/diagram.helpers';
import unwrap from './helpers/unwrap';
import RightDrawer from './components/right-drawer';
import TaskForm from './components/task-form/task-form';
import LeftMenu from './components/left-menu';
import NewWorkflowModal from './components/new-workflow-modal/new-workflow-modal';
import WorkflowDefinitionModal from './components/workflow-definition-modal/workflow-definition-modal';
import EditWorkflowForm from './components/edit-workflow-form/edit-workflow-form';
import ActionsMenu from './components/actions-menu/actions-menu';
import BgSvg from './img/bg.svg';
import { convertDiagramWorkflow, convertWorkflow } from './helpers/workflow.helpers';
import { NodeData, ExtendedTask, Workflow, CustomNodeType } from './helpers/types';

type Props = {
  onClose: () => void;
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
  onWorkflowSave: (workflows: Workflow[]) => Promise<unknown>;
};

const App: FC<Props> = ({ workflow, onWorkflowChange }) => {
  const theme = useTheme();
  const [task, setTask] = useState<ExtendedTask | null>(null);
  const workflowDefinitionDisclosure = useDisclosure();
  const workflowModalDisclosure = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const onClick = (data?: NodeData) => {
    const { task: t } = unwrap(data);
    if ('name' in t) {
      setTask(t);
    }
  };
  const schemaRef = React.useRef(createSchemaFromWorkflow(convertWorkflow(workflow), onClick));
  const [schema, { onChange, addNode }] = useSchema<NodeData>(schemaRef.current);
  const copiedSchema: DiagramSchema<NodeData> = {
    ...schema,
    nodes: schema.nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        isSelected: n.id === task?.id,
        onClick,
        task: {
          ...unwrap(n.data).task,
        },
      },
    })),
  };
  const { name } = workflow;

  const handleAddButtonClick = (t: ExtendedTask) => {
    addNode(createWorkflowNode(onClick, t));
  };

  const handleFormSubmit = (t: ExtendedTask) => {
    const copiedNodes = castImmutable(
      produce(copiedSchema.nodes, (acc) => {
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
            <ActionsMenu
              onShowDefinitionBtnClick={workflowDefinitionDisclosure.onOpen}
              onNewWorkflowBtnClick={workflowModalDisclosure.onOpen}
              onEditWorkflowBtnClick={() => {
                setIsEditing(true);
              }}
            />
            <Button
              colorScheme="blue"
              onClick={() => {
                const wf = convertDiagramWorkflow(copiedSchema, workflow);
                console.log('SAVE: ', wf);
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          schema={copiedSchema}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
      <WorkflowDefinitionModal
        isOpen={workflowDefinitionDisclosure.isOpen}
        onClose={workflowDefinitionDisclosure.onClose}
        workflow={convertDiagramWorkflow(copiedSchema, workflow)}
      />
      <NewWorkflowModal
        isOpen={workflowModalDisclosure.isOpen}
        onClose={workflowModalDisclosure.onClose}
        onConfirm={() => console.log('NEW WORKFLOW')}
      />
    </Flex>
  );
};

export default App;
