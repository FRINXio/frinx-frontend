import React, { VoidFunctionComponent } from 'react';
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
import { ClientWorkflow, Editor } from '@frinx/shared/src';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: ClientWorkflow;
};

const DefinitionModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow }) => (
  <Modal size="3xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalCloseButton />
    <ModalContent>
      <ModalHeader>{workflow?.name}</ModalHeader>
      <ModalBody>
        <Editor value={JSON.stringify(workflow, null, 2)} readOnly name="workflow-definition" width="100%" />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="gray" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default DefinitionModal;
