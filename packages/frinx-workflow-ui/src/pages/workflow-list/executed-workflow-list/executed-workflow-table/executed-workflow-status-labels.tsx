import React from 'react';
import { Tag } from '@chakra-ui/react';

enum StatusOfExecutedWorkflow {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RUNNING = 'RUNNING',
  TERMINATED = 'TERMINATED',
  TIMED_OUT = 'TIMED_OUT',
  PAUSED = 'PAUSED',
}

const ExecutedWorkflowStatusLabels = ({ status }: { status: StatusOfExecutedWorkflow }) => {
  switch (status) {
    case StatusOfExecutedWorkflow.COMPLETED:
      return <Tag colorScheme="green">COMPLETED</Tag>;
    case StatusOfExecutedWorkflow.FAILED:
    case StatusOfExecutedWorkflow.TERMINATED:
      return <Tag colorScheme="red">FAILED</Tag>;
    case StatusOfExecutedWorkflow.RUNNING:
      return <Tag colorScheme="blue">RUNNING</Tag>;
    case StatusOfExecutedWorkflow.TIMED_OUT:
      return <Tag colorScheme="orange">TIMED OUT</Tag>;
    case StatusOfExecutedWorkflow.PAUSED:
      return (
        <Tag bgColor="blue.200" textColor="white">
          PAUSED
        </Tag>
      );
    default:
      return <Tag colorScheme="gray">UNKNOWN</Tag>;
  }
};

export default ExecutedWorkflowStatusLabels;
