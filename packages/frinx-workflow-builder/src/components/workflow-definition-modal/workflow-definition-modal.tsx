import React, { FC } from 'react';
import { ClientWorkflowWithTasks, Editor, removeGraphqlSpecsFromWorkflow } from '@frinx/shared';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { omit } from 'lodash';

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
            defaultValue={JSON.stringify(removeGraphqlSpecsFromWorkflow(omit(workflow, 'tasksJson')), null, 2)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
