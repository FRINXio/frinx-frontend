import React, { FC } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { ExecutedWorkflowStatus } from '../../__generated__/graphql';

type Props = {
  status: ExecutedWorkflowStatus | null;
  onRestartWorkflow: () => void;
  onTerminateWorkflow: () => void;
  onRetryWorkflow: () => void;
  onPauseWorkflow: () => void;
  onResumeWorkflow: () => void;
  isVisibleRestartButton: boolean;
};

const ExecutedWorkflowDetailHeaderActionButton: FC<Props> = ({
  status,
  isVisibleRestartButton,
  onRestartWorkflow,
  onTerminateWorkflow,
  onRetryWorkflow,
  onPauseWorkflow,
  onResumeWorkflow,
}) => {
  if (status === 'FAILED' || status === 'TERMINATED' || status === 'TIMED_OUT') {
    return (
      <ButtonGroup float="right">
        <Button isDisabled={!isVisibleRestartButton} onClick={onRestartWorkflow} colorScheme="blue">
          <i className="fas fa-redo" />
          &nbsp;&nbsp;Restart
        </Button>
        <Button onClick={onRetryWorkflow} colorScheme="blue">
          <i className="fas fa-history" />
          &nbsp;&nbsp;Retry
        </Button>
      </ButtonGroup>
    );
  }

  if (status === 'RUNNING') {
    return (
      <ButtonGroup float="right">
        <Button onClick={onTerminateWorkflow} colorScheme="blue">
          <i className="fas fa-times" />
          &nbsp;&nbsp;Terminate
        </Button>
        <Button onClick={onPauseWorkflow} colorScheme="blue">
          <i className="fas fa-pause" />
          &nbsp;&nbsp;Pause
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup float="right">
      <Button onClick={onResumeWorkflow} colorScheme="blue">
        <i className="fas fa-play" />
        &nbsp;&nbsp;Resume
      </Button>
    </ButtonGroup>
  );
};

export default ExecutedWorkflowDetailHeaderActionButton;
