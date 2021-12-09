import React, { useEffect, VoidFunctionComponent } from 'react';
import { Flex } from '@chakra-ui/react';
import { useAsyncGenerator } from '../commit-status-modal/commit-status-modal.helpers';

type Props = {
  workflowId: string;
  onFinish: (result: string) => void;
};

const WorkflowId: VoidFunctionComponent<Props> = ({ workflowId, onFinish }) => {
  const execPayload = useAsyncGenerator({ workflowId });

  useEffect(() => {
    if (execPayload == null) {
      return;
    }

    if (execPayload.status === 'COMPLETED') {
      const { output } = execPayload;
      const data = output;
      onFinish(JSON.stringify(data));
    }
  }, [execPayload, onFinish]);

  return <Flex justifyContent="center">Loading...</Flex>;
};

export default WorkflowId;
