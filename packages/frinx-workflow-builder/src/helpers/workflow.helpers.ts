import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { ExtendedTask, Workflow } from './types';

export type InputParameter = Record<string, { value: string; description: string; type: string }>;

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

export const getDynamicInputParametersFromWorkflow = (workflow?: Workflow | null): string[] => {
  const REGEX = /workflow\.input\.([a-zA-Z0-9-_]+)/gim;
  const stringifiedWorkflow = JSON.stringify(workflow || {});
  const match = stringifiedWorkflow.match(REGEX)?.map((path) => path.replace('workflow.input.', ''));

  return match || [];
};

export const jsonParse = (json?: string | null) => {
  if (json == null) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export function parseInputParameters(inputParameters?: string[]): InputParameter | null {
  if (inputParameters == null || inputParameters.length === 0) {
    return null;
  }

  const parsedInputParameters: InputParameter[] = inputParameters.map(jsonParse);

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

export function getInitialValuesFromParsedInputParameters(
  parsedInputParameters?: InputParameter | null,
  dynamicInputParameters?: string[] | null,
) {
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
