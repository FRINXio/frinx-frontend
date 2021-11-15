import { Badge, Box, Progress } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import {
  getStatusBadgeColor,
  useAsyncGenerator,
} from '../../components/commit-status-modal/commit-status-modal.helpers';

type Props = {
  workflowId: string;
  onWorkflowFinish?: () => void;
};

const WorkflowProgressBar: VoidFunctionComponent<Props> = ({ workflowId, onWorkflowFinish }) => {
  const execPayload = useAsyncGenerator({ workflowId, onFinish: onWorkflowFinish });

  if (execPayload == null) {
    return null;
  }

  const { status } = execPayload;

  return (
    <Box>
      <Progress hasStripe isAnimated={status === 'RUNNING'} isIndeterminate colorScheme={getStatusBadgeColor(status)} />
      <Box textAlign="center" marginTop={2}>
        <Badge marginLeft="auto" colorScheme={getStatusBadgeColor(status)}>
          {status}
        </Badge>
      </Box>
    </Box>
  );
};

export default WorkflowProgressBar;
