import { Workflow } from '../helpers/types';

export type InputParameter = Record<
  string,
  { value: string; description: string; type: string; options?: string[] | null }
>;

export const sortAscBy = (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: Record<string, any>, y: Record<string, any>) => {
    if (x[key] < y[key]) {
      return -1;
    }
    if (x[key] > y[key]) {
      return 1;
    }
    return 0;
  };
};

export const sortDescBy = (key: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: Record<string, any>, y: Record<string, any>) => {
    if (x[key] > y[key]) {
      return -1;
    }
    if (x[key] < y[key]) {
      return 1;
    }
    return 0;
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
