import React, { FC } from 'react';
import { ClientWorkflow, Editor } from '@frinx/shared/src';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflow: ClientWorkflow;
};

const WorkflowDefinitionModal: FC<Props> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow definition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor value={JSON.stringify(workflow, null, 2)} readOnly />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
