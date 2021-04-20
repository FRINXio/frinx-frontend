// @flow
import React from 'react';
import UnescapeButton from './UnescapeButton';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  SimpleGrid,
  Text,
  Textarea,
  Stack,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import type { Task } from './flowtypes';
import { jsonParse } from './utils';
import { CopyIcon } from '@chakra-ui/icons';

type Props = {
  task: Task,
  show: boolean,
  handle: () => void,
};

function renderTaskDescription(task) {
  return (
    jsonParse(task?.workflowTask?.description)?.description ||
    jsonParse(task?.workflowTask?.taskDefinition?.description)?.description
  );
}

const TaskModal = ({ task, show, handle }: Props) => {
  return (
    <Modal marginTop={10} size="5xl" isOpen={show} onClose={handle}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {task.taskType} ({task.status})
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs defaultIndex={0}>
            <TabList>
              <Tab>Summary</Tab>
              <Tab>JSON</Tab>
              <Tab>Logs</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={2} spacing={4} mb={4}>
                  <Box>
                    <b>Task Ref. Name: </b>
                    {task.referenceTaskName}
                  </Box>
                  <Box>
                    <b>Callback After: </b>
                    {task.callbackAfterSeconds ? task.callbackAfterSeconds : 0} (second)
                  </Box>
                  <Box>
                    <b>Poll Count: </b>
                    {task.pollCount}
                  </Box>
                  <Box>
                    <b>Description: </b>
                    {renderTaskDescription(task)}
                  </Box>
                </SimpleGrid>
                <Divider />
                <SimpleGrid columns={2} spacing={4} mt={4}>
                  <Box>
                    <Stack direction="row" spacing={2} align="center" mb={2}>
                      <Text as="b" fontSize="sm">
                        Input
                      </Text>
                      <IconButton icon={<CopyIcon />} size="sm" className="clp" data-clipboard-target="#t_input" />
                      <UnescapeButton size="sm" target="t_input" />
                    </Stack>
                    <Textarea
                      value={JSON.stringify(task.inputData, null, 2)}
                      isReadOnly={true}
                      id="t_input"
                      variant="filled"
                      minH={200}
                    />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={2} align="center" mb={2}>
                      <Text as="b" fontSize="sm">
                        Output
                      </Text>
                      <IconButton icon={<CopyIcon />} size="sm" className="clp" data-clipboard-target="#t_output" />
                      <UnescapeButton size="sm" target="t_output" />
                    </Stack>
                    <Textarea
                      value={JSON.stringify(task.outputData, null, 2)}
                      isReadOnly={true}
                      id="t_output"
                      variant="filled"
                      minH={200}
                    />
                  </Box>
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <Box>
                  <Stack direction="row" spacing={2} align="center" mb={2}>
                    <Text as="b" fontSize="sm">
                      JSON
                    </Text>
                    <IconButton icon={<CopyIcon />} size="sm" className="clp" data-clipboard-target="#t_json" />
                    <UnescapeButton size="sm" target="t_json" />
                  </Stack>
                  <Textarea
                    value={JSON.stringify(task, null, 2)}
                    isReadOnly={true}
                    id="t_json"
                    variant="filled"
                    minH={300}
                  />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <Stack direction="row" spacing={2} align="center" mb={2}>
                    <Text as="b" fontSize="sm">
                      Logs
                    </Text>
                    <IconButton icon={<CopyIcon />} size="sm" className="clp" data-clipboard-target="#t_logs" />
                    <UnescapeButton size="sm" target="t_logs" />
                  </Stack>
                  <Textarea value={JSON.stringify(task.logs, null, 2)} isReadOnly={true} id="t_logs" variant="filled" />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
