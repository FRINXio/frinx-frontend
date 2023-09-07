export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Record: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type ActionCompleteTask = {
  __typename?: 'ActionCompleteTask';
  output: Maybe<Scalars['String']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
  taskRefName: Maybe<Scalars['String']['output']>;
  workflowId: Maybe<Scalars['String']['output']>;
};

export type ActionCompleteTaskInput = {
  output?: InputMaybe<Scalars['String']['input']>;
  taskId?: InputMaybe<Scalars['String']['input']>;
  taskRefName?: InputMaybe<Scalars['String']['input']>;
  workflowId?: InputMaybe<Scalars['String']['input']>;
};

export type ActionFailTask = {
  __typename?: 'ActionFailTask';
  output: Maybe<Scalars['String']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
  taskRefName: Maybe<Scalars['String']['output']>;
  workflowId: Maybe<Scalars['String']['output']>;
};

export type ActionFailTaskInput = {
  output?: InputMaybe<Scalars['String']['input']>;
  taskId?: InputMaybe<Scalars['String']['input']>;
  taskRefName?: InputMaybe<Scalars['String']['input']>;
  workflowId?: InputMaybe<Scalars['String']['input']>;
};

export type ActionStartWorkflow = {
  __typename?: 'ActionStartWorkflow';
  correlationId: Maybe<Scalars['String']['output']>;
  input: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  taskToDomain: Maybe<Scalars['String']['output']>;
  version: Maybe<Scalars['Int']['output']>;
};

export type ActionStartWorkflowInput = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  taskToDomain?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type AddBlueprintInput = {
  name: Scalars['String']['input'];
  template: Scalars['String']['input'];
};

export type AddBlueprintPayload = {
  __typename?: 'AddBlueprintPayload';
  blueprint: Blueprint;
};

export type AddDeviceInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  deviceSize?: InputMaybe<DeviceSize>;
  deviceType?: InputMaybe<Scalars['String']['input']>;
  labelIds?: InputMaybe<Array<Scalars['String']['input']>>;
  model?: InputMaybe<Scalars['String']['input']>;
  mountParameters?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  port?: InputMaybe<Scalars['Int']['input']>;
  serviceState?: InputMaybe<DeviceServiceState>;
  username?: InputMaybe<Scalars['String']['input']>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  zoneId: Scalars['String']['input'];
};

export type AddDevicePayload = {
  __typename?: 'AddDevicePayload';
  device: Device;
};

