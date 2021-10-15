import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../utils/callback-utils';
import {
  Button,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { jsonParse } from '../../../common/utils';
import Editor from '../../../common/editor';

const TaskModal = ({ name, modalHandler, show }) => {
  const [response, setResponse] = useState({});

  useEffect(() => {
    const getTaskDefinition = callbackUtils.getTaskDefinitionCallback();

    getTaskDefinition(name).then((definition) => {
      if (definition) {
        setResponse(definition);
      }
    });
  }, [name]);

  return (
    <Modal size="3xl" isOpen={show} onClose={modalHandler}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Details of {response?.name}</ModalHeader>
        <ModalBody>
          <Text color="gray.500" mb={4}>
            {jsonParse(response.description)?.description || response.description}
          </Text>
          <Editor name="task_details_editor" value={JSON.stringify(response, null, 2)} isReadOnly={true} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={modalHandler}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
