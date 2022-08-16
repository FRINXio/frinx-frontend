import React, { FC, memo } from 'react';
import { Box, Flex, Heading, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { ExtendedTask, TaskDefinition, Workflow } from '../../helpers/types';
import { createSystemTasks, createTask } from '../../helpers/task.helpers';
import TaskList from './task-list';
import WorkflowList from './workflow-list';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
  workflows: Workflow[];
  taskDefinitions: TaskDefinition[];
};

const LeftMenu: FC<Props> = memo(({ onTaskAdd, workflows, taskDefinitions }) => {
  return (
    <Box background="white" boxShadow="base" px={4} py={10} height="100%">
      <Tabs display="flex" flexDirection="column" height="100%" isLazy>
        <TabList>
          <Tab>System tasks</Tab>
          <Tab>Tasks</Tab>
          <Tab>Workflows</Tab>
        </TabList>
        <TabPanels flex={1} overflowY="auto">
          <TabPanel py={6}>
            {createSystemTasks().map((label) => (
              <Flex
                key={label}
                alignItems="center"
                height={16}
                border="1px"
                borderColor="gray.200"
                px={4}
                my={4}
                borderRadius="md"
                userSelect="none"
              >
                <Heading as="h4" size="xs">
                  {label}
                </Heading>
                <Box marginLeft="auto">
                  <IconButton
                    aria-label="Add task"
                    icon={<Icon as={FeatherIcon} icon="plus" size={20} />}
                    onClick={() => {
                      onTaskAdd(createTask(label));
                    }}
                  />
                </Box>
              </Flex>
            ))}
          </TabPanel>
          <TabPanel>
            <TaskList onTaskAdd={onTaskAdd} taskDefinitions={taskDefinitions} />
          </TabPanel>
          <TabPanel>
            <WorkflowList onTaskAdd={onTaskAdd} workflows={workflows} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});

export default LeftMenu;
