import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ExecutedWorkflowTask, jsonParse } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
import unescapeJs from 'unescape-js';
import copyToClipBoard from '../../helpers/copy-to-clipboard';
import ExternalStorageModal from '../../pages/executed-workflow-detail/executed-workflow-detail-tabs/external-storage-modal';

type Props = {
  task: ExecutedWorkflowTask;
  isOpen: boolean;
  onClose: () => void;
};

function renderTaskDescription(task: ExecutedWorkflowTask) {
  return (
    jsonParse<{ description: string }>(task?.workflowTask?.description)?.description ||
    jsonParse<{ description: string }>(task?.workflowTask?.taskDefinition?.description)?.description
  );
}

const TaskModal: VoidFunctionComponent<Props> = ({ task, isOpen, onClose }) => {
  const [isEscaped, setIsEscaped] = useState(true);
  const { inputData, outputData, logs, externalInputPayloadStoragePath, externalOutputPayloadStoragePath } = task;
  const [payload, setPayload] = useState<{ type: 'Input' | 'Output'; data: string } | null>(null);

  const getUnescapedJSON = (data: ExecutedWorkflowTask | Record<string, string>) => {
    const jsonString = JSON.stringify(data, null, 2);

    if (jsonString == null) {
      return undefined;
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
  };

  return (
    <>
      {payload && (
        <ExternalStorageModal
          title={payload.type}
          isOpen={payload != null}
          onClose={() => {
            setPayload(null);
          }}
          storagePath={payload.data}
        />
      )}
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent css="display: flex; flex-direction: column;" my="0.75em">
          <ModalHeader>
            {task.taskType} ({task.status})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex">
            <Tabs defaultIndex={0} css="display: flex; flex-direction: column; flex: 1">
              <TabList>
                <Tab>Summary</Tab>
                <Tab>JSON</Tab>
                <Tab>Logs</Tab>
              </TabList>
              <TabPanels css="display: flex; flex-direction: column; flex: 1">
                <TabPanel css="display: flex; flex-direction: column; flex: 1">
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
                        icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
                        size="sm"
                        className="clp"
                        onClick={() => copyToClipBoard(inputData)}
                      />
                      <Button size="sm" onClick={() => setIsEscaped((prevState) => !prevState)}>
                        {isEscaped ? 'Unescape' : 'Escape'}
                      </Button>
                      {externalInputPayloadStoragePath != null && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setPayload({ type: 'Input', data: externalInputPayloadStoragePath });
                          }}
                        >
                          External storage input
                        </Button>
                      )}
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
                  <Box css="display: flex; flex-direction: column; flex: 1">
                    <Stack direction="row" spacing={2} align="center" mb={2} mt={2}>
                      <Text as="b" fontSize="sm">
                        Output
                      </Text>
                      <IconButton
                        aria-label="Copy summary output"
                        icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
                        size="sm"
                        className="clp"
                        onClick={() => copyToClipBoard(outputData)}
                      />
                      <Button size="sm" onClick={() => setIsEscaped((prevState) => !prevState)}>
                        {isEscaped ? 'Unescape' : 'Escape'}
                      </Button>
                      {externalOutputPayloadStoragePath && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setPayload({ type: 'Output', data: externalOutputPayloadStoragePath });
                          }}
                        >
                          External storage output
                        </Button>
                      )}
                    </Stack>
                    <Textarea
                      fontFamily="monospace"
                      value={getUnescapedJSON(outputData)}
                      isReadOnly
                      id="t_output"
                      variant="filled"
                      minH={200}
                      height="46vh"
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
                        icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
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
                      isReadOnly
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
                        icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
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
                      isReadOnly
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
    </>
  );
};

export default TaskModal;