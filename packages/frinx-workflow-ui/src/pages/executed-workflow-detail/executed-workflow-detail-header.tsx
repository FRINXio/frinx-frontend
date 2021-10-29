import React, { FC } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { Status } from './executed-workflow-detail';
import { isEmpty } from 'lodash';
import DetailsModalHeaderActionButtons from './executed-workflow-detail-header-action-button';

type Props = {
  startTime: string;
  endTime: string;
  status: Status | undefined;
  restartWorkflows: () => void;
  onWorkflowActionExecution: () => void;
  workflowId: string;
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
}) => (
  <Box background="brand.600" borderRadius={4} padding={15} marginBottom={10}>
    <Grid gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
      <Box md="auto">
        <Box color="white">
          <b>Total Time (sec)</b>
          <br />
          {getExecutionTime(endTime, startTime)}
        </Box>
      </Box>
      <Box md="auto">
        <Box color="white">
          <b>Start Time</b>
          <br />
          {startTime}
        </Box>
      </Box>
      <Box md="auto">
        <Box color="white">
          <b>End Time</b>
          <br />
          {endTime}
        </Box>
      </Box>
      <Box md="auto">
        <Box color="white">
          <b>Status</b>
          <br />
          {status ?? '-'}
        </Box>
      </Box>
      <Box>
        <DetailsModalHeaderActionButtons
          restartWorkflows={restartWorkflows}
          workflowId={workflowId}
          status={status ?? 'RUNNING'}
          onWorkflowActionExecution={onWorkflowActionExecution}
        />
      </Box>
    </Grid>
  </Box>
);

export default DetailsModalHeader;
