import React, { useEffect, VoidFunctionComponent } from 'react';
import { Flex } from '@chakra-ui/react';
import { useAsyncGenerator } from '../commit-status-modal/commit-status-modal.helpers';

type Props = {
  workflowId: string;
  onFinish: (result: string) => void;
};

type WorkflowResponse = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  response_body: {
    counter: number;
    text: string;
  };
};

const WorkflowId: VoidFunctionComponent<Props> = ({ workflowId, onFinish }) => {
  const execPayload = useAsyncGenerator({ workflowId });

  useEffect(() => {
    if (execPayload == null) {
      return;
    }

    if (execPayload.status === 'COMPLETED') {
      const { output } = execPayload;
      const body = output as unknown as WorkflowResponse;
      const { text } = body.response_body;
      onFinish(text);
    }
  }, [execPayload, onFinish]);

  return <Flex justifyContent="center">Loading...</Flex>;
};

export default WorkflowId;
