import React, { FC } from 'react';
import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import { WorkflowStatus } from '../../__generated__/graphql';

type Props = {
  status: WorkflowStatus | null;
  onRestartWorkflow: () => void;
  onTerminateWorkflow: () => void;
  onRetryWorkflow: () => void;
  onPauseWorkflow: () => void;
  onResumeWorkflow: () => void;
  isRestartButtonEnabled: boolean;
};

const ExecutedWorkflowDetailHeaderActionButton: FC<Props> = ({
  status,
  isRestartButtonEnabled,
  onRestartWorkflow,
  onTerminateWorkflow,
  onRetryWorkflow,
  onPauseWorkflow,
  onResumeWorkflow,
}) => {
  if (status === 'FAILED' || status === 'TERMINATED' || status === 'TIMED_OUT') {
    return (
      <HStack justifyContent="flex-end" spacing={1}>
        <Button isDisabled={!isRestartButtonEnabled} onClick={onRestartWorkflow} colorScheme="blue">
          Restart
        </Button>
        <Button onClick={onRetryWorkflow} colorScheme="blue">
          Retry
        </Button>
      </HStack>
    );
  }

  if (status === 'RUNNING') {
    return (
      <HStack justifyContent="flex-end" spacing={1}>
        <Button onClick={onTerminateWorkflow} colorScheme="blue">
          Terminate
        </Button>
        <Button onClick={onPauseWorkflow} colorScheme="blue">
          Pause
        </Button>
      </HStack>
    );
  }

  return (
    <HStack justifyContent="flex-end" spacing={1}>
      <Button onClick={onResumeWorkflow} colorScheme="blue">
        Resume
      </Button>
    </HStack>
  );
};

export default ExecutedWorkflowDetailHeaderActionButton;
