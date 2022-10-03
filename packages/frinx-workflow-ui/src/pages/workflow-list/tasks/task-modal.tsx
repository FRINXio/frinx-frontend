import React from 'react';
import {
  Button,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { jsonParse } from '@frinx/workflow-ui/src/utils/helpers.utils';
import { Editor } from '@frinx/shared/src';
import { TaskDefinition } from '@frinx/workflow-ui/src/helpers/uniflow-types';

type TaskConfigModalProps = {
  isOpen: boolean;
  task: TaskDefinition;
  onClose: () => void;
};

export default function TaskConfigModal({ isOpen, task, onClose }: TaskConfigModalProps) {
  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Details of {task.name}</ModalHeader>
        <ModalBody>
          <Text color="gray.500" mb={4}>
            {jsonParse(task.description)?.description || task.description}
          </Text>
          <Editor name="task_details_editor" value={JSON.stringify(task, null, 2)} readOnly onChange={undefined} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
