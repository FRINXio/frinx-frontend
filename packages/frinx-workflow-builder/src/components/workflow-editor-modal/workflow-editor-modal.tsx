import React, { FC, useState } from 'react';
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
import { Editor } from '@frinx/shared/src';
import { ExtendedTask, Workflow } from '../../helpers/types';

type Props = {
  isOpen: boolean;
  workflow: Workflow<ExtendedTask>;
  onClose: () => void;
  onSave: (workflow: Workflow<ExtendedTask>) => void;
  onChangeNotify: () => void;
};

const parseWorkflow = (workflow: Workflow<ExtendedTask>) => {
  const { name, description, ...rest } = workflow;
  return JSON.stringify(
    {
      description,
      ...rest,
    },
    null,
    2,
  );
};

const WorkflowEditorModal: FC<Props> = ({ isOpen, onClose, workflow, onSave, onChangeNotify }) => {
  const [editedWorkflow, setEditedWorkflow] = useState(parseWorkflow(workflow));
  const [isJsonValid, setIsJsonValid] = useState(true);

  const handleSave = () => {
    try {
      const parsedWorkflow = JSON.parse(editedWorkflow);
      setIsJsonValid(true);
      onSave(parsedWorkflow);
      onClose();
    } catch (error) {
      setIsJsonValid(false);
    }
  };

  const handleChange = (value: string) => {
    try {
      setEditedWorkflow(value);
      setIsJsonValid(true);
      onChangeNotify();
    } catch (error) {
      setIsJsonValid(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow editor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor mode="json" value={editedWorkflow} onChange={handleChange} />
          {!isJsonValid && <p>Bad JSON</p>}
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
