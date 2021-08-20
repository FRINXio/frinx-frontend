import { TaskLabel } from '../../helpers/types';

const NODE_COLOR_MAP: Record<TaskLabel, string> = {
  http: 'yellow.300',
  graphql: 'yellow.500',
  js: 'orange.300',
  py: 'orange.500',
  decision: 'pink.400',
  fork: 'cyan.100',
  join: 'purple.100',
  while: 'blue.100',
  'while end': 'blue.200',
  lambda: 'orange.600',
  terminate: 'red.400',
  event: 'purple.300',
  wait: 'pink.200',
  raw: 'green.200',
  'exclusive join': 'cyan.300',
  'sub workflow': 'cyan.400',
  custom: 'cyan.300',
  simple: 'gray.400',
  start: 'green.100',
  end: 'red.100',
};

export function getNodeColor(label: TaskLabel): string {
  return NODE_COLOR_MAP[label];
}
