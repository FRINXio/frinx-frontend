import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormErrorMessage,
} from '@chakra-ui/react';
import React, { useState, VoidFunctionComponent } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: (name: string) => void;
  isLoading: boolean;
};

const CreateSnapshotModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, onFormSubmit, isLoading }) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const isSnapshotNameInvalid = snapshotName === '' && isDirty;

  const handleChangeSnapshotName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true);
    setSnapshotName(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onFormSubmit(snapshotName);
            onClose();
          }}
        >
          <ModalHeader>Create snapshot</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={isSnapshotNameInvalid}>
              <FormLabel>Snapshot name</FormLabel>
              <Input value={snapshotName} placeholder="Snapshot name" onChange={handleChangeSnapshotName} />
              <FormErrorMessage>Please enter snapshot name</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
              Create
            </Button>
            <Button
              onClick={() => {
                setIsDirty(false);
                setSnapshotName('');
                onClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateSnapshotModal;
