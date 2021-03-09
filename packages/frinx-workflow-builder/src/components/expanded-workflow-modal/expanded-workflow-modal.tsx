import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import Diagram, { useSchema } from 'beautiful-react-diagrams';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { createDiagramController } from '../../helpers/diagram.helpers';
import { HTTPTask, Workflow } from '../../helpers/types';
import { convertWorkflow } from '../../helpers/workflow.helpers';

const wf: Workflow = {
  updateTime: 1607938645688,
  name: 'test test',
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
  onClose: () => void;
};

const ExpandedWorkflowDiagram: FC<{ workflow: Workflow }> = ({ workflow }) => {
  const schemaCtrlRef = useRef(useMemo(() => createDiagramController(convertWorkflow(workflow)), [workflow]));
  const [schema, { onChange, addNode, removeNode }] = useSchema<void>(
    useMemo(() => schemaCtrlRef.current.createSchemaFromWorkflow(), []),
  );

  return <Diagram schema={schema} onChange={() => {}} />;
};

const ExpandedWorkflowModal: FC<Props> = ({ workflowName, workflowVersion, onClose }) => {
  const [workflowState, setWorkflowState] = useState<Workflow | null>(null);

  useEffect(() => {
    getWorkflow(workflowName, workflowVersion).then((wf) => {
      setWorkflowState(wf);
    });

    return () => {
      setWorkflowState(null);
    };
  }, [workflowName, workflowVersion]);

  return workflowState ? (
    <Modal isOpen onClose={onClose} size="full" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{workflowState.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ExpandedWorkflowDiagram workflow={workflowState} />
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : null;
};

export default ExpandedWorkflowModal;
