export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Graphql custom scalar record type */
  Record: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type ActionCompleteTask = {
  __typename?: 'ActionCompleteTask';
  output: Maybe<Scalars['String']>;
  taskId: Maybe<Scalars['String']>;
  taskRefName: Maybe<Scalars['String']>;
  workflowId: Maybe<Scalars['String']>;
};

export type ActionCompleteTaskInput = {
  output?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['String']>;
  taskRefName?: InputMaybe<Scalars['String']>;
  workflowId?: InputMaybe<Scalars['String']>;
};

export type ActionFailTask = {
  __typename?: 'ActionFailTask';
  output: Maybe<Scalars['String']>;
  taskId: Maybe<Scalars['String']>;
  taskRefName: Maybe<Scalars['String']>;
  workflowId: Maybe<Scalars['String']>;
};

export type ActionFailTaskInput = {
  output?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['String']>;
  taskRefName?: InputMaybe<Scalars['String']>;
  workflowId?: InputMaybe<Scalars['String']>;
};

export type ActionStartWorkflow = {
  __typename?: 'ActionStartWorkflow';
  correlationId: Maybe<Scalars['String']>;
  input: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  taskToDomain: Maybe<Scalars['String']>;
  version: Maybe<Scalars['Int']>;
};

export type ActionStartWorkflowInput = {
  correlationId?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  taskToDomain?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type AddBlueprintInput = {
  name: Scalars['String'];
  template: Scalars['String'];
};

export type AddBlueprintPayload = {
  __typename?: 'AddBlueprintPayload';
  blueprint: Blueprint;
};

export type AddDeviceInput = {
  address?: InputMaybe<Scalars['String']>;
  blueprintId?: InputMaybe<Scalars['String']>;
  deviceSize?: InputMaybe<DeviceSize>;
  deviceType?: InputMaybe<Scalars['String']>;
  labelIds?: InputMaybe<Array<Scalars['String']>>;
  model?: InputMaybe<Scalars['String']>;
  mountParameters?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  serviceState?: InputMaybe<DeviceServiceState>;
  username?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
  zoneId: Scalars['String'];
};

export type AddDevicePayload = {
  __typename?: 'AddDevicePayload';
  device: Device;
};

export type AddLocationInput = {
  countryId: Scalars['String'];
  name: Scalars['String'];
};

export type AddLocationPayload = {
  __typename?: 'AddLocationPayload';
  location: Location;
};

export type AddSnapshotInput = {
  deviceId: Scalars['String'];
  name: Scalars['String'];
};

export type AddSnapshotPayload = {
  __typename?: 'AddSnapshotPayload';
  snapshot: Maybe<Snapshot>;
};

export type AddZoneInput = {
  name: Scalars['String'];
};

export type AddZonePayload = {
  __typename?: 'AddZonePayload';
  zone: Zone;
};

export type ApplySnapshotInput = {
  deviceId: Scalars['String'];
  name: Scalars['String'];
};

export type ApplySnapshotPayload = {
  __typename?: 'ApplySnapshotPayload';
  isOk: Scalars['Boolean'];
  output: Scalars['String'];
};

export type BaseGraphNode = {
  coordinates: GraphNodeCoordinates;
  deviceType: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  interfaces: Array<GraphNodeInterface>;
  softwareVersion: Maybe<Scalars['String']>;
};

export type Blueprint = Node & {
  __typename?: 'Blueprint';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  template: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type BlueprintConnection = {
  __typename?: 'BlueprintConnection';
  edges: Array<BlueprintEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type BlueprintEdge = {
  __typename?: 'BlueprintEdge';
  cursor: Scalars['String'];
  node: Blueprint;
};

export type BulkOperationInput = {
  executedWorkflowIds: Array<Scalars['String']>;
};

export type BulkOperationResponse = {
  __typename?: 'BulkOperationResponse';
  bulkErrorResults: Maybe<Scalars['String']>;
  bulkSuccessfulResults: Maybe<Array<Scalars['String']>>;
};

export type CsvImport = {
  __typename?: 'CSVImport';
  isOk: Maybe<Scalars['Boolean']>;
};

export type CsvImportInput = {
  file: Scalars['Upload'];
  zoneId: Scalars['String'];
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
  actualData: Scalars['String'];
  intendedData: Scalars['String'];
  path: Scalars['String'];
};

export type CloseTransactionPayload = {
  __typename?: 'CloseTransactionPayload';
  isOk: Scalars['Boolean'];
};

export type CommitConfigInput = {
  deviceId: Scalars['String'];
  shouldDryRun?: InputMaybe<Scalars['Boolean']>;
};

export type CommitConfigOutput = {
  __typename?: 'CommitConfigOutput';
  configuration: Maybe<Scalars['String']>;
  deviceId: Scalars['String'];
  message: Maybe<Scalars['String']>;
};

export type CommitConfigPayload = {
  __typename?: 'CommitConfigPayload';
  output: CommitConfigOutput;
};

export type Country = Node & {
  __typename?: 'Country';
  code: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CountryConnection = {
  __typename?: 'CountryConnection';
  edges: Array<CountryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type CountryEdge = {
  __typename?: 'CountryEdge';
  cursor: Scalars['String'];
  node: Country;
};

export type CreateEventHandlerInput = {
  actions: Array<EventHandlerActionInput>;
  condition?: InputMaybe<Scalars['String']>;
  evaluatorType?: InputMaybe<Scalars['String']>;
  /** The event is immutable and cannot be changed. */
  event: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** The name is immutable and cannot be changed. Also it must be unique. */
  name: Scalars['String'];
};

export type CreateLabelInput = {
  name: Scalars['String'];
};

export type CreateLabelPayload = {
  __typename?: 'CreateLabelPayload';
  label: Maybe<Label>;
};

export type CreateScheduleInput = {
  cronString: Scalars['String'];
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  parallelRuns?: InputMaybe<Scalars['Boolean']>;
  performFromDate?: InputMaybe<Scalars['String']>;
  performTillDate?: InputMaybe<Scalars['String']>;
  workflowContext?: InputMaybe<Scalars['String']>;
  workflowName: Scalars['String'];
  workflowVersion: Scalars['String'];
};

export type CreateTaskDefinitionInput = {
  accessPolicy?: InputMaybe<Scalars['String']>;
  backoffScaleFactor?: InputMaybe<Scalars['Int']>;
  concurrentExecLimit?: InputMaybe<Scalars['Int']>;
  createdBy?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  executionNameSpace?: InputMaybe<Scalars['String']>;
  inputKeys?: InputMaybe<Array<Scalars['String']>>;
  inputTemplate?: InputMaybe<Scalars['String']>;
  isolationGroupId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  outputKeys?: InputMaybe<Array<Scalars['String']>>;
  ownerApp?: InputMaybe<Scalars['String']>;
  ownerEmail?: InputMaybe<Scalars['String']>;
  pollTimeoutSeconds?: InputMaybe<Scalars['Int']>;
  rateLimitFrequencyInSeconds?: InputMaybe<Scalars['Int']>;
  rateLimitPerFrequency?: InputMaybe<Scalars['Int']>;
  responseTimeoutSeconds?: InputMaybe<Scalars['Int']>;
  retryCount?: InputMaybe<Scalars['Int']>;
  retryDelaySeconds?: InputMaybe<Scalars['Int']>;
  retryLogic?: InputMaybe<RetryLogic>;
  timeoutPolicy?: InputMaybe<TaskTimeoutPolicy>;
  timeoutSeconds: Scalars['Int'];
  updatedBy?: InputMaybe<Scalars['String']>;
};

export type CreateTransactionPayload = {
  __typename?: 'CreateTransactionPayload';
  transactionId: Maybe<Scalars['String']>;
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
  config: Scalars['String'];
  operational: Scalars['String'];
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
  deviceId: Scalars['String'];
  name: Scalars['String'];
  transactionId: Scalars['String'];
};

export type DeleteSnapshotPayload = {
  __typename?: 'DeleteSnapshotPayload';
  snapshot: Maybe<Snapshot>;
};

export type DeleteWorkflowInput = {
  name: Scalars['String'];
  version: Scalars['Int'];
};

export type DeleteWorkflowPayload = {
  __typename?: 'DeleteWorkflowPayload';
  workflow: Workflow;
};

export type Device = Node & {
  __typename?: 'Device';
  address: Maybe<Scalars['String']>;
  blueprint: Maybe<Blueprint>;
  createdAt: Scalars['String'];
  deviceSize: DeviceSize;
  id: Scalars['ID'];
  isInstalled: Scalars['Boolean'];
  labels: LabelConnection;
  location: Maybe<Location>;
  model: Maybe<Scalars['String']>;
  mountParameters: Maybe<Scalars['String']>;
  name: Scalars['String'];
  port: Maybe<Scalars['Int']>;
  serviceState: DeviceServiceState;
  source: DeviceSource;
  updatedAt: Scalars['String'];
  vendor: Maybe<Scalars['String']>;
  zone: Zone;
};


export type DeviceLabelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type DeviceConnection = {
  __typename?: 'DeviceConnection';
  edges: Array<DeviceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DeviceEdge = {
  __typename?: 'DeviceEdge';
  cursor: Scalars['String'];
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
  data: Scalars['String'];
  path: Scalars['String'];
};

export type EdgeSourceTarget = {
  __typename?: 'EdgeSourceTarget';
  interface: Scalars['String'];
  nodeId: Scalars['String'];
};

export type EditWorkflowScheduleInput = {
  cronString?: InputMaybe<Scalars['String']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  parallelRuns?: InputMaybe<Scalars['Boolean']>;
  performFromDate?: InputMaybe<Scalars['String']>;
  performTillDate?: InputMaybe<Scalars['String']>;
  workflowContext?: InputMaybe<Scalars['String']>;
  workflowName?: InputMaybe<Scalars['String']>;
  workflowVersion?: InputMaybe<Scalars['String']>;
};

export type EventHandler = Node & {
  __typename?: 'EventHandler';
  actions: Array<EventHandlerAction>;
  condition: Maybe<Scalars['String']>;
  evaluatorType: Maybe<Scalars['String']>;
  /** The event is immutable and cannot be changed. */
  event: Scalars['String'];
  id: Scalars['ID'];
  isActive: Maybe<Scalars['Boolean']>;
  /** The name is immutable and cannot be changed. Also it must be unique. */
  name: Scalars['String'];
};

export type EventHandlerAction = {
  __typename?: 'EventHandlerAction';
  action: Maybe<EventHandlerActionEnum>;
  completeTask: Maybe<ActionCompleteTask>;
  expandInlineJSON: Maybe<Scalars['Boolean']>;
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
  expandInlineJSON?: InputMaybe<Scalars['Boolean']>;
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
  cursor: Scalars['String'];
  node: EventHandler;
};

export type EventHandlersOrderByInput = {
  direction: SortDirection;
  sortKey: SortEventHandlersBy;
};

export type ExecuteNewWorkflowInput = {
  correlationId?: InputMaybe<Scalars['String']>;
  externalInputPayloadStoragePath?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  taskToDomain?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type ExecuteWorkflowByName = {
  correlationId?: InputMaybe<Scalars['String']>;
  /** JSON string of input parameters */
  inputParameters: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  workflowName: Scalars['String'];
  workflowVersion?: InputMaybe<Scalars['Int']>;
};

export type ExecutedWorkflow = Node & {
  __typename?: 'ExecutedWorkflow';
  correlationId: Maybe<Scalars['String']>;
  createdAt: Maybe<Scalars['String']>;
  createdBy: Maybe<Scalars['String']>;
  endTime: Maybe<Scalars['String']>;
  failedReferenceTaskNames: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['ID'];
  input: Maybe<Scalars['String']>;
  lastRetriedTime: Maybe<Scalars['String']>;
  output: Maybe<Scalars['String']>;
  ownerApp: Maybe<Scalars['String']>;
  parentWorkflowId: Maybe<Scalars['String']>;
  reasonForIncompletion: Maybe<Scalars['String']>;
  startTime: Maybe<Scalars['String']>;
  status: Maybe<ExecutedWorkflowStatus>;
  tasks: Maybe<Array<ExecutedWorkflowTask>>;
  updatedAt: Maybe<Scalars['String']>;
  updatedBy: Maybe<Scalars['String']>;
  variables: Maybe<Scalars['String']>;
  workflowDefinition: Maybe<Workflow>;
  workflowId: Scalars['String'];
  workflowName: Maybe<Scalars['String']>;
  workflowVersion: Maybe<Scalars['Int']>;
};

export type ExecutedWorkflowConnection = {
  __typename?: 'ExecutedWorkflowConnection';
  edges: Array<ExecutedWorkflowEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ExecutedWorkflowEdge = {
  __typename?: 'ExecutedWorkflowEdge';
  cursor: Scalars['String'];
  node: ExecutedWorkflow;
};

export type ExecutedWorkflowFilterInput = {
  startTime?: InputMaybe<ExecutedWorkflowStartTimeRange>;
  status?: InputMaybe<Array<ExecutedWorkflowStatus>>;
  workflowId?: InputMaybe<Array<Scalars['String']>>;
  workflowType?: InputMaybe<Array<Scalars['String']>>;
};

export type ExecutedWorkflowSearchInput = {
  isRootWorkflow?: InputMaybe<Scalars['Boolean']>;
  query?: InputMaybe<ExecutedWorkflowFilterInput>;
};

export type ExecutedWorkflowStartTimeRange = {
  from: Scalars['String'];
  to?: InputMaybe<Scalars['String']>;
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
  callbackAfterSeconds: Maybe<Scalars['Int']>;
  endTime: Maybe<Scalars['String']>;
  executed: Maybe<Scalars['Boolean']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inputData: Maybe<Scalars['String']>;
  outputData: Maybe<Scalars['String']>;
  pollCount: Maybe<Scalars['Int']>;
  reasonForIncompletion: Maybe<Scalars['String']>;
  referenceTaskName: Maybe<Scalars['String']>;
  retried: Maybe<Scalars['Boolean']>;
  retryCount: Maybe<Scalars['Int']>;
  scheduledTime: Maybe<Scalars['String']>;
  seq: Maybe<Scalars['Int']>;
  startTime: Maybe<Scalars['String']>;
  status: Maybe<ExecutedWorkflowTaskStatus>;
  subWorkflowId: Maybe<Scalars['String']>;
  taskDefName: Maybe<Scalars['String']>;
  taskDefinition: Maybe<Scalars['String']>;
  taskId: Maybe<Scalars['String']>;
  taskType: Maybe<Scalars['String']>;
  updateTime: Maybe<Scalars['String']>;
  workflowType: Maybe<Scalars['String']>;
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

export type FilterDevicesInput = {
  deviceName?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type FilterEventHandlerInput = {
  evaluatorType?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FilterPollDataInput = {
  afterDate?: InputMaybe<Scalars['String']>;
  beforeDate?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  queueName?: InputMaybe<Scalars['String']>;
  workerId?: InputMaybe<Scalars['String']>;
};

export type FilterPoolsInput = {
  poolName?: InputMaybe<Scalars['String']>;
};

export type FilterTaskDefinitionsInput = {
  keyword?: InputMaybe<Scalars['String']>;
};

export type FilterTopologyInput = {
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type FilterWorkflowsInput = {
  keyword?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type FreeResourceInput = {
  poolId: Scalars['String'];
  resource: Scalars['Record'];
};

export type GraphEdge = {
  __typename?: 'GraphEdge';
  id: Scalars['ID'];
  source: EdgeSourceTarget;
  target: EdgeSourceTarget;
};

export type GraphEdgeStatus =
  | 'ok'
  | 'unknown';

export type GraphNode = BaseGraphNode & {
  __typename?: 'GraphNode';
  coordinates: GraphNodeCoordinates;
  device: Device;
  deviceType: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  interfaces: Array<GraphNodeInterface>;
  softwareVersion: Maybe<Scalars['String']>;
};

export type GraphNodeCoordinates = {
  __typename?: 'GraphNodeCoordinates';
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type GraphNodeCoordinatesInput = {
  deviceName: Scalars['String'];
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type GraphNodeInterface = {
  __typename?: 'GraphNodeInterface';
  id: Scalars['String'];
  name: Scalars['String'];
  status: GraphEdgeStatus;
};

export type GraphVersionEdge = {
  __typename?: 'GraphVersionEdge';
  id: Scalars['ID'];
  source: EdgeSourceTarget;
  target: EdgeSourceTarget;
};

export type GraphVersionNode = BaseGraphNode & {
  __typename?: 'GraphVersionNode';
  coordinates: GraphNodeCoordinates;
  deviceType: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  interfaces: Array<GraphNodeInterface>;
  name: Scalars['String'];
  softwareVersion: Maybe<Scalars['String']>;
};

export type InstallDevicePayload = {
  __typename?: 'InstallDevicePayload';
  device: Device;
};

export type IsOkResponse = {
  __typename?: 'IsOkResponse';
  isOk: Scalars['Boolean'];
};

export type Label = Node & {
  __typename?: 'Label';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LabelConnection = {
  __typename?: 'LabelConnection';
  edges: Array<LabelEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LabelEdge = {
  __typename?: 'LabelEdge';
  cursor: Scalars['String'];
  node: Label;
};

export type Location = Node & {
  __typename?: 'Location';
  country: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LocationConnection = {
  __typename?: 'LocationConnection';
  edges: Array<LocationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LocationEdge = {
  __typename?: 'LocationEdge';
  cursor: Scalars['String'];
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
  executeNewWorkflow: Maybe<Scalars['String']>;
  executeWorkflowByName: Maybe<Scalars['String']>;
  freeResource: Maybe<Scalars['String']>;
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
  transactionId: Scalars['String'];
};


export type MutationAddZoneArgs = {
  input: AddZoneInput;
};


export type MutationApplySnapshotArgs = {
  input: ApplySnapshotInput;
  transactionId: Scalars['String'];
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
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type MutationCommitConfigArgs = {
  input: CommitConfigInput;
  transactionId: Scalars['String'];
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
  deviceId: Scalars['String'];
};


export type MutationCreateWorkflowArgs = {
  input: CreateWorkflowInput;
};


export type MutationDeleteBlueprintArgs = {
  id: Scalars['String'];
};


export type MutationDeleteDeviceArgs = {
  id: Scalars['String'];
};


export type MutationDeleteEventHandlerArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLabelArgs = {
  id: Scalars['String'];
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
};


export type MutationDeleteTaskArgs = {
  name: Scalars['String'];
};


export type MutationDeleteWorkflowArgs = {
  input: DeleteWorkflowInput;
};


export type MutationEditWorkflowScheduleArgs = {
  id: Scalars['String'];
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
  id: Scalars['String'];
};


export type MutationPauseWorkflowArgs = {
  id: Scalars['String'];
};


export type MutationRemoveWorkflowArgs = {
  id: Scalars['String'];
  input?: InputMaybe<RemoveWorkflowInput>;
};


export type MutationResetConfigArgs = {
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type MutationRestartWorkflowArgs = {
  id: Scalars['String'];
  input?: InputMaybe<RestartWorkflowInput>;
};


export type MutationResumeWorkflowArgs = {
  id: Scalars['String'];
};


export type MutationRetryWorkflowArgs = {
  id: Scalars['String'];
  input?: InputMaybe<RetryWorkflowInput>;
};


export type MutationRevertChangesArgs = {
  transactionId: Scalars['String'];
};


export type MutationScheduleWorkflowArgs = {
  input: CreateScheduleInput;
};


export type MutationSyncFromNetworkArgs = {
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type MutationTerminateWorkflowArgs = {
  id: Scalars['String'];
  input?: InputMaybe<TerminateWorkflowInput>;
};


export type MutationUninstallDeviceArgs = {
  id: Scalars['String'];
};


export type MutationUpdateBlueprintArgs = {
  id: Scalars['String'];
  input: UpdateBlueprintInput;
};


export type MutationUpdateDataStoreArgs = {
  deviceId: Scalars['String'];
  input: UpdateDataStoreInput;
  transactionId: Scalars['String'];
};


export type MutationUpdateDeviceArgs = {
  id: Scalars['String'];
  input: UpdateDeviceInput;
};


export type MutationUpdateEventHandlerArgs = {
  event: Scalars['String'];
  input: UpdateEventHandlerInput;
  name: Scalars['String'];
};


export type MutationUpdateGraphNodeCoordinatesArgs = {
  input: Array<GraphNodeCoordinatesInput>;
};


export type MutationUpdateWorkflowArgs = {
  id: Scalars['String'];
  input: UpdateWorkflowInput;
};

export type NetInterface = {
  __typename?: 'NetInterface';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type NetNetwork = {
  __typename?: 'NetNetwork';
  coordinates: GraphNodeCoordinates;
  id: Scalars['String'];
  subnet: Scalars['String'];
};

export type NetNode = {
  __typename?: 'NetNode';
  coordinates: GraphNodeCoordinates;
  id: Scalars['ID'];
  interfaces: Array<NetInterface>;
  name: Scalars['String'];
  networks: Array<NetNetwork>;
  nodeId: Scalars['String'];
};

export type NetRoutingPaths = {
  __typename?: 'NetRoutingPaths';
  alternativePaths: Array<Array<Scalars['String']>>;
  shortestPath: Array<Scalars['String']>;
};

export type NetTopology = {
  __typename?: 'NetTopology';
  edges: Array<GraphEdge>;
  nodes: Array<NetNode>;
};

export type Node = {
  id: Scalars['ID'];
};

export type OutputParameter = {
  __typename?: 'OutputParameter';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type OutputParameterInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Maybe<Scalars['String']>;
};

export type PaginationArgs = {
  size: Scalars['Int'];
  start: Scalars['Int'];
};

export type PollData = {
  __typename?: 'PollData';
  domain: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastPollTime: Maybe<Scalars['String']>;
  queueName: Maybe<Scalars['String']>;
  workerId: Maybe<Scalars['String']>;
};

export type PollDataConnection = {
  __typename?: 'PollDataConnection';
  edges: Maybe<Array<Maybe<PollDataEdge>>>;
  pageInfo: Maybe<PageInfo>;
  totalCount: Maybe<Scalars['Int']>;
};

export type PollDataEdge = {
  __typename?: 'PollDataEdge';
  cursor: Maybe<Scalars['String']>;
  node: Maybe<PollData>;
};

export type PollsOrderByInput = {
  direction: SortPollsDirection;
  sortKey: SortPollsBy;
};

export type Pool = Node & {
  __typename?: 'Pool';
  id: Scalars['ID'];
  name: Scalars['String'];
  poolType: PoolType;
  resourceType: ResourceType;
  tags: Array<Tag>;
};

export type PoolConnection = {
  __typename?: 'PoolConnection';
  edges: Array<PoolEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PoolEdge = {
  __typename?: 'PoolEdge';
  cursor: Scalars['String'];
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
  labels: LabelConnection;
  locations: LocationConnection;
  netTopology: Maybe<NetTopology>;
  node: Maybe<Node>;
  pollData: Maybe<PollDataConnection>;
  pools: PoolConnection;
  schedules: ScheduleConnection;
  shortestPath: Maybe<NetRoutingPaths>;
  taskDefinitions: TaskDefinitionConnection;
  topology: Maybe<Topology>;
  topologyCommonNodes: Maybe<TopologyCommonNodes>;
  topologyVersionData: TopologyVersionData;
  topologyVersions: Maybe<Array<Scalars['String']>>;
  transactions: Array<Transaction>;
  uniconfigShellSession: Maybe<Scalars['String']>;
  workflowInstanceDetail: Maybe<WorkflowInstanceDetail>;
  workflowLabels: Array<Scalars['String']>;
  workflows: WorkflowConnection;
  zones: ZonesConnection;
};


export type QueryBlueprintsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryCalculatedDiffArgs = {
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type QueryCountriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryDataStoreArgs = {
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type QueryDevicesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterDevicesInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeviceOrderByInput>;
};


export type QueryEventHandlerArgs = {
  event: Scalars['String'];
  name: Scalars['String'];
};


export type QueryEventHandlersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterEventHandlerInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EventHandlersOrderByInput>;
};


export type QueryEventHandlersByEventArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  event: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryExecutedWorkflowsArgs = {
  orderBy?: InputMaybe<ExecutedWorkflowsOrderByInput>;
  pagination?: InputMaybe<PaginationArgs>;
  searchQuery?: InputMaybe<ExecutedWorkflowSearchInput>;
};


export type QueryLabelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
  version?: InputMaybe<Scalars['Int']>;
};


export type QueryPollDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterPollDataInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy: PollsOrderByInput;
};


export type QueryPoolsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterPoolsInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  resourceTypeId?: InputMaybe<Scalars['String']>;
};


export type QuerySchedulesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ScheduleFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryShortestPathArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
};


export type QueryTaskDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterTaskDefinitionsInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryTopologyArgs = {
  filter?: InputMaybe<FilterTopologyInput>;
};


export type QueryTopologyCommonNodesArgs = {
  nodes: Array<Scalars['String']>;
};


export type QueryTopologyVersionDataArgs = {
  version: Scalars['String'];
};


export type QueryWorkflowInstanceDetailArgs = {
  shouldIncludeTasks?: InputMaybe<Scalars['Boolean']>;
  workflowId: Scalars['String'];
};


export type QueryWorkflowsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterWorkflowsInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkflowsOrderByInput>;
};


export type QueryZonesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type RemoveWorkflowInput = {
  /** Default value is true */
  shouldArchiveWorkflow?: InputMaybe<Scalars['Boolean']>;
};

export type ResetConfigPayload = {
  __typename?: 'ResetConfigPayload';
  dataStore: DataStore;
};

export type ResourceType = {
  __typename?: 'ResourceType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ResourceTypeInput = {
  resourceTypeId?: InputMaybe<Scalars['String']>;
};

export type RestartWorkflowInput = {
  /** Default value is true */
  shouldUseLatestDefinitions?: InputMaybe<Scalars['Boolean']>;
};

export type RetryLogic =
  | 'EXPONENTIAL_BACKOFF'
  | 'FIXED'
  | 'LINEAR_BACKOFF';

export type RetryWorkflowInput = {
  /** Default value is true */
  shouldResumeSubworkflowTasks?: InputMaybe<Scalars['Boolean']>;
};

export type RevertChangesPayload = {
  __typename?: 'RevertChangesPayload';
  isOk: Scalars['Boolean'];
};

export type Schedule = Node & {
  __typename?: 'Schedule';
  cronString: Scalars['String'];
  id: Scalars['ID'];
  isEnabled: Scalars['Boolean'];
  name: Scalars['String'];
  parallelRuns: Scalars['Boolean'];
  performFromDate: Scalars['String'];
  performTillDate: Scalars['String'];
  status: ScheduleStatus;
  workflowContext: Scalars['String'];
  workflowName: Scalars['String'];
  workflowVersion: Scalars['String'];
};

export type ScheduleConnection = {
  __typename?: 'ScheduleConnection';
  edges: Array<Maybe<ScheduleEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ScheduleEdge = {
  __typename?: 'ScheduleEdge';
  cursor: Scalars['String'];
  node: Schedule;
};

export type ScheduleFilterInput = {
  workflowName: Scalars['String'];
  workflowVersion: Scalars['String'];
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
  createdAt: Scalars['String'];
  name: Scalars['String'];
};

export type SortDeviceBy =
  | 'createdAt'
  | 'isInstalled'
  | 'name'
  | 'serviceState'
  | 'zone';

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

export type SortWorkflowsBy =
  | 'name';

export type StartWorkflowRequestInput = {
  workflow: ExecuteNewWorkflowInput;
  workflowDefinition?: InputMaybe<WorkflowDefinitionInput>;
};

export type SubWorkflow = {
  __typename?: 'SubWorkflow';
  executedWorkflowDetail: ExecutedWorkflow;
  referenceTaskName: Scalars['String'];
  workflowDetail: Workflow;
};

export type Subscription = {
  __typename?: 'Subscription';
  controlExecutedWorkflow: Maybe<ExecutedWorkflow>;
  uniconfigShell: Maybe<Scalars['String']>;
};


export type SubscriptionControlExecutedWorkflowArgs = {
  id: Scalars['String'];
};


export type SubscriptionUniconfigShellArgs = {
  input?: InputMaybe<Scalars['String']>;
  sessionId: Scalars['String'];
  trigger?: InputMaybe<Scalars['Int']>;
};

export type SyncFromNetworkPayload = {
  __typename?: 'SyncFromNetworkPayload';
  dataStore: Maybe<DataStore>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  tag: Scalars['String'];
};

export type TaskDefinition = Node & {
  __typename?: 'TaskDefinition';
  concurrentExecLimit: Maybe<Scalars['Int']>;
  createdAt: Maybe<Scalars['String']>;
  createdBy: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inputKeys: Maybe<Array<Scalars['String']>>;
  inputTemplate: Maybe<Scalars['String']>;
  name: Scalars['String'];
  outputKeys: Maybe<Array<Scalars['String']>>;
  ownerEmail: Maybe<Scalars['String']>;
  pollTimeoutSeconds: Maybe<Scalars['Int']>;
  rateLimitFrequencyInSeconds: Maybe<Scalars['Int']>;
  rateLimitPerFrequency: Maybe<Scalars['Int']>;
  responseTimeoutSeconds: Maybe<Scalars['Int']>;
  retryCount: Maybe<Scalars['Int']>;
  retryDelaySeconds: Maybe<Scalars['Int']>;
  retryLogic: Maybe<RetryLogic>;
  timeoutPolicy: Maybe<TaskTimeoutPolicy>;
  timeoutSeconds: Scalars['Int'];
  updatedAt: Maybe<Scalars['String']>;
  updatedBy: Maybe<Scalars['String']>;
};

export type TaskDefinitionConnection = {
  __typename?: 'TaskDefinitionConnection';
  edges: Array<TaskDefinitionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TaskDefinitionEdge = {
  __typename?: 'TaskDefinitionEdge';
  cursor: Scalars['String'];
  node: TaskDefinition;
};

export type TaskInput = {
  asyncComplete?: InputMaybe<Scalars['Boolean']>;
  decisionCases?: InputMaybe<Scalars['String']>;
  defaultCase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  inputParameters?: InputMaybe<Scalars['String']>;
  joinOn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  loopCondition?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  optional?: InputMaybe<Scalars['Boolean']>;
  retryCount?: InputMaybe<Scalars['Int']>;
  startDelay?: InputMaybe<Scalars['Int']>;
  taskReferenceName: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
  workflowTaskType?: InputMaybe<Array<InputMaybe<WorkflowTaskType>>>;
};

export type TaskTimeoutPolicy =
  | 'ALERT_ONLY'
  | 'RETRY'
  | 'TIME_OUT_WF';

export type TerminateWorkflowInput = {
  reason?: InputMaybe<Scalars['String']>;
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
  commonNodes: Array<Scalars['String']>;
};

export type TopologyVersionData = {
  __typename?: 'TopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<GraphVersionNode>;
};

export type Transaction = {
  __typename?: 'Transaction';
  changes: Array<TransactionChange>;
  lastCommitTime: Scalars['String'];
  transactionId: Scalars['String'];
};

export type TransactionChange = {
  __typename?: 'TransactionChange';
  device: Device;
  diff: Array<TransactionDiff>;
};

export type TransactionDiff = {
  __typename?: 'TransactionDiff';
  dataAfter: Maybe<Scalars['String']>;
  dataBefore: Maybe<Scalars['String']>;
  path: Scalars['String'];
};

export type UninstallDevicePayload = {
  __typename?: 'UninstallDevicePayload';
  device: Device;
};

export type UpdateBlueprintInput = {
  name?: InputMaybe<Scalars['String']>;
  template?: InputMaybe<Scalars['String']>;
};

export type UpdateBlueprintPayload = {
  __typename?: 'UpdateBlueprintPayload';
  blueprint: Blueprint;
};

export type UpdateDataStoreInput = {
  config: Scalars['String'];
};

export type UpdateDataStorePayload = {
  __typename?: 'UpdateDataStorePayload';
  dataStore: DataStore;
};

export type UpdateDeviceInput = {
  address?: InputMaybe<Scalars['String']>;
  blueprintId?: InputMaybe<Scalars['String']>;
  deviceSize?: InputMaybe<DeviceSize>;
  deviceType?: InputMaybe<Scalars['String']>;
  labelIds?: InputMaybe<Array<Scalars['String']>>;
  locationId?: InputMaybe<Scalars['String']>;
  model?: InputMaybe<Scalars['String']>;
  mountParameters?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  serviceState?: InputMaybe<DeviceServiceState>;
  username?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
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
  condition?: InputMaybe<Scalars['String']>;
  evaluatorType?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateGraphNodeCoordinatesPayload = {
  __typename?: 'UpdateGraphNodeCoordinatesPayload';
  deviceNames: Array<Scalars['String']>;
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
  createdAt: Maybe<Scalars['String']>;
  createdBy: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  hasSchedule: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  inputParameters: Maybe<Array<Scalars['String']>>;
  name: Scalars['String'];
  outputParameters: Maybe<Array<OutputParameter>>;
  restartable: Maybe<Scalars['Boolean']>;
  tasks: Maybe<Scalars['String']>;
  timeoutPolicy: Maybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['Int'];
  updatedAt: Maybe<Scalars['String']>;
  updatedBy: Maybe<Scalars['String']>;
  version: Maybe<Scalars['Int']>;
};

export type WorkflowConnection = {
  __typename?: 'WorkflowConnection';
  edges: Array<WorkflowEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type WorkflowDefinitionInput = {
  createTime?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['Int']>;
  createdBy?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  inputParameters?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  inputTemplate?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  outputParameters?: InputMaybe<Scalars['String']>;
  ownerApp?: InputMaybe<Scalars['String']>;
  ownerEmail?: InputMaybe<Scalars['String']>;
  restartable?: InputMaybe<Scalars['Boolean']>;
  schemaVersion?: InputMaybe<Scalars['Int']>;
  tasks: Array<TaskInput>;
  timeoutPolicy?: InputMaybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['Int'];
  updateTime?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['Int']>;
  updatedBy?: InputMaybe<Scalars['String']>;
  variables?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type WorkflowEdge = {
  __typename?: 'WorkflowEdge';
  cursor: Scalars['String'];
  node: Workflow;
};

export type WorkflowInput = {
  createdAt?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  outputParameters?: InputMaybe<Array<OutputParameterInput>>;
  restartable?: InputMaybe<Scalars['Boolean']>;
  tasks: Scalars['String'];
  timeoutSeconds: Scalars['Int'];
  updatedAt?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
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
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ZoneEdge = {
  __typename?: 'ZoneEdge';
  cursor: Scalars['String'];
  node: Zone;
};

export type ZonesConnection = {
  __typename?: 'ZonesConnection';
  edges: Array<ZoneEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
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
  id: Scalars['String'];
}>;


export type DeleteBlueprintMutation = { __typename?: 'Mutation', deleteBlueprint: { __typename?: 'DeleteBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string } | null } };

export type DeviceNameQueryVariables = Exact<{
  deviceId: Scalars['ID'];
}>;


export type DeviceNameQuery = { __typename?: 'Query', node: { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device', id: string, name: string } | { __typename?: 'EventHandler' } | { __typename?: 'ExecutedWorkflow' } | { __typename?: 'ExecutedWorkflowTask' } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Pool' } | { __typename?: 'Schedule' } | { __typename?: 'TaskDefinition' } | { __typename?: 'Workflow' } | { __typename?: 'Zone' } | null };

export type DataStoreQueryVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type DataStoreQuery = { __typename?: 'Query', dataStore: { __typename?: 'DataStore', config: string, operational: string, snapshots: Array<{ __typename?: 'Snapshot', name: string, createdAt: string }> } | null };

export type UpdateDataStoreMutationVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
  input: UpdateDataStoreInput;
}>;


export type UpdateDataStoreMutation = { __typename?: 'Mutation', updateDataStore: { __typename?: 'UpdateDataStorePayload', dataStore: { __typename?: 'DataStore', config: string, operational: string } } };

export type CommitDataStoreConfigMutationVariables = Exact<{
  transactionId: Scalars['String'];
  input: CommitConfigInput;
}>;


export type CommitDataStoreConfigMutation = { __typename?: 'Mutation', commitConfig: { __typename?: 'CommitConfigPayload', output: { __typename?: 'CommitConfigOutput', configuration: string | null, message: string | null } } };

export type ResetConfigMutationVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type ResetConfigMutation = { __typename?: 'Mutation', resetConfig: { __typename?: 'ResetConfigPayload', dataStore: { __typename?: 'DataStore', config: string, operational: string } } };

export type AddSnapshotMutationVariables = Exact<{
  transactionId: Scalars['String'];
  input: AddSnapshotInput;
}>;


export type AddSnapshotMutation = { __typename?: 'Mutation', addSnapshot: { __typename?: 'AddSnapshotPayload', snapshot: { __typename?: 'Snapshot', name: string } | null } | null };

export type ApplySnapshotMutationVariables = Exact<{
  transactionId: Scalars['String'];
  input: ApplySnapshotInput;
}>;


export type ApplySnapshotMutation = { __typename?: 'Mutation', applySnapshot: { __typename?: 'ApplySnapshotPayload', isOk: boolean, output: string } };

export type SyncFromNetworkMutationVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type SyncFromNetworkMutation = { __typename?: 'Mutation', syncFromNetwork: { __typename?: 'SyncFromNetworkPayload', dataStore: { __typename?: 'DataStore', operational: string } | null } };

export type DeleteSnapshotMutationVariables = Exact<{
  input: DeleteSnapshotInput;
}>;


export type DeleteSnapshotMutation = { __typename?: 'Mutation', deleteSnapshot: { __typename?: 'DeleteSnapshotPayload', snapshot: { __typename?: 'Snapshot', name: string } | null } | null };

export type CreateTransactionMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'CreateTransactionPayload', transactionId: string | null } };

export type CloseTransactionMutationVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type CloseTransactionMutation = { __typename?: 'Mutation', closeTransaction: { __typename?: 'CloseTransactionPayload', isOk: boolean } };

export type CalculatedDiffQueryVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type CalculatedDiffQuery = { __typename?: 'Query', calculatedDiff: { __typename?: 'CalculatedDiffPayload', result: { __typename?: 'CalculatedDiffResult', createdData: Array<{ __typename?: 'DiffData', path: string, data: string }>, deletedData: Array<{ __typename?: 'DiffData', path: string, data: string }>, updatedData: Array<{ __typename?: 'CalculatedUpdateDiffData', path: string, actualData: string, intendedData: string }> } } };

export type DevicesQueryVariables = Exact<{
  labels?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  deviceName?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<DeviceOrderByInput>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type DevicesQuery = { __typename?: 'Query', devices: { __typename?: 'DeviceConnection', edges: Array<{ __typename?: 'DeviceEdge', node: { __typename?: 'Device', id: string, name: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState, zone: { __typename?: 'Zone', id: string, name: string } } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type InstallDeviceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type InstallDeviceMutation = { __typename?: 'Mutation', installDevice: { __typename?: 'InstallDevicePayload', device: { __typename?: 'Device', id: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState } } };

export type UninstallDeviceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UninstallDeviceMutation = { __typename?: 'Mutation', uninstallDevice: { __typename?: 'UninstallDevicePayload', device: { __typename?: 'Device', id: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState } } };

export type FilterLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FilterLabelsQuery = { __typename?: 'Query', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } };

export type DeleteDeviceMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type DeleteDeviceMutation = { __typename?: 'Mutation', deleteDevice: { __typename?: 'DeleteDevicePayload', device: { __typename?: 'Device', id: string } | null } };

export type BlueprintQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BlueprintQuery = { __typename?: 'Query', blueprint: { __typename?: 'Blueprint', name: string, template: string, id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', id: string } | { __typename?: 'EventHandler', id: string } | { __typename?: 'ExecutedWorkflow', id: string } | { __typename?: 'ExecutedWorkflowTask', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'Pool', id: string } | { __typename?: 'Schedule', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'Zone', id: string } | null };

export type UpdateBlueprintMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateBlueprintInput;
}>;


export type UpdateBlueprintMutation = { __typename?: 'Mutation', updateBlueprint: { __typename?: 'UpdateBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string, name: string, template: string } } };

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeviceQuery = { __typename?: 'Query', device: { __typename?: 'Blueprint', id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', name: string, serviceState: DeviceServiceState, model: string | null, vendor: string | null, address: string | null, deviceSize: DeviceSize, mountParameters: string | null, id: string, zone: { __typename?: 'Zone', id: string, name: string }, labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } | { __typename?: 'EventHandler', id: string } | { __typename?: 'ExecutedWorkflow', id: string } | { __typename?: 'ExecutedWorkflowTask', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'Pool', id: string } | { __typename?: 'Schedule', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'Zone', id: string } | null };

export type UpdateDeviceMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateDeviceInput;
}>;


export type UpdateDeviceMutation = { __typename?: 'Mutation', updateDevice: { __typename?: 'UpdateDevicePayload', device: { __typename?: 'Device', id: string, name: string, model: string | null, vendor: string | null, address: string | null, isInstalled: boolean, zone: { __typename?: 'Zone', id: string, name: string } } | null } };

export type TransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', transactionId: string, lastCommitTime: string, changes: Array<{ __typename?: 'TransactionChange', device: { __typename?: 'Device', id: string, name: string }, diff: Array<{ __typename?: 'TransactionDiff', path: string, dataBefore: string | null, dataAfter: string | null }> }> }> };

export type RevertChangesMutationVariables = Exact<{
  transactionId: Scalars['String'];
}>;


export type RevertChangesMutation = { __typename?: 'Mutation', revertChanges: { __typename?: 'RevertChangesPayload', isOk: boolean } };

export type CloseTransactionListMutationVariables = Exact<{
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type CloseTransactionListMutation = { __typename?: 'Mutation', closeTransaction: { __typename?: 'CloseTransactionPayload', isOk: boolean } };

export type TerminalSubscriptionVariables = Exact<{
  sessionId: Scalars['String'];
  command?: InputMaybe<Scalars['String']>;
  trigger?: InputMaybe<Scalars['Int']>;
}>;


export type TerminalSubscription = { __typename?: 'Subscription', uniconfigShell: string | null };

export type SessionIdQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionIdQuery = { __typename?: 'Query', uniconfigShellSession: string | null };
