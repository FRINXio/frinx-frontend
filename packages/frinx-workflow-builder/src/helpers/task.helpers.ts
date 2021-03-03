/* eslint-disable no-template-curly-in-string */
import { v4 as uuid } from 'uuid';
import {
  Task,
  HTTPTask,
  GraphQLTask,
  JSPythonTask,
  StartTask,
  EndTask,
  ExtendedLambdaTask,
  ExtendedForkTask,
  ExtendedJoinTask,
  ExtendedWhileTask,
  ExtendedWhileEndTask,
  ExtendedDecisionTask,
  ExtendedTerminateTask,
  ExtendedEventTask,
  ExtendedWaitTask,
  ExtendedRawTask,
  ExtendedDynamicForkTask,
  ExtendedHTTPTask,
  ExtendedGraphQLTask,
  ExtendedJSPythonTask,
  InputParameters,
  HTTPInputParams,
  GraphQLInputParams,
  LambdaInputParams,
  TaskLabel,
  ExtendedTask,
  TaskDefinition,
  ExtendedSimpleTask,
} from './types';

const DEFAULT_TASK_OPTIONS: Pick<Task, 'optional' | 'startDelay'> = {
  startDelay: 0,
  optional: false,
};

function createHTTPTask(label: TaskLabel): ExtendedHTTPTask {
  return {
    id: uuid(),
    label,
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
function createGraphQLTask(label: TaskLabel): ExtendedGraphQLTask {
  return {
    id: uuid(),
    label,
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
function createJSTask(label: TaskLabel): ExtendedJSPythonTask {
  return {
    id: uuid(),
    label,
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
function createPYTask(label: TaskLabel): ExtendedJSPythonTask {
  return {
    id: uuid(),
    label,
    name: 'GLOBAL__PY',
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
function createLambdaTask(label: TaskLabel): ExtendedLambdaTask {
  return {
    id: uuid(),
    label,
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

function createStartEndTask(
  label: 'start' | 'end',
): (StartTask & { id: string; label: string }) | (EndTask & { id: string; label: string }) {
  const name = label === 'start' ? 'START_TASK' : 'END_TASK';
  return {
    id: label,
    label,
    name,
    type: name,
    taskReferenceName: `startTaskRef_${uuid()}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createForkTask(label: TaskLabel): ExtendedForkTask {
  return {
    id: uuid(),
    label,
    name: 'forkTask',
    type: 'FORK_JOIN',
    taskReferenceName: `forkTaskRef_${uuid()}`,
    forkTasks: [],
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createJoinTask(label: TaskLabel): ExtendedJoinTask {
  return {
    id: uuid(),
    label,
    name: 'joinTask',
    type: 'JOIN',
    taskReferenceName: `joinTaskRef_${uuid()}`,
    joinOn: [],
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createWhileTask(label: TaskLabel): ExtendedWhileTask {
  return {
    id: uuid(),
    label,
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

function createWhileEndTask(label: TaskLabel): ExtendedWhileEndTask {
  return {
    id: uuid(),
    label,
    name: 'whileEndTask',
    type: 'WHILE_END',
    taskReferenceName: `whileEndTaskRef_${uuid()}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createDecisionTask(label: TaskLabel): ExtendedDecisionTask {
  return {
    id: uuid(),
    label,
    name: 'decisionTask',
    type: 'DECISION',
    taskReferenceName: `decisionTaskRef_${uuid()}`,
    caseValueParam: 'param',
    decisionCases: {
      true: [],
    },
    defaultCase: [],
    inputParameters: {
      param: 'true',
      foo: 'bar',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createTerminateTask(label: TaskLabel): ExtendedTerminateTask {
  return {
    id: uuid(),
    label,
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

function createEventTask(label: TaskLabel): ExtendedEventTask {
  return {
    id: uuid(),
    label,
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

function createWaitTask(label: TaskLabel): ExtendedWaitTask {
  return {
    id: uuid(),
    label,
    name: 'waitTask',
    type: 'WAIT',
    taskReferenceName: `waitTaskRef_${uuid()}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createRawTask(label: TaskLabel): ExtendedRawTask {
  return {
    id: uuid(),
    label,
    name: 'rawTask',
    type: 'RAW',
    taskReferenceName: `rawTaskRef_${uuid()}`,
    inputParameters: {
      raw: '',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

export function createSubWorkflowTask(name: string, version: string): ExtendedDynamicForkTask {
  return {
    id: uuid(),
    label: 'sub workflow',
    name,
    type: 'SUB_WORKFLOW',
    taskReferenceName: `${name}Ref_${uuid()}`,
    inputParameters: {
      expectedName: '${workflow.input.expectedName}',
      expectedType: 'SIMPLE',
      dynamic_tasks: '${workflow.input.dynamic_tasks}',
      dynamic_tasks_i: '${workflow.input.dynamic_tasks_i}',
    },
    subWorkflowParam: {
      name,
      version: Number(version),
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

export function createTask(taskLabel: TaskLabel): ExtendedTask {
  switch (taskLabel) {
    case 'http':
      return createHTTPTask(taskLabel);
    case 'graphql':
      return createGraphQLTask(taskLabel);
    case 'js':
      return createJSTask(taskLabel);
    case 'py':
      return createPYTask(taskLabel);
    case 'lambda':
      return createLambdaTask(taskLabel);
    case 'start':
      return createStartEndTask(taskLabel);
    case 'end':
      return createStartEndTask(taskLabel);
    case 'fork':
      return createForkTask(taskLabel);
    case 'join':
      return createJoinTask(taskLabel);
    case 'while':
      return createWhileTask(taskLabel);
    case 'while end':
      return createWhileEndTask(taskLabel);
    case 'decision':
      return createDecisionTask(taskLabel);
    case 'terminate':
      return createTerminateTask(taskLabel);
    case 'event':
      return createEventTask(taskLabel);
    case 'wait':
      return createWaitTask(taskLabel);
    case 'raw':
      return createRawTask(taskLabel);
    default:
      throw new Error('should never happen');
  }
}

export const isHttpTaskInputParams = (params: InputParameters): params is HTTPInputParams =>
  'http_request' in params && typeof params.http_request === 'object';
export const isGraphQLTaskInputParams = (params: InputParameters): params is GraphQLInputParams =>
  isHttpTaskInputParams(params) &&
  params.http_request.method === 'POST' &&
  typeof params.http_request.body === 'object';
export const isLambdaTaskInputParams = (params: InputParameters): params is LambdaInputParams =>
  'lambdaValue' in params;

export const isHttpTask = (task: Task): task is HTTPTask =>
  task.type === 'SIMPLE' && 'inputParameters' in task && isHttpTaskInputParams(task.inputParameters);
export const isGraphQLTask = (task: Task): task is GraphQLTask =>
  task.type === 'SIMPLE' && 'inputParameters' in task && isGraphQLTaskInputParams(task.inputParameters);
export const isJSorPYTask = (task: Task): task is JSPythonTask =>
  task.type === 'SIMPLE' && 'inputParameters' in task && isLambdaTaskInputParams(task.inputParameters);

export function createSystemTasks(): TaskLabel[] {
  return [
    'start',
    'end',
    'http',
    'graphql',
    'js',
    'py',
    'lambda',
    'decision',
    'event',
    'while',
    'fork',
    'join',
    'raw',
    'terminate',
    'wait',
    'while end',
  ];
}

export function getTaskLabel(t: Task): TaskLabel {
  switch (t.type) {
    case 'DECISION':
      return 'decision';
    case 'DO_WHILE':
      return 'while';
    case 'END_TASK':
      return 'end';
    case 'EVENT':
      return 'event';
    case 'FORK_JOIN':
      return 'fork';
    case 'JOIN':
      return 'join';
    case 'LAMBDA':
      return 'lambda';
    case 'RAW':
      return 'raw';
    case 'START_TASK':
      return 'start';
    case 'TERMINATE':
      return 'terminate';
    case 'WAIT':
      return 'wait';
    case 'WHILE_END':
      return 'while end';
    case 'SIMPLE': {
      if (isGraphQLTask(t)) {
        return 'graphql';
      }
      if (isHttpTask(t)) {
        return 'http';
      }
      if (isJSorPYTask(t)) {
        return t.name.replace('GLOBAL__', '').toLowerCase() as 'js' | 'py';
      }
      return 'simple';
      // throw new Error('should never happen');
    }
    default:
      throw new Error('should never happen');
  }
}

export function convertTaskDefinition(taskDefinition: TaskDefinition): ExtendedSimpleTask {
  const { name, inputKeys } = taskDefinition;
  return {
    id: uuid(),
    name,
    label: 'simple',
    type: 'SIMPLE',
    taskReferenceName: `${name}RefName_${uuid()}`,
    optional: false,
    startDelay: 0,
    inputParameters:
      inputKeys?.reduce((acc, curr) => {
        return { ...acc, [curr]: `\${workflow.input.${curr}}` };
      }, {}) ?? {},
  };
}
