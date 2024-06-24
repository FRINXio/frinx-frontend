import React, { VoidFunctionComponent } from 'react';
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
import { ClientWorkflowWithTasks, Editor, omitDeep } from '@frinx/shared';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExportClick: () => void;
  workflow?: ClientWorkflowWithTasks;
};

const DefinitionModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow, onExportClick }) => {
  return (
    <Modal size="3xl" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>{workflow?.name}</ModalHeader>
        <ModalBody>
          <Editor
            defaultValue={JSON.stringify(omitDeep(workflow, ['id', '__typename', 'tasksJson']), null, 2)}
            width="100%"
            options={{
              copyWithSyntaxHighlighting: false,
              selectionHighlight: false,
            }}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="gray" onClick={onExportClick}>
              Export definition
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DefinitionModal;
