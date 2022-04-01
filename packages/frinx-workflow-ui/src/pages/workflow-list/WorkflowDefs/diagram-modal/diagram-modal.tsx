import React, { VoidFunctionComponent } from 'react';
import WorkflowDia from '../../../executed-workflow-detail/WorkflowDia/WorkflowDia';
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
import { Task, Workflow } from '@frinx/workflow-ui/src/types/types';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: Workflow<Task>;
};

const DiagramModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
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
