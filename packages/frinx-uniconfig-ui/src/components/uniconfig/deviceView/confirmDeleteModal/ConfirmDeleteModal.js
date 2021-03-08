import React from 'react';
import {
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const ConfirmDeleteModal = ({ snapshotId, deleteSnapshot, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        size="sm"
        colorScheme="red"
        icon={<DeleteIcon />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete snapshot {snapshotId}?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="red" mr={3} isLoading={isLoading} onClick={() => deleteSnapshot(snapshotId)}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmDeleteModal;