export type AddLocationInput = {
  countryId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type AddLocationPayload = {
  __typename?: 'AddLocationPayload';
  location: Location;
};

export type AddSnapshotInput = {
  deviceId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type AddSnapshotPayload = {
  __typename?: 'AddSnapshotPayload';
  snapshot: Maybe<Snapshot>;
};

export type AddZoneInput = {
  name: Scalars['String']['input'];
};

export type AddZonePayload = {
  __typename?: 'AddZonePayload';
  zone: Zone;
};

export type ApplySnapshotInput = {
  deviceId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ApplySnapshotPayload = {
  __typename?: 'ApplySnapshotPayload';
  isOk: Scalars['Boolean']['output'];
  output: Scalars['String']['output'];
};

export type BaseGraphNode = {
  coordinates: GraphNodeCoordinates;
  deviceType: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfaces: Array<GraphNodeInterface>;
  softwareVersion: Maybe<Scalars['String']['output']>;
};

export type Blueprint = Node & {
  __typename?: 'Blueprint';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  template: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type BlueprintConnection = {
  __typename?: 'BlueprintConnection';
  edges: Array<BlueprintEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BlueprintEdge = {
  __typename?: 'BlueprintEdge';
  cursor: Scalars['String']['output'];
  node: Blueprint;
};

export type BulkOperationInput = {
  executedWorkflowIds: Array<Scalars['String']['input']>;
};

export type BulkOperationResponse = {
  __typename?: 'BulkOperationResponse';
  bulkErrorResults: Maybe<Scalars['String']['output']>;
  bulkSuccessfulResults: Maybe<Array<Scalars['String']['output']>>;
};

export type CsvImport = {
  __typename?: 'CSVImport';
  isOk: Maybe<Scalars['Boolean']['output']>;
};

export type CsvImportInput = {
  file: Scalars['Upload']['input'];
  zoneId: Scalars['String']['input'];
};

export type CalculatedDiffPayload = {
  __typename?: 'CalculatedDiffPayload';
  result: CalculatedDiffResult;
};

export type CalculatedDiffResult = {
  __typename?: 'CalculatedDiffResult';
  createdData: Array<DiffData>;
  deletedData: Array<DiffData>;
  updatedData: Array<CalculatedUpdateDiffData>;
};

export type CalculatedUpdateDiffData = {
  __typename?: 'CalculatedUpdateDiffData';
  actualData: Scalars['String']['output'];
  intendedData: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type CloseTransactionPayload = {
  __typename?: 'CloseTransactionPayload';
  isOk: Scalars['Boolean']['output'];
};

export type CommitConfigInput = {
  deviceId: Scalars['String']['input'];
  shouldDryRun?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CommitConfigOutput = {
  __typename?: 'CommitConfigOutput';
  configuration: Maybe<Scalars['String']['output']>;
  deviceId: Scalars['String']['output'];
  message: Maybe<Scalars['String']['output']>;
};

export type CommitConfigPayload = {
  __typename?: 'CommitConfigPayload';
  output: CommitConfigOutput;
};

export type Country = Node & {
  __typename?: 'Country';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CountryConnection = {
  __typename?: 'CountryConnection';
  edges: Array<CountryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CountryEdge = {
  __typename?: 'CountryEdge';
  cursor: Scalars['String']['output'];
  node: Country;
};

export type CreateEventHandlerInput = {
  actions: Array<EventHandlerActionInput>;
  condition?: InputMaybe<Scalars['String']['input']>;
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  /** The event is immutable and cannot be changed. */
  event: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The name is immutable and cannot be changed. Also it must be unique. */
  name: Scalars['String']['input'];
};

export type CreateLabelInput = {
  name: Scalars['String']['input'];
};

export type CreateLabelPayload = {
  __typename?: 'CreateLabelPayload';
  label: Maybe<Label>;
};

export type CreateScheduleInput = {
  cronString: Scalars['String']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  parallelRuns?: InputMaybe<Scalars['Boolean']['input']>;
  performFromDate?: InputMaybe<Scalars['String']['input']>;
  performTillDate?: InputMaybe<Scalars['String']['input']>;
  workflowContext?: InputMaybe<Scalars['String']['input']>;
  workflowName: Scalars['String']['input'];
  workflowVersion: Scalars['String']['input'];
};

export type CreateTaskDefinitionInput = {
  accessPolicy?: InputMaybe<Scalars['String']['input']>;
  backoffScaleFactor?: InputMaybe<Scalars['Int']['input']>;
  concurrentExecLimit?: InputMaybe<Scalars['Int']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  executionNameSpace?: InputMaybe<Scalars['String']['input']>;
  inputKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTemplate?: InputMaybe<Scalars['String']['input']>;
  isolationGroupId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  outputKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerApp?: InputMaybe<Scalars['String']['input']>;
  ownerEmail?: InputMaybe<Scalars['String']['input']>;
  pollTimeoutSeconds?: InputMaybe<Scalars['Int']['input']>;
  rateLimitFrequencyInSeconds?: InputMaybe<Scalars['Int']['input']>;
  rateLimitPerFrequency?: InputMaybe<Scalars['Int']['input']>;
  responseTimeoutSeconds?: InputMaybe<Scalars['Int']['input']>;
  retryCount?: InputMaybe<Scalars['Int']['input']>;
  retryDelaySeconds?: InputMaybe<Scalars['Int']['input']>;
  retryLogic?: InputMaybe<RetryLogic>;
  timeoutPolicy?: InputMaybe<TaskTimeoutPolicy>;
  timeoutSeconds: Scalars['Int']['input'];
  updatedBy?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTransactionPayload = {
  __typename?: 'CreateTransactionPayload';
  transactionId: Maybe<Scalars['String']['output']>;
};

export type CreateWorkflowInput = {
  workflow: WorkflowInput;
};

export type CreateWorkflowPayload = {
  __typename?: 'CreateWorkflowPayload';
  workflow: Workflow;
};

export type DataStore = {
  __typename?: 'DataStore';
  config: Scalars['String']['output'];
  operational: Scalars['String']['output'];
  snapshots: Array<Snapshot>;
};

export type DeleteBlueprintPayload = {
  __typename?: 'DeleteBlueprintPayload';
  blueprint: Maybe<Blueprint>;
};

export type DeleteDevicePayload = {
  __typename?: 'DeleteDevicePayload';
  device: Maybe<Device>;
};

export type DeleteLabelPayload = {
  __typename?: 'DeleteLabelPayload';
  label: Maybe<Label>;
};

export type DeleteSnapshotInput = {
  deviceId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};

export type DeleteSnapshotPayload = {
  __typename?: 'DeleteSnapshotPayload';
  snapshot: Maybe<Snapshot>;
};

export type DeleteWorkflowInput = {
  name: Scalars['String']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteWorkflowPayload = {
  __typename?: 'DeleteWorkflowPayload';
  workflow: Workflow;
};

export type Device = Node & {
  __typename?: 'Device';
  address: Maybe<Scalars['String']['output']>;
  blueprint: Maybe<Blueprint>;
  createdAt: Scalars['String']['output'];
  deviceSize: DeviceSize;
  id: Scalars['ID']['output'];
  isInstalled: Scalars['Boolean']['output'];
  labels: LabelConnection;
  location: Maybe<Location>;
  model: Maybe<Scalars['String']['output']>;
  mountParameters: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  port: Maybe<Scalars['Int']['output']>;
  serviceState: DeviceServiceState;
  source: DeviceSource;
  updatedAt: Scalars['String']['output'];
  vendor: Maybe<Scalars['String']['output']>;
  zone: Zone;
};


export type DeviceLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type DeviceConnection = {
  __typename?: 'DeviceConnection';
  edges: Array<DeviceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DeviceEdge = {
  __typename?: 'DeviceEdge';
  cursor: Scalars['String']['output'];
  node: Device;
};

export type DeviceOrderByInput = {
  direction: SortDirection;
  sortKey: SortDeviceBy;
};

export type DeviceServiceState =
  | 'IN_SERVICE'
  | 'OUT_OF_SERVICE'
  | 'PLANNING';

export type DeviceSize =
  | 'LARGE'
  | 'MEDIUM'
  | 'SMALL';

export type DeviceSource =
  | 'DISCOVERED'
  | 'IMPORTED'
  | 'MANUAL';

export type DiffData = {
  __typename?: 'DiffData';
  data: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type EdgeSourceTarget = {
  __typename?: 'EdgeSourceTarget';
  interface: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
};

export type EditWorkflowScheduleInput = {
  cronString?: InputMaybe<Scalars['String']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  parallelRuns?: InputMaybe<Scalars['Boolean']['input']>;
  performFromDate?: InputMaybe<Scalars['String']['input']>;
  performTillDate?: InputMaybe<Scalars['String']['input']>;
  workflowContext?: InputMaybe<Scalars['String']['input']>;
  workflowName?: InputMaybe<Scalars['String']['input']>;
  workflowVersion?: InputMaybe<Scalars['String']['input']>;
};

export type EventHandler = Node & {
  __typename?: 'EventHandler';
  actions: Array<EventHandlerAction>;
  condition: Maybe<Scalars['String']['output']>;
  evaluatorType: Maybe<Scalars['String']['output']>;
  /** The event is immutable and cannot be changed. */
  event: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Maybe<Scalars['Boolean']['output']>;
  /** The name is immutable and cannot be changed. Also it must be unique. */
  name: Scalars['String']['output'];
};

export type EventHandlerAction = {
  __typename?: 'EventHandlerAction';
  action: Maybe<EventHandlerActionEnum>;
  completeTask: Maybe<ActionCompleteTask>;
  expandInlineJSON: Maybe<Scalars['Boolean']['output']>;
  failTask: Maybe<ActionFailTask>;
  startWorkflow: Maybe<ActionStartWorkflow>;
};

export type EventHandlerActionEnum =
  | 'complete_task'
  | 'fail_task'
  | 'start_workflow';

export type EventHandlerActionInput = {
  action?: InputMaybe<EventHandlerActionEnum>;
  completeTask?: InputMaybe<ActionCompleteTaskInput>;
  expandInlineJSON?: InputMaybe<Scalars['Boolean']['input']>;
  failTask?: InputMaybe<ActionFailTaskInput>;
  startWorkflow?: InputMaybe<ActionStartWorkflowInput>;
};

export type EventHandlerConnection = {
  __typename?: 'EventHandlerConnection';
  edges: Maybe<Array<EventHandlerEdge>>;
  pageInfo: PageInfo;
};

export type EventHandlerEdge = {
  __typename?: 'EventHandlerEdge';
  cursor: Scalars['String']['output'];
  node: EventHandler;
};

export type EventHandlersOrderByInput = {
  direction: SortDirection;
  sortKey: SortEventHandlersBy;
};

export type ExecuteNewWorkflowInput = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  externalInputPayloadStoragePath?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  taskToDomain?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type ExecuteWorkflowByName = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  /** JSON string of input parameters */
  inputParameters: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  workflowName: Scalars['String']['input'];
  workflowVersion?: InputMaybe<Scalars['Int']['input']>;
};

export type ExecutedWorkflow = Node & {
  __typename?: 'ExecutedWorkflow';
  correlationId: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['String']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  failedReferenceTaskNames: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['ID']['output'];
  input: Maybe<Scalars['String']['output']>;
  lastRetriedTime: Maybe<Scalars['String']['output']>;
  output: Maybe<Scalars['String']['output']>;
  ownerApp: Maybe<Scalars['String']['output']>;
  parentWorkflowId: Maybe<Scalars['String']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  status: Maybe<ExecutedWorkflowStatus>;
  tasks: Maybe<Array<ExecutedWorkflowTask>>;
  updatedAt: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['String']['output']>;
  workflowDefinition: Maybe<Workflow>;
  workflowId: Scalars['String']['output'];
  workflowName: Maybe<Scalars['String']['output']>;
  workflowVersion: Maybe<Scalars['Int']['output']>;
};

export type ExecutedWorkflowConnection = {
  __typename?: 'ExecutedWorkflowConnection';
  edges: Array<ExecutedWorkflowEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ExecutedWorkflowEdge = {
  __typename?: 'ExecutedWorkflowEdge';
  cursor: Scalars['String']['output'];
  node: ExecutedWorkflow;
};

export type ExecutedWorkflowFilterInput = {
  startTime?: InputMaybe<ExecutedWorkflowStartTimeRange>;
  status?: InputMaybe<Array<ExecutedWorkflowStatus>>;
  workflowId?: InputMaybe<Array<Scalars['String']['input']>>;
  workflowType?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ExecutedWorkflowSearchInput = {
  isRootWorkflow?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<ExecutedWorkflowFilterInput>;
};

export type ExecutedWorkflowStartTimeRange = {
  from: Scalars['String']['input'];
  to?: InputMaybe<Scalars['String']['input']>;
};

export type ExecutedWorkflowStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'RUNNING'
  | 'TERMINATED'
  | 'TIMED_OUT';

export type ExecutedWorkflowTask = Node & {
  __typename?: 'ExecutedWorkflowTask';
  callbackAfterSeconds: Maybe<Scalars['Int']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  executed: Maybe<Scalars['Boolean']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  inputData: Maybe<Scalars['String']['output']>;
  outputData: Maybe<Scalars['String']['output']>;
  pollCount: Maybe<Scalars['Int']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  referenceTaskName: Maybe<Scalars['String']['output']>;
  retried: Maybe<Scalars['Boolean']['output']>;
  retryCount: Maybe<Scalars['Int']['output']>;
  scheduledTime: Maybe<Scalars['String']['output']>;
  seq: Maybe<Scalars['Int']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  status: Maybe<ExecutedWorkflowTaskStatus>;
  subWorkflowId: Maybe<Scalars['String']['output']>;
  taskDefName: Maybe<Scalars['String']['output']>;
  taskDefinition: Maybe<Scalars['String']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
  taskType: Maybe<Scalars['String']['output']>;
  updateTime: Maybe<Scalars['String']['output']>;
  workflowType: Maybe<Scalars['String']['output']>;
};

export type ExecutedWorkflowTaskStatus =
  | 'CANCELED'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERROR'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'SKIPPED'
  | 'TIMED_OUT';

export type ExecutedWorkflowsOrderByInput = {
  direction: SortExecutedWorkflowsDirection;
  sortKey: SortExecutedWorkflowsBy;
};

export type ExternaStorage = {
  __typename?: 'ExternaStorage';
  data: Scalars['String']['output'];
};

export type FilterDevicesInput = {
  deviceName?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FilterEventHandlerInput = {
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FilterPollDataInput = {
  afterDate?: InputMaybe<Scalars['String']['input']>;
  beforeDate?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  queueName?: InputMaybe<Scalars['String']['input']>;
  workerId?: InputMaybe<Scalars['String']['input']>;
};

export type FilterPoolsInput = {
  poolName?: InputMaybe<Scalars['String']['input']>;
};

export type FilterTaskDefinitionsInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
};

export type FilterTopologyInput = {
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FilterWorkflowsInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FreeResourceInput = {
  poolId: Scalars['String']['input'];
  resource: Scalars['Record']['input'];
};

export type GraphEdge = {
  __typename?: 'GraphEdge';
  id: Scalars['ID']['output'];
  source: EdgeSourceTarget;
  target: EdgeSourceTarget;
  weight: Maybe<Scalars['Int']['output']>;
};

export type GraphEdgeStatus =
  | 'ok'
  | 'unknown';

export type GraphNode = BaseGraphNode & {
  __typename?: 'GraphNode';
  coordinates: GraphNodeCoordinates;
  device: Device;
  deviceType: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfaces: Array<GraphNodeInterface>;
  softwareVersion: Maybe<Scalars['String']['output']>;
};

export type GraphNodeCoordinates = {
  __typename?: 'GraphNodeCoordinates';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type GraphNodeCoordinatesInput = {
  deviceName: Scalars['String']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type GraphNodeInterface = {
  __typename?: 'GraphNodeInterface';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: GraphEdgeStatus;
};

export type GraphVersionEdge = {
  __typename?: 'GraphVersionEdge';
  id: Scalars['ID']['output'];
  source: EdgeSourceTarget;
  target: EdgeSourceTarget;
};

export type GraphVersionNode = BaseGraphNode & {
  __typename?: 'GraphVersionNode';
  coordinates: GraphNodeCoordinates;
  deviceType: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfaces: Array<GraphNodeInterface>;
  name: Scalars['String']['output'];
  softwareVersion: Maybe<Scalars['String']['output']>;
};

export type InstallDevicePayload = {
  __typename?: 'InstallDevicePayload';
  device: Device;
};

export type IsOkResponse = {
  __typename?: 'IsOkResponse';
  isOk: Scalars['Boolean']['output'];
};

export type Label = Node & {
  __typename?: 'Label';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LabelConnection = {
  __typename?: 'LabelConnection';
  edges: Array<LabelEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LabelEdge = {
  __typename?: 'LabelEdge';
  cursor: Scalars['String']['output'];
  node: Label;
};

export type Location = Node & {
  __typename?: 'Location';
  country: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LocationConnection = {
  __typename?: 'LocationConnection';
  edges: Array<LocationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LocationEdge = {
  __typename?: 'LocationEdge';
  cursor: Scalars['String']['output'];
  node: Location;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBlueprint: AddBlueprintPayload;
  addDevice: AddDevicePayload;
  addLocation: AddLocationPayload;
  addSnapshot: Maybe<AddSnapshotPayload>;
  addZone: AddZonePayload;
  applySnapshot: ApplySnapshotPayload;
  bulkPauseWorkflow: Maybe<BulkOperationResponse>;
  bulkRestartWorkflow: Maybe<BulkOperationResponse>;
  bulkResumeWorkflow: Maybe<BulkOperationResponse>;
  bulkRetryWorkflow: Maybe<BulkOperationResponse>;
  bulkTerminateWorkflow: Maybe<BulkOperationResponse>;
  closeTransaction: CloseTransactionPayload;
  commitConfig: CommitConfigPayload;
  createEventHandler: Maybe<EventHandler>;
  createLabel: CreateLabelPayload;
  createTaskDefinition: Maybe<TaskDefinition>;
  createTransaction: CreateTransactionPayload;
  createWorkflow: CreateWorkflowPayload;
  deleteBlueprint: DeleteBlueprintPayload;
  deleteDevice: DeleteDevicePayload;
  deleteEventHandler: Maybe<IsOkResponse>;
  deleteLabel: DeleteLabelPayload;
  deleteSchedule: Maybe<IsOkResponse>;
  deleteSnapshot: Maybe<DeleteSnapshotPayload>;
  deleteTask: Maybe<IsOkResponse>;
  deleteWorkflow: DeleteWorkflowPayload;
  editWorkflowSchedule: Maybe<Schedule>;
  executeNewWorkflow: Maybe<Scalars['String']['output']>;
  executeWorkflowByName: Maybe<Scalars['String']['output']>;
  freeResource: Maybe<Scalars['String']['output']>;
  importCSV: Maybe<CsvImport>;
  installDevice: InstallDevicePayload;
  pauseWorkflow: Maybe<IsOkResponse>;
  removeWorkflow: Maybe<IsOkResponse>;
  resetConfig: ResetConfigPayload;
  restartWorkflow: Maybe<IsOkResponse>;
  resumeWorkflow: Maybe<IsOkResponse>;
  retryWorkflow: Maybe<IsOkResponse>;
  revertChanges: RevertChangesPayload;
  scheduleWorkflow: Maybe<Schedule>;
  syncFromNetwork: SyncFromNetworkPayload;
  terminateWorkflow: Maybe<IsOkResponse>;
  uninstallDevice: UninstallDevicePayload;
  updateBlueprint: UpdateBlueprintPayload;
  updateDataStore: UpdateDataStorePayload;
  updateDevice: UpdateDevicePayload;
  updateEventHandler: Maybe<EventHandler>;
  updateGraphNodeCoordinates: UpdateGraphNodeCoordinatesPayload;
  updateWorkflow: UpdateWorkflowPayload;
};


export type MutationAddBlueprintArgs = {
  input: AddBlueprintInput;
};


export type MutationAddDeviceArgs = {
  input: AddDeviceInput;
};


export type MutationAddLocationArgs = {
  input: AddLocationInput;
};


export type MutationAddSnapshotArgs = {
  input: AddSnapshotInput;
  transactionId: Scalars['String']['input'];
};


export type MutationAddZoneArgs = {
  input: AddZoneInput;
};


export type MutationApplySnapshotArgs = {
  input: ApplySnapshotInput;
  transactionId: Scalars['String']['input'];
};


export type MutationBulkPauseWorkflowArgs = {
  input: BulkOperationInput;
};


export type MutationBulkRestartWorkflowArgs = {
  input: BulkOperationInput;
};


export type MutationBulkResumeWorkflowArgs = {
  input: BulkOperationInput;
};


export type MutationBulkRetryWorkflowArgs = {
  input: BulkOperationInput;
};


export type MutationBulkTerminateWorkflowArgs = {
  input: BulkOperationInput;
};


export type MutationCloseTransactionArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type MutationCommitConfigArgs = {
  input: CommitConfigInput;
  transactionId: Scalars['String']['input'];
};


export type MutationCreateEventHandlerArgs = {
  input: CreateEventHandlerInput;
};


export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
};


export type MutationCreateTaskDefinitionArgs = {
  input: CreateTaskDefinitionInput;
};


export type MutationCreateTransactionArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationCreateWorkflowArgs = {
  input: CreateWorkflowInput;
};


export type MutationDeleteBlueprintArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDeviceArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEventHandlerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLabelArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
};


export type MutationDeleteTaskArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteWorkflowArgs = {
  input: DeleteWorkflowInput;
};


export type MutationEditWorkflowScheduleArgs = {
  id: Scalars['String']['input'];
  input: EditWorkflowScheduleInput;
};


export type MutationExecuteNewWorkflowArgs = {
  input: StartWorkflowRequestInput;
};


export type MutationExecuteWorkflowByNameArgs = {
  input: ExecuteWorkflowByName;
};


export type MutationFreeResourceArgs = {
  input: FreeResourceInput;
};


export type MutationImportCsvArgs = {
  input: CsvImportInput;
};


export type MutationInstallDeviceArgs = {
  id: Scalars['String']['input'];
};


export type MutationPauseWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveWorkflowArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<RemoveWorkflowInput>;
};


export type MutationResetConfigArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type MutationRestartWorkflowArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<RestartWorkflowInput>;
};


export type MutationResumeWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type MutationRetryWorkflowArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<RetryWorkflowInput>;
};


export type MutationRevertChangesArgs = {
  transactionId: Scalars['String']['input'];
};


export type MutationScheduleWorkflowArgs = {
  input: CreateScheduleInput;
};


export type MutationSyncFromNetworkArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type MutationTerminateWorkflowArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<TerminateWorkflowInput>;
};


export type MutationUninstallDeviceArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateBlueprintArgs = {
  id: Scalars['String']['input'];
  input: UpdateBlueprintInput;
};


export type MutationUpdateDataStoreArgs = {
  deviceId: Scalars['String']['input'];
  input: UpdateDataStoreInput;
  transactionId: Scalars['String']['input'];
};


export type MutationUpdateDeviceArgs = {
  id: Scalars['String']['input'];
  input: UpdateDeviceInput;
};


export type MutationUpdateEventHandlerArgs = {
  event: Scalars['String']['input'];
  input: UpdateEventHandlerInput;
  name: Scalars['String']['input'];
};


export type MutationUpdateGraphNodeCoordinatesArgs = {
  input: Array<GraphNodeCoordinatesInput>;
};


export type MutationUpdateWorkflowArgs = {
  id: Scalars['String']['input'];
  input: UpdateWorkflowInput;
};

export type NetInterface = {
  __typename?: 'NetInterface';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type NetNetwork = {
  __typename?: 'NetNetwork';
  coordinates: GraphNodeCoordinates;
  id: Scalars['String']['output'];
  subnet: Scalars['String']['output'];
};

export type NetNode = {
  __typename?: 'NetNode';
  coordinates: GraphNodeCoordinates;
  id: Scalars['ID']['output'];
  interfaces: Array<NetInterface>;
  name: Scalars['String']['output'];
  networks: Array<NetNetwork>;
  nodeId: Scalars['String']['output'];
};

export type NetRoutingPathNode = {
  __typename?: 'NetRoutingPathNode';
  nodes: Array<NetRoutingPathNodeInfo>;
  weight: Maybe<Scalars['Int']['output']>;
};

export type NetRoutingPathNodeInfo = {
  __typename?: 'NetRoutingPathNodeInfo';
  name: Maybe<Scalars['String']['output']>;
  weight: Maybe<Scalars['Int']['output']>;
};

export type NetTopology = {
  __typename?: 'NetTopology';
  edges: Array<GraphEdge>;
  nodes: Array<NetNode>;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type OutputParameter = {
  __typename?: 'OutputParameter';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type OutputParameterInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PaginationArgs = {
  size: Scalars['Int']['input'];
  start: Scalars['Int']['input'];
};

export type PollData = {
  __typename?: 'PollData';
  domain: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastPollTime: Maybe<Scalars['String']['output']>;
  queueName: Maybe<Scalars['String']['output']>;
  workerId: Maybe<Scalars['String']['output']>;
};

export type PollDataConnection = {
  __typename?: 'PollDataConnection';
  edges: Maybe<Array<Maybe<PollDataEdge>>>;
  pageInfo: Maybe<PageInfo>;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type PollDataEdge = {
  __typename?: 'PollDataEdge';
  cursor: Maybe<Scalars['String']['output']>;
  node: Maybe<PollData>;
};

export type PollsOrderByInput = {
  direction: SortPollsDirection;
  sortKey: SortPollsBy;
};

export type Pool = Node & {
  __typename?: 'Pool';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  poolType: PoolType;
  resourceType: ResourceType;
  tags: Array<Tag>;
};

export type PoolConnection = {
  __typename?: 'PoolConnection';
  edges: Array<PoolEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PoolEdge = {
  __typename?: 'PoolEdge';
  cursor: Scalars['String']['output'];
  node: Pool;
};

export type PoolType =
  | 'allocating'
  | 'set'
  | 'singleton';

export type Query = {
  __typename?: 'Query';
  blueprints: BlueprintConnection;
  calculatedDiff: CalculatedDiffPayload;
  countries: CountryConnection;
  dataStore: Maybe<DataStore>;
  devices: DeviceConnection;
  eventHandler: Maybe<EventHandler>;
  eventHandlers: Maybe<EventHandlerConnection>;
  eventHandlersByEvent: Maybe<EventHandlerConnection>;
  executedWorkflows: Maybe<ExecutedWorkflowConnection>;
  externalStorage: Maybe<ExternaStorage>;
  labels: LabelConnection;
  locations: LocationConnection;
  netTopology: Maybe<NetTopology>;
  node: Maybe<Node>;
  pollData: Maybe<PollDataConnection>;
  pools: PoolConnection;
  schedules: ScheduleConnection;
  shortestPath: Array<NetRoutingPathNode>;
  taskDefinitions: TaskDefinitionConnection;
  topology: Maybe<Topology>;
  topologyCommonNodes: Maybe<TopologyCommonNodes>;
  topologyVersionData: TopologyVersionData;
  topologyVersions: Maybe<Array<Scalars['String']['output']>>;
  transactions: Array<Transaction>;
  uniconfigShellSession: Maybe<Scalars['String']['output']>;
  workflowInstanceDetail: Maybe<WorkflowInstanceDetail>;
  workflowLabels: Array<Scalars['String']['output']>;
  workflows: WorkflowConnection;
  zones: ZonesConnection;
};


export type QueryBlueprintsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCalculatedDiffArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type QueryCountriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDataStoreArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type QueryDevicesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterDevicesInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DeviceOrderByInput>;
};


export type QueryEventHandlerArgs = {
  event: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QueryEventHandlersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterEventHandlerInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EventHandlersOrderByInput>;
};


export type QueryEventHandlersByEventArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryExecutedWorkflowsArgs = {
  orderBy?: InputMaybe<ExecutedWorkflowsOrderByInput>;
  pagination?: InputMaybe<PaginationArgs>;
  searchQuery?: InputMaybe<ExecutedWorkflowSearchInput>;
};


export type QueryExternalStorageArgs = {
  path: Scalars['String']['input'];
};


export type QueryLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLocationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPollDataArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterPollDataInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy: PollsOrderByInput;
};


export type QueryPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterPoolsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySchedulesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ScheduleFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryShortestPathArgs = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};


export type QueryTaskDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterTaskDefinitionsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TasksOrderByInput>;
};


export type QueryTopologyArgs = {
  filter?: InputMaybe<FilterTopologyInput>;
};


export type QueryTopologyCommonNodesArgs = {
  nodes: Array<Scalars['String']['input']>;
};


export type QueryTopologyVersionDataArgs = {
  version: Scalars['String']['input'];
};


export type QueryWorkflowInstanceDetailArgs = {
  shouldIncludeTasks?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};


export type QueryWorkflowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterWorkflowsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WorkflowsOrderByInput>;
};


export type QueryZonesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type RemoveWorkflowInput = {
  /** Default value is true */
  shouldArchiveWorkflow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ResetConfigPayload = {
  __typename?: 'ResetConfigPayload';
  dataStore: DataStore;
};

export type ResourceType = {
  __typename?: 'ResourceType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ResourceTypeInput = {
  resourceTypeId?: InputMaybe<Scalars['String']['input']>;
};

export type RestartWorkflowInput = {
  /** Default value is true */
  shouldUseLatestDefinitions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RetryLogic =
  | 'EXPONENTIAL_BACKOFF'
  | 'FIXED'
  | 'LINEAR_BACKOFF';

export type RetryWorkflowInput = {
  /** Default value is true */
  shouldResumeSubworkflowTasks?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RevertChangesPayload = {
  __typename?: 'RevertChangesPayload';
  isOk: Scalars['Boolean']['output'];
};

export type Schedule = Node & {
  __typename?: 'Schedule';
  cronString: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parallelRuns: Scalars['Boolean']['output'];
  performFromDate: Scalars['String']['output'];
  performTillDate: Scalars['String']['output'];
  status: ScheduleStatus;
  workflowContext: Scalars['String']['output'];
  workflowName: Scalars['String']['output'];
  workflowVersion: Scalars['String']['output'];
};

export type ScheduleConnection = {
  __typename?: 'ScheduleConnection';
  edges: Array<Maybe<ScheduleEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ScheduleEdge = {
  __typename?: 'ScheduleEdge';
  cursor: Scalars['String']['output'];
  node: Schedule;
};

export type ScheduleFilterInput = {
  workflowName: Scalars['String']['input'];
  workflowVersion: Scalars['String']['input'];
};

export type ScheduleStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'RUNNING'
  | 'TERMINATED'
  | 'TIMED_OUT'
  | 'UNKNOWN';

export type Snapshot = {
  __typename?: 'Snapshot';
  createdAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SortDeviceBy =
  | 'createdAt'
  | 'name'
  | 'serviceState';

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type SortEventHandlersBy =
  | 'evaluatorType'
  | 'event'
  | 'isActive'
  | 'name';

export type SortExecutedWorkflowsBy =
  | 'endTime'
  | 'startTime'
  | 'status'
  | 'workflowId'
  | 'workflowName';

export type SortExecutedWorkflowsDirection =
  | 'asc'
  | 'desc';

export type SortPollsBy =
  | 'lastPollTime'
  | 'queueName'
  | 'workerId';

export type SortPollsDirection =
  | 'asc'
  | 'desc';

export type SortTasksBy =
  | 'name'
  | 'responseTimeoutSeconds'
  | 'retryCount'
  | 'retryLogic'
  | 'timeoutPolicy'
  | 'timeoutSeconds';

export type SortWorkflowsBy =
  | 'name';

export type StartWorkflowRequestInput = {
  workflow: ExecuteNewWorkflowInput;
  workflowDefinition?: InputMaybe<WorkflowDefinitionInput>;
};

export type SubWorkflow = {
  __typename?: 'SubWorkflow';
  executedWorkflowDetail: ExecutedWorkflow;
  referenceTaskName: Scalars['String']['output'];
  workflowDetail: Workflow;
};

export type Subscription = {
  __typename?: 'Subscription';
  controlExecutedWorkflow: Maybe<ExecutedWorkflow>;
  uniconfigShell: Maybe<Scalars['String']['output']>;
};


export type SubscriptionControlExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionUniconfigShellArgs = {
  input?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
  trigger?: InputMaybe<Scalars['Int']['input']>;
};

export type SyncFromNetworkPayload = {
  __typename?: 'SyncFromNetworkPayload';
  dataStore: Maybe<DataStore>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  tag: Scalars['String']['output'];
};

export type TaskDefinition = Node & {
  __typename?: 'TaskDefinition';
  concurrentExecLimit: Maybe<Scalars['Int']['output']>;
  createdAt: Maybe<Scalars['String']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  inputKeys: Maybe<Array<Scalars['String']['output']>>;
  inputTemplate: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outputKeys: Maybe<Array<Scalars['String']['output']>>;
  ownerEmail: Maybe<Scalars['String']['output']>;
  pollTimeoutSeconds: Maybe<Scalars['Int']['output']>;
  rateLimitFrequencyInSeconds: Maybe<Scalars['Int']['output']>;
  rateLimitPerFrequency: Maybe<Scalars['Int']['output']>;
  responseTimeoutSeconds: Maybe<Scalars['Int']['output']>;
  retryCount: Maybe<Scalars['Int']['output']>;
  retryDelaySeconds: Maybe<Scalars['Int']['output']>;
  retryLogic: Maybe<RetryLogic>;
  timeoutPolicy: Maybe<TaskTimeoutPolicy>;
  timeoutSeconds: Scalars['Int']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
};

export type TaskDefinitionConnection = {
  __typename?: 'TaskDefinitionConnection';
  edges: Array<TaskDefinitionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TaskDefinitionEdge = {
  __typename?: 'TaskDefinitionEdge';
  cursor: Scalars['String']['output'];
  node: TaskDefinition;
};

export type TaskInput = {
  asyncComplete?: InputMaybe<Scalars['Boolean']['input']>;
  decisionCases?: InputMaybe<Scalars['String']['input']>;
  defaultCase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  inputParameters?: InputMaybe<Scalars['String']['input']>;
  joinOn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  loopCondition?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  retryCount?: InputMaybe<Scalars['Int']['input']>;
  startDelay?: InputMaybe<Scalars['Int']['input']>;
  taskReferenceName: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  workflowTaskType?: InputMaybe<Array<InputMaybe<WorkflowTaskType>>>;
};

export type TaskTimeoutPolicy =
  | 'ALERT_ONLY'
  | 'RETRY'
  | 'TIME_OUT_WF';

export type TasksOrderByInput = {
  direction: SortDirection;
  sortKey: SortTasksBy;
};

export type TerminateWorkflowInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type TimeoutPolicy =
  | 'ALERT_ONLY'
  | 'TIME_OUT_WF';

export type Topology = {
  __typename?: 'Topology';
  edges: Array<GraphEdge>;
  nodes: Array<GraphNode>;
};

export type TopologyCommonNodes = {
  __typename?: 'TopologyCommonNodes';
  commonNodes: Array<Scalars['String']['output']>;
};

export type TopologyVersionData = {
  __typename?: 'TopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<GraphVersionNode>;
};

export type Transaction = {
  __typename?: 'Transaction';
  changes: Array<TransactionChange>;
  lastCommitTime: Scalars['String']['output'];
  transactionId: Scalars['String']['output'];
};

export type TransactionChange = {
  __typename?: 'TransactionChange';
  device: Device;
  diff: Array<TransactionDiff>;
};

export type TransactionDiff = {
  __typename?: 'TransactionDiff';
  dataAfter: Maybe<Scalars['String']['output']>;
  dataBefore: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
};

export type UninstallDevicePayload = {
  __typename?: 'UninstallDevicePayload';
  device: Device;
};

export type UpdateBlueprintInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  template?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBlueprintPayload = {
  __typename?: 'UpdateBlueprintPayload';
  blueprint: Blueprint;
};

export type UpdateDataStoreInput = {
  config: Scalars['String']['input'];
};

export type UpdateDataStorePayload = {
  __typename?: 'UpdateDataStorePayload';
  dataStore: DataStore;
};

export type UpdateDeviceInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  deviceSize?: InputMaybe<DeviceSize>;
  deviceType?: InputMaybe<Scalars['String']['input']>;
  labelIds?: InputMaybe<Array<Scalars['String']['input']>>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  mountParameters?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  port?: InputMaybe<Scalars['Int']['input']>;
  serviceState?: InputMaybe<DeviceServiceState>;
  username?: InputMaybe<Scalars['String']['input']>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDeviceMetadataPayload = {
  __typename?: 'UpdateDeviceMetadataPayload';
  devices: Maybe<Array<Maybe<Device>>>;
};

export type UpdateDevicePayload = {
  __typename?: 'UpdateDevicePayload';
  device: Maybe<Device>;
};

export type UpdateEventHandlerInput = {
  actions?: InputMaybe<Array<EventHandlerActionInput>>;
  condition?: InputMaybe<Scalars['String']['input']>;
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateGraphNodeCoordinatesPayload = {
  __typename?: 'UpdateGraphNodeCoordinatesPayload';
  deviceNames: Array<Scalars['String']['output']>;
};

export type UpdateWorkflowInput = {
  workflow: WorkflowInput;
};

export type UpdateWorkflowPayload = {
  __typename?: 'UpdateWorkflowPayload';
  workflow: Workflow;
};

export type Workflow = Node & {
  __typename?: 'Workflow';
  createdAt: Maybe<Scalars['String']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  hasSchedule: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  inputParameters: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  outputParameters: Maybe<Array<OutputParameter>>;
  ownerEmail: Maybe<Scalars['String']['output']>;
  restartable: Maybe<Scalars['Boolean']['output']>;
  schemaVersion: Maybe<Scalars['Int']['output']>;
  tasks: Maybe<Scalars['String']['output']>;
  timeoutPolicy: Maybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['Int']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['String']['output']>;
  version: Maybe<Scalars['Int']['output']>;
};

export type WorkflowConnection = {
  __typename?: 'WorkflowConnection';
  edges: Array<WorkflowEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WorkflowDefinitionInput = {
  createTime?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Int']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  inputParameters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputTemplate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  outputParameters?: InputMaybe<Scalars['String']['input']>;
  ownerApp?: InputMaybe<Scalars['String']['input']>;
  ownerEmail?: InputMaybe<Scalars['String']['input']>;
  restartable?: InputMaybe<Scalars['Boolean']['input']>;
  schemaVersion?: InputMaybe<Scalars['Int']['input']>;
  tasks: Array<TaskInput>;
  timeoutPolicy?: InputMaybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['Int']['input'];
  updateTime?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['Int']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
  variables?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type WorkflowEdge = {
  __typename?: 'WorkflowEdge';
  cursor: Scalars['String']['output'];
  node: Workflow;
};

export type WorkflowInput = {
  createdAt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  outputParameters?: InputMaybe<Array<OutputParameterInput>>;
  restartable?: InputMaybe<Scalars['Boolean']['input']>;
  tasks: Scalars['String']['input'];
  timeoutSeconds: Scalars['Int']['input'];
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type WorkflowInstanceDetail = {
  __typename?: 'WorkflowInstanceDetail';
  meta: Maybe<Workflow>;
  result: ExecutedWorkflow;
  subworkflows: Maybe<Array<SubWorkflow>>;
};

export type WorkflowTaskType =
  | 'DECISION'
  | 'DO_WHILE'
  | 'DYNAMIC'
  | 'EVENT'
  | 'EXCLUSIVE_JOIN'
  | 'FORK_JOIN'
  | 'FORK_JOIN_DYNAMIC'
  | 'HTTP'
  | 'HUMAN'
  | 'INLINE'
  | 'JOIN'
  | 'JSON_JQ_TRANSFORM'
  | 'KAFKA_PUBLISH'
  | 'LAMBDA'
  | 'SET_VARIABLE'
  | 'SIMPLE'
  | 'START_WORKFLOW'
  | 'SUB_WORKFLOW'
  | 'SWITCH'
  | 'TERMINATE'
  | 'USER_DEFINED'
  | 'WAIT';

export type WorkflowsOrderByInput = {
  direction: SortDirection;
  sortKey: SortWorkflowsBy;
};

export type Zone = Node & {
  __typename?: 'Zone';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ZoneEdge = {
  __typename?: 'ZoneEdge';
  cursor: Scalars['String']['output'];
  node: Zone;
};

export type ZonesConnection = {
  __typename?: 'ZonesConnection';
  edges: Array<ZoneEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GetSchedulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSchedulesQuery = { __typename?: 'Query', schedules: { __typename?: 'ScheduleConnection', edges: Array<{ __typename?: 'ScheduleEdge', node: { __typename?: 'Schedule', name: string } } | null> } };

export type CreateWorkflowMutationVariables = Exact<{
  input: UpdateWorkflowInput;
}>;


export type CreateWorkflowMutation = { __typename?: 'Mutation', updateWorkflow: { __typename?: 'UpdateWorkflowPayload', workflow: { __typename?: 'Workflow', createdBy: string | null, updatedAt: string | null, tasks: string | null, name: string, description: string | null, version: number | null, outputParameters: Array<{ __typename?: 'OutputParameter', key: string, value: string }> | null } } };

export type GetEventHandlerDetailQueryVariables = Exact<{
  event: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type GetEventHandlerDetailQuery = { __typename?: 'Query', eventHandler: { __typename?: 'EventHandler', id: string, name: string, event: string, condition: string | null, isActive: boolean | null, evaluatorType: string | null, actions: Array<{ __typename?: 'EventHandlerAction', action: EventHandlerActionEnum | null, expandInlineJSON: boolean | null, startWorkflow: { __typename?: 'ActionStartWorkflow', name: string | null, version: number | null, input: string | null, correlationId: string | null, taskToDomain: string | null } | null, completeTask: { __typename?: 'ActionCompleteTask', workflowId: string | null, taskId: string | null, output: string | null, taskRefName: string | null } | null, failTask: { __typename?: 'ActionFailTask', workflowId: string | null, taskId: string | null, output: string | null, taskRefName: string | null } | null }> } | null };

export type EditEventHandlerMutationVariables = Exact<{
  event: Scalars['String']['input'];
  name: Scalars['String']['input'];
  input: UpdateEventHandlerInput;
}>;


export type EditEventHandlerMutation = { __typename?: 'Mutation', updateEventHandler: { __typename?: 'EventHandler', id: string, name: string } | null };

export type EventHandlerQueryVariables = Exact<{
  event: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type EventHandlerQuery = { __typename?: 'Query', eventHandler: { __typename?: 'EventHandler', id: string, name: string, event: string, condition: string | null, evaluatorType: string | null, isActive: boolean | null, actions: Array<{ __typename?: 'EventHandlerAction', action: EventHandlerActionEnum | null, expandInlineJSON: boolean | null, completeTask: { __typename?: 'ActionCompleteTask', workflowId: string | null, taskId: string | null, output: string | null, taskRefName: string | null } | null, failTask: { __typename?: 'ActionFailTask', workflowId: string | null, taskId: string | null, output: string | null, taskRefName: string | null } | null, startWorkflow: { __typename?: 'ActionStartWorkflow', name: string | null, version: number | null, input: string | null, correlationId: string | null, taskToDomain: string | null } | null }> } | null };

export type DeleteEventHandlerDetailMutationVariables = Exact<{
  deleteEventHandlerId: Scalars['String']['input'];
}>;


export type DeleteEventHandlerDetailMutation = { __typename?: 'Mutation', deleteEventHandler: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type EditEventHandlerActionsMutationVariables = Exact<{
  input: UpdateEventHandlerInput;
  name: Scalars['String']['input'];
  event: Scalars['String']['input'];
}>;


export type EditEventHandlerActionsMutation = { __typename?: 'Mutation', updateEventHandler: { __typename?: 'EventHandler', id: string, name: string, event: string } | null };

export type CreateEventHandlerMutationVariables = Exact<{
  input: CreateEventHandlerInput;
}>;


export type CreateEventHandlerMutation = { __typename?: 'Mutation', createEventHandler: { __typename?: 'EventHandler', id: string, name: string, event: string } | null };

export type GetEventHandlersQueryVariables = Exact<{
  filter?: InputMaybe<FilterEventHandlerInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<EventHandlersOrderByInput>;
}>;


export type GetEventHandlersQuery = { __typename?: 'Query', eventHandlers: { __typename?: 'EventHandlerConnection', edges: Array<{ __typename?: 'EventHandlerEdge', cursor: string, node: { __typename?: 'EventHandler', id: string, isActive: boolean | null, name: string, evaluatorType: string | null, event: string, actions: Array<{ __typename?: 'EventHandlerAction', action: EventHandlerActionEnum | null }> } }> | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type DeleteEventHandlerMutationVariables = Exact<{
  deleteEventHandlerId: Scalars['String']['input'];
}>;


export type DeleteEventHandlerMutation = { __typename?: 'Mutation', deleteEventHandler: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type UpdateEventHandlerMutationVariables = Exact<{
  input: UpdateEventHandlerInput;
  name: Scalars['String']['input'];
  event: Scalars['String']['input'];
}>;


export type UpdateEventHandlerMutation = { __typename?: 'Mutation', updateEventHandler: { __typename?: 'EventHandler', id: string, name: string, event: string } | null };

export type ExternalStorageQueryVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type ExternalStorageQuery = { __typename?: 'Query', externalStorage: { __typename?: 'ExternaStorage', data: string } | null };

export type ExecutedWorkflowDetailQueryVariables = Exact<{
  nodeId: Scalars['ID']['input'];
}>;


export type ExecutedWorkflowDetailQuery = { __typename?: 'Query', node: { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device' } | { __typename?: 'EventHandler' } | { __typename?: 'ExecutedWorkflow', id: string, createdBy: string | null, updatedBy: string | null, createdAt: string | null, updatedAt: string | null, status: ExecutedWorkflowStatus | null, parentWorkflowId: string | null, ownerApp: string | null, input: string | null, output: string | null, reasonForIncompletion: string | null, failedReferenceTaskNames: Array<string | null> | null, variables: string | null, lastRetriedTime: string | null, startTime: string | null, endTime: string | null, workflowVersion: number | null, workflowName: string | null, workflowId: string, correlationId: string | null, workflowDefinition: { __typename?: 'Workflow', id: string, version: number | null, timeoutSeconds: number, name: string, description: string | null, createdBy: string | null, updatedBy: string | null, createdAt: string | null, updatedAt: string | null, tasks: string | null, inputParameters: Array<string> | null, hasSchedule: boolean | null, restartable: boolean | null, timeoutPolicy: TimeoutPolicy | null, outputParameters: Array<{ __typename?: 'OutputParameter', key: string, value: string }> | null } | null, tasks: Array<{ __typename?: 'ExecutedWorkflowTask', id: string, taskType: string | null, referenceTaskName: string | null, status: ExecutedWorkflowTaskStatus | null, retryCount: number | null, startTime: string | null, endTime: string | null, updateTime: string | null, scheduledTime: string | null, taskDefName: string | null, workflowType: string | null, retried: boolean | null, executed: boolean | null, taskId: string | null, reasonForIncompletion: string | null, taskDefinition: string | null, subWorkflowId: string | null, inputData: string | null, outputData: string | null, externalOutputPayloadStoragePath: string | null, externalInputPayloadStoragePath: string | null, callbackAfterSeconds: number | null, seq: number | null, pollCount: number | null }> | null } | { __typename?: 'ExecutedWorkflowTask' } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Pool' } | { __typename?: 'Schedule' } | { __typename?: 'TaskDefinition' } | { __typename?: 'Workflow' } | { __typename?: 'Zone' } | null };

export type ControlExecutedWorkflowSubscriptionVariables = Exact<{
  controlExecutedWorkflowId: Scalars['String']['input'];
}>;


export type ControlExecutedWorkflowSubscription = { __typename?: 'Subscription', controlExecutedWorkflow: { __typename?: 'ExecutedWorkflow', endTime: string | null, startTime: string | null, status: ExecutedWorkflowStatus | null, tasks: Array<{ __typename?: 'ExecutedWorkflowTask', id: string, endTime: string | null, startTime: string | null, updateTime: string | null, status: ExecutedWorkflowTaskStatus | null, taskType: string | null, subWorkflowId: string | null }> | null } | null };

export type ExecuteWorkflowByItsNameMutationVariables = Exact<{
  input: ExecuteWorkflowByName;
}>;


export type ExecuteWorkflowByItsNameMutation = { __typename?: 'Mutation', executeWorkflowByName: string | null };

export type RestartWorkflowMutationVariables = Exact<{
  restartWorkflowId: Scalars['String']['input'];
}>;


export type RestartWorkflowMutation = { __typename?: 'Mutation', restartWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type RetryWorkflowMutationVariables = Exact<{
  retryWorkflowId: Scalars['String']['input'];
  retryWorkflowInput?: InputMaybe<RetryWorkflowInput>;
}>;


export type RetryWorkflowMutation = { __typename?: 'Mutation', retryWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type PauseWorkflowMutationVariables = Exact<{
  pauseWorkflowId: Scalars['String']['input'];
}>;


export type PauseWorkflowMutation = { __typename?: 'Mutation', pauseWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type ResumeWorkflowMutationVariables = Exact<{
  resumeWorkflowId: Scalars['String']['input'];
}>;


export type ResumeWorkflowMutation = { __typename?: 'Mutation', resumeWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type TerminateWorkflowMutationVariables = Exact<{
  terminateWorkflowId: Scalars['String']['input'];
}>;


export type TerminateWorkflowMutation = { __typename?: 'Mutation', terminateWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type ExecutedWorkflowsQueryVariables = Exact<{
  orderBy: ExecutedWorkflowsOrderByInput;
  searchQuery?: InputMaybe<ExecutedWorkflowSearchInput>;
  pagination?: InputMaybe<PaginationArgs>;
}>;


export type ExecutedWorkflowsQuery = { __typename?: 'Query', executedWorkflows: { __typename?: 'ExecutedWorkflowConnection', edges: Array<{ __typename?: 'ExecutedWorkflowEdge', cursor: string, node: { __typename?: 'ExecutedWorkflow', endTime: string | null, id: string, input: string | null, output: string | null, startTime: string | null, status: ExecutedWorkflowStatus | null, variables: string | null, workflowId: string, workflowName: string | null, workflowVersion: number | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type BulkPauseWorkflowMutationVariables = Exact<{
  input: BulkOperationInput;
}>;


export type BulkPauseWorkflowMutation = { __typename?: 'Mutation', bulkPauseWorkflow: { __typename?: 'BulkOperationResponse', bulkErrorResults: string | null, bulkSuccessfulResults: Array<string> | null } | null };

export type BulkResumeWorkflowMutationVariables = Exact<{
  input: BulkOperationInput;
}>;


export type BulkResumeWorkflowMutation = { __typename?: 'Mutation', bulkResumeWorkflow: { __typename?: 'BulkOperationResponse', bulkErrorResults: string | null, bulkSuccessfulResults: Array<string> | null } | null };

export type BulkRetryWorkflowMutationVariables = Exact<{
  input: BulkOperationInput;
}>;


export type BulkRetryWorkflowMutation = { __typename?: 'Mutation', bulkRetryWorkflow: { __typename?: 'BulkOperationResponse', bulkErrorResults: string | null, bulkSuccessfulResults: Array<string> | null } | null };

export type BulkTerminateWorkflowMutationVariables = Exact<{
  input: BulkOperationInput;
}>;


export type BulkTerminateWorkflowMutation = { __typename?: 'Mutation', bulkTerminateWorkflow: { __typename?: 'BulkOperationResponse', bulkErrorResults: string | null, bulkSuccessfulResults: Array<string> | null } | null };

export type BulkRestartWorkflowMutationVariables = Exact<{
  input: BulkOperationInput;
}>;


export type BulkRestartWorkflowMutation = { __typename?: 'Mutation', bulkRestartWorkflow: { __typename?: 'BulkOperationResponse', bulkErrorResults: string | null, bulkSuccessfulResults: Array<string> | null } | null };

export type WorkflowInstanceDetailQueryVariables = Exact<{
  workflowId: Scalars['String']['input'];
}>;


export type WorkflowInstanceDetailQuery = { __typename?: 'Query', workflowInstanceDetail: { __typename?: 'WorkflowInstanceDetail', subworkflows: Array<{ __typename?: 'SubWorkflow', executedWorkflowDetail: { __typename?: 'ExecutedWorkflow', id: string, endTime: string | null, startTime: string | null, reasonForIncompletion: string | null, status: ExecutedWorkflowStatus | null, workflowId: string, workflowName: string | null, workflowVersion: number | null } }> | null } | null };

export type PollDataQueryVariables = Exact<{
  filter?: InputMaybe<FilterPollDataInput>;
  orderBy: PollsOrderByInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type PollDataQuery = { __typename?: 'Query', pollData: { __typename?: 'PollDataConnection', totalCount: number | null, edges: Array<{ __typename?: 'PollDataEdge', cursor: string | null, node: { __typename?: 'PollData', id: string, queueName: string | null, workerId: string | null, domain: string | null, lastPollTime: string | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } | null } | null };

export type WorkflowListQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkflowListQuery = { __typename?: 'Query', workflows: { __typename?: 'WorkflowConnection', edges: Array<{ __typename?: 'WorkflowEdge', node: { __typename?: 'Workflow', id: string, name: string, description: string | null, version: number | null, createdAt: string | null, updatedAt: string | null, createdBy: string | null, updatedBy: string | null, tasks: string | null, hasSchedule: boolean | null, inputParameters: Array<string> | null } }> } };

export type SchedulesQueryVariables = Exact<{ [key: string]: never; }>;


export type SchedulesQuery = { __typename?: 'Query', schedules: { __typename?: 'ScheduleConnection', totalCount: number, edges: Array<{ __typename?: 'ScheduleEdge', node: { __typename?: 'Schedule', id: string, name: string, workflowName: string, workflowVersion: string, cronString: string, workflowContext: string, isEnabled: boolean, performFromDate: string, performTillDate: string, parallelRuns: boolean, status: ScheduleStatus } } | null>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type DeleteScheduleMutationVariables = Exact<{
  deleteScheduleId: Scalars['String']['input'];
}>;


export type DeleteScheduleMutation = { __typename?: 'Mutation', deleteSchedule: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type EditWorkflowScheduleMutationVariables = Exact<{
  input: EditWorkflowScheduleInput;
  editWorkflowScheduleId: Scalars['String']['input'];
}>;


export type EditWorkflowScheduleMutation = { __typename?: 'Mutation', editWorkflowSchedule: { __typename?: 'Schedule', name: string, workflowName: string, workflowVersion: string, cronString: string, workflowContext: string, isEnabled: boolean, performFromDate: string, performTillDate: string, parallelRuns: boolean } | null };

export type ScheduleWorkflowMutationVariables = Exact<{
  input: CreateScheduleInput;
}>;


export type ScheduleWorkflowMutation = { __typename?: 'Mutation', scheduleWorkflow: { __typename?: 'Schedule', name: string, isEnabled: boolean, workflowName: string, workflowVersion: string, cronString: string, workflowContext: string, performFromDate: string, performTillDate: string } | null };

export type ExecuteWorkflowByNameMutationVariables = Exact<{
  input: ExecuteWorkflowByName;
}>;


export type ExecuteWorkflowByNameMutation = { __typename?: 'Mutation', executeWorkflowByName: string | null };

export type WorkflowsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterWorkflowsInput>;
  orderBy: WorkflowsOrderByInput;
}>;


export type WorkflowsQuery = { __typename?: 'Query', workflows: { __typename?: 'WorkflowConnection', totalCount: number, edges: Array<{ __typename?: 'WorkflowEdge', node: { __typename?: 'Workflow', id: string, name: string, description: string | null, version: number | null, createdAt: string | null, updatedAt: string | null, createdBy: string | null, updatedBy: string | null, tasks: string | null, hasSchedule: boolean | null, inputParameters: Array<string> | null, restartable: boolean | null, timeoutSeconds: number, timeoutPolicy: TimeoutPolicy | null, outputParameters: Array<{ __typename?: 'OutputParameter', key: string, value: string }> | null } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type WorkflowLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkflowLabelsQuery = { __typename?: 'Query', workflowLabels: Array<string> };

export type DeleteWorkflowMutationVariables = Exact<{
  input: DeleteWorkflowInput;
}>;


export type DeleteWorkflowMutation = { __typename?: 'Mutation', deleteWorkflow: { __typename?: 'DeleteWorkflowPayload', workflow: { __typename?: 'Workflow', id: string } } };

export type UpdateWorkflowMutationVariables = Exact<{
  updateWorkflowId: Scalars['String']['input'];
  input: UpdateWorkflowInput;
}>;


export type UpdateWorkflowMutation = { __typename?: 'Mutation', updateWorkflow: { __typename?: 'UpdateWorkflowPayload', workflow: { __typename?: 'Workflow', id: string } } };

export type TaskDefinitionsQueryVariables = Exact<{
  filter?: InputMaybe<FilterTaskDefinitionsInput>;
  orderBy?: InputMaybe<TasksOrderByInput>;
  before?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaskDefinitionsQuery = { __typename?: 'Query', taskDefinitions: { __typename?: 'TaskDefinitionConnection', totalCount: number, edges: Array<{ __typename?: 'TaskDefinitionEdge', node: { __typename?: 'TaskDefinition', id: string, name: string, timeoutSeconds: number, createdAt: string | null, updatedAt: string | null, createdBy: string | null, updatedBy: string | null, description: string | null, retryCount: number | null, pollTimeoutSeconds: number | null, inputKeys: Array<string> | null, outputKeys: Array<string> | null, inputTemplate: string | null, timeoutPolicy: TaskTimeoutPolicy | null, retryLogic: RetryLogic | null, retryDelaySeconds: number | null, responseTimeoutSeconds: number | null, concurrentExecLimit: number | null, rateLimitFrequencyInSeconds: number | null, rateLimitPerFrequency: number | null, ownerEmail: string | null } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type DeleteTaskMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type CreateTaskDefinitionMutationVariables = Exact<{
  input: CreateTaskDefinitionInput;
}>;


export type CreateTaskDefinitionMutation = { __typename?: 'Mutation', createTaskDefinition: { __typename?: 'TaskDefinition', id: string, name: string, timeoutSeconds: number, retryCount: number | null, timeoutPolicy: TaskTimeoutPolicy | null, retryLogic: RetryLogic | null, responseTimeoutSeconds: number | null } | null };
