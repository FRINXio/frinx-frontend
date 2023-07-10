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
import { TaskDefinition } from '@frinx/shared/src';
import * as yup from 'yup';
import { AddTaskModalForm } from './add-task-modal-form';

type AddTaskModalProps = {
  isOpen: boolean;
  task: TaskDefinition;
  onClose: () => void;
  onSubmit: (task: TaskDefinition) => void;
};

const validationSchema = yup.object({
  name: yup.string().required('Please enter a task name.'),
  timeoutSeconds: yup.number().required('Please enter timeout seconds.'),
});

function AddTaskModal({ isOpen, onClose, onSubmit, task }: AddTaskModalProps) {
  const { handleSubmit, setFieldValue, values, errors, submitForm } = useFormik({
    initialValues: task,
    validationSchema,
    validateOnChange: false,
    onSubmit: (formData) => {
      onSubmit(formData);
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
          <AddTaskModalForm errors={errors} onSubmit={handleSubmit} onChange={setFieldValue} task={values} />
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
