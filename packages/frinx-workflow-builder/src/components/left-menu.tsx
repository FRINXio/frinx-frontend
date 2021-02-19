import React, { FC } from 'react';
import { Box, Flex, Heading, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ExtendedTask } from '../helpers/types';
import { createSystemTasks, createTask } from '../helpers/task.helpers';

type Props = {
  onTaskAdd: (task: ExtendedTask) => void;
};

const LeftMenu: FC<Props> = ({ onTaskAdd }) => {
  return (
    <Box background="white" width={96} boxShadow="base" height="100%" px={6} py={10}>
      <Tabs display="flex" flexDirection="column" height="100%">
        <TabList>
          <Tab>System tasks</Tab>
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
              >
                <Heading as="h4" size="xs" textTransform="uppercase">
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
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LeftMenu;
