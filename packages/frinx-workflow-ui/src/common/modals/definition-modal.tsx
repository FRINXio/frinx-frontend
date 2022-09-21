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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';
import { Editor } from '@frinx/shared/src';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: Workflow;
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
