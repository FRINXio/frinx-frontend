import { ExecutedWorkflow } from './types';

/* eslint-disable @typescript-eslint/naming-convention */
type AnyJson = JsonArray | JsonMap;
type JsonMap = {
  [key: string]: AnyJson | string;
};
type JsonArray = Array<AnyJson | string>;

export type WhileInputParams = {
  iterations: number;
};
export type DecisionInputParams = {
  param: string;
};
export type LambdaInputParams = {
  lambdaValue: string;
  scriptExpression: string;
};
export type GraphQLInputParams = {
  http_request: {
    uri: string;
    method: 'POST';
    body: {
      query: string;
      variables: Record<string, string>;
    };
    contentType: string;
    headers: Record<string, string>;
    timeout: number;
  };
};
export type TerminateInputParams = {
  terminationStatus: string;
  workflowOutput: string;
};
type BaseHttpRequestType = {
  uri: string;
  contentType: string;
  headers: Record<string, string>;
  timeout: number;
};
export type HTTPMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'GET';
type GetHttpRequestType = BaseHttpRequestType & {
  method: 'GET';
};
type HttpRequestTypeWidhtBody = BaseHttpRequestType & {
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body: string;
};
export type HTTPInputParams = {
  http_request: GetHttpRequestType | HttpRequestTypeWidhtBody;
};
export type EventInputParams = {
  targetWorkflowId: string;
  targetTaskRefName: string;
  action: string;
};
export type RawInputParams = {
  raw: string;
};
export type DynamicForkInputParams = {
  expectedName: string;
  expectedType: string;
  dynamic_tasks: string;
  dynamic_tasks_i: string;
};

export type InputParameters =
  | WhileInputParams
  | DecisionInputParams
  | LambdaInputParams
  | GraphQLInputParams
  | TerminateInputParams
  | HTTPInputParams
  | EventInputParams
  | RawInputParams
  | DynamicForkInputParams;

export type WorkflowPayload = {
  input: Record<string, string>;
  name: string;
  version: number;
};

export type TaskType =
  | 'DECISION'
  | 'EVENT'
  | 'SIMPLE'
  | 'FORK_JOIN'
  | 'JOIN'
  | 'WAIT'
  | 'LAMBDA'
  | 'TERMINATE'
  | 'DO_WHILE'
  | 'WHILE_END'
  | 'SUB_WORKFLOW';

export type TaskDefinition = {
  name: string;
  ownerEmail: string;
  description?: string;
  retryCount: number;
  retryLogic: 'FIXED' | 'EXPONENTIAL_BACKOFF';
  retryDelaySeconds: number;
  timeoutPolicy: 'RETRY' | 'TIME_OUT_WF' | 'ALERT_ONLY';
  timeoutSeconds: number;
  responseTimeoutSeconds: number;
  inputKeys?: string[];
  outputKeys?: string[];
  createTime?: number;
  createdBy?: string;
  rateLimitFrequencyInSeconds?: number;
  rateLimitPerFrequency?: number;
};

export type ActionTypes = 'complete_task' | 'fail_task';

export type ActionTargetTask = {
  workflowId: string;
  taskRefName: string;
  output?: unknown;
};

export type ActionTargetWorkflow = {
  workflowId: string;
  taskRefName: string;
  output?: unknown;
};

export type Action = {
  action: string;
  expandInLineJson: boolean;
} & ({ [key in ActionTypes]: ActionTargetTask } | { start_workflow: ActionTargetWorkflow });

export type EventListener = {
  name: string;
  event: string;
  actions: Action[];
  active?: boolean;
};

export type Queue = {
  lastPollTime: number;
  qsize: number;
  queueName: string;
  workerId: string;
};

export type BaseTask<T = undefined> = {
  name: string;
  taskReferenceName: string;
  description?: string;
  optional: boolean;
  startDelay: number;
  inputParameters: T;
};

export type DecisionTask = BaseTask<DecisionInputParams> & {
  type: 'DECISION';
  caseValueParam: string;
  decisionCases: Record<string, Task[]>;
  defaultCase: Task[];
};
export type EventTask = BaseTask<EventInputParams> & {
  type: 'EVENT';
  sink: string;
};
export type HTTPTask = BaseTask<HTTPInputParams> & {
  type: 'SIMPLE';
};
export type GraphQLTask = BaseTask<GraphQLInputParams> & {
  type: 'SIMPLE';
};
export type ForkTask = BaseTask & {
  type: 'FORK_JOIN';
  forkTasks: Task[][];
};
export type JoinTask = BaseTask & {
  type: 'JOIN';
  joinOn: string[];
};
export type WaitTask = BaseTask & {
  type: 'WAIT';
};
export type LambdaTask = BaseTask<LambdaInputParams> & {
  type: 'LAMBDA';
};
export type JSPythonTask = BaseTask<LambdaInputParams> & {
  type: 'SIMPLE';
};
export type TerminateTask = BaseTask<TerminateInputParams> & {
  type: 'TERMINATE';
};
export type WhileTask = BaseTask<WhileInputParams> & {
  type: 'DO_WHILE';
  loopOver: Task[];
  loopCondition: string;
};
export type WhileEndTask = BaseTask & {
  type: 'WHILE_END';
};
export type DynamicForkTask = BaseTask<DynamicForkInputParams> & {
  type: 'SUB_WORKFLOW';
  asyncComplete: boolean;
  subWorkflowParam: {
    name: string;
    version: number;
  };
};
export type RawTask = BaseTask<RawInputParams> & {
  type: 'RAW';
};
export type StartTask = BaseTask & {
  type: 'START_TASK';
};
export type EndTask = BaseTask & {
  type: 'END_TASK';
};
export type SimpleTask = BaseTask & {
  type: 'SIMPLE';
};

export type Task =
  | SimpleTask
  | DecisionTask
  | EventTask
  | HTTPTask
  | GraphQLTask
  | ForkTask
  | JoinTask
  | DynamicForkTask
  | WaitTask
  | LambdaTask
  | JSPythonTask
  | TerminateTask
  | WhileTask
  | WhileEndTask
  | RawTask
  | StartTask
  | EndTask;

export type ExtendedTask = Task & { id: string };

export type Workflow<T extends Task = Task> = {
  name: string;
  description?: string;
  version: number;
  inputParameters?: AnyJson;
  outputParameters: AnyJson;
  failureWorkflow?: boolean;
  schemaVersion: 2;
  restartable: boolean;
  ownerEmail: string;
  workflowStatusListenerEnabled?: boolean;
  tasks: T[];
  updateTime: number;
  timeoutPolicy: string;
  timeoutSeconds: number;
  variables: Record<string, unknown>;
};

export type ExecutedWorkflowSortBy = 'workflowType' | 'startTime' | 'endTime' | 'status';
export type ExecutedWorkflowSortOrder = 'ASC' | 'DESC';

export type WorkflowExecutionPayload = {
  workflowId: string;
  label: string;
  start?: number;
  size?: string;
  sortBy?: ExecutedWorkflowSortBy;
  sortOrder?: ExecutedWorkflowSortOrder;
};

export type WorkflowExecutionResult = {
  result: {
    hits: ExecutedWorkflow[];
    totalHits: number;
  };
};
