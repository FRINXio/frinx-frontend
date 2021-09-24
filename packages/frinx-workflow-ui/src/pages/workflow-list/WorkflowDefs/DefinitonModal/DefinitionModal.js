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
import Editor from '../../../../common/editor';

const DefinitionModal = ({ show, wf, modalHandler }) => (
  <Modal size="3xl" scrollBehavior="inside" isOpen={show} onClose={modalHandler}>
    <ModalOverlay />
    <ModalCloseButton />
    <ModalContent>
      <ModalHeader>{wf.name}</ModalHeader>
      <ModalBody>
        <Editor name="workflow_details_editor" value={JSON.stringify(wf, null, 2)} isReadOnly={true} />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="gray" onClick={modalHandler}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default DefinitionModal;
