import { Workflow } from '../helpers/types';

export type InputParameter = Record<string, { value: string; description: string; type: string }>;

export const sortAscBy = (key: string) => {
  return function (x: Record<string, any>, y: Record<string, any>) {
    return x[key] === y[key] ? 0 : x[key] > y[key] ? 1 : -1;
  };
};

export const sortDescBy = (key: string) => {
  return function (x: Record<string, any>, y: Record<string, any>) {
    return x[key] === y[key] ? 0 : x[key] < y[key] ? 1 : -1;
  };
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

export const getDynamicInputParametersFromWorkflow = (workflow?: Workflow | null): string[] => {
  const REGEX = /workflow\.input\.([a-zA-Z0-9-_]+)/gim;
  const stringifiedWorkflow = JSON.stringify(workflow || {});
  const match = stringifiedWorkflow.match(REGEX)?.map((path) => path.replace('workflow.input.', ''));

  return match || [];
};

export function parseInputParameters(inputParameters?: string[]) {
  if (inputParameters == null || inputParameters.length === 0) {
    return null;
  }

  const parsedInputParameters: InputParameter[] = inputParameters.map(jsonParse);

  return parsedInputParameters.map(Object.keys).reduce((acc, currObjectKeys, index) => {
    const result: InputParameter = currObjectKeys.reduce(
      (acc, curr) => ({ ...acc, [curr]: parsedInputParameters[index][curr] }),
      {},
    );

    return {
      ...acc,
      ...result,
    };
  }, {} as InputParameter);
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
