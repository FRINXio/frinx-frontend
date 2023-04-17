import React from 'react';
import { Tag } from '@chakra-ui/react';
import { ExecutedWorkflowStatus } from '../../../../__generated__/graphql';

type Props = {
  status: ExecutedWorkflowStatus | "UNKNOWN";
  onClick?: (status: ExecutedWorkflowStatus | 'UNKNOWN') => void;
};

const ExecutedWorkflowStatusLabels = ({ status, onClick }: Props) => {
  switch (status) {
    case 'COMPLETED':
      return <Tag onClick={() => onClick?.('COMPLETED')} cursor="pointer" colorScheme="green">COMPLETED</Tag>;
    case 'TERMINATED':
      return <Tag onClick={() => onClick?.('TERMINATED')} cursor="pointer" colorScheme="red">{status}</Tag>;
    case 'FAILED':
      return <Tag onClick={() => onClick?.('FAILED')} cursor="pointer" colorScheme="red">{status}</Tag>;
    case 'RUNNING':
      return <Tag onClick={() => onClick?.('RUNNING')} cursor="pointer" colorScheme="blue">RUNNING</Tag>;
    case 'TIMED_OUT':
      return <Tag onClick={() => onClick?.('TIMED_OUT')} cursor="pointer" colorScheme="orange">TIMED OUT</Tag>;
    case 'PAUSED':
      return (
        <Tag onClick={() => onClick?.('PAUSED')} bgColor="blue.50" textColor="blue.300">
          PAUSED
        </Tag>
      );
    default:
      return <Tag onClick={() => onClick?.('UNKNOWN')} cursor="pointer" colorScheme="gray">UNKNOWN</Tag>;
  }
};

export default ExecutedWorkflowStatusLabels;
