import React, { VoidFunctionComponent } from 'react';
import { Tag } from '@chakra-ui/react';

export type Status = 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE';

type Props = {
  status: Status;
};

function getColor(status: Status): string {
  switch (status) {
    case 'CREATED':
      return 'green';
    case 'UPDATED':
      return 'orange';
    case 'DELETED':
      return 'red';
    default:
      return '';
  }
}

function getText(status: Status): string {
  switch (status) {
    case 'CREATED':
      return 'Created';
    case 'UPDATED':
      return 'Updated';
    case 'DELETED':
      return 'Deleted';
    default:
      return '';
  }
}

const StatusTag: VoidFunctionComponent<Props> = ({ status }) => {
  if (status === 'NO_CHANGE') {
    return null;
  }

  return <Tag color={getColor(status)}>{getText(status)}</Tag>;
};

export default StatusTag;
