import React, { FC } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { Status } from './details-modal';
import { isEmpty } from 'lodash';
import DetailsModalHeaderActionButtons from './details-modal-header-action-button';

type Props = {
  startTime: string;
  endTime: string;
  status: Status | undefined;
  restartWorkflows: () => void;
  onWorkflowActionExecution: () => void;
  workflowId: string;
};

const execTime = (end: Date | number | string | undefined, start: Date | number | string | undefined) => {
  if (end == null || end === 0 || isEmpty(end)) {
    return '';
  }

  const endTime = new Date(end).getTime();

  if (start == null || start === 0 || isEmpty(start)) {
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
  <Box
    bgGradient="linear(to-r, rgb(0, 147, 255), rgb(0, 118, 203))"
    borderRadius={4}
    padding="15px"
    marginBottom="10px"
  >
    <Grid gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
      <Box md="auto">
        <div color="white">
          <b>Total Time (sec)</b>
          <br />
          {execTime(endTime, startTime)}
        </div>
      </Box>
      <Box md="auto">
        <div color="white">
          <b>Start Time</b>
          <br />
          {startTime}
        </div>
      </Box>
      <Box md="auto">
        <div color="white">
          <b>End Time</b>
          <br />
          {endTime}
        </div>
      </Box>
      <Box md="auto">
        <div color="white">
          <b>Status</b>
          <br />
          {status ?? '-'}
        </div>
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
