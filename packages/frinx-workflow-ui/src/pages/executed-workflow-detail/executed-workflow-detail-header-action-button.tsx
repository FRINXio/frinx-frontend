import React, { FC } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { WorkflowStatus } from './executed-workflow-detail-status.helpers';

type Props = {
  workflowId: string;
  status: WorkflowStatus | undefined;
  restartWorkflows: () => void;
  onWorkflowActionExecution: (workflowId: string) => void;
  isVisibleRestartButton: boolean;
};

const DetailsModalHeaderActionButtons: FC<Props> = ({
  status,
  onWorkflowActionExecution,
  restartWorkflows,
  workflowId,
  isVisibleRestartButton,
}) => {
  const handleOnTerminateWorkflow = async () => {
    const { terminateWorkflows } = callbackUtils.getCallbacks;

    terminateWorkflows([workflowId]).then(() => onWorkflowActionExecution(workflowId));
  };
  const handleOnPauseWorkflow = () => {
    const { pauseWorkflows } = callbackUtils.getCallbacks;

    pauseWorkflows([workflowId]).then(() => onWorkflowActionExecution(workflowId));
  };

  const handleOnResumeWorkflow = () => {
    const { resumeWorkflows } = callbackUtils.getCallbacks;

    resumeWorkflows([workflowId]).then(() => onWorkflowActionExecution(workflowId));
  };

  const handleOnRetryWorkflow = () => {
    const { retryWorkflows } = callbackUtils.getCallbacks;

    retryWorkflows([workflowId]).then(() => onWorkflowActionExecution(workflowId));
  };

  if (status === 'FAILED' || status === 'TERMINATED' || status === 'TIMED_OUT') {
    return (
      <ButtonGroup float="right">
        <Button isDisabled={!isVisibleRestartButton} onClick={restartWorkflows} colorScheme="blue">
          <i className="fas fa-redo" />
          &nbsp;&nbsp;Restart
        </Button>
        <Button onClick={handleOnRetryWorkflow} colorScheme="blue">
          <i className="fas fa-history" />
          &nbsp;&nbsp;Retry
        </Button>
      </ButtonGroup>
    );
  }

  if (status === 'RUNNING') {
    return (
      <ButtonGroup float="right">
        <Button onClick={handleOnTerminateWorkflow} colorScheme="blue">
          <i className="fas fa-times" />
          &nbsp;&nbsp;Terminate
        </Button>
        <Button onClick={handleOnPauseWorkflow} colorScheme="blue">
          <i className="fas fa-pause" />
          &nbsp;&nbsp;Pause
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup float="right">
      <Button onClick={handleOnResumeWorkflow} colorScheme="blue">
        <i className="fas fa-play" />
        &nbsp;&nbsp;Resume
      </Button>
    </ButtonGroup>
  );
};

export default DetailsModalHeaderActionButtons;
