// @flow
import Highlight from 'react-highlight.js';
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

const DefinitionModal = (props) => {
  return (
    <Modal size="3xl" scrollBehavior="inside" isOpen={props.show} onClose={props.modalHandler}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>{props.wf.name}</ModalHeader>
        <ModalBody>
          <code style={{ fontSize: '17px' }}>
            <pre style={{ maxHeight: '600px' }}>
              <Highlight language="json">{JSON.stringify(props.wf, null, 2)}</Highlight>
            </pre>
          </code>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" onClick={props.modalHandler}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DefinitionModal;
