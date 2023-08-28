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
import { Editor, jsonParse, TaskDefinition } from '@frinx/shared';

type TaskConfigModalProps = {
  isOpen: boolean;
  task: Partial<TaskDefinition>;
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
          <Editor defaultValue={JSON.stringify(task, null, 2)} />
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
