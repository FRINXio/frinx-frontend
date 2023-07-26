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
import { ClientWorkflow, Editor, ExtendedTask } from '@frinx/shared/src';

type Props = {
  isOpen: boolean;
  workflow: ClientWorkflow<ExtendedTask>;
  onClose: () => void;
  onSave: (workflow: ClientWorkflow<ExtendedTask>) => void;
  onChangeNotify: () => void;
};

const parseWorkflow = (workflow: ClientWorkflow<ExtendedTask>) => {
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

  const handleSave = () => {
    try {
      const parsedWorkflow = JSON.parse(editedWorkflow);

      onSave(parsedWorkflow);
      onClose();
    } catch {
      // eslint-disable-next-line no-console
      console.error('wrong json');
    }
  };

  const handleChange = (value: string | undefined) => {
    // console.log(value);
    setEditedWorkflow(value ?? '');
    onChangeNotify();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow editor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor language="json" value={editedWorkflow} onChange={handleChange} />
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
