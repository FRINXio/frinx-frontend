import React, { FC } from 'react';
import 'beautiful-react-diagrams/styles.css';
import Diagram, { useSchema } from 'beautiful-react-diagrams';
import { Box, Button, CloseButton, Flex, Heading, Text, useTheme } from '@chakra-ui/react';
import { NodeData, Task } from './helpers/types';
import { createSchemaFromWorkflow, createWorkflowNode } from './helpers/diagram.helpers';
import RightDrawer from './components/right-drawer';
import TaskForm from './components/task-form/task-form';
import LeftMenu from './components/left-menu';
import BgSvg from './img/bg.svg';
import { useWorkflowContext } from './workflow-context';

type Props = {
  onClose: () => void;
};

const App: FC<Props> = ({ onClose }) => {
  const theme = useTheme();
  const { setTask, task, workflow } = useWorkflowContext();
  const onClick = (data?: NodeData) => {
    setTask(data?.task ?? null);
  };
  const schemaRef = React.useRef(createSchemaFromWorkflow(workflow, onClick));
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
          {/* <CloseButton onClick={onClose} /> */}
          <Button
            colorScheme="blue"
            onClick={() => {
              console.log(copiedSchema);
            }}
          >
            Save
          </Button>
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
              />
            </Box>
          </RightDrawer>
        )}
      </Flex>
    </Flex>
  );
};

export default App;
