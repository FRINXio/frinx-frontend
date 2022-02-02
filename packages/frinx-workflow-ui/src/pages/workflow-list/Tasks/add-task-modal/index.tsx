import { InfoIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tooltip,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { taskDefinition } from '../../../../constants';
import { TaskDefinition } from '../../../../types/uniflow-types';

type AddTaskModalProps = {
  isOpen: boolean;
  task: TaskDefinition;
  onClose: () => void;
  onSubmit: (task: TaskDefinition) => void;
};

const AddTaskModal = ({ isOpen, onClose, onSubmit, task }: AddTaskModalProps) => {
  const [newTask, setNewTask] = useState<TaskDefinition>(task);
  const handleSubmit = () => {
    onSubmit(newTask);
    onClose();
  };

  const mapTaskPropertyToFormControl = (key: keyof typeof taskDefinition, index: number) => {
    return (
      <FormControl key={key}>
        <FormLabel htmlFor={`task-property-${key}`}>{key}</FormLabel>
        <Input
          id={`task-property-${key}`}
          placeholder={`${key}`}
          value={newTask[key]}
          onChange={(e) => {
            setNewTask({ ...newTask, [key]: e.target.value });
          }}
        />
        {index >= 8 && <FormHelperText>Please use comma (",") to separate keys</FormHelperText>}
      </FormControl>
    );
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Add new Task</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Grid gridTemplateColumns="1fr 1fr" columnGap={12} rowGap={2}>
              {Object.keys(task).map((item, i) => {
                return mapTaskPropertyToFormControl(item as keyof typeof taskDefinition, i);
              })}
            </Grid>
          </form>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Add
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
