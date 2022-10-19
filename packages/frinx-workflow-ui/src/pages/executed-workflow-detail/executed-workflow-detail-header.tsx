import React, { FC } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { Status } from '@frinx/workflow-ui/src/helpers/types';
import { isEmpty } from 'lodash';
import DetailsModalHeaderActionButtons from './executed-workflow-detail-header-action-button';

type Props = {
  startTime: string;
  endTime: string;
  status: Status;
  restartWorkflows: () => void;
  onWorkflowActionExecution: (workflowId: string) => void;
  workflowId: string;
  visibleRestartButton: boolean;
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

const DetailsModalHeader: FC<Props> = ({
  startTime,
  status,
  endTime,
  onWorkflowActionExecution,
  workflowId,
  restartWorkflows,
  visibleRestartButton,
}) => (
  <Box background="blue.600" borderRadius={4} padding={15} marginBottom={10}>
    <Grid templateColumns={status === 'COMPLETED' ? 'repeat(4, 1fr)' : 'repeat(5,1fr)'}>
      <Box mx="auto">
        <Box color="white">
          <b>Total Time (sec)</b>
          <br />
          {getExecutionTime(endTime, startTime)}
        </Box>
      </Box>
      <Box mx="auto">
        <Box color="white">
          <b>Start Time</b>
          <br />
          {startTime}
        </Box>
      </Box>
      <Box mx="auto">
        <Box color="white">
          <b>End Time</b>
          <br />
          {endTime}
        </Box>
      </Box>
      <Box mx="auto">
        <Box color="white">
          <b>Status</b>
          <br />
          {status}
        </Box>
      </Box>
      {status !== 'COMPLETED' && (
        <Box>
          <DetailsModalHeaderActionButtons
            restartWorkflows={restartWorkflows}
            workflowId={workflowId}
            status={status}
            onWorkflowActionExecution={onWorkflowActionExecution}
            isVisibleRestartButton={visibleRestartButton}
          />
        </Box>
      )}
    </Grid>
  </Box>
);

export default DetailsModalHeader;
