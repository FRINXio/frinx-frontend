import React, { FC } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { Status } from './details-modal';
import { isEmpty } from 'lodash';
import DetailsModalHeaderActionButtons from './details-modal-header-action-button';

type Props = {
  startTime: string;
  endTime: string;
  status: Status | undefined;
  restartWfs: () => void;
  onWorkflowActionExecution: () => void;
  wfId: string;
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

const DetailsModalHeader: FC<Props> = ({ startTime, status, endTime, onWorkflowActionExecution, wfId, restartWfs }) => (
  <div className="headerInfo">
    <Grid gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
      <Box md="auto">
        <div>
          <b>Total Time (sec)</b>
          <br />
          {execTime(endTime, startTime)}
        </div>
      </Box>
      <Box md="auto">
        <div>
          <b>Start Time</b>
          <br />
          {startTime}
        </div>
      </Box>
      <Box md="auto">
        <div>
          <b>End Time</b>
          <br />
          {endTime}
        </div>
      </Box>
      <Box md="auto">
        <div>
          <b>Status</b>
          <br />
          {status ?? '-'}
        </div>
      </Box>
      <Box>
        <DetailsModalHeaderActionButtons
          restartWfs={restartWfs}
          wfId={wfId}
          status={status ?? 'RUNNING'}
          onWorkflowActionExecution={onWorkflowActionExecution}
        />
      </Box>
    </Grid>
  </div>
);

export default DetailsModalHeader;
