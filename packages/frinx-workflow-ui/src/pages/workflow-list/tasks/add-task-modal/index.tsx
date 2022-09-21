import React from 'react';
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { TaskDefinition } from '@frinx/workflow-ui/src/helpers/uniflow-types';
import { AddTaskModalForm } from './add-task-modal-form';

type AddTaskModalProps = {
  isOpen: boolean;
  task: TaskDefinition;
  onClose: () => void;
  onSubmit: (task: TaskDefinition) => void;
};

function AddTaskModal({ isOpen, onClose, onSubmit, task }: AddTaskModalProps) {
  const { handleSubmit, setFieldValue, values, submitForm } = useFormik({
    initialValues: task,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Add new Task</ModalHeader>
        <ModalBody>
          <AddTaskModalForm onSubmit={handleSubmit} onChange={setFieldValue} task={values} />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={submitForm}>
              Add
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddTaskModal;
