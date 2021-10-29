// @flow
import React from 'react';
import WorkflowDia from '../../executed-workflow-list/executed-workflow-detail/WorkflowDia/WorkflowDia';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

const DiagramModal = (props) => {
  return (
    <Modal size="3xl" isOpen={props.show} onClose={props.modalHandler}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Workflow Diagram</ModalHeader>
        <ModalBody>
          <WorkflowDia meta={props.wf} tasks={[]} def={true} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={props.modalHandler}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiagramModal;
