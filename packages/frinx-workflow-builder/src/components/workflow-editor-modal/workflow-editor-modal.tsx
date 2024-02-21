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
  Box,
} from '@chakra-ui/react';
import { ClientWorkflowWithTasks, Editor, ExtendedTask, removeGraphqlSpecsFromWorkflow } from '@frinx/shared';

type Props = {
  isOpen: boolean;
  workflow: ClientWorkflowWithTasks<ExtendedTask>;
  onClose: () => void;
  onSave: (workflow: ClientWorkflowWithTasks<ExtendedTask>) => void;
  onChangeNotify: () => void;
};

const parseWorkflow = (workflow: ClientWorkflowWithTasks<ExtendedTask>) => {
  const clientWorkflow = removeGraphqlSpecsFromWorkflow(workflow);

  if (clientWorkflow == null) {
    return '';
  }

  const { name, description, ...rest } = clientWorkflow;
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
    setEditedWorkflow(value ?? '');
    onChangeNotify();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW="75vw">
        <ModalHeader>Workflow editor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box height="calc(100vh - 62px - 72px - 16px)">
            <Editor language="json" value={editedWorkflow} onChange={handleChange} height="100%" />
          </Box>
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
