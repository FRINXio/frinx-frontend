import { v4 as uuid } from 'uuid';
import { Task, HTTPTask, GraphQLTask, JSPythonTask, LambdaTask, StartTask, EndTask, ForkTask } from './types';

const DEFAULT_TASK_OPTIONS: Pick<
  Task,
  | 'optional'
  | 'ownerEmail'
  | 'pollTimeoutSeconds'
  | 'responseTimeoutSeconds'
  | 'retryCount'
  | 'retryLogic'
  | 'retryDelaySeconds'
  | 'startDelay'
  | 'timeoutPolicy'
  | 'timeoutSeconds'
  | 'description'
> = {
  optional: false,
  ownerEmail: 'frinxUser',
  pollTimeoutSeconds: 0,
  responseTimeoutSeconds: 10,
  retryCount: 0,
  retryDelaySeconds: 0,
  retryLogic: 'EXPONENTIAL_BACKOFF',
  startDelay: 0,
  timeoutPolicy: 'TIME_OUT_WF',
  timeoutSeconds: 60,
  description: '',
};

function createHTTPTask(): HTTPTask {
  return {
    id: uuid(),
    name: 'GLOBAL___HTTP_task',
    type: 'SIMPLE',
    taskReferenceName: `httpRequestTaskRef_${uuid()}`,
    inputParameters: {
      http_request: {
        contentType: 'application/json',
        method: 'GET',
        headers: {},
        timeout: 3600,
        uri: '${workflow.input.uri}',
      },
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}
function createGraphQLTask(): GraphQLTask {
  return {
    id: uuid(),
    name: 'GLOBAL___HTTP_task',
    type: 'SIMPLE',
    taskReferenceName: `graphQLTaskRef_${uuid()}`,
    inputParameters: {
      http_request: {
        contentType: 'application/json',
        method: 'POST',
        headers: {},
        timeout: 3600,
        uri: '${workflow.input.uri}',
        body: {
          query: '',
          variables: {},
        },
      },
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}
function createJSTask(): JSPythonTask {
  return {
    id: uuid(),
    name: 'GLOBAL__JS',
    type: 'SIMPLE',
    taskReferenceName: `lambdaJsTaskRef_${uuid()}`,
    inputParameters: {
      lambdaValue: '${workflow.input.lambdaValue}',
      scriptExpression: `if inputData["lambdaValue"] == "1":
        return {"testValue": True}
      else:
        return {"testValue": False}`,
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}
function createPYTask(): JSPythonTask {
  return {
    id: uuid(),
    name: 'GLOBAL__JS',
    type: 'SIMPLE',
    taskReferenceName: `lambdaJsTaskRef_${uuid()}`,
    inputParameters: {
      lambdaValue: '${workflow.input.lambdaValue}',
      scriptExpression: `if ($.lambdaValue == 1) {
        return {testvalue: true};
        } else {
        return {testvalue: false};
        }`,
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}
function createLambdaTask(): LambdaTask {
  return {
    id: uuid(),
    name: 'LAMBDA_TASK',
    taskReferenceName: `lambdaTaskRef_${uuid()}`,
    type: 'LAMBDA',
    inputParameters: {
      lambdaValue: '${workflow.input.lambdaValue}',
      scriptExpression: `if inputData["lambdaValue"] == "1":
        return {"testValue": True}
      else:
        return {"testValue": False}`,
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createStartEndTask(type: 'START' | 'END'): StartTask | EndTask {
  const name = type === 'START' ? 'START_TASK' : 'END_TASK';
  return {
    id: type === 'START' ? 'start' : 'end',
    name,
    type: name,
    taskReferenceName: `startTaskRef_${uuid()}`,
    inputParameters: undefined,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createForkTask(): ForkTask {
  return {
    id: uuid(),
    name: 'forkTask',
    type: 'FORK_JOIN',
    taskReferenceName: `forkTaskRef_${uuid()}`,
    forkTasks: [],
    inputParameters: undefined,
    ...DEFAULT_TASK_OPTIONS,
  };
}

export function createTask(taskLabel: string): Task {
  switch (taskLabel) {
    case 'HTTP':
      return createHTTPTask();
    case 'GRAPHQL':
      return createGraphQLTask();
    case 'JS':
      return createJSTask();
    case 'PY':
      return createPYTask();
    case 'LAMBDA':
      return createLambdaTask();
    case 'START':
      return createStartEndTask('START');
    case 'END':
      return createStartEndTask('END');
    case 'FORK':
      return createForkTask();
    default:
      throw new Error('should never happen');
  }
}
