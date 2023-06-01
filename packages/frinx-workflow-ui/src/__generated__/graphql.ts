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
  Upload: any;
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
  version: Maybe<Scalars['Int']>;
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
  version: Maybe<Scalars['Int']>;
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
  serviceState: DeviceServiceState;
  source: DeviceSource;
  updatedAt: Scalars['String'];
  vendor: Maybe<Scalars['String']>;
  version: Maybe<Scalars['Int']>;
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
  version: Maybe<Scalars['Int']>;
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
  version: Maybe<Scalars['Int']>;
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

export type FilterDevicesInput = {
  deviceName?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type FilterTopologyInput = {
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type FilterWorkflowsInput = {
  keyword?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
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
  version: Maybe<Scalars['Int']>;
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
  version: Maybe<Scalars['Int']>;
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
  createLabel: CreateLabelPayload;
  createTransaction: CreateTransactionPayload;
  createWorkflow: CreateWorkflowPayload;
  deleteBlueprint: DeleteBlueprintPayload;
  deleteDevice: DeleteDevicePayload;
  deleteLabel: DeleteLabelPayload;
  deleteSchedule: Maybe<IsOkResponse>;
  deleteSnapshot: Maybe<DeleteSnapshotPayload>;
  deleteWorkflow: DeleteWorkflowPayload;
  editWorkflowSchedule: Maybe<Schedule>;
  executeNewWorkflow: Maybe<Scalars['String']>;
  executeWorkflowByName: Maybe<Scalars['String']>;
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


export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
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


export type MutationDeleteLabelArgs = {
  id: Scalars['String'];
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
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
};

export type NetTopology = {
  __typename?: 'NetTopology';
  edges: Array<GraphEdge>;
  nodes: Array<NetNode>;
};

export type Node = {
  id: Scalars['ID'];
  version: Maybe<Scalars['Int']>;
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

export type Query = {
  __typename?: 'Query';
  blueprints: BlueprintConnection;
  calculatedDiff: CalculatedDiffPayload;
  countries: CountryConnection;
  dataStore: Maybe<DataStore>;
  devices: DeviceConnection;
  executedWorkflows: Maybe<ExecutedWorkflowConnection>;
  labels: LabelConnection;
  locations: LocationConnection;
  netTopology: Maybe<NetTopology>;
  node: Maybe<Node>;
  schedules: ScheduleConnection;
  taskDefinitions: Array<TaskDefinition>;
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


export type QueryExecutedWorkflowsArgs = {
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


export type QuerySchedulesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ScheduleFilterInput>;
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
  version: Maybe<Scalars['Int']>;
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
  | 'CREATED_AT'
  | 'NAME';

export type SortDirection =
  | 'ASC'
  | 'DESC';

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

export type TaskDefinition = {
  __typename?: 'TaskDefinition';
  concurrentExecLimit: Maybe<Scalars['Int']>;
  createdAt: Maybe<Scalars['String']>;
  createdBy: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
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

export type Zone = Node & {
  __typename?: 'Zone';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
  version: Maybe<Scalars['Int']>;
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

export type GetSchedulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSchedulesQuery = { __typename?: 'Query', schedules: { __typename?: 'ScheduleConnection', edges: Array<{ __typename?: 'ScheduleEdge', node: { __typename?: 'Schedule', name: string } } | null> } };

export type ExecutedWorkflowDetailQueryVariables = Exact<{
  nodeId: Scalars['ID'];
}>;


export type ExecutedWorkflowDetailQuery = { __typename?: 'Query', node: { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device' } | { __typename?: 'ExecutedWorkflow', id: string, version: number | null, createdBy: string | null, updatedBy: string | null, createdAt: string | null, updatedAt: string | null, status: ExecutedWorkflowStatus | null, parentWorkflowId: string | null, ownerApp: string | null, input: string | null, output: string | null, reasonForIncompletion: string | null, failedReferenceTaskNames: Array<string | null> | null, variables: string | null, lastRetriedTime: string | null, startTime: string | null, endTime: string | null, workflowVersion: number | null, workflowName: string | null, workflowId: string, correlationId: string | null, workflowDefinition: { __typename?: 'Workflow', id: string, version: number | null, timeoutSeconds: number, name: string, description: string | null, createdBy: string | null, updatedBy: string | null, createdAt: string | null, updatedAt: string | null, tasks: string | null, inputParameters: Array<string> | null, hasSchedule: boolean | null, restartable: boolean | null, timeoutPolicy: TimeoutPolicy | null, outputParameters: Array<{ __typename?: 'OutputParameter', key: string, value: string }> | null } | null, tasks: Array<{ __typename?: 'ExecutedWorkflowTask', id: string, version: number | null, taskType: string | null, referenceTaskName: string | null, status: ExecutedWorkflowTaskStatus | null, retryCount: number | null, startTime: string | null, endTime: string | null, updateTime: string | null, scheduledTime: string | null, taskDefName: string | null, workflowType: string | null, retried: boolean | null, executed: boolean | null, taskId: string | null, reasonForIncompletion: string | null, taskDefinition: string | null, subWorkflowId: string | null, inputData: string | null, outputData: string | null, externalOutputPayloadStoragePath: string | null, externalInputPayloadStoragePath: string | null, callbackAfterSeconds: number | null, seq: number | null, pollCount: number | null }> | null } | { __typename?: 'ExecutedWorkflowTask' } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Schedule' } | { __typename?: 'Workflow' } | { __typename?: 'Zone' } | null };

export type ControlExecutedWorkflowSubscriptionVariables = Exact<{
  controlExecutedWorkflowId: Scalars['String'];
}>;


export type ControlExecutedWorkflowSubscription = { __typename?: 'Subscription', controlExecutedWorkflow: { __typename?: 'ExecutedWorkflow', endTime: string | null, startTime: string | null, status: ExecutedWorkflowStatus | null, tasks: Array<{ __typename?: 'ExecutedWorkflowTask', id: string, endTime: string | null, startTime: string | null, updateTime: string | null, status: ExecutedWorkflowTaskStatus | null, taskType: string | null, subWorkflowId: string | null }> | null } | null };

export type ExecuteWorkflowByItsNameMutationVariables = Exact<{
  input: ExecuteWorkflowByName;
}>;


export type ExecuteWorkflowByItsNameMutation = { __typename?: 'Mutation', executeWorkflowByName: string | null };

export type RestartWorkflowMutationVariables = Exact<{
  restartWorkflowId: Scalars['String'];
}>;


export type RestartWorkflowMutation = { __typename?: 'Mutation', restartWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type RetryWorkflowMutationVariables = Exact<{
  retryWorkflowId: Scalars['String'];
  retryWorkflowInput?: InputMaybe<RetryWorkflowInput>;
}>;


export type RetryWorkflowMutation = { __typename?: 'Mutation', retryWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type PauseWorkflowMutationVariables = Exact<{
  pauseWorkflowId: Scalars['String'];
}>;


export type PauseWorkflowMutation = { __typename?: 'Mutation', pauseWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type ResumeWorkflowMutationVariables = Exact<{
  resumeWorkflowId: Scalars['String'];
}>;


export type ResumeWorkflowMutation = { __typename?: 'Mutation', resumeWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type TerminateWorkflowMutationVariables = Exact<{
  terminateWorkflowId: Scalars['String'];
}>;


export type TerminateWorkflowMutation = { __typename?: 'Mutation', terminateWorkflow: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type ExecutedWorkflowsQueryVariables = Exact<{
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
  workflowInstanceDetailId: Scalars['String'];
}>;


export type WorkflowInstanceDetailQuery = { __typename?: 'Query', workflowInstanceDetail: { __typename?: 'WorkflowInstanceDetail', subworkflows: Array<{ __typename?: 'SubWorkflow', executedWorkflowDetail: { __typename?: 'ExecutedWorkflow', id: string, endTime: string | null, startTime: string | null, reasonForIncompletion: string | null, status: ExecutedWorkflowStatus | null, workflowId: string, workflowName: string | null, workflowVersion: number | null } }> | null } | null };

export type WorkflowListQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkflowListQuery = { __typename?: 'Query', workflows: { __typename?: 'WorkflowConnection', edges: Array<{ __typename?: 'WorkflowEdge', node: { __typename?: 'Workflow', id: string, name: string, description: string | null, version: number | null, createdAt: string | null, updatedAt: string | null, createdBy: string | null, updatedBy: string | null, tasks: string | null, hasSchedule: boolean | null, inputParameters: Array<string> | null } }> } };

export type SchedulesQueryVariables = Exact<{ [key: string]: never; }>;


export type SchedulesQuery = { __typename?: 'Query', schedules: { __typename?: 'ScheduleConnection', totalCount: number, edges: Array<{ __typename?: 'ScheduleEdge', node: { __typename?: 'Schedule', id: string, name: string, workflowName: string, workflowVersion: string, cronString: string, workflowContext: string, isEnabled: boolean, performFromDate: string, performTillDate: string, parallelRuns: boolean, status: ScheduleStatus } } | null>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type DeleteScheduleMutationVariables = Exact<{
  deleteScheduleId: Scalars['String'];
}>;


export type DeleteScheduleMutation = { __typename?: 'Mutation', deleteSchedule: { __typename?: 'IsOkResponse', isOk: boolean } | null };

export type EditWorkflowScheduleMutationVariables = Exact<{
  input: EditWorkflowScheduleInput;
  editWorkflowScheduleId: Scalars['String'];
}>;


export type EditWorkflowScheduleMutation = { __typename?: 'Mutation', editWorkflowSchedule: { __typename?: 'Schedule', name: string, workflowName: string, workflowVersion: string, cronString: string, workflowContext: string, isEnabled: boolean, performFromDate: string, performTillDate: string, parallelRuns: boolean } | null };

export type ExecuteWorkflowDefinitionMutationVariables = Exact<{
  input: ExecuteWorkflowByName;
}>;


export type ExecuteWorkflowDefinitionMutation = { __typename?: 'Mutation', executeWorkflowByName: string | null };

export type ScheduleWorkflowMutationVariables = Exact<{
  input: CreateScheduleInput;
}>;


export type ScheduleWorkflowMutation = { __typename?: 'Mutation', scheduleWorkflow: { __typename?: 'Schedule', name: string, isEnabled: boolean, workflowName: string, workflowVersion: string, cronString: string, workflowContext: string, performFromDate: string, performTillDate: string } | null };

export type WorkflowsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<FilterWorkflowsInput>;
}>;


export type WorkflowsQuery = { __typename?: 'Query', workflows: { __typename?: 'WorkflowConnection', totalCount: number, edges: Array<{ __typename?: 'WorkflowEdge', node: { __typename?: 'Workflow', id: string, name: string, description: string | null, version: number | null, createdAt: string | null, updatedAt: string | null, createdBy: string | null, updatedBy: string | null, tasks: string | null, hasSchedule: boolean | null, inputParameters: Array<string> | null, restartable: boolean | null, timeoutSeconds: number, timeoutPolicy: TimeoutPolicy | null, outputParameters: Array<{ __typename?: 'OutputParameter', key: string, value: string }> | null } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type WorkflowLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkflowLabelsQuery = { __typename?: 'Query', workflowLabels: Array<string> };

export type DeleteWorkflowMutationVariables = Exact<{
  input: DeleteWorkflowInput;
}>;


export type DeleteWorkflowMutation = { __typename?: 'Mutation', deleteWorkflow: { __typename?: 'DeleteWorkflowPayload', workflow: { __typename?: 'Workflow', id: string } } };
