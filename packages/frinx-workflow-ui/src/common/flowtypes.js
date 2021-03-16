// @flow

export type Task = {
  taskType: string,
  status: string,
  reasonForIncompletion: string,
  referenceTaskName: string,
  callbackAfterSeconds: number,
  pollCount: number,
  logs: {},
  inputData: {},
  outputData: {},
  workflowTask: {
    description: string;
    taskDefinition: {
      description: string;
    };
  },
};
