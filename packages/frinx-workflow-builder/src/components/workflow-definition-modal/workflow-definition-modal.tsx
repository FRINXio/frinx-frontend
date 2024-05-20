import React, { FC } from 'react';
import { ClientWorkflowWithTasks, Editor, omitDeep } from '@frinx/shared';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflow: ClientWorkflowWithTasks;
};

const WorkflowDefinitionModal: FC<Props> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow definition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor
            language="json"
            defaultValue={JSON.stringify(omitDeep(workflow, ['id', 'tasksJson', '__typename']), null, 2)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
