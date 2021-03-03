import React, { FC } from 'react';
import { Box, Flex, Heading, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ExtendedTask, TaskDefinition, Workflow } from '../helpers/types';
import { convertTaskDefinition, createSubWorkflowTask, createSystemTasks, createTask } from '../helpers/task.helpers';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
  workflows: Workflow[];
  taskDefinitions: TaskDefinition[];
};

const LeftMenu: FC<Props> = ({ onTaskAdd, workflows, taskDefinitions }) => {
  return (
    <Box background="white" width={96} boxShadow="base" height="100%" px={6} py={10}>
      <Tabs display="flex" flexDirection="column" height="100%">
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
                    icon={<AddIcon />}
                    onClick={() => {
                      onTaskAdd(createTask(label));
                    }}
                  />
                </Box>
              </Flex>
            ))}
          </TabPanel>
          <TabPanel>
            {taskDefinitions.map((tskDefinition) => (
              <Flex
                key={tskDefinition.name}
                alignItems="center"
                height={16}
                border="1px"
                borderColor="gray.200"
                px={4}
                my={4}
                borderRadius="md"
                userSelect="none"
              >
                <Heading as="h4" size="xs" isTruncated>
                  {tskDefinition.name}
                </Heading>
                <Box marginLeft="auto">
                  <IconButton
                    aria-label="Add task"
                    icon={<AddIcon />}
                    onClick={() => {
                      onTaskAdd(convertTaskDefinition(tskDefinition));
                    }}
                  />
                </Box>
              </Flex>
            ))}
          </TabPanel>
          <TabPanel>
            {workflows.map((wf) => (
              <Flex
                key={wf.name}
                alignItems="center"
                height={16}
                border="1px"
                borderColor="gray.200"
                px={4}
                my={4}
                borderRadius="md"
                userSelect="none"
              >
                <Heading as="h4" size="xs" isTruncated>
                  {wf.name}
                </Heading>
                <Box marginLeft="auto">
                  <IconButton
                    aria-label="Add task"
                    icon={<AddIcon />}
                    onClick={() => {
                      onTaskAdd(createSubWorkflowTask(wf.name, wf.version.toString()));
                    }}
                  />
                </Box>
              </Flex>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LeftMenu;
