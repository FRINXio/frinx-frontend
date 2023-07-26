import React, { FC } from 'react';
import { Editor, Workflow } from '@frinx/shared/src';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflow: Workflow;
};

const WorkflowDefinitionModal: FC<Props> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow definition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor language="json" defaultValue={JSON.stringify(workflow, null, 2)} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
