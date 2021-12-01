/* eslint-disable @typescript-eslint/naming-convention */
import { Node } from 'beautiful-react-diagrams/@types/DiagramSchema';

type AnyJson = JsonArray | JsonMap;
type JsonMap = {
  [key: string]: AnyJson | string;
};
type JsonArray = Array<AnyJson | string>;

export type WhileInputParams = {
  iterations: number;
};
export type DecisionInputParams = Record<string, string>;

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

export type KafkaPublishInputParams = {
  kafka_request: {
    topic: string;
    value: string;
    requestTimeoutMs?: number;
    maxBlockMs?: number;
    bootStrapServers: string;
    headers: Record<string, string>;
    key: string;
    keySerializer: SerializerEnum;
  };
};

export type JsonJQInputParams = {
  key: string;
  queryExpression: string;
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
export type ForkJoinDynamicInputParams = {
  dynamic_tasks: string;
  dynamic_tasks_i: string;
};

export type InputParameters =
  | WhileInputParams
  | DecisionInputParams
  | LambdaInputParams
  | GraphQLInputParams
  | KafkaPublishInputParams
  | JsonJQInputParams
  | TerminateInputParams
  | HTTPInputParams
  | EventInputParams
  | RawInputParams
  | DynamicForkInputParams;

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
  | 'SUB_WORKFLOW'
  | 'CUSTOM'
  | 'FORK_JOIN_DYNAMIC'
  | 'EXCLUSIVE_JOIN'
  | 'HTTP'
  | 'KAFKA_PUBLISH'
  | 'JSON_JQ';

type TaskValues = {
  name: string;
  taskReferenceName: string;
  // ownerEmail: string;
  // description?: string;
  // retryCount: number;
  // retryLogic: 'FIXED' | 'EXPONENTIAL_BACKOFF';
  // retryDelaySeconds: number;
  // timeoutPolicy: 'RETRY' | 'TIME_OUT_WF' | 'ALERT_ONLY';
  // timeoutSeconds: number;
  // pollTimeoutSeconds: number;
  // responseTimeoutSeconds: number;
  // inputKeys?: string[];
  // outputKeys?: string[];
  optional: boolean;
  startDelay: number;
};

type BaseTask<T = undefined> = T extends undefined
  ? TaskValues
  : TaskValues & {
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
  type: 'SIMPLE' | 'HTTP';
};
export type GraphQLTask = BaseTask<GraphQLInputParams> & {
  type: 'SIMPLE';
};
export type KafkaPublishTask = BaseTask<KafkaPublishInputParams> & {
  type: 'KAFKA_PUBLISH';
};
export type JsonJQTask = BaseTask<JsonJQInputParams> & {
  type: 'JSON_JQ_TRANSFORM';
};
export type ForkTask = BaseTask & {
  type: 'FORK_JOIN' | 'FORK_JOIN_DYNAMIC';
  forkTasks: Task[][];
};
export type JoinTask = BaseTask & {
  type: 'JOIN';
  joinOn: string[];
};
export type ExclusiveJoinTask = BaseTask & {
  type: 'EXCLUSIVE_JOIN';
  joinOn: string[];
  defaultExclusiveJoinTask: string[];
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
export type SubworkflowTask = BaseTask<Record<string, string>> & {
  type: 'SUB_WORKFLOW';
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
export type SimpleTask = BaseTask<Record<string, string>> & {
  type: 'SIMPLE';
};
export type ForkJoinDynamicTask = BaseTask<ForkJoinDynamicInputParams> & {
  type: 'FORK_JOIN_DYNAMIC';
};

export type Task =
  | DecisionTask
  | EventTask
  | HTTPTask
  | GraphQLTask
  | KafkaPublishTask
  | JsonJQTask
  | ForkTask
  | JoinTask
  | ExclusiveJoinTask
  | SubworkflowTask
  | WaitTask
  | LambdaTask
  | JSPythonTask
  | TerminateTask
  | WhileTask
  | WhileEndTask
  | RawTask
  | StartTask
  | EndTask
  | SimpleTask;

export type TaskLabel =
  | 'decision'
  | 'while'
  | 'end'
  | 'event'
  | 'fork'
  | 'join'
  | 'exclusive join'
  | 'lambda'
  | 'raw'
  | 'start'
  | 'sub workflow'
  | 'terminate'
  | 'wait'
  | 'while end'
  | 'graphql'
  | 'http'
  | 'js'
  | 'py'
  | 'simple'
  | 'kafka publish'
  | 'json jq'
  | 'custom';

export type ExtendedDecisionTask = DecisionTask & { id: string; label: TaskLabel };
export type ExtendedEventTask = EventTask & { id: string; label: TaskLabel };
export type ExtendedHTTPTask = HTTPTask & { id: string; label: TaskLabel };
export type ExtendedGraphQLTask = GraphQLTask & { id: string; label: TaskLabel };
export type ExtendedKafkaPublishTask = KafkaPublishTask & { id: string; label: TaskLabel };
export type ExtendedJsonJQTask = JsonJQTask & { id: string; label: TaskLabel };
export type ExtendedForkTask = ForkTask & { id: string; label: TaskLabel };
export type ExtendedJoinTask = JoinTask & { id: string; label: TaskLabel };
export type ExtendedExclusiveJoinTask = ExclusiveJoinTask & { id: string; label: TaskLabel };
export type ExtendedSubworkflowTask = SubworkflowTask & { id: string; label: TaskLabel };
export type ExtendedWaitTask = WaitTask & { id: string; label: TaskLabel };
export type ExtendedLambdaTask = LambdaTask & { id: string; label: TaskLabel };
export type ExtendedJSPythonTask = JSPythonTask & { id: string; label: TaskLabel };
export type ExtendedTerminateTask = TerminateTask & { id: string; label: TaskLabel };
export type ExtendedWhileTask = WhileTask & { id: string; label: TaskLabel };
export type ExtendedWhileEndTask = WhileEndTask & { id: string; label: TaskLabel };
export type ExtendedRawTask = RawTask & { id: string; label: TaskLabel };
export type ExtendedStartTask = StartTask & { id: string; label: TaskLabel };
export type ExtendedEndTask = EndTask & { id: string; label: TaskLabel };
export type ExtendedSimpleTask = SimpleTask & { id: string; label: TaskLabel };

export type ExtendedTask =
  | ExtendedDecisionTask
  | ExtendedEventTask
  | ExtendedHTTPTask
  | ExtendedGraphQLTask
  | ExtendedForkTask
  | ExtendedJoinTask
  | ExtendedExclusiveJoinTask
  | ExtendedSubworkflowTask
  | ExtendedWaitTask
  | ExtendedLambdaTask
  | ExtendedJSPythonTask
  | ExtendedTerminateTask
  | ExtendedWhileTask
  | ExtendedWhileEndTask
  | ExtendedRawTask
  | ExtendedStartTask
  | ExtendedEndTask
  | ExtendedSimpleTask
  | ExtendedKafkaPublishTask
  | ExtendedJsonJQTask;

export type Workflow<T extends Task = Task> = {
  name: string;
  description?: string;
  version: number;
  inputParameters?: string[];
  outputParameters: Record<string, string>;
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
export type NodeData =
  | {
      task: Exclude<ExtendedTask, ExtendedDecisionTask>;
    }
  | {
      task: ExtendedDecisionTask;
      decisionCases: Record<string, string>;
    };

export type CustomNodeType = Node<NodeData>;

export type TaskDefinition = {
  name: string;
  description?: string;
  retryCount: number;
  timeoutSeconds: number;
  pollTimeoutSeconds: number;
  inputKeys?: string[];
  outputKeys?: string[];
  inputTemplate?: Record<string, string>;
  timeoutPolicy: 'RETRY' | 'TIME_OUT_WF' | 'ALERT_ONLY';
  retryLogic: 'FIXED' | 'EXPONENTIAL_BACKOFF';
  retryDelaySeconds: number;
  responseTimeoutSeconds: number;
  concurrentExecLimit?: number;
  rateLimitFrequencyInSeconds?: number;
  rateLimitPerFrequency?: number;
  ownerEmail: string;
};

export type ExecutedWorkflowTask = {
  taskType: string;
  status: string;
  reasonForIncompletion: string;
  referenceTaskName: string;
  callbackAfterSeconds: number;
  pollCount: number;
  logs: {};
  inputData: {};
  outputData: {};
  workflowTask: {
    description: string;
    taskDefinition: {
      description: string;
    };
  };
  seq: number;
  subWorkflowId: string;
  startTime: number;
  endTime: number;
  externalOutputPayloadStoragePath?: string;
  externalInputPayloadStoragePath?: string;
};

// eslint-disable-next-line no-shadow
export enum SerializerEnum {
  IntegerSerializer = 'org.apache.kafka.common.serialization.IntegerSerializer',
  LongSerializer = 'org.apache.kafka.common.serialization.LongSerializer',
  StringSerializer = 'org.apache.kafka.common.serialization.StringSerializer',
}

export type StatusType = 'COMPLETED' | 'RUNNING' | 'FAILED';

export type ScheduledWorkflow = {
  correlationId: string;
  cronString: string;
  lastUpdate: string;
  name: string;
  taskToDomain: {
    [key: string]: string;
  };
  workflowName: string;
  workflowVersion: string;
  workflowContext: {
    [key: string]: any;
  };
  enabled: boolean;
  status: StatusType;
};

export type ExecutedWorkflow = {
  correlationId: string;
  endTime: string;
  executionTime: number;
  failedReferenceTaskNames: string;
  input: string;
  inputSize: number;
  output: string;
  outputSize: number;
  priority: number;
  reasonForIncompletion?: string;
  startTime: string;
  status: string;
  updateTime: string;
  version: number;
  workflowId: string;
  workflowType: string;
};

export type NestedExecutedWorkflow = {
  correlationId: string;
  endTime: string;
  executionTime: number;
  failedReferenceTaskNames: string;
  index: number;
  input: string;
  inputSize: number;
  output: string;
  outputSize: number;
  parentWorkflowId: string;
  priority: number;
  reasonForIncompletion: string;
  startTime: string;
  status: string;
  updateTime: string;
  version: number;
  workflowId: string;
  workflowType: string;
};

export type ExecutedWorkflowsFlat = {
  result: {
    hits: ExecutedWorkflow[];
    totalHits: number;
  };
};

export type ExecutedWorkflowsHierarchical = {
  parents: ExecutedWorkflow[];
  children: NestedExecutedWorkflow[];
  count: number;
  hits: number;
};

export type Status = 'RUNNING' | 'FAILED' | 'TERMINATED' | 'PAUSED' | 'COMPLETED';

export type ExecutedWorkflowDetailResult = {
  status: Status;
  tasks: ExecutedWorkflowTask[];
  startTime: Date | number | string;
  endTime: Date | number | string;
  input: Record<string, string>;
  output: Record<string, string>;
};

export type WorkflowInstanceDetail = {
  ownerApp: string;
  createTime: number;
  updateTime: number;
  status: Status;
  endTime: number;
  workflowId: string;
  tasks: ExecutedWorkflowTask[];
  input: Record<string, string>;
  output: Record<string, string>;
  correlationId: string;
  taskToDomain: {
    '*': string;
  };
  failedReferenceTaskNames: string[];
  workflowDefinition: {};
  priority: number;
  variables: {};
  lastRetriedTime: number;
  startTime: number;
  workflowName: string;
  workflowVersion: number;
  parentWorkflowId: string;
  externalInputPayloadStoragePath?: string;
  externalOutputPayloadStoragePath?: string;
};
