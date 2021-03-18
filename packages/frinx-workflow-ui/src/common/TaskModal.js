// @flow
import Highlight from 'react-highlight.js';
import React from 'react';
import UnescapeButton from './UnescapeButton';
import {
  Box,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import type { Task } from './flowtypes';

type Props = {
  task: Task,
  show: boolean,
  handle: () => void,
};

const TaskModal = (props: Props) => {
  const task = props.task;
  const show = props.show;
  return (
    <Modal marginTop={10} size="4xl" isOpen={show} onClose={props.handle}>
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>
          {task.taskType} ({task.status})
          <div
            style={{
              color: '#ff0000',
              display: task.status === 'FAILED' ? '' : 'none',
            }}
          >
            {task.reasonForIncompletion}
          </div>
        </ModalHeader>
        <ModalBody>
          <Tabs defaultIndex={0}>
            <TabList>
              <Tab>Summary</Tab>
              <Tab>JSON</Tab>
              <Tab>Logs</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <Grid gridTemplateColumns="1fr auto" marginTop={20} marginBottom={20}>
                    <Box>
                      <b>Task Ref. Name:&nbsp;&nbsp;</b>
                      {task.referenceTaskName}
                    </Box>
                    <Box>
                      <b>Callback After:&nbsp;&nbsp;</b>
                      {task.callbackAfterSeconds ? task.callbackAfterSeconds : 0} (second)
                      <br />
                      <b>Poll Count:&nbsp;&nbsp;</b>
                      {task.pollCount}
                    </Box>
                  </Grid>
                  <hr />
                  <Flex marginBottom={10}>
                    <b>
                      Input
                      <i title="copy to clipboard" className="btn fa fa-clipboard" data-clipboard-target="#t_input" />
                      <UnescapeButton size="tiny" target="t_input" />
                    </b>
                  </Flex>
                  <Flex>
                    <code>
                      <pre style={{ width: '770px' }} id="t_input">
                        <Highlight language="json">{JSON.stringify(task.inputData, null, 3)}</Highlight>
                      </pre>
                    </code>
                  </Flex>
                  <Flex marginBottom={10}>
                    <b>
                      Output
                      <i title="copy to clipboard" className="btn fa fa-clipboard" data-clipboard-target="#t_output" />
                      <UnescapeButton size="tiny" target="t_output" />
                    </b>
                  </Flex>
                  <Flex>
                    <code>
                      <pre style={{ width: '770px' }} id="t_output">
                        <Highlight language="json">{JSON.stringify(task.outputData, null, 3)}</Highlight>
                      </pre>
                    </code>
                  </Flex>
                </Box>
              </TabPanel>
              <TabPanel>
                <br />
                <b>
                  JSON
                  <i title="copy to clipboard" className="btn fa fa-clipboard" data-clipboard-target="#t_json" />
                </b>

                <code>
                  <pre
                    style={{
                      maxHeight: '500px',
                      marginTop: '20px',
                      backgroundColor: '#eaeef3',
                    }}
                    id="t_json"
                  >
                    {JSON.stringify(task, null, 3)}
                  </pre>
                </code>
              </TabPanel>
              <TabPanel>
                <br />
                <b>
                  Logs
                  <i title="copy to clipboard" className="btn fa fa-clipboard" data-clipboard-target="#t_logs" />
                </b>
                <code>
                  <pre style={{ maxHeight: '500px', marginTop: '20px' }} id="t_logs">
                    <Highlight language="json">{JSON.stringify(task.logs, null, 3)}</Highlight>
                  </pre>
                </code>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
