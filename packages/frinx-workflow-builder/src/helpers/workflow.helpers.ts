import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { ExtendedTask, Workflow } from './types';

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

export function isWorkflowNameAvailable(workflows: Workflow[], name: string): boolean {
  return workflows.every((wf) => wf.name !== name);
}
