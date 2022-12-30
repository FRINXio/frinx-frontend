import { v4 as uuid } from 'uuid';
import { ExtendedTask, Workflow } from '@frinx/shared/src';
import { getTaskLabel } from './task.helpers';

export function deserializeId(id: string): { type: string; id: string } {
  return JSON.parse(id);
}

export function convertWorkflow(wf: Workflow): Workflow<ExtendedTask> {
  const { tasks, ...rest } = wf;
  return {
    ...rest,
    tasks: tasks.map((t) => ({
      ...t,
      id: uuid(),
      label: getTaskLabel(t),
    })),
  };
}

export function createEmptyWorkflow(): Pick<
  Workflow,
  | 'name'
  | 'description'
  | 'version'
  | 'ownerEmail'
  | 'restartable'
  | 'timeoutPolicy'
  | 'timeoutSeconds'
  | 'outputParameters'
  | 'variables'
> {
  return {
    name: '',
    description: '{}',
    version: 1,
    ownerEmail: '',
    restartable: true,
    timeoutPolicy: 'ALERT_ONLY',
    timeoutSeconds: 0,
    outputParameters: {},
    variables: {},
  };
}
