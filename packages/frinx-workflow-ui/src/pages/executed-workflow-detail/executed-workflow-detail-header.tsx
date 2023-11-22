import React, { FC } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import ExecutedWorkflowDetailHeaderActionButton from './executed-workflow-detail-header-action-button';
import { WorkflowStatus } from '../../__generated__/graphql';
import { formatDate } from '../../helpers/utils.helpers';
import WorkflowStatusLabel from '../../components/workflow-status-label/workflow-status-label';

type Props = {
  startTime: string;
  endTime: string;
  status: WorkflowStatus | null;
  isRestartButtonEnabled: boolean;
  onRestartWorkflow: () => void;
  onTerminateWorkflow: () => void;
  onRetryWorkflow: () => void;
  onPauseWorkflow: () => void;
  onResumeWorkflow: () => void;
};

const getExecutionTime = (end: string, start: string) => {
  if (end == null || isEmpty(end)) {
    return '';
  }
  const endTime = new Date(end).getTime();

  if (start == null || isEmpty(start)) {
    return endTime / 1000;
  }

  const startTime = new Date(start).getTime();
  const total = endTime - startTime;
  return total / 1000;
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
}) => (
  <Box background="white" padding={6} borderRadius="md" boxShadow="sm" marginBottom={10}>
    <Flex>
      <Box flex={1}>
        <Heading as="h4" fontSize="lg">
          Total Time (sec)
        </Heading>
        {getExecutionTime(endTime, startTime)}
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
        {formatDate(endTime)}
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

export default ExecutedWorkflowDetailHeader;
