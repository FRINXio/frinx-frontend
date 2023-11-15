import { WorkflowStatus } from '../../__generated__/graphql';

export function getLabelColor(status: WorkflowStatus | 'UNKNOWN'): string {
  switch (status) {
    case 'FAILED':
    case 'TERMINATED':
      return 'red';
    case 'PAUSED':
      return 'blue.400';
    case 'RUNNING':
      return 'blue';
    case 'TIMED_OUT':
      return 'orange';
    case 'COMPLETED':
      return 'green';
    default:
      return 'gray';
  }
}
