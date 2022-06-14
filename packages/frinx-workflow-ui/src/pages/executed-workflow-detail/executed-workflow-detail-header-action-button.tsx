import React, { FC } from 'react';
import { WorkflowStatus } from './executed-workflow-detail-status.helpers';
import { Button, ButtonGroup } from '@chakra-ui/react';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';

type Props = {
  workflowId: string;
  status: WorkflowStatus | undefined;
  restartWorkflows: () => void;
  onWorkflowActionExecution: (workflowId: string) => void;
};

const DetailsModalHeaderActionButtons: FC<Props> = ({
  status,
  onWorkflowActionExecution,
  restartWorkflows,
  workflowId,
}) => {
  const terminateWorkflows = async () => {
    const { terminateWorkflows } = callbackUtils.getCallbacks;

    const result = await terminateWorkflows([workflowId]);
    onWorkflowActionExecution(workflowId);
  };

  const pauseWorkflows = () => {
    const { pauseWorkflows } = callbackUtils.getCallbacks;

    pauseWorkflows([workflowId]);
    onWorkflowActionExecution(workflowId);
  };

  const resumeWorkflows = () => {
    const { resumeWorkflows } = callbackUtils.getCallbacks;

    resumeWorkflows([workflowId]);
    onWorkflowActionExecution(workflowId);
  };

  const retryWorkflows = () => {
    const { retryWorkflows } = callbackUtils.getCallbacks;

    retryWorkflows([workflowId]);
    onWorkflowActionExecution(workflowId);
  };

  if (status === 'FAILED' || status === 'TERMINATED' || status === 'TIMED_OUT') {
    return (
      <ButtonGroup float="right">
        <Button onClick={restartWorkflows} colorScheme="blue">
          <i className="fas fa-redo" />
          &nbsp;&nbsp;Restart
        </Button>
        <Button onClick={retryWorkflows} colorScheme="blue">
          <i className="fas fa-history" />
          &nbsp;&nbsp;Retry
        </Button>
      </ButtonGroup>
    );
  }

  if (status === 'RUNNING') {
    return (
      <ButtonGroup float="right">
        <Button onClick={terminateWorkflows} colorScheme="blue">
          <i className="fas fa-times" />
          &nbsp;&nbsp;Terminate
        </Button>
        <Button onClick={pauseWorkflows} colorScheme="blue">
          <i className="fas fa-pause" />
          &nbsp;&nbsp;Pause
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup float="right">
      <Button onClick={resumeWorkflows} colorScheme="blue">
        <i className="fas fa-play" />
        &nbsp;&nbsp;Resume
      </Button>
    </ButtonGroup>
  );
};

export default DetailsModalHeaderActionButtons;
