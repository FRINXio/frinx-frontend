// @flow
import React, { useState } from 'react';
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
  Button,
} from '@chakra-ui/react';
import type { Task } from '../types/task';
import { jsonParse } from './utils';
import { CopyIcon } from '@chakra-ui/icons';
import unescapeJs from 'unescape-js';

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

function renderTaskDescription(task: Task) {
  return (
    jsonParse(task?.workflowTask?.description)?.description ||
    jsonParse(task?.workflowTask?.taskDefinition?.description)?.description
  );
}

const TaskModal = ({ task, isOpen, onClose }: Props) => {
  const [isEscaped, setIsEscaped] = useState(true);
  const { inputData, outputData, logs } = task;

  function getUnescapedJSON(data: Task | Object) {
    const jsonString = JSON.stringify(data, null, 2);

    if (!jsonString) {
      return;
    }

    return isEscaped
      ? jsonString
          .replace(/\\n/g, '\\n')
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, '\\&')
          .replace(/\\r/g, '\\r')
          .replace(/\\t/g, '\\t')
          .replace(/\\b/g, '\\b')
          .replace(/\\f/g, '\\f')
      : unescapeJs(jsonString);
  }

  const copyToClipBoard = (textToCopy: any) => {
    navigator.clipboard.writeText(JSON.stringify(textToCopy));
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
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
                <Box>
                  <Stack direction="row" spacing={2} align="center" mb={2} mt={2}>
                    <Text as="b" fontSize="sm">
                      Input
                    </Text>
                    <IconButton
                      aria-label="Copy summary input"
                      icon={<CopyIcon />}
                      size="sm"
                      className="clp"
                      onClick={() => copyToClipBoard(inputData)}
                    />
                    <Button size="sm" onClick={() => setIsEscaped((prevState) => !prevState)}>
                      {isEscaped ? 'Unescape' : 'Escape'}
                    </Button>
                  </Stack>
                  <Textarea
                    fontFamily="monospace"
                    value={getUnescapedJSON(inputData)}
                    isReadOnly
                    id="t_input"
                    variant="filled"
                    minH={200}
                  />
                </Box>
                <Box>
                  <Stack direction="row" spacing={2} align="center" mb={2} mt={2}>
                    <Text as="b" fontSize="sm">
                      Output
                    </Text>
                    <IconButton
                      aria-label="Copy summary output"
                      icon={<CopyIcon />}
                      size="sm"
                      className="clp"
                      onClick={() => copyToClipBoard(outputData)}
                    />
                    <Button size="sm" onClick={() => setIsEscaped((prevState) => !prevState)}>
                      {isEscaped ? 'Unescape' : 'Escape'}
                    </Button>
                  </Stack>
                  <Textarea
                    fontFamily="monospace"
                    value={getUnescapedJSON(outputData)}
                    isReadOnly
                    id="t_output"
                    variant="filled"
                    minH={200}
                  />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <Stack direction="row" spacing={2} align="center" mb={2}>
                    <Text as="b" fontSize="sm">
                      JSON
                    </Text>
                    <IconButton
                      aria-label="Copy JSON"
                      icon={<CopyIcon />}
                      size="sm"
                      className="clp"
                      onClick={() => copyToClipBoard(task)}
                    />
                    <Button size="sm" onClick={() => setIsEscaped((prevState) => !prevState)}>
                      {isEscaped ? 'Unescape' : 'Escape'}
                    </Button>
                  </Stack>
                  <Textarea
                    fontFamily="monospace"
                    value={getUnescapedJSON(task)}
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
                    <IconButton
                      aria-label="Copy logs"
                      icon={<CopyIcon />}
                      size="sm"
                      className="clp"
                      onClick={() => copyToClipBoard(logs)}
                    />
                    <Button size="sm" onClick={() => setIsEscaped((prevState) => !prevState)}>
                      {isEscaped ? 'Unescape' : 'Escape'}
                    </Button>
                  </Stack>
                  <Textarea
                    fontFamily="monospace"
                    value={getUnescapedJSON(logs)}
                    isReadOnly={true}
                    id="t_logs"
                    variant="filled"
                  />
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
