import { Change } from '../../helpers/topology-helpers';

export function getEdgeColor(change: Change) {
  if (change === 'DELETED') {
    return 'red.400';
  }
  if (change === 'ADDED') {
    return 'green.400';
  }
  if (change === 'UPDATED') {
    return 'yellow.400';
  }
  return 'gray.800';
}
