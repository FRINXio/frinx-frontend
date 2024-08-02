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
  BigInt: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Map: { input: any; output: any; }
  ObjMap: { input: any; output: any; }
  Upload: { input: any; output: any; }
  Void: { input: any; output: any; }
};

export type Action = {
  __typename?: 'Action';
  action: Maybe<MutationInput_UpdateEventHandler_Input_Actions_Items_Action>;
  complete_task: Maybe<TaskDetails>;
  expandInlineJSON: Maybe<Scalars['Boolean']['output']>;
  fail_task: Maybe<TaskDetails>;
  start_workflow: Maybe<StartWorkflow>;
};

export type ActionWorkflowPayload = {
  __typename?: 'ActionWorkflowPayload';
  workflow: Maybe<Workflow>;
};

export type Action_Input = {
  action?: InputMaybe<MutationInput_UpdateEventHandler_Input_Actions_Items_Action>;
  complete_task?: InputMaybe<TaskDetails_Input>;
  expandInlineJSON?: InputMaybe<Scalars['Boolean']['input']>;
  fail_task?: InputMaybe<TaskDetails_Input>;
  start_workflow?: InputMaybe<StartWorkflow_Input>;
};

export type ActivateStreamPayload = {
  __typename?: 'ActivateStreamPayload';
  stream: Stream;
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
  locationId?: InputMaybe<Scalars['String']['input']>;
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
  coordinates: Coordinates;
  countryId?: InputMaybe<Scalars['String']['input']>;
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

export type AddStreamInput = {
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  deviceName: Scalars['String']['input'];
  streamName: Scalars['String']['input'];
  streamParameters?: InputMaybe<Scalars['String']['input']>;
};

export type AddStreamPayload = {
  __typename?: 'AddStreamPayload';
  stream: Stream;
};

export type AddZoneInput = {
  name: Scalars['String']['input'];
};

export type AddZonePayload = {
  __typename?: 'AddZonePayload';
  zone: Zone;
};

/** Represents an allocation strategy */
export type AllocationStrategy = Node & {
  __typename?: 'AllocationStrategy';
  Description: Maybe<Scalars['String']['output']>;
  Lang: AllocationStrategyLang;
  Name: Scalars['String']['output'];
  Script: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

/** Supported languages for allocation strategy scripts */
export type AllocationStrategyLang =
  | 'go'
  | 'js'
  | 'py';

export type ApiEventHandler = {
  __typename?: 'ApiEventHandler';
  actions: Array<Maybe<Action>>;
  active: Maybe<Scalars['Boolean']['output']>;
  condition: Maybe<Scalars['String']['output']>;
  evaluatorType: Maybe<Scalars['String']['output']>;
  event: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ApiWorkflow = {
  __typename?: 'ApiWorkflow';
  completedWithErrors: Maybe<Scalars['Boolean']['output']>;
  correlationId: Maybe<Scalars['String']['output']>;
  createTime: Maybe<Scalars['BigInt']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['BigInt']['output']>;
  event: Maybe<Scalars['String']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  failedReferenceTaskNames: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  failedTaskNames: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  input: Maybe<Scalars['JSON']['output']>;
  lastRetriedTime: Maybe<Scalars['BigInt']['output']>;
  output: Maybe<Scalars['JSON']['output']>;
  ownerApp: Maybe<Scalars['String']['output']>;
  parentWorkflowId: Maybe<Scalars['String']['output']>;
  parentWorkflowTaskId: Maybe<Scalars['String']['output']>;
  priority: Maybe<Scalars['Int']['output']>;
  reRunFromWorkflowId: Maybe<Scalars['String']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  startTime: Maybe<Scalars['BigInt']['output']>;
  status: Maybe<Mutation_GetWorkflows_AdditionalProperties_Items_Status>;
  taskToDomain: Maybe<Scalars['JSON']['output']>;
  tasks: Maybe<Array<Maybe<Task>>>;
  updateTime: Maybe<Scalars['BigInt']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['JSON']['output']>;
  workflowDefinition: Maybe<WorkflowDef>;
  workflowId: Maybe<Scalars['String']['output']>;
  workflowName: Maybe<Scalars['String']['output']>;
  workflowVersion: Maybe<Scalars['Int']['output']>;
};

export type ApiWorkflowTask = {
  __typename?: 'ApiWorkflowTask';
  asyncComplete: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated deprecated */
  caseExpression: Maybe<Scalars['String']['output']>;
  /** @deprecated deprecated */
  caseValueParam: Maybe<Scalars['String']['output']>;
  decisionCases: Maybe<Scalars['JSON']['output']>;
  defaultCase: Maybe<Array<Maybe<ApiWorkflowTask>>>;
  defaultExclusiveJoinTask: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  description: Maybe<Scalars['String']['output']>;
  /** @deprecated deprecated */
  dynamicForkJoinTasksParam: Maybe<Scalars['String']['output']>;
  dynamicForkTasksInputParamName: Maybe<Scalars['String']['output']>;
  dynamicForkTasksParam: Maybe<Scalars['String']['output']>;
  dynamicTaskNameParam: Maybe<Scalars['String']['output']>;
  evaluatorType: Maybe<Scalars['String']['output']>;
  expression: Maybe<Scalars['String']['output']>;
  forkTasks: Maybe<Array<Maybe<Array<Maybe<ApiWorkflowTask>>>>>;
  inputParameters: Maybe<Scalars['JSON']['output']>;
  joinOn: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  loopCondition: Maybe<Scalars['String']['output']>;
  loopOver: Maybe<Array<Maybe<ApiWorkflowTask>>>;
  name: Scalars['String']['output'];
  optional: Maybe<Scalars['Boolean']['output']>;
  rateLimited: Maybe<Scalars['Boolean']['output']>;
  retryCount: Maybe<Scalars['Int']['output']>;
  scriptExpression: Maybe<Scalars['String']['output']>;
  sink: Maybe<Scalars['String']['output']>;
  startDelay: Maybe<Scalars['Int']['output']>;
  subWorkflowParam: Maybe<SubWorkflowParams>;
  taskDefinition: Maybe<TaskDef>;
  taskReferenceName: Scalars['String']['output'];
  type: Maybe<Scalars['String']['output']>;
  workflowTaskType: Maybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_WorkflowTaskType>;
};

export type ApplySnapshotInput = {
  deviceId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ApplySnapshotPayload = {
  __typename?: 'ApplySnapshotPayload';
  isOk: Scalars['Boolean']['output'];
};

export type BaseGraphNode = {
  coordinates: GraphNodeCoordinates;
  deviceType: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfaces: Array<GraphNodeInterface>;
  softwareVersion: Maybe<Scalars['String']['output']>;
};

export type BaseWorkflowDefinition = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  version: Scalars['Int']['output'];
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
  deviceIds: Array<Scalars['String']['input']>;
};

export type BulkInstallStreamPayload = {
  __typename?: 'BulkInstallStreamPayload';
  installedStreams: Array<Stream>;
};

export type BulkInstallStreamsInput = {
  streamIds: Array<Scalars['String']['input']>;
};

export type BulkResponse = {
  __typename?: 'BulkResponse';
  bulkErrorResults: Maybe<Scalars['JSON']['output']>;
  bulkSuccessfulResults: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type BulkUninstallDevicePayload = {
  __typename?: 'BulkUninstallDevicePayload';
  uninstalledDevices: Array<Device>;
};

export type BulkUninstallDevicesInput = {
  deviceIds: Array<Scalars['String']['input']>;
};

export type BulkUninstallStreamPayload = {
  __typename?: 'BulkUninstallStreamPayload';
  uninstalledStreams: Array<Stream>;
};

export type BulkUninstallStreamsInput = {
  streamIds: Array<Scalars['String']['input']>;
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

export type ConductorSubscription = {
  __typename?: 'ConductorSubscription';
  controlExecutedWorkflow: Workflow;
};


export type ConductorSubscriptionControlExecutedWorkflowArgs = {
  workflowId: Scalars['String']['input'];
};

export type Coordinates = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
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

/** Input parameters for creating an allocation pool */
export type CreateAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  poolProperties: Scalars['Map']['input'];
  poolPropertyTypes: Scalars['Map']['input'];
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating an allocating pool */
export type CreateAllocatingPoolPayload = {
  __typename?: 'CreateAllocatingPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a new allocation strategy */
export type CreateAllocationStrategyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expectedPoolPropertyTypes?: InputMaybe<Scalars['Map']['input']>;
  lang: AllocationStrategyLang;
  name: Scalars['String']['input'];
  script: Scalars['String']['input'];
};

/** Output of creating a new allocation strategy */
export type CreateAllocationStrategyPayload = {
  __typename?: 'CreateAllocationStrategyPayload';
  strategy: Maybe<AllocationStrategy>;
};

export type CreateEventHandlerInput = {
  actions: Array<EventHandlerActionInput>;
  condition?: InputMaybe<Scalars['String']['input']>;
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type CreateEventHandlerPayload = {
  __typename?: 'CreateEventHandlerPayload';
  eventHandler: Maybe<EventHandler>;
};

export type CreateLabelInput = {
  name: Scalars['String']['input'];
};

export type CreateLabelPayload = {
  __typename?: 'CreateLabelPayload';
  label: Maybe<Label>;
};

/** Input parameters for creating a nested allocation pool */
export type CreateNestedAllocatingPoolInput = {
  allocationStrategyId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  parentResourceId: Scalars['ID']['input'];
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a nested allocating pool */
export type CreateNestedAllocatingPoolPayload = {
  __typename?: 'CreateNestedAllocatingPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested set pool */
export type CreateNestedSetPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  parentResourceId: Scalars['ID']['input'];
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  poolValues: Array<InputMaybe<Scalars['Map']['input']>>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a nested set pool */
export type CreateNestedSetPoolPayload = {
  __typename?: 'CreateNestedSetPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a nested singleton pool */
export type CreateNestedSingletonPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  parentResourceId: Scalars['ID']['input'];
  poolName: Scalars['String']['input'];
  poolValues: Array<InputMaybe<Scalars['Map']['input']>>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a nested singleton pool */
export type CreateNestedSingletonPoolPayload = {
  __typename?: 'CreateNestedSingletonPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Creating a new resource-type */
export type CreateResourceTypeInput = {
  /** name of the resource type AND property type (should they be different?) */
  resourceName: Scalars['String']['input'];
  /** resourceProperties: Map! - for key "init" the value is the initial value of the property type (like 7) - for key "type" the value is the name of the type like "int" */
  resourceProperties: Scalars['Map']['input'];
};

/** Output of creating a new resource-type */
export type CreateResourceTypePayload = {
  __typename?: 'CreateResourceTypePayload';
  resourceType: ResourceType;
};

export type CreateScheduleInput = {
  cronString: Scalars['String']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  parallelRuns?: InputMaybe<Scalars['Boolean']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
  workflowContext?: InputMaybe<Scalars['String']['input']>;
  workflowName: Scalars['String']['input'];
  workflowVersion: Scalars['String']['input'];
};

/** Input parameters for creating a set pool */
export type CreateSetPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  poolDealocationSafetyPeriod: Scalars['Int']['input'];
  poolName: Scalars['String']['input'];
  poolValues: Array<Scalars['Map']['input']>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating set pool */
export type CreateSetPoolPayload = {
  __typename?: 'CreateSetPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a singleton pool */
export type CreateSingletonPoolInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  poolName: Scalars['String']['input'];
  poolValues: Array<Scalars['Map']['input']>;
  resourceTypeId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Output of creating a singleton pool */
export type CreateSingletonPoolPayload = {
  __typename?: 'CreateSingletonPoolPayload';
  pool: Maybe<ResourcePool>;
};

/** Input parameters for creating a new tag */
export type CreateTagInput = {
  tagText: Scalars['String']['input'];
};

/** Output of creating a tag */
export type CreateTagPayload = {
  __typename?: 'CreateTagPayload';
  tag: Maybe<Tag>;
};

export type CreateTransactionPayload = {
  __typename?: 'CreateTransactionPayload';
  transactionId: Maybe<Scalars['String']['output']>;
};

export type CreateWorkflowDefinitionInput = {
  workflowDefinition: WorkflowDefinitionInput;
};

export type DataStore = {
  __typename?: 'DataStore';
  config: Scalars['String']['output'];
  operational: Scalars['String']['output'];
  snapshots: Array<Snapshot>;
};

export type DeactivateStreamPayload = {
  __typename?: 'DeactivateStreamPayload';
  stream: Stream;
};

/** Input parameters for deleting an existing allocation strategy */
export type DeleteAllocationStrategyInput = {
  allocationStrategyId: Scalars['ID']['input'];
};

/** Output of deleting an existing allocation strategy */
export type DeleteAllocationStrategyPayload = {
  __typename?: 'DeleteAllocationStrategyPayload';
  strategy: Maybe<AllocationStrategy>;
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

/** Input entity for deleting a pool */
export type DeleteResourcePoolInput = {
  resourcePoolId: Scalars['ID']['input'];
};

/** Output entity for deleting a pool */
export type DeleteResourcePoolPayload = {
  __typename?: 'DeleteResourcePoolPayload';
  resourcePoolId: Scalars['ID']['output'];
};

/** Input parameters for deleting an existing resource-type */
export type DeleteResourceTypeInput = {
  resourceTypeId: Scalars['ID']['input'];
};

/** Output of deleting a resource-type */
export type DeleteResourceTypePayload = {
  __typename?: 'DeleteResourceTypePayload';
  resourceTypeId: Scalars['ID']['output'];
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

export type DeleteStreamPayload = {
  __typename?: 'DeleteStreamPayload';
  stream: Maybe<Stream>;
};

/** Input parameters for deleting an existing tag */
export type DeleteTagInput = {
  tagId: Scalars['ID']['input'];
};

/** Output of deleting a tag */
export type DeleteTagPayload = {
  __typename?: 'DeleteTagPayload';
  tagId: Scalars['ID']['output'];
};

export type DeleteWorkflowDefinitionInput = {
  name: Scalars['String']['input'];
  version: Scalars['Int']['input'];
};

export type DeleteWorkflowDefinitionPayload = {
  __typename?: 'DeleteWorkflowDefinitionPayload';
  workflowDefinition: Maybe<WorkflowDefinition>;
};

export type Device = Node & {
  __typename?: 'Device';
  address: Maybe<Scalars['String']['output']>;
  blueprint: Maybe<Blueprint>;
  createdAt: Scalars['String']['output'];
  deviceSize: DeviceSize;
  discoveredAt: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isInstalled: Scalars['Boolean']['output'];
  labels: LabelConnection;
  location: Maybe<Location>;
  model: Maybe<Scalars['String']['output']>;
  mountParameters: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  port: Maybe<Scalars['Int']['output']>;
  serviceState: DeviceServiceState;
  software: Maybe<Scalars['String']['output']>;
  source: DeviceSource;
  updatedAt: Scalars['String']['output'];
  vendor: Maybe<Scalars['String']['output']>;
  version: Maybe<Scalars['String']['output']>;
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

export type DeviceDiscoveryPayload = {
  __typename?: 'DeviceDiscoveryPayload';
  deviceId: Scalars['String']['output'];
  discoveredAt: Maybe<Scalars['String']['output']>;
};

export type DeviceEdge = {
  __typename?: 'DeviceEdge';
  cursor: Scalars['String']['output'];
  node: Device;
};

export type DeviceListUsage = {
  __typename?: 'DeviceListUsage';
  devicesUsage: Array<DevicesUsage>;
};

export type DeviceMetadata = {
  __typename?: 'DeviceMetadata';
  nodes: Maybe<Array<Maybe<GeoMapDevice>>>;
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

export type DeviceStatus = {
  __typename?: 'DeviceStatus';
  deviceName: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
};

export type DeviceUsage = {
  __typename?: 'DeviceUsage';
  cpuLoad: Maybe<Scalars['Float']['output']>;
  memoryLoad: Maybe<Scalars['Float']['output']>;
};

export type DevicesConnection = {
  __typename?: 'DevicesConnection';
  deviceStatuses: Maybe<Array<Maybe<DeviceStatus>>>;
};

export type DevicesUsage = {
  __typename?: 'DevicesUsage';
  cpuLoad: Maybe<Scalars['Float']['output']>;
  deviceName: Scalars['String']['output'];
  memoryLoad: Maybe<Scalars['Float']['output']>;
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

export type EditEventHandlerInput = {
  actions?: InputMaybe<Array<EventHandlerActionInput>>;
  condition?: InputMaybe<Scalars['String']['input']>;
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EditEventHandlerPayload = {
  __typename?: 'EditEventHandlerPayload';
  eventHandler: Maybe<EventHandler>;
};

export type EventHandler = Node & {
  __typename?: 'EventHandler';
  actions: Array<Maybe<EventHandlerAction>>;
  condition: Maybe<Scalars['String']['output']>;
  evaluatorType: Maybe<Scalars['String']['output']>;
  event: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type EventHandlerAction = {
  __typename?: 'EventHandlerAction';
  action: Maybe<MutationInput_UpdateEventHandler_Input_Actions_Items_Action>;
  completeTask: Maybe<TaskDetails>;
  expandInlineJSON: Maybe<Scalars['JSON']['output']>;
  failTask: Maybe<TaskDetails>;
  startWorkflow: Maybe<StartWorkflow>;
};

export type EventHandlerActionInput = {
  action?: InputMaybe<MutationInput_UpdateEventHandler_Input_Actions_Items_Action>;
  completeTask?: InputMaybe<TaskDetails_Input>;
  expandInlineJSON?: InputMaybe<Scalars['JSON']['input']>;
  failTask?: InputMaybe<TaskDetails_Input>;
  startWorkflow?: InputMaybe<StartWorkflow_Input>;
};

export type EventHandlerConnection = {
  __typename?: 'EventHandlerConnection';
  edges: Array<EventHandlerEdge>;
  pageInfo: PageInfo;
};

export type EventHandlerEdge = {
  __typename?: 'EventHandlerEdge';
  cursor: Scalars['String']['output'];
  node: EventHandler;
};

export type EventHandler_Input = {
  actions: Array<InputMaybe<Action_Input>>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  condition?: InputMaybe<Scalars['String']['input']>;
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  event: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type EventHandlersOrderByInput = {
  direction: SortDirection;
  sortKey: SortEventHandlersBy;
};

export type ExecuteWorkflowByNameInput = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  /** JSON string of input parameters */
  inputParameters: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  workflowName: Scalars['String']['input'];
  workflowVersion?: InputMaybe<Scalars['Int']['input']>;
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
  node: Workflow;
};

export type ExecutedWorkflowFilterInput = {
  startTime?: InputMaybe<ExecutedWorkflowStartTimeRange>;
  status?: InputMaybe<Array<WorkflowStatus>>;
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

export type ExecutedWorkflowsOrderByInput = {
  direction: SortExecutedWorkflowsDirection;
  sortKey: SortExecutedWorkflowsBy;
};

export type ExternalStorageLocation = {
  __typename?: 'ExternalStorageLocation';
  path: Maybe<Scalars['String']['output']>;
  uri: Maybe<Scalars['String']['output']>;
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

export type FilterStreamsInput = {
  deviceName?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
  streamName?: InputMaybe<Scalars['String']['input']>;
};

export type FilterTaskDefinitionsInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
};

export type FilterTopologyInput = {
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FilterZonesInput = {
  name: Scalars['String']['input'];
};

export type GeoMapDevice = {
  __typename?: 'GeoMapDevice';
  deviceName: Scalars['String']['output'];
  geolocation: Maybe<Geolocation>;
  id: Scalars['ID']['output'];
};

export type Geolocation = {
  __typename?: 'Geolocation';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
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
  device: Maybe<Device>;
  deviceType: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfaces: Array<GraphNodeInterface>;
  name: Scalars['String']['output'];
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

export type HttpMethod =
  | 'CONNECT'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'TRACE';

export type Health = {
  __typename?: 'Health';
  details: Maybe<Scalars['JSON']['output']>;
  errorMessage: Maybe<Scalars['String']['output']>;
  healthy: Maybe<Scalars['Boolean']['output']>;
};

export type HealthCheckStatus = {
  __typename?: 'HealthCheckStatus';
  healthResults: Maybe<Array<Maybe<Health>>>;
  healthy: Maybe<Scalars['Boolean']['output']>;
  suppressedHealthResults: Maybe<Array<Maybe<Health>>>;
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
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latitude: Maybe<Scalars['Float']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
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
  conductor: ConductorMutation;
  deviceInventory: DeviceInventoryMutation;
  resourceManager: ResourceManagerMutation;
  scheduler: SchedulerMutation;
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

export type NetTopologyVersionData = {
  __typename?: 'NetTopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<NetNode>;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type OrderDirection =
  | 'ASC'
  | 'DESC';

export type OutputParameters = {
  __typename?: 'OutputParameters';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
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

export type PhyTopologyVersionData = {
  __typename?: 'PhyTopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<GraphVersionNode>;
};

export type PollData = {
  __typename?: 'PollData';
  domain: Maybe<Scalars['String']['output']>;
  lastPollTime: Maybe<Scalars['BigInt']['output']>;
  queueName: Maybe<Scalars['String']['output']>;
  workerId: Maybe<Scalars['String']['output']>;
};

/** Entity representing capacity of a pool */
export type PoolCapacityPayload = {
  __typename?: 'PoolCapacityPayload';
  freeCapacity: Scalars['String']['output'];
  utilizedCapacity: Scalars['String']['output'];
};

/** Defines the type of pool */
export type PoolType =
  | 'allocating'
  | 'set'
  | 'singleton';

/** Defines the type of the property */
export type PropertyType = Node & {
  __typename?: 'PropertyType';
  FloatVal: Maybe<Scalars['Float']['output']>;
  IntVal: Maybe<Scalars['Int']['output']>;
  Mandatory: Maybe<Scalars['Boolean']['output']>;
  Name: Scalars['String']['output'];
  StringVal: Maybe<Scalars['String']['output']>;
  Type: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type PtpDeviceDetails = {
  __typename?: 'PtpDeviceDetails';
  clockAccuracy: Maybe<Scalars['String']['output']>;
  clockClass: Maybe<Scalars['Int']['output']>;
  clockId: Maybe<Scalars['String']['output']>;
  clockType: Maybe<Scalars['String']['output']>;
  clockVariance: Maybe<Scalars['String']['output']>;
  domain: Maybe<Scalars['Int']['output']>;
  globalPriority: Maybe<Scalars['Int']['output']>;
  gmClockId: Maybe<Scalars['String']['output']>;
  parentClockId: Maybe<Scalars['String']['output']>;
  ptpProfile: Maybe<Scalars['String']['output']>;
  timeRecoveryStatus: Maybe<Scalars['String']['output']>;
  userPriority: Maybe<Scalars['Int']['output']>;
};

export type PtpDiffSynce = {
  __typename?: 'PtpDiffSynce';
  edges: Array<PtpDiffSynceEdges>;
};

export type PtpDiffSynceEdges = {
  __typename?: 'PtpDiffSynceEdges';
  node: PtpDiffSynceNode;
};

export type PtpDiffSynceNode = {
  __typename?: 'PtpDiffSynceNode';
  id: Scalars['String']['output'];
};

export type PtpGraphNode = {
  __typename?: 'PtpGraphNode';
  coordinates: GraphNodeCoordinates;
  id: Scalars['ID']['output'];
  interfaces: Array<PtpGraphNodeInterface>;
  labels: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
  ptpDeviceDetails: PtpDeviceDetails;
  status: GraphEdgeStatus;
};

export type PtpGraphNodeInterface = {
  __typename?: 'PtpGraphNodeInterface';
  details: Maybe<PtpGraphNodeInterfaceDetails>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: GraphEdgeStatus;
};

export type PtpGraphNodeInterfaceDetails = {
  __typename?: 'PtpGraphNodeInterfaceDetails';
  adminOperStatus: Scalars['String']['output'];
  ptpStatus: Scalars['String']['output'];
  ptsfUnusable: Scalars['String']['output'];
};

export type PtpTopology = {
  __typename?: 'PtpTopology';
  edges: Array<GraphEdge>;
  nodes: Array<PtpGraphNode>;
};

export type PtpTopologyVersionData = {
  __typename?: 'PtpTopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<PtpGraphNode>;
};

export type Query = {
  __typename?: 'Query';
  conductor: ConductorQuery;
  deviceInventory: DeviceInventoryQuery;
  resourceManager: ResourceManagerQuery;
  scheduler: SchedulerQuery;
};

export type RerunWorkflowRequest_Input = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  reRunFromTaskId?: InputMaybe<Scalars['String']['input']>;
  reRunFromWorkflowId?: InputMaybe<Scalars['String']['input']>;
  taskInput?: InputMaybe<Scalars['JSON']['input']>;
  workflowInput?: InputMaybe<Scalars['JSON']['input']>;
};

export type ResetConfigPayload = {
  __typename?: 'ResetConfigPayload';
  dataStore: DataStore;
};

/** Represents an allocated resource */
export type Resource = Node & {
  __typename?: 'Resource';
  AlternativeId: Maybe<Scalars['Map']['output']>;
  Description: Maybe<Scalars['String']['output']>;
  NestedPool: Maybe<ResourcePool>;
  ParentPool: ResourcePool;
  Properties: Scalars['Map']['output'];
  id: Scalars['ID']['output'];
};

/** A Relay-specific entity holding information about pagination */
export type ResourceConnection = {
  __typename?: 'ResourceConnection';
  edges: Array<Maybe<ResourceEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** A Relay-specific entity that holds information about the requested pagination page */
export type ResourceEdge = {
  __typename?: 'ResourceEdge';
  cursor: Scalars['Cursor']['output'];
  node: Resource;
};

/** Alternative representation of identity of a resource (i.e. alternative to resource ID) */
export type ResourceInput = {
  Properties: Scalars['Map']['input'];
  Status: Scalars['String']['input'];
  UpdatedAt: Scalars['String']['input'];
};

/** A pool is an entity that contains allocated and free resources */
export type ResourcePool = Node & {
  __typename?: 'ResourcePool';
  AllocationStrategy: Maybe<AllocationStrategy>;
  Capacity: Maybe<PoolCapacityPayload>;
  DealocationSafetyPeriod: Scalars['Int']['output'];
  Name: Scalars['String']['output'];
  ParentResource: Maybe<Resource>;
  PoolProperties: Scalars['Map']['output'];
  PoolType: PoolType;
  ResourceType: ResourceType;
  Resources: Array<Resource>;
  Tags: Array<Tag>;
  allocatedResources: Maybe<ResourceConnection>;
  id: Scalars['ID']['output'];
};


/** A pool is an entity that contains allocated and free resources */
export type ResourcePoolAllocatedResourcesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ResourcePoolConnection = {
  __typename?: 'ResourcePoolConnection';
  edges: Array<Maybe<ResourcePoolEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ResourcePoolEdge = {
  __typename?: 'ResourcePoolEdge';
  cursor: Scalars['Cursor']['output'];
  node: ResourcePool;
};

/** Convenience entity representing the identity of a pool in some calls */
export type ResourcePoolInput = {
  ResourcePoolID: Scalars['ID']['input'];
  ResourcePoolName: Scalars['String']['input'];
  poolProperties: Scalars['Map']['input'];
};

export type ResourcePoolOrderField =
  | 'dealocationSafetyPeriod'
  | 'name';

/** Describes the properties of a resource */
export type ResourceType = Node & {
  __typename?: 'ResourceType';
  Name: Scalars['String']['output'];
  Pools: Array<ResourcePool>;
  PropertyTypes: Array<PropertyType>;
  id: Scalars['ID']['output'];
};

export type RetryLogic =
  | 'EXPONENTIAL_BACKOFF'
  | 'FIXED'
  | 'LINEAR_BACKOFF';

export type RevertChangesPayload = {
  __typename?: 'RevertChangesPayload';
  isOk: Scalars['Boolean']['output'];
};

export type Schedule = {
  __typename?: 'Schedule';
  cronString: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  fromDate: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  parallelRuns: Scalars['Boolean']['output'];
  status: Status;
  toDate: Scalars['DateTime']['output'];
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

export type SchedulesFilterInput = {
  workflowName: Scalars['String']['input'];
  workflowVersion: Scalars['String']['input'];
};

export type SearchResultTask = {
  __typename?: 'SearchResultTask';
  results: Maybe<Array<Maybe<Task>>>;
  totalHits: Maybe<Scalars['BigInt']['output']>;
};

export type SearchResultTaskSummary = {
  __typename?: 'SearchResultTaskSummary';
  results: Maybe<Array<Maybe<TaskSummary>>>;
  totalHits: Maybe<Scalars['BigInt']['output']>;
};

export type SearchResultWorkflow = {
  __typename?: 'SearchResultWorkflow';
  results: Maybe<Array<Maybe<ApiWorkflow>>>;
  totalHits: Maybe<Scalars['BigInt']['output']>;
};

export type SearchResultWorkflowSummary = {
  __typename?: 'SearchResultWorkflowSummary';
  results: Maybe<Array<Maybe<WorkflowSummary>>>;
  totalHits: Maybe<Scalars['BigInt']['output']>;
};

export type SkipTaskRequest_Input = {
  taskInput?: InputMaybe<Scalars['JSON']['input']>;
  taskOutput?: InputMaybe<Scalars['JSON']['input']>;
};

export type Snapshot = {
  __typename?: 'Snapshot';
  createdAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SortDeviceBy =
  | 'discoveredAt'
  | 'modelVersion'
  | 'name';

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

export type SortResourcePoolsInput = {
  direction: OrderDirection;
  field?: InputMaybe<ResourcePoolOrderField>;
};

export type SortStreamBy =
  | 'createdAt'
  | 'deviceName'
  | 'streamName';

export type SortTasksBy = {
  _fake?: InputMaybe<Scalars['String']['input']>;
};

export type SortWorkflowsBy =
  | 'name';

export type StartWorkflow = {
  __typename?: 'StartWorkflow';
  correlationId: Maybe<Scalars['String']['output']>;
  input: Maybe<Scalars['JSON']['output']>;
  name: Maybe<Scalars['String']['output']>;
  taskToDomain: Maybe<Scalars['JSON']['output']>;
  version: Maybe<Scalars['Int']['output']>;
};

export type StartWorkflowRequest_Input = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  externalInputPayloadStoragePath?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  taskToDomain?: InputMaybe<Scalars['JSON']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
  workflowDef?: InputMaybe<WorkflowDef_Input>;
};

export type StartWorkflow_Input = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  taskToDomain?: InputMaybe<Scalars['JSON']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type Status =
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'RUNNING'
  | 'TERMINATED'
  | 'TIMED_OUT'
  | 'UNKNOWN';

export type Stream = Node & {
  __typename?: 'Stream';
  blueprint: Maybe<Blueprint>;
  createdAt: Scalars['String']['output'];
  deviceName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  startedAt: Maybe<Scalars['String']['output']>;
  stoppedAt: Maybe<Scalars['String']['output']>;
  streamName: Scalars['String']['output'];
  streamParameters: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type StreamConnection = {
  __typename?: 'StreamConnection';
  edges: Array<StreamEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StreamEdge = {
  __typename?: 'StreamEdge';
  cursor: Scalars['String']['output'];
  node: Stream;
};

export type StreamOrderByInput = {
  direction: SortDirection;
  sortKey: SortStreamBy;
};

export type SubWorkflowParams = {
  __typename?: 'SubWorkflowParams';
  name: Scalars['String']['output'];
  taskToDomain: Maybe<Scalars['JSON']['output']>;
  version: Maybe<Scalars['Int']['output']>;
  workflowDefinition: Maybe<WorkflowDef>;
};

export type SubWorkflowParams_Input = {
  name: Scalars['String']['input'];
  taskToDomain?: InputMaybe<Scalars['JSON']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
  workflowDefinition?: InputMaybe<WorkflowDef_Input>;
};

export type Subscription = {
  __typename?: 'Subscription';
  conductor: ConductorSubscription;
  deviceInventory: DeviceInventorySubscription;
};

export type Subworkflow = {
  __typename?: 'Subworkflow';
  executedWorkflowDetail: Maybe<Workflow>;
  referenceTaskName: Maybe<Scalars['String']['output']>;
  workflowDetail: Maybe<WorkflowDefinition>;
};

export type SyncFromNetworkPayload = {
  __typename?: 'SyncFromNetworkPayload';
  dataStore: Maybe<DataStore>;
};

export type SynceDeviceDetails = {
  __typename?: 'SynceDeviceDetails';
  selectedForUse: Maybe<Scalars['String']['output']>;
};

export type SynceGraphNode = {
  __typename?: 'SynceGraphNode';
  coordinates: GraphNodeCoordinates;
  id: Scalars['ID']['output'];
  interfaces: Array<SynceGraphNodeInterface>;
  labels: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
  status: GraphEdgeStatus;
  synceDeviceDetails: SynceDeviceDetails;
};

export type SynceGraphNodeInterface = {
  __typename?: 'SynceGraphNodeInterface';
  details: Maybe<SynceGraphNodeInterfaceDetails>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: GraphEdgeStatus;
};

export type SynceGraphNodeInterfaceDetails = {
  __typename?: 'SynceGraphNodeInterfaceDetails';
  notQualifiedDueTo: Maybe<Scalars['String']['output']>;
  notSelectedDueTo: Maybe<Scalars['String']['output']>;
  qualifiedForUse: Maybe<Scalars['String']['output']>;
  rxQualityLevel: Maybe<Scalars['String']['output']>;
  synceEnabled: Maybe<Scalars['Boolean']['output']>;
};

export type SynceTopology = {
  __typename?: 'SynceTopology';
  edges: Array<GraphEdge>;
  nodes: Array<SynceGraphNode>;
};

export type SynceTopologyVersionData = {
  __typename?: 'SynceTopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<SynceGraphNode>;
};

/** Pools can be tagged for easier search */
export type Tag = Node & {
  __typename?: 'Tag';
  Pools: Maybe<Array<Maybe<ResourcePool>>>;
  Tag: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

/** Helper entities for tag search */
export type TagAnd = {
  matchesAll: Array<Scalars['String']['input']>;
};

/** Helper entities for tag search */
export type TagOr = {
  matchesAny: Array<TagAnd>;
};

/** Input parameters for a call adding a tag to pool */
export type TagPoolInput = {
  poolId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};

/** Output of adding a specific tag to a pool */
export type TagPoolPayload = {
  __typename?: 'TagPoolPayload';
  tag: Maybe<Tag>;
};

export type Task = {
  __typename?: 'Task';
  callbackAfterSeconds: Maybe<Scalars['BigInt']['output']>;
  callbackFromWorker: Maybe<Scalars['Boolean']['output']>;
  correlationId: Maybe<Scalars['String']['output']>;
  domain: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['BigInt']['output']>;
  executed: Maybe<Scalars['Boolean']['output']>;
  executionNameSpace: Maybe<Scalars['String']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  inputData: Maybe<Scalars['JSON']['output']>;
  isolationGroupId: Maybe<Scalars['String']['output']>;
  iteration: Maybe<Scalars['Int']['output']>;
  loopOverTask: Maybe<Scalars['Boolean']['output']>;
  outputData: Maybe<Scalars['JSON']['output']>;
  pollCount: Maybe<Scalars['Int']['output']>;
  queueWaitTime: Maybe<Scalars['BigInt']['output']>;
  rateLimitFrequencyInSeconds: Maybe<Scalars['Int']['output']>;
  rateLimitPerFrequency: Maybe<Scalars['Int']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  referenceTaskName: Maybe<Scalars['String']['output']>;
  responseTimeoutSeconds: Maybe<Scalars['BigInt']['output']>;
  retried: Maybe<Scalars['Boolean']['output']>;
  retriedTaskId: Maybe<Scalars['String']['output']>;
  retryCount: Maybe<Scalars['Int']['output']>;
  scheduledTime: Maybe<Scalars['BigInt']['output']>;
  seq: Maybe<Scalars['Int']['output']>;
  startDelayInSeconds: Maybe<Scalars['Int']['output']>;
  startTime: Maybe<Scalars['BigInt']['output']>;
  status: Maybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_Status>;
  subWorkflowId: Maybe<Scalars['String']['output']>;
  subworkflowChanged: Maybe<Scalars['Boolean']['output']>;
  taskDefName: Maybe<Scalars['String']['output']>;
  taskDefinition: Maybe<TaskDef>;
  taskId: Maybe<Scalars['String']['output']>;
  taskType: Maybe<Scalars['String']['output']>;
  updateTime: Maybe<Scalars['BigInt']['output']>;
  workerId: Maybe<Scalars['String']['output']>;
  workflowInstanceId: Maybe<Scalars['String']['output']>;
  workflowPriority: Maybe<Scalars['Int']['output']>;
  workflowTask: Maybe<ApiWorkflowTask>;
  workflowType: Maybe<Scalars['String']['output']>;
};

export type TaskDef = {
  __typename?: 'TaskDef';
  accessPolicy: Maybe<Scalars['JSON']['output']>;
  backoffScaleFactor: Maybe<Scalars['Int']['output']>;
  concurrentExecLimit: Maybe<Scalars['Int']['output']>;
  createTime: Maybe<Scalars['BigInt']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  executionNameSpace: Maybe<Scalars['String']['output']>;
  inputKeys: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  inputTemplate: Maybe<Scalars['JSON']['output']>;
  isolationGroupId: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outputKeys: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  ownerApp: Maybe<Scalars['String']['output']>;
  ownerEmail: Maybe<Scalars['String']['output']>;
  pollTimeoutSeconds: Maybe<Scalars['Int']['output']>;
  rateLimitFrequencyInSeconds: Maybe<Scalars['Int']['output']>;
  rateLimitPerFrequency: Maybe<Scalars['Int']['output']>;
  responseTimeoutSeconds: Maybe<Scalars['BigInt']['output']>;
  retryCount: Maybe<Scalars['Int']['output']>;
  retryDelaySeconds: Maybe<Scalars['Int']['output']>;
  retryLogic: Maybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_TaskDefinition_RetryLogic>;
  timeoutPolicy: Maybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_TaskDefinition_TimeoutPolicy>;
  timeoutSeconds: Scalars['BigInt']['output'];
  updateTime: Maybe<Scalars['BigInt']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
};

export type TaskDef_Input = {
  accessPolicy?: InputMaybe<Scalars['JSON']['input']>;
  backoffScaleFactor?: InputMaybe<Scalars['Int']['input']>;
  concurrentExecLimit?: InputMaybe<Scalars['Int']['input']>;
  createTime?: InputMaybe<Scalars['BigInt']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  executionNameSpace?: InputMaybe<Scalars['String']['input']>;
  inputKeys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputTemplate?: InputMaybe<Scalars['JSON']['input']>;
  isolationGroupId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  outputKeys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerApp?: InputMaybe<Scalars['String']['input']>;
  ownerEmail?: InputMaybe<Scalars['String']['input']>;
  pollTimeoutSeconds?: InputMaybe<Scalars['Int']['input']>;
  rateLimitFrequencyInSeconds?: InputMaybe<Scalars['Int']['input']>;
  rateLimitPerFrequency?: InputMaybe<Scalars['Int']['input']>;
  responseTimeoutSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  retryCount?: InputMaybe<Scalars['Int']['input']>;
  retryDelaySeconds?: InputMaybe<Scalars['Int']['input']>;
  retryLogic?: InputMaybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_TaskDefinition_RetryLogic>;
  timeoutPolicy?: InputMaybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_TaskDefinition_TimeoutPolicy>;
  timeoutSeconds: Scalars['BigInt']['input'];
  updateTime?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
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

export type TaskDetails = {
  __typename?: 'TaskDetails';
  output: Maybe<Scalars['JSON']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
  taskRefName: Maybe<Scalars['String']['output']>;
  workflowId: Maybe<Scalars['String']['output']>;
};

export type TaskDetails_Input = {
  output?: InputMaybe<Scalars['JSON']['input']>;
  taskId?: InputMaybe<Scalars['String']['input']>;
  taskRefName?: InputMaybe<Scalars['String']['input']>;
  workflowId?: InputMaybe<Scalars['String']['input']>;
};

export type TaskExecLog = {
  __typename?: 'TaskExecLog';
  createdTime: Maybe<Scalars['BigInt']['output']>;
  log: Maybe<Scalars['String']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
};

export type TaskExecLog_Input = {
  createdTime?: InputMaybe<Scalars['BigInt']['input']>;
  log?: InputMaybe<Scalars['String']['input']>;
  taskId?: InputMaybe<Scalars['String']['input']>;
};

export type TaskResult_Input = {
  callbackAfterSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  extendLease?: InputMaybe<Scalars['Boolean']['input']>;
  externalOutputPayloadStoragePath?: InputMaybe<Scalars['String']['input']>;
  logs?: InputMaybe<Array<InputMaybe<TaskExecLog_Input>>>;
  outputData?: InputMaybe<Scalars['JSON']['input']>;
  reasonForIncompletion?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MutationInput_UpdateTask_Input_Status>;
  subWorkflowId?: InputMaybe<Scalars['String']['input']>;
  taskId: Scalars['String']['input'];
  workerId?: InputMaybe<Scalars['String']['input']>;
  workflowInstanceId: Scalars['String']['input'];
};

export type TaskSummary = {
  __typename?: 'TaskSummary';
  correlationId: Maybe<Scalars['String']['output']>;
  domain: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  executionTime: Maybe<Scalars['BigInt']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  input: Maybe<Scalars['String']['output']>;
  output: Maybe<Scalars['String']['output']>;
  queueWaitTime: Maybe<Scalars['BigInt']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  scheduledTime: Maybe<Scalars['String']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  status: Maybe<Query_Search_1_Results_Items_Status>;
  taskDefName: Maybe<Scalars['String']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
  taskType: Maybe<Scalars['String']['output']>;
  updateTime: Maybe<Scalars['String']['output']>;
  workflowId: Maybe<Scalars['String']['output']>;
  workflowPriority: Maybe<Scalars['Int']['output']>;
  workflowType: Maybe<Scalars['String']['output']>;
};

export type TaskTimeoutPolicy =
  | 'ALERT_ONLY'
  | 'RETRY'
  | 'TIME_OUT_WF';

export type TasksOrderByInput = {
  direction: SortDirection;
  sortKey: SortTasksBy;
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

export type TopologyLayer =
  | 'EthTopology'
  | 'PhysicalTopology'
  | 'PtpTopology';

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

/** Input parameters for a call removing a tag from pool */
export type UntagPoolInput = {
  poolId: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
};

/** Output of removing a specific tag from a pool */
export type UntagPoolPayload = {
  __typename?: 'UntagPoolPayload';
  tag: Maybe<Tag>;
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

export type UpdateGraphNodeCoordinatesInput = {
  coordinates: Array<GraphNodeCoordinatesInput>;
  layer?: InputMaybe<TopologyLayer>;
};

export type UpdateGraphNodeCoordinatesPayload = {
  __typename?: 'UpdateGraphNodeCoordinatesPayload';
  deviceNames: Array<Scalars['String']['output']>;
};

/** Input parameters updating the name of a resource-type */
export type UpdateResourceTypeNameInput = {
  resourceName: Scalars['String']['input'];
  resourceTypeId: Scalars['ID']['input'];
};

/** Output of updating the name of a resource-type */
export type UpdateResourceTypeNamePayload = {
  __typename?: 'UpdateResourceTypeNamePayload';
  resourceTypeId: Scalars['ID']['output'];
};

export type UpdateScheduleInput = {
  cronString?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  parallelRuns?: InputMaybe<Scalars['Boolean']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
  workflowContext?: InputMaybe<Scalars['String']['input']>;
  workflowName?: InputMaybe<Scalars['String']['input']>;
  workflowVersion?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStreamInput = {
  blueprintId?: InputMaybe<Scalars['String']['input']>;
  deviceName: Scalars['String']['input'];
  streamName: Scalars['String']['input'];
  streamParameters?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStreamPayload = {
  __typename?: 'UpdateStreamPayload';
  stream: Maybe<Stream>;
};

/** Input parameters for updating an existing tag */
export type UpdateTagInput = {
  tagId: Scalars['ID']['input'];
  tagText: Scalars['String']['input'];
};

/** Output of updating a tag */
export type UpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  tag: Maybe<Tag>;
};

export type UpdateWorkflowDefinitionInput = {
  id: Scalars['ID']['input'];
  workflowDefinition: WorkflowDefinitionInput;
};

export type Workflow = Node & {
  __typename?: 'Workflow';
  correlationId: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['String']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  failedReferenceTaskNames: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  hasSubworkflows: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  input: Maybe<Scalars['String']['output']>;
  lastRetriedTime: Maybe<Scalars['String']['output']>;
  originalId: Maybe<Scalars['String']['output']>;
  output: Maybe<Scalars['String']['output']>;
  ownerApp: Maybe<Scalars['String']['output']>;
  parentId: Maybe<Scalars['String']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  status: Maybe<WorkflowStatus>;
  tasks: Maybe<Array<WorkflowTask>>;
  updatedAt: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['String']['output']>;
  workflowDefinition: Maybe<WorkflowDefinition>;
};

export type WorkflowDef = {
  __typename?: 'WorkflowDef';
  accessPolicy: Maybe<Scalars['JSON']['output']>;
  createTime: Maybe<Scalars['BigInt']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  failureWorkflow: Maybe<Scalars['String']['output']>;
  inputParameters: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  inputTemplate: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  outputParameters: Maybe<Scalars['JSON']['output']>;
  ownerApp: Maybe<Scalars['String']['output']>;
  ownerEmail: Maybe<Scalars['String']['output']>;
  restartable: Maybe<Scalars['Boolean']['output']>;
  schemaVersion: Maybe<Scalars['Int']['output']>;
  tasks: Array<Maybe<ApiWorkflowTask>>;
  timeoutPolicy: Maybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_SubWorkflowParam_WorkflowDefinition_TimeoutPolicy>;
  timeoutSeconds: Scalars['BigInt']['output'];
  updateTime: Maybe<Scalars['BigInt']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['JSON']['output']>;
  version: Maybe<Scalars['Int']['output']>;
  workflowStatusListenerEnabled: Maybe<Scalars['Boolean']['output']>;
};

export type WorkflowDef_Input = {
  accessPolicy?: InputMaybe<Scalars['JSON']['input']>;
  createTime?: InputMaybe<Scalars['BigInt']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  failureWorkflow?: InputMaybe<Scalars['String']['input']>;
  inputParameters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputTemplate?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  outputParameters?: InputMaybe<Scalars['JSON']['input']>;
  ownerApp?: InputMaybe<Scalars['String']['input']>;
  ownerEmail?: InputMaybe<Scalars['String']['input']>;
  restartable?: InputMaybe<Scalars['Boolean']['input']>;
  schemaVersion?: InputMaybe<Scalars['Int']['input']>;
  tasks: Array<InputMaybe<WorkflowTask_Input>>;
  timeoutPolicy?: InputMaybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_SubWorkflowParam_WorkflowDefinition_TimeoutPolicy>;
  timeoutSeconds: Scalars['BigInt']['input'];
  updateTime?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
  variables?: InputMaybe<Scalars['JSON']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
  workflowStatusListenerEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type WorkflowDefinition = BaseWorkflowDefinition & Node & {
  __typename?: 'WorkflowDefinition';
  createdAt: Maybe<Scalars['String']['output']>;
  createdBy: Maybe<Scalars['String']['output']>;
  description: Maybe<WorkflowDefinitionDescription>;
  hasSchedule: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  inputParameters: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  outputParameters: Maybe<Array<OutputParameters>>;
  ownerEmail: Maybe<Scalars['String']['output']>;
  restartable: Scalars['Boolean']['output'];
  tasks: Array<WorkflowDefinitionTask>;
  tasksJson: Maybe<Scalars['JSON']['output']>;
  timeoutPolicy: Maybe<TimeoutPolicy>;
  timeoutSeconds: Maybe<Scalars['Int']['output']>;
  updatedAt: Maybe<Scalars['String']['output']>;
  updatedBy: Maybe<Scalars['String']['output']>;
  variables: Maybe<Scalars['JSON']['output']>;
  version: Scalars['Int']['output'];
};

export type WorkflowDefinitionConnection = {
  __typename?: 'WorkflowDefinitionConnection';
  edges: Array<WorkflowDefinitionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WorkflowDefinitionDescription = {
  __typename?: 'WorkflowDefinitionDescription';
  description: Maybe<Scalars['String']['output']>;
  labels: Maybe<Array<Scalars['String']['output']>>;
};

export type WorkflowDefinitionDescriptionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type WorkflowDefinitionEdge = {
  __typename?: 'WorkflowDefinitionEdge';
  cursor: Scalars['String']['output'];
  node: WorkflowDefinition;
};

export type WorkflowDefinitionInput = {
  accessPolicy?: InputMaybe<Scalars['JSON']['input']>;
  createTime?: InputMaybe<Scalars['BigInt']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<WorkflowDefinitionDescriptionInput>;
  failureWorkflow?: InputMaybe<Scalars['String']['input']>;
  inputParameters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputTemplate?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  outputParameters?: InputMaybe<Scalars['JSON']['input']>;
  ownerApp?: InputMaybe<Scalars['String']['input']>;
  ownerEmail?: InputMaybe<Scalars['String']['input']>;
  restartable?: InputMaybe<Scalars['Boolean']['input']>;
  schemaVersion?: InputMaybe<Scalars['Int']['input']>;
  tasks: Scalars['String']['input'];
  timeoutPolicy?: InputMaybe<TimeoutPolicy>;
  timeoutSeconds: Scalars['BigInt']['input'];
  updateTime?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
  variables?: InputMaybe<Scalars['JSON']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
  workflowStatusListenerEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type WorkflowDefinitionPayload = {
  __typename?: 'WorkflowDefinitionPayload';
  workflowDefinition: Maybe<WorkflowDefinition>;
};

export type WorkflowDefinitionTask = {
  __typename?: 'WorkflowDefinitionTask';
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  taskReferenceName: Scalars['String']['output'];
};

export type WorkflowInstanceDetail = {
  __typename?: 'WorkflowInstanceDetail';
  meta: Maybe<WorkflowDefinition>;
  subworkflows: Maybe<Array<Subworkflow>>;
};

export type WorkflowStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'RUNNING'
  | 'TERMINATED'
  | 'TIMED_OUT';

export type WorkflowSummary = {
  __typename?: 'WorkflowSummary';
  correlationId: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  event: Maybe<Scalars['String']['output']>;
  executionTime: Maybe<Scalars['BigInt']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  failedReferenceTaskNames: Maybe<Scalars['String']['output']>;
  failedTaskNames: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  input: Maybe<Scalars['String']['output']>;
  inputSize: Maybe<Scalars['BigInt']['output']>;
  output: Maybe<Scalars['String']['output']>;
  outputSize: Maybe<Scalars['BigInt']['output']>;
  parentWorkflowId: Maybe<Scalars['String']['output']>;
  priority: Maybe<Scalars['Int']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  status: Maybe<Query_Search_Results_Items_Status>;
  updateTime: Maybe<Scalars['String']['output']>;
  version: Maybe<Scalars['Int']['output']>;
  workflowId: Maybe<Scalars['String']['output']>;
  workflowType: Maybe<Scalars['String']['output']>;
};

export type WorkflowTask = Node & {
  __typename?: 'WorkflowTask';
  callbackAfterSeconds: Maybe<Scalars['Int']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  executed: Maybe<Scalars['Boolean']['output']>;
  externalInputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  externalOutputPayloadStoragePath: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  inputData: Maybe<Scalars['String']['output']>;
  logs: Maybe<Array<WorkflowTaskLog>>;
  outputData: Maybe<Scalars['String']['output']>;
  pollCount: Maybe<Scalars['Int']['output']>;
  reasonForIncompletion: Maybe<Scalars['String']['output']>;
  referenceTaskName: Maybe<Scalars['String']['output']>;
  retried: Maybe<Scalars['Boolean']['output']>;
  retryCount: Maybe<Scalars['Int']['output']>;
  scheduledTime: Maybe<Scalars['String']['output']>;
  seq: Maybe<Scalars['Int']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  status: Maybe<WorkflowTaskStatus>;
  subWorkflowId: Maybe<Scalars['String']['output']>;
  taskDefName: Maybe<Scalars['String']['output']>;
  taskDefinition: Maybe<Scalars['String']['output']>;
  taskId: Maybe<Scalars['String']['output']>;
  taskType: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['String']['output']>;
  workflowType: Maybe<Scalars['String']['output']>;
};

export type WorkflowTaskLog = {
  __typename?: 'WorkflowTaskLog';
  createdAt: Maybe<Scalars['String']['output']>;
  message: Maybe<Scalars['String']['output']>;
};

export type WorkflowTaskStatus =
  | 'CANCELED'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'SKIPPED'
  | 'TIMED_OUT';

export type WorkflowTask_Input = {
  asyncComplete?: InputMaybe<Scalars['Boolean']['input']>;
  caseExpression?: InputMaybe<Scalars['String']['input']>;
  caseValueParam?: InputMaybe<Scalars['String']['input']>;
  decisionCases?: InputMaybe<Scalars['JSON']['input']>;
  defaultCase?: InputMaybe<Array<InputMaybe<WorkflowTask_Input>>>;
  defaultExclusiveJoinTask?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dynamicForkJoinTasksParam?: InputMaybe<Scalars['String']['input']>;
  dynamicForkTasksInputParamName?: InputMaybe<Scalars['String']['input']>;
  dynamicForkTasksParam?: InputMaybe<Scalars['String']['input']>;
  dynamicTaskNameParam?: InputMaybe<Scalars['String']['input']>;
  evaluatorType?: InputMaybe<Scalars['String']['input']>;
  expression?: InputMaybe<Scalars['String']['input']>;
  forkTasks?: InputMaybe<Array<InputMaybe<Array<InputMaybe<WorkflowTask_Input>>>>>;
  inputParameters?: InputMaybe<Scalars['JSON']['input']>;
  joinOn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  loopCondition?: InputMaybe<Scalars['String']['input']>;
  loopOver?: InputMaybe<Array<InputMaybe<WorkflowTask_Input>>>;
  name: Scalars['String']['input'];
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  rateLimited?: InputMaybe<Scalars['Boolean']['input']>;
  retryCount?: InputMaybe<Scalars['Int']['input']>;
  scriptExpression?: InputMaybe<Scalars['String']['input']>;
  sink?: InputMaybe<Scalars['String']['input']>;
  startDelay?: InputMaybe<Scalars['Int']['input']>;
  subWorkflowParam?: InputMaybe<SubWorkflowParams_Input>;
  taskDefinition?: InputMaybe<TaskDef_Input>;
  taskReferenceName: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  workflowTaskType?: InputMaybe<Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_WorkflowTaskType>;
};

export type WorkflowTestRequest_Input = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  externalInputPayloadStoragePath?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  subWorkflowTestRequest?: InputMaybe<Scalars['JSON']['input']>;
  taskRefToMockOutput?: InputMaybe<Scalars['JSON']['input']>;
  taskToDomain?: InputMaybe<Scalars['JSON']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
  workflowDef?: InputMaybe<WorkflowDef_Input>;
};

export type WorkflowsFilterInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
};

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

export type ConductorMutation = {
  __typename?: 'conductorMutation';
  /** Add a new event handler. */
  addEventHandler: Maybe<Scalars['JSON']['output']>;
  cloneWorkflowDefinition: Scalars['Boolean']['output'];
  /** Create a new workflow definition */
  create: Maybe<Scalars['JSON']['output']>;
  createEventHandler: CreateEventHandlerPayload;
  createWorkflowDefinition: Maybe<WorkflowDefinitionPayload>;
  /** Starts the decision task for a workflow */
  decide: Maybe<Scalars['JSON']['output']>;
  /** Removes the workflow from the system */
  delete: Maybe<Scalars['JSON']['output']>;
  deleteEventHandler: Scalars['Boolean']['output'];
  deleteWorkflowDefinition: DeleteWorkflowDefinitionPayload;
  editEventHandler: EditEventHandlerPayload;
  executeWorkflowByName: Maybe<Scalars['String']['output']>;
  exportWorkflowDefinition: Maybe<Scalars['JSON']['output']>;
  /** Lists workflows for the given correlation id list */
  getWorkflows: Maybe<Scalars['JSON']['output']>;
  /** Log Task Execution Details */
  log: Maybe<Scalars['JSON']['output']>;
  pauseExecutedWorkflow: ActionWorkflowPayload;
  /** Pauses the workflow */
  pauseWorkflow: Maybe<Scalars['JSON']['output']>;
  /** Pause the list of workflows */
  pauseWorkflow_1: Maybe<BulkResponse>;
  /** Update an existing task */
  registerTaskDef: Maybe<Scalars['JSON']['output']>;
  /** Create new task definition(s) */
  registerTaskDef_1: Maybe<Scalars['JSON']['output']>;
  /** Remove an event handler */
  removeEventHandlerStatus: Maybe<Scalars['JSON']['output']>;
  /** Requeue pending tasks */
  requeuePendingTask: Maybe<Scalars['String']['output']>;
  /** Queue up all the running workflows for sweep */
  requeueSweep: Maybe<Scalars['String']['output']>;
  /** Reruns the workflow from a specific task */
  rerun: Maybe<Scalars['String']['output']>;
  rerunExecutedWorkflow: ActionWorkflowPayload;
  /** Resets callback times of all non-terminal SIMPLE tasks to 0 */
  resetWorkflow: Maybe<Scalars['Void']['output']>;
  /** Restarts a completed workflow */
  restart: Maybe<Scalars['Void']['output']>;
  restartExecutedWorkflow: ActionWorkflowPayload;
  /** Restart the list of completed workflow */
  restart_1: Maybe<BulkResponse>;
  resumeExecutedWorkflow: ActionWorkflowPayload;
  /** Resumes the workflow */
  resumeWorkflow: Maybe<Scalars['JSON']['output']>;
  /** Resume the list of workflows */
  resumeWorkflow_1: Maybe<BulkResponse>;
  /** Retries the last failed task */
  retry: Maybe<Scalars['Void']['output']>;
  retryExecutedWorkflow: ActionWorkflowPayload;
  /** Retry the last failed task for each workflow from the list */
  retry_1: Maybe<BulkResponse>;
  /** Skips a given task from a current running workflow */
  skipTaskFromWorkflow: Maybe<Scalars['JSON']['output']>;
  /** Start a new workflow with StartWorkflowRequest, which allows task to be executed in a domain */
  startWorkflow: Maybe<Scalars['String']['output']>;
  /** Start a new workflow. Returns the ID of the workflow instance that can be later used for tracking */
  startWorkflow_1: Maybe<Scalars['String']['output']>;
  /** Terminate workflows execution */
  terminate: Maybe<BulkResponse>;
  terminateExecutedWorkflow: ActionWorkflowPayload;
  /** Terminate workflow execution */
  terminate_1: Maybe<Scalars['JSON']['output']>;
  /** Test workflow execution using mock data */
  testWorkflow: Maybe<ApiWorkflow>;
  /** Remove a task definition */
  unregisterTaskDef: Maybe<Scalars['JSON']['output']>;
  /** Removes workflow definition. It does not remove workflows associated with the definition. */
  unregisterWorkflowDef: Maybe<Scalars['JSON']['output']>;
  /** Create or update workflow definition */
  update: Maybe<BulkResponse>;
  /** Publish a message in queue to mark a wait task (by taskId) as completed. */
  updateByTaskId: Maybe<Scalars['JSON']['output']>;
  /** Update an existing event handler. */
  updateEventHandler: Maybe<Scalars['JSON']['output']>;
  /** Update a task */
  updateTask: Maybe<Scalars['String']['output']>;
  updateWorkflowDefinition: Maybe<WorkflowDefinitionPayload>;
  /** Publish a message in queue to mark a wait task as completed. */
  update_1: Maybe<Scalars['JSON']['output']>;
  /** Validates a new workflow definition */
  validate: Maybe<Scalars['JSON']['output']>;
  /** Verify and repair workflow consistency */
  verifyAndRepairWorkflowConsistency: Maybe<Scalars['String']['output']>;
};


export type ConductorMutationAddEventHandlerArgs = {
  input?: InputMaybe<EventHandler_Input>;
};


export type ConductorMutationCloneWorkflowDefinitionArgs = {
  name: Scalars['String']['input'];
  version: Scalars['Int']['input'];
  workflowToBeCloned: WorkflowDefinitionInput;
};


export type ConductorMutationCreateArgs = {
  input?: InputMaybe<WorkflowDef_Input>;
};


export type ConductorMutationCreateEventHandlerArgs = {
  input: CreateEventHandlerInput;
};


export type ConductorMutationCreateWorkflowDefinitionArgs = {
  input: CreateWorkflowDefinitionInput;
};


export type ConductorMutationDecideArgs = {
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationDeleteArgs = {
  archiveWorkflow?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationDeleteEventHandlerArgs = {
  id: Scalars['ID']['input'];
};


export type ConductorMutationDeleteWorkflowDefinitionArgs = {
  input: DeleteWorkflowDefinitionInput;
};


export type ConductorMutationEditEventHandlerArgs = {
  input: EditEventHandlerInput;
};


export type ConductorMutationExecuteWorkflowByNameArgs = {
  input: ExecuteWorkflowByNameInput;
};


export type ConductorMutationExportWorkflowDefinitionArgs = {
  name: Scalars['String']['input'];
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorMutationGetWorkflowsArgs = {
  includeClosed?: InputMaybe<Scalars['Boolean']['input']>;
  includeTasks?: InputMaybe<Scalars['Boolean']['input']>;
  input?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
};


export type ConductorMutationLogArgs = {
  input?: InputMaybe<Scalars['String']['input']>;
  taskId: Scalars['String']['input'];
};


export type ConductorMutationPauseExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type ConductorMutationPauseWorkflowArgs = {
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationPauseWorkflow_1Args = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ConductorMutationRegisterTaskDefArgs = {
  input?: InputMaybe<TaskDef_Input>;
};


export type ConductorMutationRegisterTaskDef_1Args = {
  input?: InputMaybe<Array<InputMaybe<TaskDef_Input>>>;
};


export type ConductorMutationRemoveEventHandlerStatusArgs = {
  name: Scalars['String']['input'];
};


export type ConductorMutationRequeuePendingTaskArgs = {
  taskType: Scalars['String']['input'];
};


export type ConductorMutationRequeueSweepArgs = {
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationRerunArgs = {
  input?: InputMaybe<RerunWorkflowRequest_Input>;
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationRerunExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<RerunWorkflowRequest_Input>;
};


export type ConductorMutationResetWorkflowArgs = {
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationRestartArgs = {
  useLatestDefinitions?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationRestartExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type ConductorMutationRestart_1Args = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  useLatestDefinitions?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ConductorMutationResumeExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type ConductorMutationResumeWorkflowArgs = {
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationResumeWorkflow_1Args = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ConductorMutationRetryArgs = {
  resumeSubworkflowTasks?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationRetryExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type ConductorMutationRetry_1Args = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ConductorMutationSkipTaskFromWorkflowArgs = {
  input?: InputMaybe<SkipTaskRequest_Input>;
  taskReferenceName: Scalars['String']['input'];
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationStartWorkflowArgs = {
  input?: InputMaybe<StartWorkflowRequest_Input>;
};


export type ConductorMutationStartWorkflow_1Args = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorMutationTerminateArgs = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type ConductorMutationTerminateExecutedWorkflowArgs = {
  id: Scalars['String']['input'];
};


export type ConductorMutationTerminate_1Args = {
  reason?: InputMaybe<Scalars['String']['input']>;
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationTestWorkflowArgs = {
  input?: InputMaybe<WorkflowTestRequest_Input>;
};


export type ConductorMutationUnregisterTaskDefArgs = {
  tasktype: Scalars['String']['input'];
};


export type ConductorMutationUnregisterWorkflowDefArgs = {
  name: Scalars['String']['input'];
  version: Scalars['Int']['input'];
};


export type ConductorMutationUpdateArgs = {
  input?: InputMaybe<Array<InputMaybe<WorkflowDef_Input>>>;
};


export type ConductorMutationUpdateByTaskIdArgs = {
  input?: InputMaybe<Scalars['JSON']['input']>;
  status: MutationInput_UpdateByTaskId_Status;
  taskId: Scalars['String']['input'];
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationUpdateEventHandlerArgs = {
  input?: InputMaybe<EventHandler_Input>;
};


export type ConductorMutationUpdateTaskArgs = {
  input?: InputMaybe<TaskResult_Input>;
};


export type ConductorMutationUpdateWorkflowDefinitionArgs = {
  input: UpdateWorkflowDefinitionInput;
};


export type ConductorMutationUpdate_1Args = {
  input?: InputMaybe<Scalars['JSON']['input']>;
  status: MutationInput_Update_1_Status;
  taskRefName: Scalars['String']['input'];
  workflowId: Scalars['String']['input'];
};


export type ConductorMutationValidateArgs = {
  input?: InputMaybe<WorkflowDef_Input>;
};


export type ConductorMutationVerifyAndRepairWorkflowConsistencyArgs = {
  workflowId: Scalars['String']['input'];
};

export type ConductorQuery = {
  __typename?: 'conductorQuery';
  /** Get the details about each queue */
  all: Maybe<Scalars['JSON']['output']>;
  /** Get the details about each queue */
  allVerbose: Maybe<Scalars['JSON']['output']>;
  /** Batch poll for a task of a certain type */
  batchPoll: Maybe<Array<Maybe<Task>>>;
  doCheck: Maybe<HealthCheckStatus>;
  eventHandlers: EventHandlerConnection;
  executedWorkflows: Maybe<ExecutedWorkflowConnection>;
  externalStorage: Maybe<Scalars['JSON']['output']>;
  /** Retrieves workflow definition along with blueprint */
  get: Maybe<WorkflowDef>;
  /** Retrieves all workflow definition along with blueprint */
  getAll: Maybe<Array<Maybe<WorkflowDef>>>;
  /** Get all the configuration parameters */
  getAllConfig: Maybe<Scalars['JSON']['output']>;
  /** Get the last poll data for all task types */
  getAllPollData: Maybe<Array<Maybe<PollData>>>;
  /** Returns only the latest version of all workflow definitions */
  getAllWorkflowsWithLatestVersions: Maybe<Array<Maybe<WorkflowDef>>>;
  /** Get all the event handlers */
  getEventHandlers: Maybe<Array<Maybe<ApiEventHandler>>>;
  /** Get event handlers for a given event */
  getEventHandlersForEvent: Maybe<Array<Maybe<ApiEventHandler>>>;
  /** Get registered queues */
  getEventQueues: Maybe<Scalars['JSON']['output']>;
  /** Gets the workflow by workflow id */
  getExecutionStatus: Maybe<ApiWorkflow>;
  /** Get task or workflow by externalPayloadPath from External PostgreSQL Storage */
  getExternalStorageData: Maybe<Scalars['JSON']['output']>;
  /** Get the uri and path of the external storage where the workflow payload is to be stored */
  getExternalStorageLocation: Maybe<ExternalStorageLocation>;
  /** Get the external uri where the task payload is to be stored */
  getExternalStorageLocation_1: Maybe<ExternalStorageLocation>;
  /** Get the last poll data for a given task type */
  getPollData: Maybe<Array<Maybe<PollData>>>;
  /** Retrieve all the running workflows */
  getRunningWorkflow: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Get task by Id */
  getTask: Maybe<Task>;
  /** Gets the task definition */
  getTaskDef: Maybe<TaskDef>;
  /** Gets all task definition */
  getTaskDefs: Maybe<Array<Maybe<TaskDef>>>;
  /** Get Task Execution Logs */
  getTaskLogs: Maybe<Array<Maybe<TaskExecLog>>>;
  /** Gets the workflow by workflow id */
  getWorkflowFamily: Maybe<Array<Maybe<ApiWorkflow>>>;
  /** Returns workflow names and versions only (no definition bodies) */
  getWorkflowNamesAndVersions: Maybe<Scalars['JSON']['output']>;
  /** Gets the workflow by workflow id */
  getWorkflowPath: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Lists workflows for the given correlation id */
  getWorkflows_1: Maybe<Array<Maybe<ApiWorkflow>>>;
  /** Get Queue Names */
  names: Maybe<Scalars['JSON']['output']>;
  node: Maybe<Node>;
  /** Poll for a task of a certain type */
  poll: Maybe<Task>;
  /** use sort options as sort=<field>:ASC|DESC e.g. sort=name&sort=workflowId:DESC. If order is not specified, defaults to ASC. */
  search: Maybe<SearchResultWorkflowSummary>;
  /** use sort options as sort=<field>:ASC|DESC e.g. sort=name&sort=workflowId:DESC. If order is not specified, defaults to ASC. */
  searchV2: Maybe<SearchResultWorkflow>;
  /** use sort options as sort=<field>:ASC|DESC e.g. sort=name&sort=workflowId:DESC. If order is not specified, defaults to ASC */
  searchV2_1: Maybe<SearchResultTask>;
  /** use sort options as sort=<field>:ASC|DESC e.g. sort=name&sort=workflowId:DESC. If order is not specified, defaults to ASC */
  searchWorkflowsByTasks: Maybe<SearchResultWorkflowSummary>;
  /** use sort options as sort=<field>:ASC|DESC e.g. sort=name&sort=workflowId:DESC. If order is not specified, defaults to ASC */
  searchWorkflowsByTasksV2: Maybe<SearchResultWorkflow>;
  /** use sort options as sort=<field>:ASC|DESC e.g. sort=name&sort=workflowId:DESC. If order is not specified, defaults to ASC */
  search_1: Maybe<SearchResultTaskSummary>;
  /**
   * Deprecated. Please use /tasks/queue/size endpoint
   * @deprecated deprecated
   */
  size: Maybe<Scalars['JSON']['output']>;
  /** Get the queue length */
  size_1: Maybe<Scalars['JSON']['output']>;
  taskDefinitions: TaskDefinitionConnection;
  /** Get queue size for a task type. */
  taskDepth: Maybe<Scalars['Int']['output']>;
  /** Get the list of pending tasks for a given task type */
  view: Maybe<Array<Maybe<Task>>>;
  workflowDefinitions: WorkflowDefinitionConnection;
  workflowInstanceDetail: WorkflowInstanceDetail;
  workflowLabels: Array<Scalars['String']['output']>;
};


export type ConductorQueryBatchPollArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  tasktype: Scalars['String']['input'];
  timeout?: InputMaybe<Scalars['Int']['input']>;
  workerid?: InputMaybe<Scalars['String']['input']>;
};


export type ConductorQueryEventHandlersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterEventHandlerInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EventHandlersOrderByInput>;
};


export type ConductorQueryExecutedWorkflowsArgs = {
  orderBy?: InputMaybe<ExecutedWorkflowsOrderByInput>;
  pagination?: InputMaybe<PaginationArgs>;
  searchQuery?: InputMaybe<ExecutedWorkflowSearchInput>;
};


export type ConductorQueryExternalStorageArgs = {
  path: Scalars['String']['input'];
};


export type ConductorQueryGetArgs = {
  name: Scalars['String']['input'];
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQueryGetEventHandlersForEventArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  event: Scalars['String']['input'];
};


export type ConductorQueryGetEventQueuesArgs = {
  verbose?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ConductorQueryGetExecutionStatusArgs = {
  includeTasks?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};


export type ConductorQueryGetExternalStorageDataArgs = {
  externalPayloadPath: Scalars['String']['input'];
};


export type ConductorQueryGetExternalStorageLocationArgs = {
  operation: Scalars['String']['input'];
  path: Scalars['String']['input'];
  payloadType: Scalars['String']['input'];
};


export type ConductorQueryGetExternalStorageLocation_1Args = {
  operation: Scalars['String']['input'];
  path: Scalars['String']['input'];
  payloadType: Scalars['String']['input'];
};


export type ConductorQueryGetPollDataArgs = {
  taskType: Scalars['String']['input'];
};


export type ConductorQueryGetRunningWorkflowArgs = {
  endTime?: InputMaybe<Scalars['BigInt']['input']>;
  name: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQueryGetTaskArgs = {
  taskId: Scalars['String']['input'];
};


export type ConductorQueryGetTaskDefArgs = {
  tasktype: Scalars['String']['input'];
};


export type ConductorQueryGetTaskLogsArgs = {
  taskId: Scalars['String']['input'];
};


export type ConductorQueryGetWorkflowFamilyArgs = {
  summaryOnly?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};


export type ConductorQueryGetWorkflowPathArgs = {
  workflowId: Scalars['String']['input'];
};


export type ConductorQueryGetWorkflows_1Args = {
  correlationId: Scalars['String']['input'];
  includeClosed?: InputMaybe<Scalars['Boolean']['input']>;
  includeTasks?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};


export type ConductorQueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type ConductorQueryPollArgs = {
  domain?: InputMaybe<Scalars['String']['input']>;
  tasktype: Scalars['String']['input'];
  workerid?: InputMaybe<Scalars['String']['input']>;
};


export type ConductorQuerySearchArgs = {
  freeText?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQuerySearchV2Args = {
  freeText?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQuerySearchV2_1Args = {
  freeText?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQuerySearchWorkflowsByTasksArgs = {
  freeText?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQuerySearchWorkflowsByTasksV2Args = {
  freeText?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQuerySearch_1Args = {
  freeText?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type ConductorQuerySizeArgs = {
  taskType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ConductorQueryTaskDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterTaskDefinitionsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TasksOrderByInput>;
};


export type ConductorQueryTaskDepthArgs = {
  domain?: InputMaybe<Scalars['String']['input']>;
  executionNamespace?: InputMaybe<Scalars['String']['input']>;
  isolationGroupId?: InputMaybe<Scalars['String']['input']>;
  taskType: Scalars['String']['input'];
};


export type ConductorQueryViewArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
  tasktype: Scalars['String']['input'];
};


export type ConductorQueryWorkflowDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<WorkflowsFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WorkflowsOrderByInput>;
};


export type ConductorQueryWorkflowInstanceDetailArgs = {
  shouldIncludeTasks?: InputMaybe<Scalars['Boolean']['input']>;
  workflowId: Scalars['String']['input'];
};

export type DeviceInventoryMutation = {
  __typename?: 'deviceInventoryMutation';
  activateStream: ActivateStreamPayload;
  addBlueprint: AddBlueprintPayload;
  addDevice: AddDevicePayload;
  addLocation: AddLocationPayload;
  addSnapshot: Maybe<AddSnapshotPayload>;
  addStream: AddStreamPayload;
  addZone: AddZonePayload;
  applySnapshot: ApplySnapshotPayload;
  bulkInstallDevices: BulkInstallDevicePayload;
  bulkInstallStreams: BulkInstallStreamPayload;
  bulkUninstallDevices: BulkUninstallDevicePayload;
  bulkUninstallStreams: BulkUninstallStreamPayload;
  closeTransaction: CloseTransactionPayload;
  commitConfig: CommitConfigPayload;
  createLabel: CreateLabelPayload;
  createTransaction: CreateTransactionPayload;
  deactivateStream: DeactivateStreamPayload;
  deleteBlueprint: DeleteBlueprintPayload;
  deleteDevice: DeleteDevicePayload;
  deleteLabel: DeleteLabelPayload;
  deleteSnapshot: Maybe<DeleteSnapshotPayload>;
  deleteStream: DeleteStreamPayload;
  importCSV: Maybe<CsvImport>;
  installDevice: InstallDevicePayload;
  reconnectKafka: Maybe<IsOkResponse>;
  resetConfig: ResetConfigPayload;
  revertChanges: RevertChangesPayload;
  syncFromNetwork: SyncFromNetworkPayload;
  uninstallDevice: UninstallDevicePayload;
  updateBlueprint: UpdateBlueprintPayload;
  updateDataStore: UpdateDataStorePayload;
  updateDevice: UpdateDevicePayload;
  updateDiscoveredAt: Array<DeviceDiscoveryPayload>;
  updateGraphNodeCoordinates: UpdateGraphNodeCoordinatesPayload;
  updateStream: UpdateStreamPayload;
};


export type DeviceInventoryMutationActivateStreamArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationAddBlueprintArgs = {
  input: AddBlueprintInput;
};


export type DeviceInventoryMutationAddDeviceArgs = {
  input: AddDeviceInput;
};


export type DeviceInventoryMutationAddLocationArgs = {
  input: AddLocationInput;
};


export type DeviceInventoryMutationAddSnapshotArgs = {
  input: AddSnapshotInput;
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationAddStreamArgs = {
  input: AddStreamInput;
};


export type DeviceInventoryMutationAddZoneArgs = {
  input: AddZoneInput;
};


export type DeviceInventoryMutationApplySnapshotArgs = {
  input: ApplySnapshotInput;
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationBulkInstallDevicesArgs = {
  input: BulkInstallDevicesInput;
};


export type DeviceInventoryMutationBulkInstallStreamsArgs = {
  input: BulkInstallStreamsInput;
};


export type DeviceInventoryMutationBulkUninstallDevicesArgs = {
  input: BulkUninstallDevicesInput;
};


export type DeviceInventoryMutationBulkUninstallStreamsArgs = {
  input: BulkUninstallStreamsInput;
};


export type DeviceInventoryMutationCloseTransactionArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationCommitConfigArgs = {
  input: CommitConfigInput;
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationCreateLabelArgs = {
  input: CreateLabelInput;
};


export type DeviceInventoryMutationCreateTransactionArgs = {
  deviceId: Scalars['String']['input'];
};


export type DeviceInventoryMutationDeactivateStreamArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationDeleteBlueprintArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationDeleteDeviceArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationDeleteLabelArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
};


export type DeviceInventoryMutationDeleteStreamArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationImportCsvArgs = {
  input: CsvImportInput;
};


export type DeviceInventoryMutationInstallDeviceArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationResetConfigArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationRevertChangesArgs = {
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationSyncFromNetworkArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationUninstallDeviceArgs = {
  id: Scalars['String']['input'];
};


export type DeviceInventoryMutationUpdateBlueprintArgs = {
  id: Scalars['String']['input'];
  input: UpdateBlueprintInput;
};


export type DeviceInventoryMutationUpdateDataStoreArgs = {
  deviceId: Scalars['String']['input'];
  input: UpdateDataStoreInput;
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryMutationUpdateDeviceArgs = {
  id: Scalars['String']['input'];
  input: UpdateDeviceInput;
};


export type DeviceInventoryMutationUpdateDiscoveredAtArgs = {
  deviceIds: Array<Scalars['String']['input']>;
};


export type DeviceInventoryMutationUpdateGraphNodeCoordinatesArgs = {
  input: UpdateGraphNodeCoordinatesInput;
};


export type DeviceInventoryMutationUpdateStreamArgs = {
  id: Scalars['String']['input'];
  input: UpdateStreamInput;
};

export type DeviceInventoryQuery = {
  __typename?: 'deviceInventoryQuery';
  blueprints: BlueprintConnection;
  calculatedDiff: CalculatedDiffPayload;
  countries: CountryConnection;
  dataStore: Maybe<DataStore>;
  deviceMetadata: Maybe<DeviceMetadata>;
  devices: DeviceConnection;
  kafkaHealthCheck: Maybe<IsOkResponse>;
  labels: LabelConnection;
  locations: LocationConnection;
  netTopology: Maybe<NetTopology>;
  netTopologyVersionData: NetTopologyVersionData;
  node: Maybe<Node>;
  phyTopologyVersionData: PhyTopologyVersionData;
  ptpDiffSynce: PtpDiffSynce;
  ptpPathToGrandMaster: Maybe<Array<Scalars['String']['output']>>;
  ptpTopology: Maybe<PtpTopology>;
  ptpTopologyVersionData: PtpTopologyVersionData;
  shortestPath: Array<NetRoutingPathNode>;
  streams: StreamConnection;
  syncePathToGrandMaster: Maybe<Array<Scalars['String']['output']>>;
  synceTopology: Maybe<SynceTopology>;
  synceTopologyVersionData: SynceTopologyVersionData;
  topology: Maybe<Topology>;
  topologyCommonNodes: Maybe<TopologyCommonNodes>;
  topologyVersions: Maybe<Array<Scalars['String']['output']>>;
  transactions: Array<Transaction>;
  uniconfigShellSession: Maybe<Scalars['String']['output']>;
  zones: ZonesConnection;
};


export type DeviceInventoryQueryBlueprintsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type DeviceInventoryQueryCalculatedDiffArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryQueryCountriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type DeviceInventoryQueryDataStoreArgs = {
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
};


export type DeviceInventoryQueryDevicesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterDevicesInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DeviceOrderByInput>;
};


export type DeviceInventoryQueryLabelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterLabelsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type DeviceInventoryQueryLocationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type DeviceInventoryQueryNetTopologyVersionDataArgs = {
  version: Scalars['String']['input'];
};


export type DeviceInventoryQueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type DeviceInventoryQueryPhyTopologyVersionDataArgs = {
  version: Scalars['String']['input'];
};


export type DeviceInventoryQueryPtpPathToGrandMasterArgs = {
  deviceFrom: Scalars['String']['input'];
};


export type DeviceInventoryQueryPtpTopologyVersionDataArgs = {
  version: Scalars['String']['input'];
};


export type DeviceInventoryQueryShortestPathArgs = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};


export type DeviceInventoryQueryStreamsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterStreamsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamOrderByInput>;
};


export type DeviceInventoryQuerySyncePathToGrandMasterArgs = {
  deviceFrom: Scalars['String']['input'];
};


export type DeviceInventoryQuerySynceTopologyVersionDataArgs = {
  version: Scalars['String']['input'];
};


export type DeviceInventoryQueryTopologyArgs = {
  filter?: InputMaybe<FilterTopologyInput>;
};


export type DeviceInventoryQueryTopologyCommonNodesArgs = {
  nodes: Array<Scalars['String']['input']>;
};


export type DeviceInventoryQueryZonesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FilterZonesInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type DeviceInventorySubscription = {
  __typename?: 'deviceInventorySubscription';
  deviceUsage: Maybe<DeviceUsage>;
  devicesConnection: Maybe<DevicesConnection>;
  devicesUsage: Maybe<DeviceListUsage>;
  uniconfigShell: Maybe<Scalars['String']['output']>;
};


export type DeviceInventorySubscriptionDeviceUsageArgs = {
  deviceName: Scalars['String']['input'];
  refreshEverySec?: InputMaybe<Scalars['Int']['input']>;
};


export type DeviceInventorySubscriptionDevicesConnectionArgs = {
  connectionTimeout?: InputMaybe<Scalars['Int']['input']>;
  targetDevices: Array<Scalars['String']['input']>;
};


export type DeviceInventorySubscriptionDevicesUsageArgs = {
  deviceNames: Array<Scalars['String']['input']>;
  refreshEverySec?: InputMaybe<Scalars['Int']['input']>;
};


export type DeviceInventorySubscriptionUniconfigShellArgs = {
  input?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
  trigger?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationInput_UpdateByTaskId_Status =
  | 'CANCELED'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'SKIPPED'
  | 'TIMED_OUT';

export type MutationInput_UpdateEventHandler_Input_Actions_Items_Action =
  | 'complete_task'
  | 'fail_task'
  | 'start_workflow';

export type MutationInput_UpdateTask_Input_Status =
  | 'COMPLETED'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS';

export type MutationInput_Update_1_Status =
  | 'CANCELED'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'SKIPPED'
  | 'TIMED_OUT';

export type Mutation_GetWorkflows_AdditionalProperties_Items_Status =
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'RUNNING'
  | 'TERMINATED'
  | 'TIMED_OUT';

export type Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_Status =
  | 'CANCELED'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'SKIPPED'
  | 'TIMED_OUT';

export type Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_SubWorkflowParam_WorkflowDefinition_TimeoutPolicy =
  | 'ALERT_ONLY'
  | 'TIME_OUT_WF';

export type Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_TaskDefinition_RetryLogic =
  | 'EXPONENTIAL_BACKOFF'
  | 'FIXED'
  | 'LINEAR_BACKOFF';

export type Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_TaskDefinition_TimeoutPolicy =
  | 'ALERT_ONLY'
  | 'RETRY'
  | 'TIME_OUT_WF';

export type Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_WorkflowTaskType =
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

export type Query_Search_1_Results_Items_Status =
  | 'CANCELED'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'SKIPPED'
  | 'TIMED_OUT';

export type Query_Search_Results_Items_Status =
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'RUNNING'
  | 'TERMINATED'
  | 'TIMED_OUT';

export type ResourceManagerMutation = {
  __typename?: 'resourceManagerMutation';
  ClaimResource: Resource;
  ClaimResourceWithAltId: Resource;
  CreateAllocatingPool: CreateAllocatingPoolPayload;
  CreateAllocationStrategy: CreateAllocationStrategyPayload;
  CreateNestedAllocatingPool: CreateNestedAllocatingPoolPayload;
  CreateNestedSetPool: CreateNestedSetPoolPayload;
  CreateNestedSingletonPool: CreateNestedSingletonPoolPayload;
  CreateResourceType: CreateResourceTypePayload;
  CreateSetPool: CreateSetPoolPayload;
  CreateSingletonPool: CreateSingletonPoolPayload;
  CreateTag: CreateTagPayload;
  DeleteAllocationStrategy: DeleteAllocationStrategyPayload;
  DeleteResourcePool: DeleteResourcePoolPayload;
  DeleteResourceType: DeleteResourceTypePayload;
  DeleteTag: DeleteTagPayload;
  FreeResource: Scalars['String']['output'];
  TagPool: TagPoolPayload;
  TestAllocationStrategy: Scalars['Map']['output'];
  UntagPool: UntagPoolPayload;
  UpdateResourceAltId: Resource;
  UpdateResourceTypeName: UpdateResourceTypeNamePayload;
  UpdateTag: UpdateTagPayload;
};


export type ResourceManagerMutationClaimResourceArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  poolId: Scalars['ID']['input'];
  userInput: Scalars['Map']['input'];
};


export type ResourceManagerMutationClaimResourceWithAltIdArgs = {
  alternativeId: Scalars['Map']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  poolId: Scalars['ID']['input'];
  userInput: Scalars['Map']['input'];
};


export type ResourceManagerMutationCreateAllocatingPoolArgs = {
  input?: InputMaybe<CreateAllocatingPoolInput>;
};


export type ResourceManagerMutationCreateAllocationStrategyArgs = {
  input?: InputMaybe<CreateAllocationStrategyInput>;
};


export type ResourceManagerMutationCreateNestedAllocatingPoolArgs = {
  input: CreateNestedAllocatingPoolInput;
};


export type ResourceManagerMutationCreateNestedSetPoolArgs = {
  input: CreateNestedSetPoolInput;
};


export type ResourceManagerMutationCreateNestedSingletonPoolArgs = {
  input: CreateNestedSingletonPoolInput;
};


export type ResourceManagerMutationCreateResourceTypeArgs = {
  input: CreateResourceTypeInput;
};


export type ResourceManagerMutationCreateSetPoolArgs = {
  input: CreateSetPoolInput;
};


export type ResourceManagerMutationCreateSingletonPoolArgs = {
  input?: InputMaybe<CreateSingletonPoolInput>;
};


export type ResourceManagerMutationCreateTagArgs = {
  input: CreateTagInput;
};


export type ResourceManagerMutationDeleteAllocationStrategyArgs = {
  input?: InputMaybe<DeleteAllocationStrategyInput>;
};


export type ResourceManagerMutationDeleteResourcePoolArgs = {
  input: DeleteResourcePoolInput;
};


export type ResourceManagerMutationDeleteResourceTypeArgs = {
  input: DeleteResourceTypeInput;
};


export type ResourceManagerMutationDeleteTagArgs = {
  input: DeleteTagInput;
};


export type ResourceManagerMutationFreeResourceArgs = {
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerMutationTagPoolArgs = {
  input: TagPoolInput;
};


export type ResourceManagerMutationTestAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID']['input'];
  currentResources: Array<ResourceInput>;
  resourcePool: ResourcePoolInput;
  userInput: Scalars['Map']['input'];
};


export type ResourceManagerMutationUntagPoolArgs = {
  input: UntagPoolInput;
};


export type ResourceManagerMutationUpdateResourceAltIdArgs = {
  alternativeId: Scalars['Map']['input'];
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerMutationUpdateResourceTypeNameArgs = {
  input: UpdateResourceTypeNameInput;
};


export type ResourceManagerMutationUpdateTagArgs = {
  input: UpdateTagInput;
};

export type ResourceManagerQuery = {
  __typename?: 'resourceManagerQuery';
  QueryAllocationStrategies: Array<AllocationStrategy>;
  QueryAllocationStrategy: AllocationStrategy;
  QueryEmptyResourcePools: ResourcePoolConnection;
  QueryLeafResourcePools: ResourcePoolConnection;
  QueryPoolCapacity: PoolCapacityPayload;
  QueryPoolTypes: Array<PoolType>;
  QueryRecentlyActiveResources: ResourceConnection;
  QueryRequiredPoolProperties: Array<PropertyType>;
  QueryResource: Resource;
  QueryResourcePool: ResourcePool;
  QueryResourcePoolHierarchyPath: Array<ResourcePool>;
  QueryResourcePools: ResourcePoolConnection;
  QueryResourceTypes: Array<ResourceType>;
  QueryResources: ResourceConnection;
  QueryResourcesByAltId: ResourceConnection;
  QueryRootResourcePools: ResourcePoolConnection;
  QueryTags: Array<Tag>;
  SearchPoolsByTags: ResourcePoolConnection;
  node: Maybe<Node>;
};


export type ResourceManagerQueryQueryAllocationStrategiesArgs = {
  byName?: InputMaybe<Scalars['String']['input']>;
};


export type ResourceManagerQueryQueryAllocationStrategyArgs = {
  allocationStrategyId: Scalars['ID']['input'];
};


export type ResourceManagerQueryQueryEmptyResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
};


export type ResourceManagerQueryQueryLeafResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
  tags?: InputMaybe<TagOr>;
};


export type ResourceManagerQueryQueryPoolCapacityArgs = {
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerQueryQueryRecentlyActiveResourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromDatetime: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  toDatetime?: InputMaybe<Scalars['String']['input']>;
};


export type ResourceManagerQueryQueryRequiredPoolPropertiesArgs = {
  allocationStrategyName: Scalars['String']['input'];
};


export type ResourceManagerQueryQueryResourceArgs = {
  input: Scalars['Map']['input'];
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerQueryQueryResourcePoolArgs = {
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerQueryQueryResourcePoolHierarchyPathArgs = {
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerQueryQueryResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
  tags?: InputMaybe<TagOr>;
};


export type ResourceManagerQueryQueryResourceTypesArgs = {
  byName?: InputMaybe<Scalars['String']['input']>;
};


export type ResourceManagerQueryQueryResourcesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  poolId: Scalars['ID']['input'];
};


export type ResourceManagerQueryQueryResourcesByAltIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  input: Scalars['Map']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  poolId?: InputMaybe<Scalars['ID']['input']>;
};


export type ResourceManagerQueryQueryRootResourcePoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filterByResources?: InputMaybe<Scalars['Map']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  resourceTypeId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<SortResourcePoolsInput>;
  tags?: InputMaybe<TagOr>;
};


export type ResourceManagerQuerySearchPoolsByTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<TagOr>;
};


export type ResourceManagerQueryNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SchedulerMutation = {
  __typename?: 'schedulerMutation';
  createSchedule: Schedule;
  deleteSchedule: Scalars['Boolean']['output'];
  updateSchedule: Schedule;
};


export type SchedulerMutationCreateScheduleArgs = {
  input: CreateScheduleInput;
};


export type SchedulerMutationDeleteScheduleArgs = {
  name: Scalars['String']['input'];
};


export type SchedulerMutationUpdateScheduleArgs = {
  input: UpdateScheduleInput;
  name: Scalars['String']['input'];
};

export type SchedulerQuery = {
  __typename?: 'schedulerQuery';
  schedule: Maybe<Schedule>;
  schedules: Maybe<ScheduleConnection>;
};


export type SchedulerQueryScheduleArgs = {
  name: Scalars['String']['input'];
};


export type SchedulerQuerySchedulesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SchedulesFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFileMutationVariables = Exact<{
  input: CsvImportInput;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', importCSV: { __typename?: 'CSVImport', isOk: boolean | null } | null } };

export type ZonesImportQueryVariables = Exact<{ [key: string]: never; }>;


export type ZonesImportQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', zones: { __typename?: 'ZonesConnection', edges: Array<{ __typename?: 'ZoneEdge', node: { __typename?: 'Zone', id: string, name: string } }> } } };

export type AddBlueprintMutationVariables = Exact<{
  input: AddBlueprintInput;
}>;


export type AddBlueprintMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', addBlueprint: { __typename?: 'AddBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string, createdAt: string, name: string } } } };

export type AddDeviceMutationVariables = Exact<{
  input: AddDeviceInput;
}>;


export type AddDeviceMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', addDevice: { __typename?: 'AddDevicePayload', device: { __typename?: 'Device', id: string, name: string, isInstalled: boolean, zone: { __typename?: 'Zone', id: string, name: string } } } } };

export type ZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type ZonesQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', zones: { __typename?: 'ZonesConnection', edges: Array<{ __typename?: 'ZoneEdge', node: { __typename?: 'Zone', id: string, name: string } }> } } };

export type DeviceBlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type DeviceBlueprintsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', blueprints: { __typename?: 'BlueprintConnection', edges: Array<{ __typename?: 'BlueprintEdge', node: { __typename?: 'Blueprint', id: string, name: string, template: string } }> } } };

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', newLabel: { __typename?: 'CreateLabelPayload', label: { __typename?: 'Label', id: string, name: string, createdAt: string, updatedAt: string } | null } } };

export type LabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type LabelsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } };

export type AddLocationMutationVariables = Exact<{
  addLocationInput: AddLocationInput;
}>;


export type AddLocationMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', addLocation: { __typename?: 'AddLocationPayload', location: { __typename?: 'Location', id: string } } } };

export type LocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type LocationsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', locations: { __typename?: 'LocationConnection', edges: Array<{ __typename?: 'LocationEdge', node: { __typename?: 'Location', id: string, latitude: number | null, longitude: number | null, name: string } }> } } };

export type AddStreamMutationVariables = Exact<{
  input: AddStreamInput;
}>;


export type AddStreamMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', addStream: { __typename?: 'AddStreamPayload', stream: { __typename?: 'Stream', id: string, deviceName: string, streamName: string } } } };

export type DevicesAndBlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type DevicesAndBlueprintsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', streams: { __typename?: 'StreamConnection', edges: Array<{ __typename?: 'StreamEdge', node: { __typename?: 'Stream', id: string, deviceName: string, streamName: string } }> }, devices: { __typename?: 'DeviceConnection', edges: Array<{ __typename?: 'DeviceEdge', node: { __typename?: 'Device', id: string, name: string } }> }, blueprints: { __typename?: 'BlueprintConnection', edges: Array<{ __typename?: 'BlueprintEdge', node: { __typename?: 'Blueprint', id: string, name: string, template: string } }> } } };

export type BlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type BlueprintsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', blueprints: { __typename?: 'BlueprintConnection', edges: Array<{ __typename?: 'BlueprintEdge', node: { __typename?: 'Blueprint', id: string, createdAt: string, name: string } }> } } };

export type DeleteBlueprintMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBlueprintMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', deleteBlueprint: { __typename?: 'DeleteBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string } | null } } };

export type DeviceNameQueryVariables = Exact<{
  deviceId: Scalars['ID']['input'];
}>;


export type DeviceNameQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', node: { __typename?: 'AllocationStrategy' } | { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device', id: string, name: string } | { __typename?: 'EventHandler' } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'PropertyType' } | { __typename?: 'Resource' } | { __typename?: 'ResourcePool' } | { __typename?: 'ResourceType' } | { __typename?: 'Stream' } | { __typename?: 'Tag' } | { __typename?: 'TaskDefinition' } | { __typename?: 'Workflow' } | { __typename?: 'WorkflowDefinition' } | { __typename?: 'WorkflowTask' } | { __typename?: 'Zone' } | null } };

export type DataStoreQueryVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type DataStoreQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', dataStore: { __typename?: 'DataStore', config: string, operational: string, snapshots: Array<{ __typename?: 'Snapshot', name: string, createdAt: string }> } | null } };

export type UpdateDataStoreMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
  input: UpdateDataStoreInput;
}>;


export type UpdateDataStoreMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateDataStore: { __typename?: 'UpdateDataStorePayload', dataStore: { __typename?: 'DataStore', config: string, operational: string } } } };

export type CommitDataStoreConfigMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  input: CommitConfigInput;
}>;


export type CommitDataStoreConfigMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', commitConfig: { __typename?: 'CommitConfigPayload', output: { __typename?: 'CommitConfigOutput', configuration: string | null, message: string | null } } } };

export type ResetConfigMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type ResetConfigMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', resetConfig: { __typename?: 'ResetConfigPayload', dataStore: { __typename?: 'DataStore', config: string, operational: string } } } };

export type AddSnapshotMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  input: AddSnapshotInput;
}>;


export type AddSnapshotMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', addSnapshot: { __typename?: 'AddSnapshotPayload', snapshot: { __typename?: 'Snapshot', name: string } | null } | null } };

export type ApplySnapshotMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
  input: ApplySnapshotInput;
}>;


export type ApplySnapshotMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', applySnapshot: { __typename?: 'ApplySnapshotPayload', isOk: boolean } } };

export type SyncFromNetworkMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type SyncFromNetworkMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', syncFromNetwork: { __typename?: 'SyncFromNetworkPayload', dataStore: { __typename?: 'DataStore', operational: string } | null } } };

export type DeleteSnapshotMutationVariables = Exact<{
  input: DeleteSnapshotInput;
}>;


export type DeleteSnapshotMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', deleteSnapshot: { __typename?: 'DeleteSnapshotPayload', snapshot: { __typename?: 'Snapshot', name: string } | null } | null } };

export type CreateTransactionMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', createTransaction: { __typename?: 'CreateTransactionPayload', transactionId: string | null } } };

export type CloseTransactionMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type CloseTransactionMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', closeTransaction: { __typename?: 'CloseTransactionPayload', isOk: boolean } } };

export type CalculatedDiffQueryVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type CalculatedDiffQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', calculatedDiff: { __typename?: 'CalculatedDiffPayload', result: { __typename?: 'CalculatedDiffResult', createdData: Array<{ __typename?: 'DiffData', path: string, data: string }>, deletedData: Array<{ __typename?: 'DiffData', path: string, data: string }>, updatedData: Array<{ __typename?: 'CalculatedUpdateDiffData', path: string, actualData: string, intendedData: string }> } } } };

export type DevicesQueryVariables = Exact<{
  labels?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  deviceName?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<DeviceOrderByInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type DevicesQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', devices: { __typename?: 'DeviceConnection', edges: Array<{ __typename?: 'DeviceEdge', node: { __typename?: 'Device', id: string, name: string, address: string | null, createdAt: string, discoveredAt: string | null, isInstalled: boolean, serviceState: DeviceServiceState, version: string | null, model: string | null, software: string | null, mountParameters: string | null, zone: { __typename?: 'Zone', id: string, name: string } } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type InstallDeviceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type InstallDeviceMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', installDevice: { __typename?: 'InstallDevicePayload', device: { __typename?: 'Device', id: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState } } } };

export type UninstallDeviceMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UninstallDeviceMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', uninstallDevice: { __typename?: 'UninstallDevicePayload', device: { __typename?: 'Device', id: string, createdAt: string, isInstalled: boolean, serviceState: DeviceServiceState } } } };

export type FilterLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FilterLabelsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } };

export type DeleteDeviceMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type DeleteDeviceMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', deleteDevice: { __typename?: 'DeleteDevicePayload', device: { __typename?: 'Device', id: string } | null } } };

export type BulkInstallDevicesMutationVariables = Exact<{
  input: BulkInstallDevicesInput;
}>;


export type BulkInstallDevicesMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', bulkInstallDevices: { __typename?: 'BulkInstallDevicePayload', installedDevices: Array<{ __typename?: 'Device', id: string }> } } };

export type ExecuteModalWorkflowByNameMutationVariables = Exact<{
  input: ExecuteWorkflowByNameInput;
}>;


export type ExecuteModalWorkflowByNameMutation = { __typename?: 'Mutation', conductor: { __typename?: 'conductorMutation', executeWorkflowByName: string | null } };

export type KafkaHealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type KafkaHealthCheckQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', kafkaHealthCheck: { __typename?: 'IsOkResponse', isOk: boolean } | null } };

export type KafkaReconnectMutationVariables = Exact<{ [key: string]: never; }>;


export type KafkaReconnectMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', reconnectKafka: { __typename?: 'IsOkResponse', isOk: boolean } | null } };

export type DevicesUsageSubscriptionVariables = Exact<{
  deviceNames: Array<Scalars['String']['input']> | Scalars['String']['input'];
  refreshEverySec?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DevicesUsageSubscription = { __typename?: 'Subscription', deviceInventory: { __typename?: 'deviceInventorySubscription', devicesUsage: { __typename?: 'DeviceListUsage', devicesUsage: Array<{ __typename?: 'DevicesUsage', cpuLoad: number | null, deviceName: string, memoryLoad: number | null }> } | null } };

export type DevicesConnectionSubscriptionVariables = Exact<{
  targetDevices: Array<Scalars['String']['input']> | Scalars['String']['input'];
  connectionTimeout?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DevicesConnectionSubscription = { __typename?: 'Subscription', deviceInventory: { __typename?: 'deviceInventorySubscription', devicesConnection: { __typename?: 'DevicesConnection', deviceStatuses: Array<{ __typename?: 'DeviceStatus', deviceName: string | null, status: string | null } | null> | null } | null } };

export type DiscoveryWorkflowsQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscoveryWorkflowsQuery = { __typename?: 'Query', conductor: { __typename?: 'conductorQuery', getAll: Array<{ __typename?: 'WorkflowDef', name: string, version: number | null } | null> | null } };

export type ModalWorkflowsQueryVariables = Exact<{ [key: string]: never; }>;


export type ModalWorkflowsQuery = { __typename?: 'Query', conductor: { __typename?: 'conductorQuery', getAll: Array<{ __typename?: 'WorkflowDef', name: string, description: string | null, version: number | null, createdBy: string | null, updatedBy: string | null, inputParameters: Array<string | null> | null, outputParameters: any | null, restartable: boolean | null, timeoutSeconds: any, timeoutPolicy: Mutation_GetWorkflows_AdditionalProperties_Items_Tasks_Items_WorkflowTask_SubWorkflowParam_WorkflowDefinition_TimeoutPolicy | null, ownerEmail: string | null, schemaVersion: number | null, variables: any | null } | null> | null } };

export type BlueprintQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BlueprintQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', blueprint: { __typename?: 'AllocationStrategy', id: string } | { __typename?: 'Blueprint', name: string, template: string, id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', id: string } | { __typename?: 'EventHandler', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'PropertyType', id: string } | { __typename?: 'Resource', id: string } | { __typename?: 'ResourcePool', id: string } | { __typename?: 'ResourceType', id: string } | { __typename?: 'Stream', id: string } | { __typename?: 'Tag', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'WorkflowDefinition', id: string } | { __typename?: 'WorkflowTask', id: string } | { __typename?: 'Zone', id: string } | null } };

export type UpdateBlueprintMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateBlueprintInput;
}>;


export type UpdateBlueprintMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateBlueprint: { __typename?: 'UpdateBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string, name: string, template: string } } } };

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeviceQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', device: { __typename?: 'AllocationStrategy', id: string } | { __typename?: 'Blueprint', id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', name: string, serviceState: DeviceServiceState, model: string | null, vendor: string | null, address: string | null, deviceSize: DeviceSize, mountParameters: string | null, id: string, zone: { __typename?: 'Zone', id: string, name: string }, labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } | { __typename?: 'EventHandler', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'PropertyType', id: string } | { __typename?: 'Resource', id: string } | { __typename?: 'ResourcePool', id: string } | { __typename?: 'ResourceType', id: string } | { __typename?: 'Stream', id: string } | { __typename?: 'Tag', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'WorkflowDefinition', id: string } | { __typename?: 'WorkflowTask', id: string } | { __typename?: 'Zone', id: string } | null } };

export type UpdateDeviceMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateDeviceInput;
}>;


export type UpdateDeviceMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateDevice: { __typename?: 'UpdateDevicePayload', device: { __typename?: 'Device', id: string, name: string, model: string | null, vendor: string | null, address: string | null, isInstalled: boolean, zone: { __typename?: 'Zone', id: string, name: string } } | null } } };

export type StreamQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StreamQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', stream: { __typename?: 'AllocationStrategy', id: string } | { __typename?: 'Blueprint', id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', id: string } | { __typename?: 'EventHandler', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'PropertyType', id: string } | { __typename?: 'Resource', id: string } | { __typename?: 'ResourcePool', id: string } | { __typename?: 'ResourceType', id: string } | { __typename?: 'Stream', streamName: string, deviceName: string, streamParameters: string | null, id: string } | { __typename?: 'Tag', id: string } | { __typename?: 'TaskDefinition', id: string } | { __typename?: 'Workflow', id: string } | { __typename?: 'WorkflowDefinition', id: string } | { __typename?: 'WorkflowTask', id: string } | { __typename?: 'Zone', id: string } | null, streams: { __typename?: 'StreamConnection', edges: Array<{ __typename?: 'StreamEdge', node: { __typename?: 'Stream', id: string, deviceName: string, streamName: string } }> }, devices: { __typename?: 'DeviceConnection', edges: Array<{ __typename?: 'DeviceEdge', node: { __typename?: 'Device', id: string, name: string } }> }, blueprints: { __typename?: 'BlueprintConnection', edges: Array<{ __typename?: 'BlueprintEdge', node: { __typename?: 'Blueprint', id: string, name: string, template: string } }> } } };

export type UpdateStreamMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateStreamInput;
}>;


export type UpdateStreamMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateStream: { __typename?: 'UpdateStreamPayload', stream: { __typename?: 'Stream', id: string, streamName: string, deviceName: string, isActive: boolean } | null } } };

export type StreamsQueryVariables = Exact<{
  labels?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  streamName?: InputMaybe<Scalars['String']['input']>;
  deviceName?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<StreamOrderByInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type StreamsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', streams: { __typename?: 'StreamConnection', edges: Array<{ __typename?: 'StreamEdge', node: { __typename?: 'Stream', id: string, streamName: string, deviceName: string, createdAt: string, startedAt: string | null, stoppedAt: string | null, isActive: boolean } }>, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type ActivateStreamMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ActivateStreamMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', activateStream: { __typename?: 'ActivateStreamPayload', stream: { __typename?: 'Stream', id: string, createdAt: string, isActive: boolean } } } };

export type DeactivateStreamMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeactivateStreamMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', deactivateStream: { __typename?: 'DeactivateStreamPayload', stream: { __typename?: 'Stream', id: string, createdAt: string, isActive: boolean } } } };

export type DeleteStreamMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteStreamMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', deleteStream: { __typename?: 'DeleteStreamPayload', stream: { __typename?: 'Stream', id: string } | null } } };

export type BulkActivateStreamsMutationVariables = Exact<{
  input: BulkInstallStreamsInput;
}>;


export type BulkActivateStreamsMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', bulkInstallStreams: { __typename?: 'BulkInstallStreamPayload', installedStreams: Array<{ __typename?: 'Stream', id: string }> } } };

export type StreamFilterLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type StreamFilterLabelsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } };

export type BulkDeactivateStreamsMutationVariables = Exact<{
  input: BulkUninstallStreamsInput;
}>;


export type BulkDeactivateStreamsMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', bulkUninstallStreams: { __typename?: 'BulkUninstallStreamPayload', uninstalledStreams: Array<{ __typename?: 'Stream', id: string }> } } };

export type TransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', transactions: Array<{ __typename?: 'Transaction', transactionId: string, lastCommitTime: string, changes: Array<{ __typename?: 'TransactionChange', device: { __typename?: 'Device', id: string, name: string }, diff: Array<{ __typename?: 'TransactionDiff', path: string, dataBefore: string | null, dataAfter: string | null }> }> }> } };

export type RevertChangesMutationVariables = Exact<{
  transactionId: Scalars['String']['input'];
}>;


export type RevertChangesMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', revertChanges: { __typename?: 'RevertChangesPayload', isOk: boolean } } };

export type CloseTransactionListMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
  transactionId: Scalars['String']['input'];
}>;


export type CloseTransactionListMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', closeTransaction: { __typename?: 'CloseTransactionPayload', isOk: boolean } } };

export type TerminalSubscriptionVariables = Exact<{
  sessionId: Scalars['String']['input'];
  command?: InputMaybe<Scalars['String']['input']>;
  trigger?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TerminalSubscription = { __typename?: 'Subscription', deviceInventory: { __typename?: 'deviceInventorySubscription', uniconfigShell: string | null } };

export type SessionIdQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionIdQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', uniconfigShellSession: string | null } };
