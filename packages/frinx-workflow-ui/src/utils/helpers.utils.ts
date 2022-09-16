import { Workflow } from '../helpers/types';

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
