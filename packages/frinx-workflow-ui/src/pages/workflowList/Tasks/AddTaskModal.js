// @flow
import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from '@chakra-ui/react';

const AddTaskModal = (props) => {
  const handleClose = () => {
    props.modalHandler();
  };

  const showInfo = (i) => {
    return (
      <Tooltip placement="auto" label='Please use comma (",") to separate keys'>
        <i style={{ color: 'rgba(0, 149, 255, 0.91)' }} className="clickable fas fa-info-circle" />
      </Tooltip>
    );
  };

  return (
    <Modal size="3xl" dialogClassName="modalWider" isOpen={props.show} onClose={handleClose}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Add new Task</ModalHeader>
        <ModalBody>
          <form onSubmit={props.addTask.bind(this)}>
            <Grid gridTemplateColumns="1fr 1fr" columnGap={12} rowGap={2}>
              {Object.keys(props.taskBody).map((item, i) => {
                return (
                  <Box key={`col1-${i}`}>
                    <FormControl>
                      <FormLabel>
                        {item}&nbsp;&nbsp;
                        {i >= 8 ? showInfo(i - 8) : null}
                      </FormLabel>
                      <Input
                        onChange={(e) => props.handleInput(e)}
                        placeholder="Enter the input"
                        value={Object.values(props.taskBody)[i] ? Object.values(props.taskBody)[i] : ''}
                      />
                    </FormControl>
                  </Box>
                );
              })}
            </Grid>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button marginRight={4} colorScheme="blue" onClick={props.addTask.bind(this)}>
            Add
          </Button>
          <Button colorScheme="gray" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
