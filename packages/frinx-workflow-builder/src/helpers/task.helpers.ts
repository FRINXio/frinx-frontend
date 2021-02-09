/* eslint-disable no-template-curly-in-string */
import { v4 as uuid } from 'uuid';
import {
  Task,
  HTTPTask,
  GraphQLTask,
  JSPythonTask,
  LambdaTask,
  StartTask,
  EndTask,
  ForkTask,
  JoinTask,
  WhileTask,
  WhileEndTask,
  DecisionTask,
  TerminateTask,
  EventTask,
  WaitTask,
  RawTask,
} from './types';

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
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createJoinTask(): JoinTask {
  return {
    id: uuid(),
    name: 'joinTask',
    type: 'JOIN',
    taskReferenceName: `joinTaskRef_${uuid()}`,
    joinOn: [],
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createWhileTask(): WhileTask {
  return {
    id: uuid(),
    name: 'whileTask',
    type: 'DO_WHILE',
    taskReferenceName: `whileTaskRef_${uuid()}`,
    loopOver: [],
    loopCondition: '',
    inputParameters: {
      iterations: 3,
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createWhileEndTask(): WhileEndTask {
  return {
    id: uuid(),
    name: 'whileEndTask',
    type: 'WHILE_END',
    taskReferenceName: `whileEndTaskRef_${uuid()}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createDecisionTask(): DecisionTask {
  return {
    id: uuid(),
    name: 'decisionTask',
    type: 'DECISION',
    taskReferenceName: `decisionTaskRef_${uuid()}`,
    caseValueParam: '',
    decisionCases: {
      true: [],
    },
    defaultCase: [],
    inputParameters: {
      param: 'true',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createTerminateTask(): TerminateTask {
  return {
    id: uuid(),
    name: 'terminateTask',
    type: 'TERMINATE',
    taskReferenceName: `terminateTaskRef_${uuid()}`,
    inputParameters: {
      terminationStatus: 'COMPLETED',
      workflowOutput: 'Expected workflow output',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createEventTask(): EventTask {
  return {
    id: uuid(),
    name: 'eventTask',
    type: 'EVENT',
    taskReferenceName: `eventTaskRef_${uuid()}`,
    sink: 'conductor',
    inputParameters: {
      targetWorkflowId: '${workflow.input.targetWorkflowId}',
      targetTaskRefName: '${workflow.input.targetTaskRefName}',
      action: 'complete_task',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createWaitTask(): WaitTask {
  return {
    id: uuid(),
    name: 'waitTask',
    type: 'WAIT',
    taskReferenceName: `waitTaskRef_${uuid()}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createRawTask(): RawTask {
  return {
    id: uuid(),
    name: 'rawTask',
    type: 'RAW',
    taskReferenceName: `rawTaskRef_${uuid()}`,
    inputParameters: {
      raw: '',
    },
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
    case 'JOIN':
      return createJoinTask();
    case 'WHILE':
      return createWhileTask();
    case 'WHILE END':
      return createWhileEndTask();
    case 'DECISION':
      return createDecisionTask();
    case 'TERMINATE':
      return createTerminateTask();
    case 'EVENT':
      return createEventTask();
    case 'WAIT':
      return createWaitTask();
    case 'RAW':
      return createRawTask();
    default:
      throw new Error('should never happen');
  }
}
