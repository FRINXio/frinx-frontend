import React, { FC } from 'react';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const NewWorkflowModal: FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new workflow</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          All changes since last <strong>Save</strong> or <strong>Execute</strong> operation will be lost
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onConfirm} colorScheme="blue">
              Create new workflow
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewWorkflowModal;
