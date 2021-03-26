import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import Diagram, { Canvas, CanvasControls, useCanvasState, useSchema } from 'beautiful-react-diagrams';
import callbackUtils from '../../callback-utils';
import { createDiagramController } from '../../helpers/diagram.helpers';
import { NodeData, Workflow } from '../../helpers/types';
import { convertWorkflow } from '../../helpers/workflow.helpers';

type Props = {
  workflowName: string;
  workflowVersion: number;
  onEditBtnClick: (name: string, version: string) => void;
  onClose: () => void;
};

const ExpandedWorkflowDiagram: FC<{ workflow: Workflow }> = ({ workflow }) => {
  const schemaCtrlRef = useRef(useMemo(() => createDiagramController(convertWorkflow(workflow), true), [workflow]));
  const [schema] = useSchema<NodeData>(useMemo(() => schemaCtrlRef.current.createSchemaFromWorkflow(), []));
  const [canvasStates, handlers] = useCanvasState(); // creates canvas state

  return (
    <Canvas {...canvasStates} {...handlers}>
      <Diagram
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        schema={schema}
        // onChange={noop}
        style={{
          boxShadow: 'none',
          border: 'none',
        }}
      />
      <CanvasControls />
    </Canvas>
  );
};

const ExpandedWorkflowModal: FC<Props> = ({ workflowName, workflowVersion, onClose, onEditBtnClick }) => {
  const [workflowState, setWorkflowState] = useState<Workflow | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const getWorkflow = callbackUtils.getWorkflowCallback();
    getWorkflow(workflowName, workflowVersion.toString()).then((wf) => {
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
                onClick={() => {
                  onEditBtnClick(workflowState.name, workflowState.version.toString());
                }}
                marginLeft={3}
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
