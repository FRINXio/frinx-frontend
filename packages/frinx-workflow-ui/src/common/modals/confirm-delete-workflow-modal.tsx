import React, { VoidFunctionComponent } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Icon,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';
import FeatherIcon from 'feather-icons-react';

type Props = {
  activeWorkflow: Workflow;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const ConfirmDeleteModal: VoidFunctionComponent<Props> = ({ activeWorkflow, isOpen, onClose, onDelete }) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Delete Workflow</ModalHeader>
        <ModalBody>
          <Text>
            Do you want to delete workflow <b>{activeWorkflow.name}</b> ?
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button leftIcon={<Icon size={20} as={FeatherIcon} icon="trash-2" />} colorScheme="red" onClick={onDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
