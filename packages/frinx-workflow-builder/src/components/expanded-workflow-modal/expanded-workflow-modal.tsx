import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider } from 'react-flow-renderer';
import { Link } from 'react-router-dom';
import callbackUtils from '../../callback-utils';
import { getElementsFromWorkflow } from '../../helpers/data.helpers';
import { getLayoutedElements } from '../../helpers/layout.helpers';
import { Task, Workflow } from '../../helpers/types';
import BaseNode from '../workflow-nodes/base-node';
import DecisionNode from '../workflow-nodes/decision-node';
import StartEndNode from '../workflow-nodes/start-end-node';

const nodeTypes = {
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
  base: BaseNode,
};

type Props = {
  workflowName: string;
  workflowVersion: number;
  onClose: () => void;
};

const ExpandedWorkflowDiagram: FC<{ workflow: Workflow<Task> }> = ({ workflow }) => {
  const elements = getElementsFromWorkflow(workflow.tasks, true);
  const layoutedElements = useMemo(() => getLayoutedElements(elements), [elements]);
  return (
    <ReactFlowProvider>
      <ReactFlow elements={layoutedElements} nodeTypes={nodeTypes} snapToGrid onLoad={(instance) => instance.fitView()}>
        <Background variant={BackgroundVariant.Dots} gap={15} size={0.8} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

const ExpandedWorkflowModal: FC<Props> = ({ workflowName, workflowVersion, onClose }) => {
  const [workflowState, setWorkflowState] = useState<Workflow<Task> | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const { getWorkflow } = callbackUtils.getCallbacks;
    getWorkflow(workflowName, workflowVersion).then((wf) => {
      setWorkflowState(wf);
    });

    return () => {
      setWorkflowState(null);
    };
  }, [workflowName, workflowVersion]);

  return workflowState ? (
    <>
      <Modal isOpen onClose={onClose} size="full" closeOnOverlayClick={false} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{workflowState.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="81.97vh">
              <ExpandedWorkflowDiagram workflow={workflowState} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<ExternalLinkIcon />}
              onClick={() => {
                setIsAlertOpen(true);
              }}
            >
              Edit workflow
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={ref}
        onClose={() => {
          setIsAlertOpen(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Edit workflow</AlertDialogHeader>
            <AlertDialogBody>Are you sure? All unsaved progress on the current workflow will be lost.</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={ref}
                onClick={() => {
                  setIsAlertOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                marginLeft={3}
                as={Link}
                to={`../builder/${workflowState.name}/${workflowState.version}`}
              >
                Edit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  ) : null;
};

export default ExpandedWorkflowModal;
