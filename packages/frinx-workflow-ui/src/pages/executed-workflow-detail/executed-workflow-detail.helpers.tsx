import React, { ReactNode } from 'react';
import { Spinner } from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import { formatDate } from '../../helpers/utils.helpers';
import { WorkflowStatus } from '../../__generated__/graphql';

export function getExecutionTime(end: string | null, start: string | null) {
  if (end == null || start == null) {
    return '-';
  }
  return formatDistance(new Date(start), new Date(end), { includeSeconds: true });
}

export function getFormattedEndTime(endTime: string | null, status: WorkflowStatus | 'UNKNOWN'): ReactNode {
  if (endTime == null) {
    if (status === 'RUNNING') {
      return <Spinner size="xs" />;
    }
    return '-';
  }
  return formatDate(new Date(endTime));
}
