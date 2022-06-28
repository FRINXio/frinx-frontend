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
import { Link } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const NewWorkflowModal: FC<Props> = ({ isOpen, onClose }) => {
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
            <Button as={Link} to="../" colorScheme="blue">
              Create new workflow
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewWorkflowModal;
