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
import { ClientWorkflow, Editor, ExtendedTask } from '@frinx/shared';
import { omit } from 'lodash';

type Props = {
  isOpen: boolean;
  workflow: ClientWorkflow<ExtendedTask>;
  onClose: () => void;
  onSave: (workflow: ClientWorkflow<ExtendedTask>) => void;
  onChangeNotify: () => void;
};

const parseWorkflow = (workflow: ClientWorkflow<ExtendedTask>) => {
  const { name, description, ...rest } = omit(workflow, ['__typename']);
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
