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
  onClose: () => void;
  onSave: (workflow: Workflow<ExtendedTask>) => void;
  workflow: Workflow<ExtendedTask>;
};

const parseWorkflow = (workflow: Workflow<ExtendedTask>) => {
  const workflowEntries = Object.entries(workflow);
  const result = Object.fromEntries(
    workflowEntries
      .map((item) => {
        if (typeof item[1] !== 'string') return [item[0], item[1]];

        try {
          const parsedValue = JSON.parse(item[1]);
          return [item[0], parsedValue];
        } catch (error) {
          return [item[0], item[1]];
        }
      })
      .filter(([key]) => {
        return key !== 'name';
      }),
  );
  return result;
};

const WorkflowEditorModal: FC<Props> = ({ isOpen, onClose, workflow, onSave }) => {
  const [editedWorkflow, setEditedWorkflow] = useState(JSON.stringify(parseWorkflow(workflow), null, 2));
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
