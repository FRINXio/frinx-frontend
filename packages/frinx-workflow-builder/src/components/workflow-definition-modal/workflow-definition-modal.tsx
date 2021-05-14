import React, { FC } from 'react';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Workflow } from '../../helpers/types';
import Editor from '../common/editor';

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
          <Editor value={JSON.stringify(workflow, null, 2)} readOnly />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
