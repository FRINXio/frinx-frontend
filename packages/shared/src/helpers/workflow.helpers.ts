import { utcToZonedTime } from 'date-fns-tz';
import { omit } from 'lodash';
import { v4 as uuid } from 'uuid';
import { omitNullValue } from './omit-null-value';
import { getTaskLabel } from './task.helpers';
import {
  Workflow,
  ExtendedTask,
  ClientWorkflow,
  Task,
  SubworkflowTask,
  ClientWorkflowWithTasks,
} from './workflow-api.types';

export type InputParameter = Record<
  string,
  { value: string; description: string; type: string; options?: string[] | null }
>;

type ModalWorkflow = {
  correlationId: string;
  description: string | undefined;
  name: string;
  version: number;
  inputParameters: (string | null)[];
  outputParameters: unknown;
  restartable: boolean;
  ownerEmail: string;
  schemaVersion: number;
  timeoutPolicy: string;
  timeoutSeconds: unknown;
  variables: unknown;
  tasks: never[];
};

export const getDynamicInputParametersFromWorkflow = (
  workflow?: ModalWorkflow | Workflow | ClientWorkflowWithTasks | ClientWorkflow | null,
): string[] => {
  const REGEX = /workflow\.input\.([a-zA-Z0-9-_]+)/gim;
  const stringifiedWorkflow = JSON.stringify(workflow || {});
  const match = stringifiedWorkflow.match(REGEX)?.map((path) => path.replace('workflow.input.', ''));

  return match || [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonParse = <T = { description: string }>(json?: string | null): T | null => {
  if (json == null) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export function parseInputParameters(inputParameters?: (string | null)[] | null): InputParameter | null {
  if (inputParameters == null || inputParameters.length === 0) {
    return null;
  }

  const parsedInputParameters: InputParameter[] = inputParameters
    .filter(omitNullValue)
    .map((v) => jsonParse<InputParameter>(v))
    .filter(omitNullValue);

  return parsedInputParameters.map(Object.keys).reduce((acc, currObjectKeys, index) => {
    const result: InputParameter = currObjectKeys.reduce(
      (parsedInputParams, curr) => ({ ...parsedInputParams, [curr]: parsedInputParameters[index][curr] }),
      {},
    );

    return {
      ...acc,
      ...result,
    };
  }, {});
}

export function isWorkflowNameAvailable(workflows: ClientWorkflowWithTasks[], name: string): boolean {
  return workflows.every((wf) => wf.name !== name);
}

export function getInitialValuesFromParsedInputParameters(
  parsedInputParameters?: InputParameter | null,
  dynamicInputParameters?: string[] | null,
): Record<string, string> {
  let initialValues = {};
  if (parsedInputParameters != null) {
    initialValues = Object.keys(parsedInputParameters).reduce(
      (acc, curr) => ({ ...acc, [curr]: parsedInputParameters[curr].value }),
      {},
    );
  }

  if (dynamicInputParameters != null) {
    initialValues = {
      ...dynamicInputParameters?.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: '',
        }),
        {},
      ),
      ...initialValues,
    };
  }

  return initialValues;
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

export function createEmptyWorkflow(): ClientWorkflow & { tasks: ExtendedTask[] } {
  return {
    id: '',
    name: '',
    description: '',
    version: 1,
    createdAt: null,
    updatedAt: null,
    hasSchedule: false,
    tasks: [],
    inputParameters: [],
    labels: [],
    timeoutSeconds: 0,
    outputParameters: [],
    restartable: false,
    ownerEmail: '',
    schemaVersion: 2,
    timeoutPolicy: null,
    createdBy: '',
    updatedBy: '',
  };
}

export function getLocalDateFromUTC(date: string): Date {
  return utcToZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
}

export function isTaskWithInputParameters(task: Task): task is SubworkflowTask {
  if (task.type === 'SUB_WORKFLOW') {
    return true;
  }

  return false;
}

export function isValueOfType<T>(propertyName: string, obj?: unknown | null): obj is T {
  if (obj == null) {
    return false;
  }

  return Object.keys(obj).includes(propertyName);
}

export function removeGraphqlSpecsFromWorkflow(workflow?: ClientWorkflowWithTasks | ClientWorkflow | null) {
  if (workflow == null) {
    return null;
  }

  if (isValueOfType<ClientWorkflowWithTasks>('tasks', workflow)) {
    const workflowTasksWithoutGraphqlSpecs = workflow?.tasks.map((task) => omit(task, ['id', '__typename']));

    return {
      ...omit(workflow, ['id', '__typename']),
      tasks: workflowTasksWithoutGraphqlSpecs,
      tasksJson: JSON.stringify(workflowTasksWithoutGraphqlSpecs),
    };
  }

  return omit(workflow, ['id', '__typename']);
}
