import React, { FC } from 'react';
import { Status } from './executed-workflow-detail';
import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import callbackUtils from '../../utils/callback-utils';

type Props = {
  workflowId: string;
  status: Status | undefined;
  restartWorkflows: () => void;
  onWorkflowActionExecution: () => void;
};

const DetailsModalHeaderActionButtons: FC<Props> = ({
  status,
  onWorkflowActionExecution,
  restartWorkflows,
  workflowId,
}) => {
  const terminateWorkflows = () => {
    const terminateWorkflows = callbackUtils.terminateWorkflowsCallback();

    terminateWorkflows([workflowId]).then(() => {
      onWorkflowActionExecution();
    });
  };

  const pauseWorkflows = () => {
    const pauseWorkflows = callbackUtils.pauseWorkflowsCallback();

    pauseWorkflows([workflowId]).then(() => {
      onWorkflowActionExecution();
    });
  };

  const resumeWorkflows = () => {
    const resumeWorkflows = callbackUtils.resumeWorkflowsCallback();

    resumeWorkflows([workflowId]);
    onWorkflowActionExecution();
  };

  const retryWorkflows = () => {
    const retryWorkflows = callbackUtils.retryWorkflowsCallback();

    retryWorkflows([workflowId]).then(() => {
      onWorkflowActionExecution();
    });
  };
  if (status === 'COMPLETED') {
    return <Box color="white">Worklow was successfully executed</Box>;
  }

  if (status === 'FAILED' || status === 'TERMINATED') {
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
