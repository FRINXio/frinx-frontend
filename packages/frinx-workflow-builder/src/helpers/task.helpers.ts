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
  ExtendedSubworkflowTask,
  ExtendedHTTPTask,
  ExtendedGraphQLTask,
  ExtendedKafkaPublishTask,
  ExtendedJsonJQTask,
  InputParameters,
  HTTPInputParams,
  GraphQLInputParams,
  LambdaInputParams,
  TaskLabel,
  ExtendedTask,
  TaskDefinition,
  ExtendedSimpleTask,
  ExtendedExclusiveJoinTask,
  SerializerEnum,
} from './types';

const DEFAULT_TASK_OPTIONS: Pick<Task, 'optional' | 'startDelay'> = {
  startDelay: 0,
  optional: false,
};

function getRandomString(length: number): string {
  return window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
        .map((b) => String.fromCharCode(b))
        .join(''),
    )
    .replace(/[+/]/g, '')
    .substring(0, length);
}

function createHTTPTask(label: TaskLabel): ExtendedHTTPTask {
  return {
    id: uuid(),
    label,
    name: 'HTTP_task',
    type: 'SIMPLE',
    taskReferenceName: `http_${getRandomString(4)}`,
    inputParameters: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
    name: 'HTTP_task',
    type: 'SIMPLE',
    taskReferenceName: `graphql_${getRandomString(4)}`,
    inputParameters: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
function createKafkaPublishTask(label: TaskLabel): ExtendedKafkaPublishTask {
  return {
    id: uuid(),
    label,
    name: 'kafkaPublish_task',
    type: 'KAFKA_PUBLISH',
    taskReferenceName: `kafka_${getRandomString(4)}`,
    inputParameters: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      kafka_request: {
        topic: '',
        value: '',
        bootStrapServers: '',
        headers: {},
        key: '',
        keySerializer: SerializerEnum.StringSerializer,
      },
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}
function createJsonJQTask(label: TaskLabel): ExtendedJsonJQTask {
  return {
    id: uuid(),
    label,
    name: 'jsonJQ_task',
    type: 'JSON_JQ_TRANSFORM',
    taskReferenceName: `jsonJQ_${getRandomString(4)}`,
    inputParameters: {
      queryExpression: '',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}
function createLambdaTask(label: TaskLabel): ExtendedLambdaTask {
  return {
    id: uuid(),
    label,
    name: 'LAMBDA_TASK',
    taskReferenceName: `lambda_${getRandomString(4)}`,
    type: 'LAMBDA',
    inputParameters: {
      lambdaValue: '${workflow.input.lambdaValue}',
      scriptExpression: `if ($.lambdaValue == 1) { 
  return { testvalue: true } 
} else { 
  return { testvalue: false } 
}`,
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createStartEndTask(
  label: 'start' | 'end',
): (StartTask & { id: string; label: TaskLabel }) | (EndTask & { id: string; label: TaskLabel }) {
  const name = label === 'start' ? 'START_TASK' : 'END_TASK';
  return {
    id: label,
    label,
    name,
    type: name,
    taskReferenceName: `start_${getRandomString(4)}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createForkTask(label: TaskLabel): ExtendedForkTask {
  return {
    id: uuid(),
    label,
    name: 'forkTask',
    type: 'FORK_JOIN',
    taskReferenceName: `fork_${getRandomString(4)}`,
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
    taskReferenceName: `join_${getRandomString(4)}`,
    joinOn: [],
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createExclusiveJoinTask(label: TaskLabel): ExtendedExclusiveJoinTask {
  return {
    id: uuid(),
    label,
    name: 'exclusiveJoinTask',
    type: 'EXCLUSIVE_JOIN',
    taskReferenceName: `exclusiveJoin_${getRandomString(4)}`,
    joinOn: [],
    defaultExclusiveJoinTask: [],
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createWhileTask(label: TaskLabel): ExtendedWhileTask {
  return {
    id: uuid(),
    label,
    name: 'whileTask',
    type: 'DO_WHILE',
    taskReferenceName: `while_${getRandomString(4)}`,
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
    taskReferenceName: `whileEnd_${getRandomString(4)}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createDecisionTask(label: TaskLabel): ExtendedDecisionTask {
  return {
    id: uuid(),
    label,
    name: 'decisionTask',
    type: 'DECISION',
    taskReferenceName: `decision_${getRandomString(4)}`,
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
    taskReferenceName: `terminate_${getRandomString(4)}`,
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
    taskReferenceName: `event_${getRandomString(4)}`,
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
    taskReferenceName: `wait_${getRandomString(4)}`,
    ...DEFAULT_TASK_OPTIONS,
  };
}

function createRawTask(label: TaskLabel): ExtendedRawTask {
  return {
    id: uuid(),
    label,
    name: 'rawTask',
    type: 'RAW',
    taskReferenceName: `raw_${getRandomString(4)}`,
    inputParameters: {
      raw: '',
    },
    ...DEFAULT_TASK_OPTIONS,
  };
}

function convertSubWorkflowTaskParams(params: string[]): Record<string, string> {
  return params.reduce((acc, curr) => {
    const values = JSON.parse(curr);
    return {
      ...acc,
      ...Object.keys(values).reduce((accu, current) => {
        return {
          ...accu,
          [current]: values[current].value,
        };
      }, {}),
    };
  }, {});
}

export function createSubWorkflowTask(
  name: string,
  version: string,
  inputParameters?: string[],
): ExtendedSubworkflowTask {
  return {
    id: uuid(),
    label: 'sub workflow',
    name,
    type: 'SUB_WORKFLOW',
    taskReferenceName: `${name}Ref_${getRandomString(4)}`,
    inputParameters: inputParameters ? convertSubWorkflowTaskParams(inputParameters) : {},
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
    case 'exclusive join':
      return createExclusiveJoinTask(taskLabel);
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
    case 'kafka publish':
      return createKafkaPublishTask(taskLabel);
    case 'json jq':
      return createJsonJQTask(taskLabel);
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
  task.type === 'LAMBDA' && 'inputParameters' in task && isLambdaTaskInputParams(task.inputParameters);

export function createSystemTasks(): TaskLabel[] {
  return [
    'http',
    'graphql',
    'lambda',
    'decision',
    'event',
    'while',
    'fork',
    'join',
    'exclusive join',
    'raw',
    'terminate',
    'wait',
    'while end',
    'kafka publish',
    'json jq',
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
    case 'FORK_JOIN_DYNAMIC':
      return 'fork';
    case 'JOIN':
      return 'join';
    case 'EXCLUSIVE_JOIN':
      return 'exclusive join';
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
    case 'SUB_WORKFLOW':
      return 'sub workflow';
    case 'HTTP':
      return 'http';
    case 'KAFKA_PUBLISH':
      return 'kafka publish';
    case 'JSON_JQ_TRANSFORM':
      return 'json jq';
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

function createGenericInputParams(inputKeys?: string[]): Record<string, string> {
  return (
    inputKeys?.reduce((acc, curr) => {
      return { ...acc, [curr]: `\${workflow.input.${curr}}` };
    }, {}) ?? {}
  );
}

function createHTTPInputParams(): HTTPInputParams {
  return {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    http_request: {
      method: 'GET',
      contentType: 'application/json',
      timeout: 3600,
      uri: '${workflow.input.uri}',
      headers: {},
    },
  };
}

export function convertTaskDefinition(taskDefinition: TaskDefinition): ExtendedSimpleTask | ExtendedHTTPTask {
  const { name, inputKeys } = taskDefinition;

  if (name === 'HTTP_task') {
    return {
      id: uuid(),
      name,
      label: 'simple',
      type: 'SIMPLE',
      taskReferenceName: `${name}RefName_${getRandomString(4)}`,
      optional: false,
      startDelay: 0,
      inputParameters: createHTTPInputParams(),
    };
  }

  return {
    id: uuid(),
    name,
    label: 'simple',
    type: 'SIMPLE',
    taskReferenceName: `${name}RefName_${getRandomString(4)}`,
    optional: false,
    startDelay: 0,
    inputParameters: createGenericInputParams(inputKeys),
  };
}
