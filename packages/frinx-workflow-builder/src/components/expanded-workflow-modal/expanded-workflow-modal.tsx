import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useTheme,
} from '@chakra-ui/react';
import Diagram, { useSchema } from 'beautiful-react-diagrams';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import callbackUtils from '../../callback-utils';
import { createDiagramController } from '../../helpers/diagram.helpers';
import { Workflow } from '../../helpers/types';
import { convertWorkflow } from '../../helpers/workflow.helpers';
import BgSvg from './img/bg.svg';

type Props = {
  workflowName: string;
  workflowVersion: number;
  onEditBtnClick: (name: string, version: string) => void;
  onClose: () => void;
};

const ExpandedWorkflowDiagram: FC<{ workflow: Workflow }> = ({ workflow }) => {
  const theme = useTheme();
  const schemaCtrlRef = useRef(useMemo(() => createDiagramController(convertWorkflow(workflow)), [workflow]));
  const [schema, { onChange, addNode, removeNode }] = useSchema<void>(
    useMemo(() => schemaCtrlRef.current.createSchemaFromWorkflow(true), []),
  );

  return (
    <Diagram
      schema={schema}
      onChange={() => {}}
      style={{
        boxShadow: 'none',
        border: 'none',
        background: theme.colors.gray[100],
        backgroundImage: `url(${BgSvg})`,
        flex: 1,
      }}
    />
  );
};

const ExpandedWorkflowModal: FC<Props> = ({ workflowName, workflowVersion, onClose, onEditBtnClick }) => {
  const [workflowState, setWorkflowState] = useState<Workflow | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const getWorkflow = callbackUtils.getWorkflowCallback();
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
          <ModalBody display="flex" flexDirection="column">
            <ExpandedWorkflowDiagram workflow={workflowState} />
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
