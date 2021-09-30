import React, { FC } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
} from '@chakra-ui/react';
import { Workflow } from '../../helpers/types';
import Editor from '../common/editor';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: string) => void;
  onChange: (workflow: string) => void;
  workflow: Workflow;
};

const WorkflowEditorModal: FC<Props> = ({ isOpen, onClose, workflow, onSave, onChange }) => {
  const handleSave = () => {
    onSave(JSON.stringify(workflow));
    onClose();
  };

  const handleChange = () => onChange(JSON.stringify(workflow));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow editor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor value={JSON.stringify(workflow, null, 2)} onChange={handleChange} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose} marginRight={2}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowEditorModal;
