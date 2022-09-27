import React, { VoidFunctionComponent } from 'react';
import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';
import ReactFlow, { Controls, MiniMap, ReactFlowProvider } from 'react-flow-renderer';
import { getLayoutedElements } from '../../helpers/layout.helpers';
import { getElementsFromWorkflow } from '../../helpers/api-to-graph.helpers';
import { convertWorkflowTaskToExtendedTask } from '../../helpers/task.helpers';
import { BaseNode, DecisionNode, StartEndNode } from '../components';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow: Workflow;
};

const nodeTypes = {
  base: BaseNode,
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
};

const DiagramModal: VoidFunctionComponent<ModalProps> = ({ isOpen, onClose, workflow }) => {
  const nodes = getLayoutedElements(
    getElementsFromWorkflow(workflow.tasks.map(convertWorkflowTaskToExtendedTask), true),
    'TB',
  );

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Workflow Diagram</ModalHeader>
        <ModalBody>
          <Center height={600}>
            <ReactFlowProvider>
              <ReactFlow nodes={nodes.nodes} edges={nodes.edges} nodeTypes={nodeTypes} fitView>
                <Controls />
                <MiniMap />
              </ReactFlow>
            </ReactFlowProvider>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiagramModal;
