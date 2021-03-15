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
import { createDiagramController } from '../../helpers/diagram.helpers';
import { HTTPTask, Workflow, SubworkflowTask } from '../../helpers/types';
import { convertWorkflow } from '../../helpers/workflow.helpers';
import BgSvg from './img/bg.svg';

const wf: Workflow = {
  updateTime: 1607938645688,
  name: 'test 2',
  description: 'sample description',
  version: 1,
  tasks: [
    ({
      name: '22GLOBAL___HTTP_task',
      taskReferenceName: 'httpRequestTaskRef_S3NZ',
      inputParameters: {
        http_request: {
          uri: '${workflow.input.uri}',
          method: 'GET',
          contentType: 'application/json',
          headers: {
            from: 'frinxUser',
            'x-auth-user-roles': 'OWNER',
            'x-tenant-id': 'frinx_test',
          },
          timeout: 3600,
        },
      },
      type: 'SIMPLE',
      startDelay: 0,
      optional: false,
      asyncComplete: false,
    } as unknown) as HTTPTask,
    ({
      name: '3SUB_WORKFLOW_TASK',
      taskReferenceName: 'subWorkflowTaskRef_S3NZ',
      inputParameters: {
        foo: '${workflow.input.foo}',
      },
      type: 'SUB_WORKFLOW',
      subWorkflowParam: {
        name: 'Test workflow',
        version: 1,
      },
      startDelay: 0,
      optional: false,
      asyncComplete: false,
    } as unknown) as SubworkflowTask,
  ],
  inputParameters: [],
  outputParameters: {},
  schemaVersion: 2,
  restartable: true,
  workflowStatusListenerEnabled: false,
  ownerEmail: 'frinxuser',
  timeoutPolicy: 'ALERT_ONLY',
  timeoutSeconds: 0,
  variables: {},
};

function getWorkflow(name: string, version: number): Promise<Workflow> {
  return Promise.resolve(wf);
}

type Props = {
  workflowName: string;
  workflowVersion: number;
  onEditBtnClick: () => void;
  onClose: () => void;
};

const ExpandedWorkflowDiagram: FC<{ workflow: Workflow }> = ({ workflow, onEditBtnClick }) => {
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
              <Button colorScheme="blue" onClick={onEditBtnClick} marginLeft={3}>
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
