import { Tag } from '@chakra-ui/react';
import React, { FC } from 'react';
import { WorkflowStatus } from '../../__generated__/graphql';
import { getLabelColor } from './workflow-status-label.helpers';

type Props = {
  status: WorkflowStatus | 'UNKNOWN';
  onClick?: (status: WorkflowStatus | 'UNKNOWN') => void;
};

const WorkflowStatusLabel: FC<Props> = ({ status, onClick }) => {
  return (
    <Tag
      as="button"
      colorScheme={getLabelColor(status)}
      onClick={() => {
        onClick?.(status);
      }}
    >
      {status}
    </Tag>
  );
};

export default WorkflowStatusLabel;
