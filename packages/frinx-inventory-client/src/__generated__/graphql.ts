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

export type BulkInstallDevicePayload = {
  __typename?: 'BulkInstallDevicePayload';
  installedDevices: Array<Device>;
};

export type BulkInstallDevicesInput = {
  devicesToInstall: Array<DevicesToInstallInput>;
};

export type BulkOperationInput = {
  executedWorkflowIds: Array<Scalars['String']['input']>;
};

export type BulkOperationResponse = {
  __typename?: 'BulkOperationResponse';
  bulkErrorResults: Maybe<Scalars['String']['output']>;
  bulkSuccessfulResults: Maybe<Array<Scalars['String']['output']>>;
};

export type BulkUninstallDevicePayload = {
  __typename?: 'BulkUninstallDevicePayload';
  uninstalledDevices: Array<Device>;
};

export type BulkUninstallDevicesInput = {
  devicesToUninstall: Array<DevicesToUninstallInput>;
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

export type DevicesToInstallInput = {
  deviceIds: Array<Scalars['String']['input']>;
  zoneId: Scalars['String']['input'];
};

export type DevicesToUninstallInput = {
  deviceIds: Array<Scalars['String']['input']>;
  zoneId: Scalars['String']['input'];
};

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

export type FilterLabelsInput = {
  name: Scalars['String']['input'];
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

export type FilterZonesInput = {
  name: Scalars['String']['input'];
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
  bulkInstallDevices: BulkInstallDevicePayload;
  bulkPauseWorkflow: Maybe<BulkOperationResponse>;
  bulkRestartWorkflow: Maybe<BulkOperationResponse>;
  bulkResumeWorkflow: Maybe<BulkOperationResponse>;
  bulkRetryWorkflow: Maybe<BulkOperationResponse>;
  bulkTerminateWorkflow: Maybe<BulkOperationResponse>;
  bulkUninstallDevices: BulkUninstallDevicePayload;
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


export type MutationBulkInstallDevicesArgs = {
  input: BulkInstallDevicesInput;
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


export type MutationBulkUninstallDevicesArgs = {
  input: BulkUninstallDevicesInput;
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
  poolProperties: Scalars['Record']['output'];
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
  filter?: InputMaybe<FilterLabelsInput>;
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
  filter?: InputMaybe<FilterZonesInput>;
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
  accessPolicy: Maybe<Scalars['Record']['output']>;
  createdAt: Maybe<Scalars['String']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  failureWorkflow: Maybe<Scalars['String']['output']>;
  hasSchedule: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  inputParameters: Maybe<Array<Scalars['String']['output']>>;
  inputTemplate: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outputParameters: Maybe<Array<OutputParameter>>;
  ownerApp: Maybe<Scalars['String']['output']>;
  ownerEmail: Maybe<Scalars['String']['output']>;
  restartable: Maybe<Scalars['Boolean']['output']>;
  schemaVersion: Maybe<Scalars['Int']['output']>;
  tasks: Maybe<Scalars['String']['output']>;
  timeoutPolicy: Maybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['Int']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['Record']['output']>;
  version: Maybe<Scalars['Int']['output']>;
  workflowStatusListenerEnabled: Maybe<Scalars['Boolean']['output']>;
};

export type WorkflowConnection = {
  __typename?: 'WorkflowConnection';
  edges: Array<WorkflowEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WorkflowDefinitionInput = {
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
  accessPolicy?: InputMaybe<Scalars['Record']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  failureWorkflow?: InputMaybe<Scalars['String']['input']>;
  inputParameters?: InputMaybe<Array<Scalars['String']['input']>>;
  inputTemplate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  outputParameters?: InputMaybe<Array<OutputParameterInput>>;
  ownerApp?: InputMaybe<Scalars['String']['input']>;
  ownerEmail?: InputMaybe<Scalars['String']['input']>;
  restartable?: InputMaybe<Scalars['Boolean']['input']>;
  schemaVersion?: InputMaybe<Scalars['Int']['input']>;
  tasks: Scalars['String']['input'];
  timeoutPolicy?: InputMaybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['Int']['input'];
  updatedBy?: InputMaybe<Scalars['String']['input']>;
  variables?: InputMaybe<Scalars['Record']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
  workflowStatusListenerEnabled?: InputMaybe<Scalars['Boolean']['input']>;
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

export type UploadFileMutationVariables = Exact<{
  input: CsvImportInput;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', importCSV: { __typename?: 'CSVImport', isOk: boolean | null } | null };

export type ZonesImportQueryVariables = Exact<{ [key: string]: never; }>;


export type ZonesImportQuery = { __typename?: 'Query', zones: { __typename?: 'ZonesConnection', edges: Array<{ __typename?: 'ZoneEdge', node: { __typename?: 'Zone', id: string, name: string } }> } };

export type AddBlueprintMutationVariables = Exact<{
  input: AddBlueprintInput;
}>;


export type AddBlueprintMutation = { __typename?: 'Mutation', addBlueprint: { __typename?: 'AddBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string, createdAt: string, name: string } } };

export type AddDeviceMutationVariables = Exact<{
  input: AddDeviceInput;
}>;


export type AddDeviceMutation = { __typename?: 'Mutation', addDevice: { __typename?: 'AddDevicePayload', device: { __typename?: 'Device', id: string, name: string, isInstalled: boolean, zone: { __typename?: 'Zone', id: string, name: string } } } };

export type ZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type ZonesQuery = { __typename?: 'Query', zones: { __typename?: 'ZonesConnection', edges: Array<{ __typename?: 'ZoneEdge', node: { __typename?: 'Zone', id: string, name: string } }> } };

export type DeviceBlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type DeviceBlueprintsQuery = { __typename?: 'Query', blueprints: { __typename?: 'BlueprintConnection', edges: Array<{ __typename?: 'BlueprintEdge', node: { __typename?: 'Blueprint', id: string, name: string, template: string } }> } };

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = { __typename?: 'Mutation', newLabel: { __typename?: 'CreateLabelPayload', label: { __typename?: 'Label', id: string, name: string, createdAt: string, updatedAt: string } | null } };

export type LabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type LabelsQuery = { __typename?: 'Query', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } };

export type BlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type BlueprintsQuery = { __typename?: 'Query', blueprints: { __typename?: 'BlueprintConnection', edges: Array<{ __typename?: 'BlueprintEdge', node: { __typename?: 'Blueprint', id: string, createdAt: string, name: string } }> } };

export type DeleteBlueprintMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBlueprintMutation = { __typename?: 'Mutation', deleteBlueprint: { __typename?: 'DeleteBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string } | null } };

export type DeviceNameQueryVariables = Exact<{
  deviceId: Scalars['ID']['input'];
}>;


export type DeviceNameQuery = { __typename?: 'Query', node: { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device', id: string, name: string } | { __typename?: 'EventHandler' } | { __typename?: 'ExecutedWorkflow' } | { __typename?: 'ExecutedWorkflowTask' } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Pool' } | { __typename?: 'Schedule' } | { __typename?: 'TaskDefinition' } | { __typename?: 'Workflow' } | { __typename?: 'Zone' } | null };

export type DataStoreQueryVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type DataStoreQuery = { __typename?: 'Query', dataStore: { __typename?: 'DataStore', config: string, operational: string, snapshots: Array<{ __typename?: 'Snapshot', name: string, createdAt: string }> } | null };

export type UpdateDataStoreMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
  input: UpdateDataStoreInput;
}>;


export type UpdateDataStoreMutation = { __typename?: 'Mutation', updateDataStore: { __typename?: 'UpdateDataStorePayload', dataStore: { __typename?: 'DataStore', config: string, operational: string } } };

export type CommitDataStoreConfigMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  input: CommitConfigInput;
}>;


export type CommitDataStoreConfigMutation = { __typename?: 'Mutation', commitConfig: { __typename?: 'CommitConfigPayload', output: { __typename?: 'CommitConfigOutput', configuration: string | null, message: string | null } } };

export type ResetConfigMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type ResetConfigMutation = { __typename?: 'Mutation', resetConfig: { __typename?: 'ResetConfigPayload', dataStore: { __typename?: 'DataStore', config: string, operational: string } } };

export type AddSnapshotMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  input: AddSnapshotInput;
}>;


export type AddSnapshotMutation = { __typename?: 'Mutation', addSnapshot: { __typename?: 'AddSnapshotPayload', snapshot: { __typename?: 'Snapshot', name: string } | null } | null };

export type ApplySnapshotMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  input: ApplySnapshotInput;
}>;


export type ApplySnapshotMutation = { __typename?: 'Mutation', applySnapshot: { __typename?: 'ApplySnapshotPayload', isOk: boolean, output: string } };

export type SyncFromNetworkMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type SyncFromNetworkMutation = { __typename?: 'Mutation', syncFromNetwork: { __typename?: 'SyncFromNetworkPayload', dataStore: { __typename?: 'DataStore', operational: string } | null } };

export type DeleteSnapshotMutationVariables = Exact<{
  input: DeleteSnapshotInput;
}>;


export type DeleteSnapshotMutation = { __typename?: 'Mutation', deleteSnapshot: { __typename?: 'DeleteSnapshotPayload', snapshot: { __typename?: 'Snapshot', name: string } | null } | null };

export type CreateTransactionMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'CreateTransactionPayload', transactionId: string | null } };

export type CloseTransactionMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type CloseTransactionMutation = { __typename?: 'Mutation', closeTransaction: { __typename?: 'CloseTransactionPayload', isOk: boolean } };

export type CalculatedDiffQueryVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type CalculatedDiffQuery = { __typename?: 'Query', calculatedDiff: { __typename?: 'CalculatedDiffPayload', result: { __typename?: 'CalculatedDiffResult', createdData: Array<{ __typename?: 'DiffData', path: string, data: string }>, deletedData: Array<{ __typename?: 'DiffData', path: string, data: string }>, updatedData: Array<{ __typename?: 'CalculatedUpdateDiffData', path: string, actualData: string, intendedData: string }> } } };

export type DevicesQueryVariables = Exact<{
  labels?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  deviceName?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<DeviceOrderByInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type DevicesQuery = { __typename?: 'Query', devices: { __typename?: 'DeviceConnection', edges: Array<{ __typename?: 'DeviceEdge', node: { __typename?: 'Device', id: string, name: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState, zone: { __typename?: 'Zone', id: string, name: string } } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type InstallDeviceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type InstallDeviceMutation = { __typename?: 'Mutation', installDevice: { __typename?: 'InstallDevicePayload', device: { __typename?: 'Device', id: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState } } };

export type UninstallDeviceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UninstallDeviceMutation = { __typename?: 'Mutation', uninstallDevice: { __typename?: 'UninstallDevicePayload', device: { __typename?: 'Device', id: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState } } };

export type FilterLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FilterLabelsQuery = { __typename?: 'Query', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } };

export type DeleteDeviceMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type DeleteDeviceMutation = { __typename?: 'Mutation', deleteDevice: { __typename?: 'DeleteDevicePayload', device: { __typename?: 'Device', id: string } | null } };

export type BulkInstallDevicesMutationVariables = Exact<{
  input: BulkInstallDevicesInput;
}>;


export type BulkInstallDevicesMutation = { __typename?: 'Mutation', bulkInstallDevices: { __typename?: 'BulkInstallDevicePayload', installedDevices: Array<{ __typename?: 'Device', id: string }> } };

export type ExecuteModalWorkflowByNameMutationVariables = Exact<{
  input: ExecuteWorkflowByName;
}>;


export type ExecuteModalWorkflowByNameMutation = { __typename?: 'Mutation', executeWorkflowByName: string | null };

export type ModalWorkflowsQueryVariables = Exact<{ [key: string]: never; }>;


export type ModalWorkflowsQuery = { __typename?: 'Query', workflows: { __typename?: 'WorkflowConnection', totalCount: number, edges: Array<{ __typename?: 'WorkflowEdge', node: { __typename?: 'Workflow', id: string, name: string, description: string | null, version: number | null, createdAt: string | null, updatedAt: string | null, createdBy: string | null, updatedBy: string | null, tasks: string | null, hasSchedule: boolean | null, inputParameters: Array<string> | null, restartable: boolean | null, timeoutSeconds: number, timeoutPolicy: TimeoutPolicy | null, ownerEmail: string | null, schemaVersion: number | null, variables: any | null, outputParameters: Array<{ __typename?: 'OutputParameter', key: string, value: string }> | null } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type BlueprintQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BlueprintQuery = { __typename?: 'Query', blueprint: { __typename?: 'Blueprint', name: string, template: string, id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', id: string } | { __typename?: 'EventHandler', id: string } | { __typename?: 'ExecutedWorkflow', id: string } | { __typename?: 'ExecutedWorkflowTask', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'Pool', id: string } | { __typename?: 'Schedule', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'Zone', id: string } | null };

export type UpdateBlueprintMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateBlueprintInput;
}>;


export type UpdateBlueprintMutation = { __typename?: 'Mutation', updateBlueprint: { __typename?: 'UpdateBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string, name: string, template: string } } };

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeviceQuery = { __typename?: 'Query', device: { __typename?: 'Blueprint', id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', name: string, serviceState: DeviceServiceState, model: string | null, vendor: string | null, address: string | null, deviceSize: DeviceSize, mountParameters: string | null, id: string, zone: { __typename?: 'Zone', id: string, name: string }, labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } | { __typename?: 'EventHandler', id: string } | { __typename?: 'ExecutedWorkflow', id: string } | { __typename?: 'ExecutedWorkflowTask', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'Pool', id: string } | { __typename?: 'Schedule', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'Zone', id: string } | null };

export type UpdateDeviceMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateDeviceInput;
}>;


export type UpdateDeviceMutation = { __typename?: 'Mutation', updateDevice: { __typename?: 'UpdateDevicePayload', device: { __typename?: 'Device', id: string, name: string, model: string | null, vendor: string | null, address: string | null, isInstalled: boolean, zone: { __typename?: 'Zone', id: string, name: string } } | null } };

export type TransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', transactionId: string, lastCommitTime: string, changes: Array<{ __typename?: 'TransactionChange', device: { __typename?: 'Device', id: string, name: string }, diff: Array<{ __typename?: 'TransactionDiff', path: string, dataBefore: string | null, dataAfter: string | null }> }> }> };

export type RevertChangesMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
}>;


export type RevertChangesMutation = { __typename?: 'Mutation', revertChanges: { __typename?: 'RevertChangesPayload', isOk: boolean } };

export type CloseTransactionListMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type CloseTransactionListMutation = { __typename?: 'Mutation', closeTransaction: { __typename?: 'CloseTransactionPayload', isOk: boolean } };

export type TerminalSubscriptionVariables = Exact<{
  sessionId: Scalars['String']['input'];
  command?: InputMaybe<Scalars['String']['input']>;
  trigger?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TerminalSubscription = { __typename?: 'Subscription', uniconfigShell: string | null };

export type SessionIdQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionIdQuery = { __typename?: 'Query', uniconfigShellSession: string | null };
