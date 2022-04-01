import React, { VoidFunctionComponent } from 'react';
import AceEditor from 'react-ace';
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
import { Task, Workflow } from '@frinx/workflow-builder/src/helpers/types';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: Workflow<Task>;
};

const DefinitionModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow }) => (
  <Modal size="3xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalCloseButton />
    <ModalContent>
      <ModalHeader>{workflow?.name}</ModalHeader>
      <ModalBody>
        <AceEditor value={JSON.stringify(workflow, null, 2)} readOnly name="workflow-definition" width="100%" />
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
