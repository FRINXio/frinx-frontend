import { Change } from '../../helpers/topology-helpers';

export function getEdgeColor(change: Change, isUnknown: boolean, isShortestPath: boolean, isGmpath: boolean): string {
  if (isShortestPath) {
    return 'blue.400';
  }
  if (isGmpath) {
    return 'red.400';
  }
  if (isUnknown) {
    if (change === 'DELETED') {
      return 'red.200';
    }
    if (change === 'ADDED') {
      return 'green.200';
    }
    if (change === 'UPDATED') {
      return 'yellow.200';
    }
    return 'gray.200';
  }
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
