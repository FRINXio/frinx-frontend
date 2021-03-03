// @flow
import Highlight from 'react-highlight.js';
import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../utils/callbackUtils';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { jsonParse } from '../../../common/utils';

const TaskModal = (props) => {
  const [response, setResponse] = useState({});

  useEffect(() => {
    const name = props.name;
    const getTaskDefinition = callbackUtils.getTaskDefinitionCallback();

    getTaskDefinition(name).then((definition) => {
      if (definition) {
        setResponse(definition);
      }
    });
  }, [props.name]);

  const handleClose = () => {
    props.modalHandler();
  };

  const renderKeys = (variable) => {
    const output = [];
    const keys = response[variable] ? response[variable] : 0;
    for (let i = 0; i < keys.length; i++) {
      output.push(
        <Tr key={`${variable}-${i}`}>
          <Td>{keys[i]}</Td>
        </Tr>,
      );
    }
    return output;
  };

  const iokeys = () => (
    <Flex>
      <Box>
        <Table striped hover size="sm">
          <Thead>
            <Tr>
              <Th>Input keys</Th>
            </Tr>
          </Thead>
          <Tbody>{renderKeys('inputKeys')}</Tbody>
        </Table>
      </Box>
      <Box>
        <Table striped hover size="sm">
          <Thead>
            <Tr>
              <Th>Output keys</Th>
            </Tr>
          </Thead>
          <tbody>{renderKeys('outputKeys')}</tbody>
        </Table>
      </Box>
    </Flex>
  );

  const def = () => (
    <div>
      <h4>
        Task JSON&nbsp;&nbsp;
        <i title="copy to clipboard" className="clp far fa-clipboard clickable" data-clipboard-target="#json" />
      </h4>
      <code>
        <pre id="json" className="heightWrapper">
          <Highlight language="json">{JSON.stringify(response, null, 2)}</Highlight>
        </pre>
      </code>
    </div>
  );

  return (
    <Modal size="3xl" dialogClassName="modalWider" isOpen={props.show} onClose={handleClose}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>
          Details of {response.name ? response.name : null}
          <br />
          <p className="text-muted">{jsonParse(response.description)?.description || response.description}</p>
        </ModalHeader>
        <ModalBody>
          <Tabs marginBottom={20}>
            <TabList>
              <Tab>Task JSON</Tab>
              <Tab>Input/Output</Tab>
            </TabList>
            <TabPanels>
              <TabPanel mountOnEnter eventKey="JSON" title="Task JSON">
                {def()}
              </TabPanel>
              {response.outputKeys || response.outputKeys ? (
                <TabPanel mountOnEnter eventKey="inputOutput" title="Input/Output">
                  {iokeys()}
                </TabPanel>
              ) : null}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
