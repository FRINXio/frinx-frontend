import { omitNullValue } from './omit-null-value';
import { Workflow } from './workflow-api.types';

export type InputParameter = Record<
  string,
  { value: string; description: string; type: string; options?: string[] | null }
>;

export const getDynamicInputParametersFromWorkflow = (workflow?: Workflow | null): string[] => {
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

export function parseInputParameters(inputParameters?: string[]): InputParameter | null {
  if (inputParameters == null || inputParameters.length === 0) {
    return null;
  }

  const parsedInputParameters: InputParameter[] = inputParameters
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

export function isWorkflowNameAvailable(workflows: Workflow[], name: string): boolean {
  return workflows.every((wf) => wf.name !== name);
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