export type ExecutionState = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'NONE';

export function getBackgroundColor(state: ExecutionState): string {
  switch (state) {
    case 'COMPLETED':
      return 'green.200';
    case 'FAILED':
      return 'red.200';
    case 'RUNNING':
      return 'yellow.200';
    default:
      return 'none';
  }
}
