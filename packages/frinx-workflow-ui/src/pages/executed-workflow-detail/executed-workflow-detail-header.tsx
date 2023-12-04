import React, { FC } from 'react';
import { Box, Flex, Heading, Spinner } from '@chakra-ui/react';
import ExecutedWorkflowDetailHeaderActionButton from './executed-workflow-detail-header-action-button';
import { WorkflowStatus } from '../../__generated__/graphql';
import { formatDate } from '../../helpers/utils.helpers';
import WorkflowStatusLabel from '../../components/workflow-status-label/workflow-status-label';
import { getExecutionTime, getFormattedEndTime } from './executed-workflow-detail.helpers';

type Props = {
  startTime: string | null;
  endTime: string | null;
  status: WorkflowStatus | null;
  isRestartButtonEnabled: boolean;
  onRestartWorkflow: () => void;
  onTerminateWorkflow: () => void;
  onRetryWorkflow: () => void;
  onPauseWorkflow: () => void;
  onResumeWorkflow: () => void;
};

const ExecutedWorkflowDetailHeader: FC<Props> = ({
  startTime,
  status,
  endTime,
  isRestartButtonEnabled,
  onRestartWorkflow,
  onTerminateWorkflow,
  onRetryWorkflow,
  onPauseWorkflow,
  onResumeWorkflow,
}) => {
  return (
    <Box background="white" padding={6} borderRadius="md" boxShadow="sm" marginBottom={10}>
      <Flex>
        <Box flex={1}>
          <Heading as="h4" fontSize="lg">
            Total Time (sec)
          </Heading>
          {status === 'RUNNING' ? <Spinner size="xs" /> : getExecutionTime(endTime, startTime)}
        </Box>
        <Box flex={1}>
          <Heading as="h4" fontSize="lg">
            Start Time
          </Heading>
          {formatDate(startTime)}
        </Box>
        <Box flex={1}>
          <Heading as="h4" fontSize="lg">
            End Time
          </Heading>
          {getFormattedEndTime(endTime, status ?? 'UNKNOWN')}
        </Box>
        <Box flex={1}>
          <Heading as="h4" fontSize="lg">
            Status
          </Heading>
          <WorkflowStatusLabel status={status ?? 'UNKNOWN'} />
        </Box>
        {status !== 'COMPLETED' && (
          <Box flex={1} marginLeft="auto">
            <ExecutedWorkflowDetailHeaderActionButton
              status={status}
              isRestartButtonEnabled={isRestartButtonEnabled}
              onRestartWorkflow={onRestartWorkflow}
              onTerminateWorkflow={onTerminateWorkflow}
              onRetryWorkflow={onRetryWorkflow}
              onPauseWorkflow={onPauseWorkflow}
              onResumeWorkflow={onResumeWorkflow}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default ExecutedWorkflowDetailHeader;
