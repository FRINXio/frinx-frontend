import React, { VoidFunctionComponent } from 'react';
import WorkflowDia from '@frinx/workflow-ui/src/pages/executed-workflow-detail/WorkflowDia/WorkflowDia';
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
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: Workflow;
};

const DiagramModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Workflow Diagram</ModalHeader>
        <ModalBody>
          <WorkflowDia meta={workflow} tasks={[]} def={true} />
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

export default DiagramModal;
