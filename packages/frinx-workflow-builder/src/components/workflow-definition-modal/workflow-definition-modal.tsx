import React, { FC } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { Workflow } from '../../helpers/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflow: Workflow;
};

const WorkflowDefinitionModal: FC<Props> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Workflow definition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea value={JSON.stringify(workflow, null, 2)} readOnly height={96} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
