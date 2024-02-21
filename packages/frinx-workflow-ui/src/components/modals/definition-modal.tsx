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
import { ClientWorkflowWithTasks, Editor, removeGraphqlSpecsFromWorkflow } from '@frinx/shared';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: ClientWorkflowWithTasks;
};

const DefinitionModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal size="3xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>{workflow?.name}</ModalHeader>
        <ModalBody>
          <Editor defaultValue={JSON.stringify(removeGraphqlSpecsFromWorkflow(workflow), null, 2)} width="100%" />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DefinitionModal;
