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

/** Response from the commonNodes query that wraps the list of found common nodes in the database. */
export type CommonNodesResponse = {
  __typename?: 'CommonNodesResponse';
  /** List of the common node names. Common nodes contain connection to all nodes specified on the input. */
  commonNodes: Array<Scalars['String']['output']>;
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

/** Input of the updateCoordinates mutation that contains information about updated coordinates of a node. */
export type CoordinatesInput = {
  /** Name of the node in the topology. */
  nodeName: Scalars['String']['input'];
  /** Type of the node in the topology. */
  nodeType: CoordinatesNodeType;
  /** Updated horizontal coordinate of the node on the graph. */
  x: Scalars['Float']['input'];
  /** Updated vertical coordinate of the node on the graph. */
  y: Scalars['Float']['input'];
};

/** Type of the node in the topology for which the coordinates are being updated. */
export type CoordinatesNodeType =
  /** Node that represent device in a topology (for example, PhyDevice or NetDevice collections). */
  | 'DEVICE'
  /** Node that represents IP network in the network topology (NetNetwork collection). */
  | 'NETWORK';

/** Response from the updateCoordinates query that contains information about updated coordinated of selected nodes. */
export type CoordinatesResponse = {
  __typename?: 'CoordinatesResponse';
  /** Devices that exist in the database. */
  installed: InstalledDevices;
  /** List of node names that do not exist in the database. */
  notInstalled: Array<Scalars['String']['output']>;
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

/** Response from the createBackup mutation that contains information about created backup. */
export type CreateBackupResponse = {
  __typename?: 'CreateBackupResponse';
  /** Name of the created backup database. Format: f"backup_{datetime.today().strftime('%Y%m%d%H%M%S')}". */
  dbName: Scalars['String']['output'];
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

/** Response from the deleteBackups mutation that contains information about removed backups. */
export type DeleteBackupsResponse = {
  __typename?: 'DeleteBackupsResponse';
  /** Names of the removed databases that contained backups. */
  deletedBackups: Array<Scalars['String']['output']>;
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

export type DeleteLocationPayload = {
  __typename?: 'DeleteLocationPayload';
  location: Location;
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

/** Device GeoLocation data. */
export type DeviceGeoLocation = {
  __typename?: 'DeviceGeoLocation';
  /** Defining the area around the device, with four elements indicating its boundaries. */
  bbox: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  /** Device location coordinates providing longitude and latitude (in this order, based on GeoJSON convention). */
  coordinates: Array<Scalars['Float']['output']>;
  /** Type of geometry. */
  type: GeometryType;
};

export type DeviceListUsage = {
  __typename?: 'DeviceListUsage';
  devicesUsage: Array<DevicesUsage>;
};

/** Representation of the device in the metadata. */
export type DeviceMetadata = Node & {
  __typename?: 'DeviceMetadata';
  /** Human readable name of the device. */
  deviceName: Scalars['String']['output'];
  /** Type of the device (ex. router). */
  deviceType: Maybe<Scalars['String']['output']>;
  /** Device geographic data of point type in GeoJson format. */
  geoLocation: Maybe<DeviceGeoLocation>;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Model of the device (XR, ASR). */
  model: Maybe<Scalars['String']['output']>;
  nodes: Maybe<Array<Maybe<GeoMapDevice>>>;
  /** Protocol used for management for the device (cli, netconf, gnmi). */
  protocolType: Maybe<Array<Scalars['String']['output']>>;
  /** Vendor of the device (ex. Cisco). */
  vendor: Maybe<Scalars['String']['output']>;
  /** Version of the device software (ex. 6.0.1). */
  version: Maybe<Scalars['String']['output']>;
};

/** Grouped Metadata device object and associated cursor used by pagination. */
export type DeviceMetadataEdge = {
  __typename?: 'DeviceMetadataEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated MetadataDevice object. */
  node: Maybe<DeviceMetadata>;
};

/** Filter for Metadata device type based on device name, or other attributes. */
export type DeviceMetadataFilter = {
  /** Regex of device name. */
  deviceName?: InputMaybe<Scalars['String']['input']>;
  /**
   * A GeoJSON Polygon shape used for filtering devices based on their location in this area.
   *
   * The GeoJSON Polygon consists of a series of closed LineString objects (ring-like).
   * These Linear Ring objects consist of four or more coordinate pairs with the first and last coordinate
   * pair being equal. Coordinate pairs of a Polygon are an array of linear ring coordinate arrays.
   * The first element in the array represents the exterior ring.
   * Any subsequent elements represent interior rings (holes within the surface).
   *
   * The orientation of the first linear ring is crucial: the right-hand-rule is applied, so that the area to the left
   * of the path of the linear ring (when walking on the surface of the Earth) is considered to be the “interior”
   * of the polygon. All other linear rings must be contained within this interior.
   *
   * Example with a hole:
   * [
   *     [
   *         [100.0, 0.0],
   *         [101.0, 0.0],
   *         [101.0, 1.0],
   *         [100.0, 1.0],
   *         [100.0, 0.0]
   *     ],
   *     [
   *         [100.8, 0.8],
   *         [100.8, 0.2],
   *         [100.2, 0.2],
   *         [100.2, 0.8],
   *         [100.8, 0.8]
   *     ]
   * ]
   */
  polygon?: InputMaybe<Array<Array<Array<Scalars['Float']['input']>>>>;
  /** Topology in which device must be present. */
  topologyType?: InputMaybe<TopologyType>;
};

export type DeviceNeighbors = {
  __typename?: 'DeviceNeighbors';
  neighbors: Maybe<Array<Maybe<Neighbor>>>;
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

export type FilterDevicesMetadatasInput = {
  deviceName?: InputMaybe<Scalars['String']['input']>;
  polygon?: InputMaybe<PolygonInput>;
  topologyType?: InputMaybe<TopologyType>;
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

export type FilterLocationsInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FilterNeighborInput = {
  deviceName: Scalars['String']['input'];
  topologyType: TopologyType;
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
  locationName: Maybe<Scalars['String']['output']>;
};

export type Geolocation = {
  __typename?: 'Geolocation';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

/** Type of geometry. */
export type GeometryType =
  | 'POINT';

export type GraphEdge = {
  __typename?: 'GraphEdge';
  id: Scalars['ID']['output'];
  source: EdgeSourceTarget;
  target: EdgeSourceTarget;
  weight: Maybe<Scalars['Int']['output']>;
};

export type GraphEdgeStatus =
  | 'OK'
  | 'UNKNOWN';

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

export type InstalledDevices = {
  __typename?: 'InstalledDevices';
  /** List of node names which coordinates have not been updated. */
  notUpdated: Array<Scalars['String']['output']>;
  /** List of node names which coordinates have been updated. */
  updated: Array<Scalars['String']['output']>;
};

export type InventoryLspTunnel = {
  __typename?: 'InventoryLspTunnel';
  fromDevice: Maybe<Scalars['String']['output']>;
  lspId: Scalars['String']['output'];
  signalization: Maybe<Signalization>;
  toDevice: Maybe<Scalars['String']['output']>;
  uptime: Maybe<Scalars['Int']['output']>;
};

export type InventoryMplsData = {
  __typename?: 'InventoryMplsData';
  inputInterface: Maybe<Scalars['String']['output']>;
  inputLabel: Maybe<Scalars['Int']['output']>;
  ldpPrefix: Maybe<Scalars['String']['output']>;
  lspId: Scalars['String']['output'];
  mplsOperation: Maybe<Scalars['String']['output']>;
  operState: Maybe<Scalars['String']['output']>;
  outputInterface: Maybe<Scalars['String']['output']>;
  outputLabel: Maybe<Scalars['Int']['output']>;
};

export type InventoryMplsDeviceDetails = {
  __typename?: 'InventoryMplsDeviceDetails';
  lspTunnels: Maybe<Array<Maybe<InventoryLspTunnel>>>;
  mplsData: Maybe<Array<Maybe<InventoryMplsData>>>;
};

export type InventoryNetInterface = {
  __typename?: 'InventoryNetInterface';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type InventoryNetNetwork = {
  __typename?: 'InventoryNetNetwork';
  coordinates: GraphNodeCoordinates;
  id: Scalars['String']['output'];
  subnet: Scalars['String']['output'];
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

export type LocationOrderByInput = {
  direction: SortDirection;
  sortKey: SortLocationBy;
};

export type LspPath = {
  __typename?: 'LspPath';
  metadata: Maybe<LspPathMetadata>;
  path: Array<Scalars['String']['output']>;
};

export type LspPathMetadata = {
  __typename?: 'LspPathMetadata';
  fromDevice: Maybe<Scalars['String']['output']>;
  signalization: Maybe<Scalars['String']['output']>;
  toDevice: Maybe<Scalars['String']['output']>;
  uptime: Maybe<Scalars['Int']['output']>;
};

/** LSP Tunnel (related to tunnel originating from this device). */
export type LspTunnel = {
  __typename?: 'LspTunnel';
  /** From which device is the tunnel originating. */
  fromDevice: Maybe<Scalars['String']['output']>;
  /** Name of the link state packet. */
  lspId: Scalars['String']['output'];
  /** Type of signalisation. */
  signalisation: Signalisation;
  /** Where is the tunnel headed. */
  toDevice: Maybe<Scalars['String']['output']>;
  /** Uptime of the tunnel in seconds. */
  uptime: Maybe<Scalars['Int']['output']>;
};

/** Grouped list of Metadata device objects and pagination metadata. */
export type MetadataConnection = {
  __typename?: 'MetadataConnection';
  /** List of Metadata device objects. */
  edges: Maybe<Array<Maybe<DeviceMetadataEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** MPLS Data (related to all tunnels). */
export type MplsData = {
  __typename?: 'MplsData';
  /** The input interface. */
  inInterface: Maybe<Scalars['String']['output']>;
  /** The input label. */
  inLabel: Maybe<Scalars['Int']['output']>;
  /** Name of the link state packet. */
  lspId: Scalars['String']['output'];
  /** The operation type. */
  mplsOperation: Maybe<MplsOperation>;
  /** Operational state of the device. */
  operState: Maybe<Scalars['String']['output']>;
  /** The input interface. */
  outInterface: Maybe<Scalars['String']['output']>;
  /** The output label. */
  outLabel: Maybe<Scalars['Int']['output']>;
  /** Type of signalisation. */
  signalisation: Maybe<Signalisation>;
};

/** Representation of the device in the MPLS topology. */
export type MplsDevice = Node & {
  __typename?: 'MplsDevice';
  /** Coordinates of the device node on the graph. */
  coordinates: TopologyCoordinates;
  /** Details of the device. */
  details: MplsDeviceDetails;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** List of strings that can be used for grouping of synced devices. */
  labels: Maybe<Array<Scalars['String']['output']>>;
  /** List of ports that are present on the device. */
  mplsInterfaces: MplsInterfaceConnection;
  /** Human readable name of the device. */
  name: Scalars['String']['output'];
  /** Status of the device from the view of the synced topology. */
  status: NodeStatus;
};


/** Representation of the device in the MPLS topology. */
export type MplsDeviceMplsInterfacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<MplsInterfaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of MplsDevice objects and pagination metadata. */
export type MplsDeviceConnection = {
  __typename?: 'MplsDeviceConnection';
  /** List of MplsDevice objects. */
  edges: Maybe<Array<Maybe<MplsDeviceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Details specific to MPLS (Multi-Protocol Label Switching). */
export type MplsDeviceDetails = {
  __typename?: 'MplsDeviceDetails';
  lspTunnels: Maybe<Array<Maybe<LspTunnel>>>;
  mplsData: Maybe<Array<Maybe<MplsData>>>;
  routerId: Maybe<Scalars['String']['output']>;
};

/** Grouped MplsDevice object and associated cursor used by pagination. */
export type MplsDeviceEdge = {
  __typename?: 'MplsDeviceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated MplsDevice object. */
  node: Maybe<MplsDevice>;
};

/** Filter for MplsDevice type based on device label and device name. */
export type MplsDeviceFilter = {
  /** Device label. */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Regex of device name. */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type MplsGraphNode = {
  __typename?: 'MplsGraphNode';
  coordinates: GraphNodeCoordinates;
  id: Scalars['ID']['output'];
  interfaces: Array<MplsGraphNodeInterface>;
  labels: Maybe<Array<Scalars['String']['output']>>;
  mplsDeviceDetails: InventoryMplsDeviceDetails;
  name: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
  status: GraphEdgeStatus;
};

export type MplsGraphNodeInterface = {
  __typename?: 'MplsGraphNodeInterface';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: GraphEdgeStatus;
};

/** Port attached to the MPLS device. */
export type MplsInterface = Node & {
  __typename?: 'MplsInterface';
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Device that owns this interface. */
  mplsDevice: Maybe<MplsDevice>;
  /** Link to connected remote MPLS device. */
  mplsLinks: Maybe<MplsLinkConnection>;
  /** Human readable name of the network port. */
  name: Scalars['String']['output'];
  /** Status of the interface from the view of the synced topology ('ok' or 'unknown'). */
  status: NodeStatus;
};


/** Port attached to the MPLS device. */
export type MplsInterfaceMplsLinksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of MplsInterface objects and pagination metadata. */
export type MplsInterfaceConnection = {
  __typename?: 'MplsInterfaceConnection';
  /** List of MplsInterface objects. */
  edges: Maybe<Array<Maybe<MplsInterfaceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped MplsInterface object and associated cursor used by pagination. */
export type MplsInterfaceEdge = {
  __typename?: 'MplsInterfaceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated MplsInterface object. */
  node: Maybe<MplsInterface>;
};

/** Filter for MplsInterface type based on the current interface status and name of the device. */
export type MplsInterfaceFilter = {
  /** Regex of interface name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Status of the interface from the view of the synced topology. */
  status?: InputMaybe<NodeStatus>;
};

/** Grouped list of MplsLinks objects and pagination metadata. */
export type MplsLinkConnection = {
  __typename?: 'MplsLinkConnection';
  /** List of MplsInterface objects. */
  edges: Maybe<Array<Maybe<MplsLinkEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped MplsLink object and associated cursor used by pagination. */
export type MplsLinkEdge = {
  __typename?: 'MplsLinkEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device */
  link: Maybe<Scalars['ID']['output']>;
  /** The associated MplsInterface object. */
  node: Maybe<MplsInterface>;
};

export type MplsLspCount = {
  __typename?: 'MplsLspCount';
  counts: Maybe<Array<Maybe<MplsLspCountItem>>>;
};

export type MplsLspCountItem = {
  __typename?: 'MplsLspCountItem';
  incomingLsps: Maybe<Scalars['Int']['output']>;
  outcomingLsps: Maybe<Scalars['Int']['output']>;
  target: Maybe<Scalars['String']['output']>;
};

export type MplsLspMetadata = {
  __typename?: 'MplsLspMetadata';
  /** From which device is the tunnel originating. */
  fromDevice: Scalars['String']['output'];
  /** Type of signalisation. */
  signalisation: Scalars['String']['output'];
  /** Where is the tunnel headed. */
  toDevice: Scalars['String']['output'];
  /** Uptime of the tunnel in seconds. */
  uptime: Maybe<Scalars['Int']['output']>;
};

export type MplsLspPath = {
  __typename?: 'MplsLspPath';
  /** LSP metadata. */
  lspMetadata: Maybe<MplsLspMetadata>;
  /** Ordered list of link IDs & device IDs on the path. */
  path: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type MplsOperation =
  | 'NOOP'
  | 'POP'
  | 'PUSH'
  | 'SWAP';

export type MplsTopology = {
  __typename?: 'MplsTopology';
  edges: Array<GraphEdge>;
  nodes: Array<MplsGraphNode>;
};

export type MplsTopologyVersionData = {
  __typename?: 'MplsTopologyVersionData';
  edges: Array<GraphVersionEdge>;
  nodes: Array<MplsGraphNode>;
};

export type MplsTotalLsps = {
  __typename?: 'MplsTotalLsps';
  /** Number of incoming LSPs. */
  incomingLsps: Maybe<Scalars['Int']['output']>;
  /** Number of outcoming LSPs. */
  outcomingLsps: Maybe<Scalars['Int']['output']>;
  /** To which device the LSP is headed. */
  toDevice: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  conductor: ConductorMutation;
  deviceInventory: DeviceInventoryMutation;
  resourceManager: ResourceManagerMutation;
  scheduler: SchedulerMutation;
  topologyDiscovery: TopologyDiscoveryMutation;
};

/** Metadata information about a neighbor device. */
export type Neighbor = {
  __typename?: 'Neighbor';
  /** Identifier of the neighbor device document (for example, MplsDevice/1). */
  deviceId: Scalars['String']['output'];
  /** Human-readable name of the neighbor device (for example, CPE_01). */
  deviceName: Scalars['String']['output'];
};

/** Representation of the routing entity in the network topology. */
export type NetDevice = Node & {
  __typename?: 'NetDevice';
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Interfaces that are used for connecting to other routing entities. */
  netInterfaces: NetInterfaceConnection;
  /** Networks that are attached to the routing entity. */
  netNetworks: NetNetworkConnection;
  /** Identifier of OSPF area formatted as IPv4 address (for example, 0.0.0.0 represents area 0). */
  ospfAreaId: Scalars['String']['output'];
  /** Linked device in the physical topology. */
  phyDevice: Maybe<PhyDevice>;
  /** Identifier of the routing entity (usually IPv4 address). RouterId and ospfAreaId together compose a unique key. */
  routerId: Scalars['String']['output'];
};


/** Representation of the routing entity in the network topology. */
export type NetDeviceNetInterfacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<NetInterfaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


/** Representation of the routing entity in the network topology. */
export type NetDeviceNetNetworksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<NetNetworkFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of NetDevice objects and pagination metadata. */
export type NetDeviceConnection = {
  __typename?: 'NetDeviceConnection';
  /** List of NetDevice objects. */
  edges: Maybe<Array<Maybe<NetDeviceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped NetDevice object and associated cursor used by pagination. */
export type NetDeviceEdge = {
  __typename?: 'NetDeviceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated NetDevice object. */
  node: Maybe<NetDevice>;
};

/** Filter for NetDevice type based on router identifier and area identifier. */
export type NetDeviceFilter = {
  /** OSPF area identifier formatted as IPv4 address (for example, 0.0.0.0 represents area 0). */
  ospfAreaId?: InputMaybe<Scalars['String']['input']>;
  /** Regex of router identifier of the routing entity (usually IPv4 address). */
  routerId?: InputMaybe<Scalars['String']['input']>;
};

/** Network interface attached to the network device. */
export type NetInterface = Node & {
  __typename?: 'NetInterface';
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** IGP metric configured on the network interface. */
  igpMetric: Maybe<Scalars['Int']['output']>;
  /** IP address configured on the interface. */
  ipAddress: Scalars['String']['output'];
  /** Routing entity that owns this interface. */
  netDevice: Maybe<NetDevice>;
  /** Links to connected remote network devices. */
  netLinks: NetLinkConnection;
};


/** Network interface attached to the network device. */
export type NetInterfaceNetLinksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of NetInterface objects and pagination metadata. */
export type NetInterfaceConnection = {
  __typename?: 'NetInterfaceConnection';
  /** List of NetInterface objects. */
  edges: Maybe<Array<Maybe<NetInterfaceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped NetInterface object and associated cursor used by pagination. */
export type NetInterfaceEdge = {
  __typename?: 'NetInterfaceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated NetInterface object. */
  node: Maybe<NetInterface>;
};

/** Filter for NetInterface type based on the configured IP address. */
export type NetInterfaceFilter = {
  /** Regex of IP address configured on the interface. */
  ipAddress?: InputMaybe<Scalars['String']['input']>;
};

export type NetLinkAttributes = {
  __typename?: 'NetLinkAttributes';
  /** A list of admin group masks on the network interface. (Group Number) */
  adminGroup: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  /** IGP metric configured on the network interface. */
  igpMetric: Maybe<Scalars['Int']['output']>;
  /** The maximum link bandwidth of the network interface. (Bytes per second) */
  maxLinkBandwidth: Maybe<Scalars['Float']['output']>;
  /** The maximum reservable link bandwidth of the network interface. (Bytes per second) */
  maxReservableLinkBandwidth: Maybe<Scalars['Float']['output']>;
  /** A list of shared risk link groups on the network interface. */
  sharedRiskLinkGroup: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  /** Traffic Engineering metric on the network interface. */
  trafficEngineeringMetric: Maybe<Scalars['Int']['output']>;
  /** The unreserved bandwidth on the network interface. (Bytes per second) */
  unreservedBandwidth: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

/** Grouped list of NetLinks objects and pagination metadata. */
export type NetLinkConnection = {
  __typename?: 'NetLinkConnection';
  /** List of NetInterface objects. */
  edges: Maybe<Array<Maybe<NetLinkEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

export type NetLinkEdge = {
  __typename?: 'NetLinkEdge';
  /** List of attributes associated to the link. */
  attributes: Maybe<NetLinkAttributes>;
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device */
  link: Maybe<Scalars['ID']['output']>;
  /** The associated NetInterface object. */
  node: Maybe<NetInterface>;
};

/** IP subnet in the network topology. */
export type NetNetwork = Node & {
  __typename?: 'NetNetwork';
  /** Coordinates of the network node on the graph. */
  coordinates: TopologyCoordinates;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Type of the OSPF network (LSA type). */
  ospfRouteType: Scalars['Int']['output'];
  /** Network address including prefix length expressed in the CIDR notation (e.g. 10.0.0.0/24). */
  subnet: Scalars['String']['output'];
};

/** Grouped list of NetNetwork objects and pagination metadata. */
export type NetNetworkConnection = {
  __typename?: 'NetNetworkConnection';
  /** List of NetNetwork objects. */
  edges: Maybe<Array<Maybe<NetNetworkEdge>>>;
  /** Pagination metadata. */
  pageInfo: Maybe<PageInfo>;
};

export type NetNetworkEdge = {
  __typename?: 'NetNetworkEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated NetNetwork object. */
  node: Maybe<NetNetwork>;
};

/** Filter for NetNetwork type based on the subnet and route type. */
export type NetNetworkFilter = {
  /** Type of the OSPF network (LSA type). */
  ospfRouteType?: InputMaybe<Scalars['Int']['input']>;
  /** Regex of network address including prefix length (e.g. 10.0.0.0/24) */
  subnet?: InputMaybe<Scalars['String']['input']>;
};

export type NetNode = {
  __typename?: 'NetNode';
  coordinates: GraphNodeCoordinates;
  id: Scalars['ID']['output'];
  interfaces: Array<InventoryNetInterface>;
  name: Scalars['String']['output'];
  networks: Array<InventoryNetNetwork>;
  nodeId: Scalars['String']['output'];
  phyDeviceName: Maybe<Scalars['String']['output']>;
};

/** Computed routing paths from source to destination device. */
export type NetRoutingPathConnection = {
  __typename?: 'NetRoutingPathConnection';
  /** List of routing paths from source to destination device. Ordered from shortest to longest path based on weight. */
  edges: Maybe<Array<RoutingPath>>;
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

/** Types of the nodes that should be included in the returned path. */
export type NetRoutingPathOutputCollections =
  /** Include NetDevice nodes in the returned path. */
  | 'NET_DEVICE'
  /** Include NetInterface nodes in the returned path. */
  | 'NET_INTERFACE';

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

/** Represents the coordinates of a specific node in the topology. */
export type NodeCoordinates = {
  __typename?: 'NodeCoordinates';
  /** Name of the node in the topology. */
  nodeId: Scalars['String']['output'];
  /** Refreshed horizontal coordinate of the node on the graph. Value is between 0.0 and 1.0. */
  x: Scalars['Float']['output'];
  /** Refreshed vertical coordinate of the node on the graph. Value is between 0.0 and 1.0. */
  y: Scalars['Float']['output'];
};

/** Information about a node that is part of the computed path. */
export type NodeInfo = {
  __typename?: 'NodeInfo';
  /** Unique identifier of the node on the path. */
  node: Scalars['ID']['output'];
  /** Weight of the node on the path. Weight is present only on the nodes of NetDevice type. */
  weight: Maybe<Scalars['Int']['output']>;
};

/** Status of the node from the view of the device registry. */
export type NodeStatus =
  /** Node is known - it has been installed in the device registry. */
  | 'OK'
  /** Node is unknown - sync process has detected presence of this node but it is not present in the device registry. */
  | 'UNKNOWN';

export type OrderDirection =
  | 'ASC'
  | 'DESC';

export type OutputParameters = {
  __typename?: 'OutputParameters';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** Pagination metadata that is usually coupled to a returned list of objects. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Pointer to the last object in the list. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** Indicates if there is a next object in the list. */
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PaginationArgs = {
  size: Scalars['Int']['input'];
  start: Scalars['Int']['input'];
};

/** Representation of the device in the physical topology. */
export type PhyDevice = Node & {
  __typename?: 'PhyDevice';
  /** Coordinates of the device node on the graph. */
  coordinates: TopologyCoordinates;
  /** Details of the device. */
  details: PhyDeviceDetails;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** List of strings that can be used for grouping of synced devices. */
  labels: Maybe<Array<Scalars['String']['output']>>;
  /** Human readable name of the device. */
  name: Scalars['String']['output'];
  /** Linked device in the network topology. */
  netDevice: Maybe<NetDevice>;
  /** List of ports that are present on the device. */
  phyInterfaces: PhyInterfaceConnection;
  /** Identifier of the corresponding routing entity in the network topology. */
  routerId: Maybe<Scalars['String']['output']>;
  /** Status of the device from the view of the synced topology. */
  status: NodeStatus;
};


/** Representation of the device in the physical topology. */
export type PhyDevicePhyInterfacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<PhyInterfaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of PhyDevice objects and pagination metadata. */
export type PhyDeviceConnection = {
  __typename?: 'PhyDeviceConnection';
  /** List of PhyDevice objects. */
  edges: Maybe<Array<Maybe<PhyDeviceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Details of the device. */
export type PhyDeviceDetails = {
  __typename?: 'PhyDeviceDetails';
  /** Device type (e.g. device model, vendor, chassis, hardware details, etc.) */
  deviceType: Maybe<Scalars['String']['output']>;
  /** Version of the network operating system running on the device. */
  swVersion: Maybe<Scalars['String']['output']>;
};

/** Grouped PhyDevice object and associated cursor used by pagination. */
export type PhyDeviceEdge = {
  __typename?: 'PhyDeviceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated PhyDevice object. */
  node: Maybe<PhyDevice>;
};

/** Filter for PhyDevice type based on device label and device name. */
export type PhyDeviceFilter = {
  /** Device label. */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Regex of device name. */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Port attached to the physical device. */
export type PhyInterface = Node & {
  __typename?: 'PhyInterface';
  /** Details of the interface. */
  details: Maybe<PhyInterfaceDetails>;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Human readable name of the network port. */
  name: Scalars['String']['output'];
  /** Device that owns this interface. */
  phyDevice: Maybe<PhyDevice>;
  /** List of links connected to remote physical device. */
  phyLinks: PhyLinkConnection;
  /** Status of the interface from the view of the synced topology ('ok' or 'unknown'). */
  status: NodeStatus;
};


/** Port attached to the physical device. */
export type PhyInterfacePhyLinksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of PhyInterface objects and pagination metadata. */
export type PhyInterfaceConnection = {
  __typename?: 'PhyInterfaceConnection';
  /** List of PhyInterface objects. */
  edges: Maybe<Array<Maybe<PhyInterfaceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Details of the interface. */
export type PhyInterfaceDetails = {
  __typename?: 'PhyInterfaceDetails';
  /** Max operational interface bandwidth in Mbit. */
  maxSpeed: Maybe<Scalars['Float']['output']>;
};

/** Grouped PhyInterface object and associated cursor used by pagination. */
export type PhyInterfaceEdge = {
  __typename?: 'PhyInterfaceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated PhyInterface object. */
  node: Maybe<PhyInterface>;
};

/** Filter for PhyInterface type based on the current interface status and name of the device. */
export type PhyInterfaceFilter = {
  /** Regex of interface name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Status of the interface from the view of the synced topology. */
  status?: InputMaybe<Scalars['String']['input']>;
};

/** Grouped list of PhyLinks objects and pagination metadata. */
export type PhyLinkConnection = {
  __typename?: 'PhyLinkConnection';
  /** List of PhyInterface objects. */
  edges: Maybe<Array<Maybe<PhyLinkEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

export type PhyLinkEdge = {
  __typename?: 'PhyLinkEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device */
  link: Maybe<Scalars['ID']['output']>;
  /** The associated PhyInterface object. */
  node: Maybe<PhyInterface>;
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

export type PolygonInput = {
  polygon?: InputMaybe<Array<Array<Array<Scalars['Float']['input']>>>>;
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

/** Response from the provider query that contains information about supported device types in the specified topology. */
export type ProviderResponse = {
  __typename?: 'ProviderResponse';
  /** List of the supported device types in the specified topology (e.g. ios, ios xe, sros, etc.) */
  supportedDevices: Array<Scalars['String']['output']>;
};

/** Representation of the device in the ptp topology. */
export type PtpDevice = Node & {
  __typename?: 'PtpDevice';
  /** Coordinates of the device node on the graph. */
  coordinates: TopologyCoordinates;
  /** Details of the device. */
  details: PtpDeviceDetails;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** List of strings that can be used for grouping of synced devices. */
  labels: Maybe<Array<Scalars['String']['output']>>;
  /** Human readable name of the device. */
  name: Scalars['String']['output'];
  /** List of ports that are present on the device. */
  ptpInterfaces: PtpInterfaceConnection;
  /** Status of the device from the view of the synced topology. */
  status: NodeStatus;
};


/** Representation of the device in the ptp topology. */
export type PtpDevicePtpInterfacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<PtpInterfaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of PtpDevice objects and pagination metadata. */
export type PtpDeviceConnection = {
  __typename?: 'PtpDeviceConnection';
  /** List of PtpDevice objects. */
  edges: Maybe<Array<Maybe<PtpDeviceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Details specific to PTP (Precision Time Protocol). */
export type PtpDeviceDetails = {
  __typename?: 'PtpDeviceDetails';
  /**
   * How accurate is the clock output to primary reference. This parameter is often automatically determined
   * by the device based on the characteristics of its internal clock oscillator and how well it can track
   * the reference time.
   */
  clockAccuracy: Maybe<Scalars['String']['output']>;
  /** Measure of clock traceability. */
  clockClass: Maybe<Scalars['Int']['output']>;
  /** Unique identifier of the clock. */
  clockId: Maybe<Scalars['String']['output']>;
  /** Type of clock (e.g., ordinary, master). */
  clockType: Maybe<Scalars['String']['output']>;
  /**
   * Measure of clock precision. How much the clock-output varies when not synchronized to another source.
   * The variance is determined by assessing how much the local clock deviates from the ideal time over a certain period,
   * often expressed in parts per billion (ppb) or as the standard deviation of the clock's offset.
   */
  clockVariance: Maybe<Scalars['String']['output']>;
  /** Domain of the PTP network. */
  domain: Maybe<Scalars['Int']['output']>;
  /** Global priority of the clock (the first priority). */
  globalPriority: Maybe<Scalars['Int']['output']>;
  /** Unique identifier of the grandmaster clock. */
  gmClockId: Maybe<Scalars['String']['output']>;
  /** Unique identifier of the parent clock. */
  parentClockId: Maybe<Scalars['String']['output']>;
  /** The port state of the device. */
  ptpPortState: Maybe<Scalars['String']['output']>;
  /** PTP profile used (e.g., ITU-T G.8275.1). */
  ptpProfile: Maybe<Scalars['String']['output']>;
  /**
   * Indicates the current state of the time recovery process. Time recovery is the process of adjusting
   * the local clock to synchronize with a more accurate reference clock.
   */
  timeRecoveryStatus: Maybe<Scalars['String']['output']>;
  /** User defined value of the second priority. */
  userPriority: Maybe<Scalars['Int']['output']>;
};

/** Grouped PtpDevice object and associated cursor used by pagination. */
export type PtpDeviceEdge = {
  __typename?: 'PtpDeviceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated PtpDevice object. */
  node: Maybe<PtpDevice>;
};

/** Filter for PtpDevice type based on device label and device name. */
export type PtpDeviceFilter = {
  /** Regex: clock accuracy to primary reference. */
  clockAccuracy?: InputMaybe<Scalars['String']['input']>;
  /** Measure of clock traceability. */
  clockClass?: InputMaybe<Scalars['Int']['input']>;
  /** Regex: Unique identifier of the clock. */
  clockId?: InputMaybe<Scalars['String']['input']>;
  /** Regex: Type of clock (e.g., ordinary, master). */
  clockType?: InputMaybe<Scalars['String']['input']>;
  /** Regex: measure of clock precision. */
  clockVariance?: InputMaybe<Scalars['String']['input']>;
  /** Domain of the PTP network. */
  domain?: InputMaybe<Scalars['Int']['input']>;
  /** Device label. */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Regex of device name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** PTP profile used (e.g., ITU-T G.8275.1). */
  ptpProfile?: InputMaybe<Scalars['String']['input']>;
  /** Regex: indicates the current state of the time recovery process. */
  timeRecoveryStatus?: InputMaybe<Scalars['String']['input']>;
};

/** A Ptp node that uses a different upstream path in SyncE topology */
export type PtpDiffSynce = Node & {
  __typename?: 'PtpDiffSynce';
  edges: Array<PtpDiffSynceEdges>;
  /** Ptp node id */
  id: Scalars['ID']['output'];
  /** Ptp node's upstream interface */
  ptpUpstreamInterface: Maybe<Scalars['ID']['output']>;
  /** Ptp node's upstream interface name */
  ptpUpstreamInterfaceName: Maybe<Scalars['String']['output']>;
  /** Ptp node's upstream interface status */
  ptpUpstreamInterfaceStatus: Maybe<Scalars['String']['output']>;
  /** SyncE node id. This is the same device as identified */
  synceId: Maybe<Scalars['ID']['output']>;
  /** Synce node's upstream interface name */
  synceUpstreamInterfaceName: Maybe<Scalars['String']['output']>;
};

/** Grouped list of PtpDiffSynceDevice objects and pagination metadata. */
export type PtpDiffSynceConnection = {
  __typename?: 'PtpDiffSynceConnection';
  /** List of PtpDiffSynce objects. */
  edges: Maybe<Array<Maybe<PtpDiffSynceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped PtpDiffSynceDevice object and associated cursor used by pagination. */
export type PtpDiffSynceEdge = {
  __typename?: 'PtpDiffSynceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated PtpDiffSynce object. */
  node: Maybe<PtpDiffSynce>;
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

/** Port attached to the ptp device. */
export type PtpInterface = Node & {
  __typename?: 'PtpInterface';
  /** Interface details specific to PTP (Precision Time Protocol). */
  details: Maybe<PtpInterfaceDetails>;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Human readable name of the network port. */
  name: Scalars['String']['output'];
  /** Device that owns this interface. */
  ptpDevice: Maybe<PtpDevice>;
  /** List of links connected to remote ptp devices. */
  ptpLinks: PtpLinkConnection;
  /** Status of the interface from the view of the synced topology ('ok' or 'unknown'). */
  status: NodeStatus;
};


/** Port attached to the ptp device. */
export type PtpInterfacePtpLinksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of PtpInterface objects and pagination metadata. */
export type PtpInterfaceConnection = {
  __typename?: 'PtpInterfaceConnection';
  /** List of PtpInterface objects. */
  edges: Maybe<Array<Maybe<PtpInterfaceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** PTP interface details. */
export type PtpInterfaceDetails = {
  __typename?: 'PtpInterfaceDetails';
  /** Administrative/operational status of the interface (e.g. 'up/up', 'up/down'). */
  adminOperStatus: Scalars['String']['output'];
  /** State of the PTP process on the interface (e.g. 'master', 'slave', 'disabled', 'passive', 'unknown'). */
  ptpStatus: Scalars['String']['output'];
  /**
   * Unusable packet timing signal received by the slave, for example, where the packet delay variation is excessive,
   * resulting in the slave being unable to meet the output clock performance requirements.
   */
  ptsfUnusable: Scalars['String']['output'];
};

/** Grouped PtpInterface object and associated cursor used by pagination. */
export type PtpInterfaceEdge = {
  __typename?: 'PtpInterfaceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated PtpInterface object. */
  node: Maybe<PtpInterface>;
};

/** Filter for PtpInterface type based on the current interface status and name of the device. */
export type PtpInterfaceFilter = {
  /** Regex of administrative/operational status on the interface (e.g. 'up/up', 'up/down'). */
  adminOperStatus?: InputMaybe<Scalars['String']['input']>;
  /** Regex of interface name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Regex of the PTP process status on the interface. */
  ptpStatus?: InputMaybe<Scalars['String']['input']>;
  /** Regex of unusable packet timing signal received by the slave. */
  ptsfUnusable?: InputMaybe<Scalars['String']['input']>;
  /** Status of the interface from the view of the synced topology. */
  status?: InputMaybe<NodeStatus>;
};

/** Grouped list of PtpLinks objects and pagination metadata. */
export type PtpLinkConnection = {
  __typename?: 'PtpLinkConnection';
  /** List of PtpInterface objects. */
  edges: Maybe<Array<Maybe<PtpLinkEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped PtpLink object and associated cursor used by pagination. */
export type PtpLinkEdge = {
  __typename?: 'PtpLinkEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device */
  link: Maybe<Scalars['ID']['output']>;
  /** The associated PtpInterface object. */
  node: Maybe<PtpInterface>;
};

/** Computed path from source to destination PTP clock device. */
export type PtpPath = {
  __typename?: 'PtpPath';
  /** True if path is complete - the last element in the path represents GM clock, False otherwise. */
  complete: Scalars['Boolean']['output'];
  /** Ordered list of node identifiers that compose path from source clock to destination clock. */
  nodes: Maybe<Array<Scalars['ID']['output']>>;
};

/** Types of the nodes that should be included in the returned path. */
export type PtpPathOutputCollections =
  /** Include PtpDevice nodes in the returned path. */
  | 'PTP_DEVICE'
  /** Include PtpInterface nodes in the returned path. */
  | 'PTP_INTERFACE';

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
  topologyDiscovery: TopologyDiscoveryQuery;
};

/** Response containing a list of nodes with refreshed coordinates. */
export type RefreshCoordinatesResponse = {
  __typename?: 'RefreshCoordinatesResponse';
  /** List of refreshed nodes with their new coordinates. */
  nodes: Array<NodeCoordinates>;
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

/** Computed routing path from source to destination device. */
export type RoutingPath = {
  __typename?: 'RoutingPath';
  /** Ordered list of nodes that compose path from source to destination device. */
  nodes: Array<NodeInfo>;
  /** Total weight of the path. */
  weight: Scalars['Int']['output'];
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

export type Signalisation =
  | 'LDP'
  | 'RSVP';

export type Signalization =
  | 'LDP'
  | 'RSVP';

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

export type SortLocationBy =
  | 'name';

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

/** Response from the sync query that contains information about synced devices from the network to topology. */
export type SyncResponse = {
  __typename?: 'SyncResponse';
  /**
   * List of devices that are installed in UniConfig but are missing their metadata in DeviceMetadata collection in the
   * database.
   */
  devicesMissingInInventory: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** List of devices that are not installed in UniConfig. */
  devicesMissingInUniconfig: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**
   * List of string labels that are used for grouping of synced devices.
   * List content should be the same as the list of labels in the input of the sync query.
   */
  labels: Array<Scalars['String']['output']>;
  /**
   * Dictionary of devices and neighbors that are successfully synced from network to target topology.
   * JSON format:
   * {
   *   "R1": [
   *     {
   *       "from_interface": "GigabitEthernet0/0/0/0",
   *       "to_interface": "GigabitEthernet0/0/0/0",
   *       "to_device": "R7"
   *     },
   *     {
   *       "from_interface": "GigabitEthernet0/0/0/1",
   *       "to_interface": "GigabitEthernet0/0/0/1",
   *       "to_device": "R2"
   *     }
   *   ],
   *   "R2": [
   *     {
   *       "from_interface": "GigabitEthernet0/0/0/0",
   *       "to_interface": "GigabitEthernet0/0/0/0",
   *       "to_device": "R3"
   *     }
   *   ]
   * }
   */
  loadedDevices: Scalars['JSON']['output'];
};

/** Representation of the device in the synce topology. */
export type SynceDevice = Node & {
  __typename?: 'SynceDevice';
  /** Coordinates of the device node on the graph. */
  coordinates: TopologyCoordinates;
  /** Details of the device. */
  details: SynceDeviceDetails;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** List of strings that can be used for grouping of synced devices. */
  labels: Maybe<Array<Scalars['String']['output']>>;
  /** Human readable name of the device. */
  name: Scalars['String']['output'];
  /** Status of the device from the view of the synced topology. */
  status: NodeStatus;
  /** List of ports that are present on the device. */
  synceInterfaces: SynceInterfaceConnection;
};


/** Representation of the device in the synce topology. */
export type SynceDeviceSynceInterfacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<SynceInterfaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of SynceDevice objects and pagination metadata. */
export type SynceDeviceConnection = {
  __typename?: 'SynceDeviceConnection';
  /** List of SynceDevice objects. */
  edges: Maybe<Array<Maybe<SynceDeviceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Details specific to SyncE (Synchronous Ethernet). */
export type SynceDeviceDetails = {
  __typename?: 'SynceDeviceDetails';
  /** Identifier of the reference (for example, source interface) that is used to synchronize the clock. */
  selectedForUse: Maybe<Scalars['String']['output']>;
};

/** Grouped SynceDevice object and associated cursor used by pagination. */
export type SynceDeviceEdge = {
  __typename?: 'SynceDeviceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated SynceDevice object. */
  node: Maybe<SynceDevice>;
};

/** Filter for SynceDevice type based on device label and device name. */
export type SynceDeviceFilter = {
  /** Device label. */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Regex of device name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Regex: identifier of the reference (for example, source interface) that is used to synchronize the clock. */
  selectedForUse?: InputMaybe<Scalars['String']['input']>;
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

/** Port attached to the SyncE device. */
export type SynceInterface = Node & {
  __typename?: 'SynceInterface';
  /** Interface details specific to SyncE operation. */
  details: Maybe<SynceInterfaceDetails>;
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Human readable name of the network port. */
  name: Scalars['String']['output'];
  /** Status of the interface from the view of the synced topology ('ok' or 'unknown'). */
  status: NodeStatus;
  /** Device that owns this interface. */
  synceDevice: Maybe<SynceDevice>;
  /** Link to connected remote synce device. */
  synceLinks: Maybe<SynceLinkConnection>;
};


/** Port attached to the SyncE device. */
export type SynceInterfaceSynceLinksArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of SynceInterface objects and pagination metadata. */
export type SynceInterfaceConnection = {
  __typename?: 'SynceInterfaceConnection';
  /** List of SynceInterface objects. */
  edges: Maybe<Array<Maybe<SynceInterfaceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Details specific to SyncE (Synchronous Ethernet). */
export type SynceInterfaceDetails = {
  __typename?: 'SynceInterfaceDetails';
  /**
   * Information about why the interface is not qualified for SyncE synchronization
   * (set to 'unknown' if the interface is qualified).
   */
  notQualifiedDueTo: Maybe<Scalars['String']['output']>;
  /**
   * Information about why the interface is not selected for SyncE synchronization
   * (set to 'unknown' if the interface is selected).
   */
  notSelectedDueTo: Maybe<Scalars['String']['output']>;
  /** Statement of whether the interface is qualified for SyncE synchronization. */
  qualifiedForUse: Maybe<Scalars['String']['output']>;
  /** Quality of the received SyncE signal (for example, 'DNU' or 'PRC'). */
  rxQualityLevel: Maybe<Scalars['String']['output']>;
  /** Configured SyncE on the port. */
  synceEnabled: Maybe<Scalars['Boolean']['output']>;
};

/** Grouped SynceInterface object and associated cursor used by pagination. */
export type SynceInterfaceEdge = {
  __typename?: 'SynceInterfaceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated SynceInterface object. */
  node: Maybe<SynceInterface>;
};

/** Filter for SynceInterface type based on the current interface status and name of the device. */
export type SynceInterfaceFilter = {
  /** Regex of interface name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Regex: Information about why the interface is not qualified for SyncE synchronization. */
  notQualifiedDueTo?: InputMaybe<Scalars['String']['input']>;
  /** Regex: Information about why the interface is not selected for SyncE synchronization. */
  notSelectedDueTo?: InputMaybe<Scalars['String']['input']>;
  /** Regex: Statement of whether the interface is qualified for SyncE synchronization. */
  qualifiedForUse?: InputMaybe<Scalars['String']['input']>;
  /** Regex: Quality of the received SyncE signal (for example, 'DNU' or 'PRC'). */
  rxQualityLevel?: InputMaybe<Scalars['String']['input']>;
  /** Status of the interface from the view of the synced topology. */
  status?: InputMaybe<NodeStatus>;
  /** Configured SyncE on the port. */
  synceEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Grouped list of SynceLinks objects and pagination metadata. */
export type SynceLinkConnection = {
  __typename?: 'SynceLinkConnection';
  /** List of SynceInterface objects. */
  edges: Maybe<Array<Maybe<SynceLinkEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped SynceLink object and associated cursor used by pagination. */
export type SynceLinkEdge = {
  __typename?: 'SynceLinkEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device */
  link: Maybe<Scalars['ID']['output']>;
  /** The associated SynceInterface object. */
  node: Maybe<SynceInterface>;
};

/** Computed path from source to destination SYNCE device. */
export type SyncePath = {
  __typename?: 'SyncePath';
  /** True if path is complete - the last element in the path represents GM, False otherwise. */
  complete: Scalars['Boolean']['output'];
  /** Ordered list of node identifiers that compose path from source device to destination device. */
  nodes: Maybe<Array<Scalars['ID']['output']>>;
};

/** Types of the nodes that should be included in the returned path. */
export type SyncePathOutputCollections =
  /** Include SynceDevice nodes in the returned path. */
  | 'SYNCE_DEVICE'
  /** Include SynceInterface nodes in the returned path. */
  | 'SYNCE_INTERFACE';

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

/** Coordinates of the node on the graph. */
export type TopologyCoordinates = {
  __typename?: 'TopologyCoordinates';
  /** Horizontal coordinate of the node on the graph. */
  x: Scalars['Float']['output'];
  /** Vertical coordinate of the node on the graph. */
  y: Scalars['Float']['output'];
};

/** Topology and device identifier of a device. */
export type TopologyDevice = {
  __typename?: 'TopologyDevice';
  /** Topology-specific device identifier. */
  deviceId: Scalars['ID']['output'];
  /** Identifier of the topology in which device is present. */
  topologyId: TopologyType;
};

export type TopologyLayer =
  | 'ETH_TOPOLOGY'
  | 'MPLS_TOPOLOGY'
  | 'PHYSICAL_TOPOLOGY'
  | 'PTP_TOPOLOGY';

export type TopologyOverlayDevice = {
  __typename?: 'TopologyOverlayDevice';
  /** Unique identifier of the object. */
  id: Scalars['ID']['output'];
  /** Device name. */
  name: Scalars['String']['output'];
  /** Document device ID from the second topology (can be null). */
  secondTopologyId: Maybe<Scalars['ID']['output']>;
  /** List of ports that are present on the device. */
  topologyOverlayInterfaces: TopologyOverlayInterfaceConnection;
};


export type TopologyOverlayDeviceTopologyOverlayInterfacesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<TopologyOverlayInterfaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Grouped list of TopologyOverlayDevice objects and pagination metadata. */
export type TopologyOverlayDeviceConnection = {
  __typename?: 'TopologyOverlayDeviceConnection';
  /** List of TopologyOverlayDeviceEdge objects. */
  edges: Maybe<Array<Maybe<TopologyOverlayDeviceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped TopologyOverlayDeviceEdge object and associated cursor used by pagination. */
export type TopologyOverlayDeviceEdge = {
  __typename?: 'TopologyOverlayDeviceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated TopologyOverlayDevice object. */
  node: Maybe<TopologyOverlayDevice>;
};

/** Filter for TopologyOverlayDevice type based on device name. */
export type TopologyOverlayDeviceFilter = {
  /** Regex of device name. */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TopologyOverlayInterface = {
  __typename?: 'TopologyOverlayInterface';
  /** Document interface ID from the first topology */
  id: Scalars['ID']['output'];
  /** Interface name. */
  name: Scalars['String']['output'];
  /** Document device ID from the second topology (can be null). */
  secondTopologyId: Maybe<Scalars['ID']['output']>;
  /** Topology overlay device that owns this interface. */
  topologyOverlayDevice: Maybe<TopologyOverlayDevice>;
  /** Topology overlay neighbor interface */
  topologyOverlayLinks: Maybe<TopologyOverlayLinkConnection>;
};

/** Grouped list of TopologyOverlayInterface objects and pagination metadata. */
export type TopologyOverlayInterfaceConnection = {
  __typename?: 'TopologyOverlayInterfaceConnection';
  /** List of TopologyOverlayInterface objects. */
  edges: Maybe<Array<Maybe<TopologyOverlayInterfaceEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

/** Grouped TopologyOverlayInterface object and associated cursor used by pagination. */
export type TopologyOverlayInterfaceEdge = {
  __typename?: 'TopologyOverlayInterfaceEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** The associated TopologyOverlayInterface object. */
  node: Maybe<TopologyOverlayInterface>;
};

/** Filter for TopologyOverlayInterface type based on the name of the device. */
export type TopologyOverlayInterfaceFilter = {
  /** Regex of interface name. */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Grouped list of TopologyOverlayLinks objects and pagination metadata. */
export type TopologyOverlayLinkConnection = {
  __typename?: 'TopologyOverlayLinkConnection';
  /** List of TopologyOverlayInterface objects. */
  edges: Maybe<Array<Maybe<TopologyOverlayLinkEdge>>>;
  /** Pagination metadata. */
  pageInfo: PageInfo;
};

export type TopologyOverlayLinkEdge = {
  __typename?: 'TopologyOverlayLinkEdge';
  /** Pagination cursor for this edge. */
  cursor: Scalars['String']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device */
  link: Maybe<TopologyOverlayLinkIds>;
  /** The associated TopologyOverlayInterface object. */
  node: Maybe<TopologyOverlayInterface>;
};

export type TopologyOverlayLinkIds = {
  __typename?: 'TopologyOverlayLinkIds';
  /** Identifier of the link that connects this interface to the interface on the remote device on the first topology. */
  firstTopologyLinkId: Scalars['ID']['output'];
  /** Identifier of the link that connects this interface to the interface on the remote device on the second topology. */
  secondTopologyLinkId: Maybe<Scalars['ID']['output']>;
};

/** Response from the topologyDiff query that contains diff between two databases. */
export type TopologyResponse = {
  __typename?: 'TopologyResponse';
  /**
   * Created diff between two databases. Format of the output JSON ('data' represents database document):
   * {
   *     "added": {"PhyDevice": [{data}], "PhyInterface": [], ...},
   *     "deleted": {"PhyDevice": [{data}], "PhyInterface": [], ...},
   *     "changed": {"PhyDevice": [{"new": {data}, "old"}: {data}], "PhyInterface": [{"new": {data}, "old": {data}], ...}
   * }
   */
  diffData: Maybe<Scalars['JSON']['output']>;
};

/** Present topology types. */
export type TopologyType =
  | 'ETH_TOPOLOGY'
  | 'MPLS_TOPOLOGY'
  | 'NETWORK_TOPOLOGY'
  | 'PHYSICAL_TOPOLOGY'
  | 'PTP_TOPOLOGY';

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

export type UpdateLocationInput = {
  coordinates: Coordinates;
  countryId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateLocationPayload = {
  __typename?: 'UpdateLocationPayload';
  location: Location;
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
  deleteLocation: DeleteLocationPayload;
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
  updateLocation: UpdateLocationPayload;
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


export type DeviceInventoryMutationDeleteLocationArgs = {
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


export type DeviceInventoryMutationUpdateLocationArgs = {
  id: Scalars['String']['input'];
  input: UpdateLocationInput;
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
  deviceNeighbor: Maybe<DeviceNeighbors>;
  devices: DeviceConnection;
  kafkaHealthCheck: Maybe<IsOkResponse>;
  labels: LabelConnection;
  locations: LocationConnection;
  lspPath: Maybe<LspPath>;
  mplsLspCount: Maybe<MplsLspCount>;
  mplsTopology: Maybe<MplsTopology>;
  mplsTopologyVersionData: MplsTopologyVersionData;
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


export type DeviceInventoryQueryDeviceMetadataArgs = {
  filter?: InputMaybe<FilterDevicesMetadatasInput>;
};


export type DeviceInventoryQueryDeviceNeighborArgs = {
  filter?: InputMaybe<FilterNeighborInput>;
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
  filter?: InputMaybe<FilterLocationsInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LocationOrderByInput>;
};


export type DeviceInventoryQueryLspPathArgs = {
  deviceId: Scalars['String']['input'];
  lspId: Scalars['String']['input'];
};


export type DeviceInventoryQueryMplsLspCountArgs = {
  deviceId: Scalars['String']['input'];
};


export type DeviceInventoryQueryMplsTopologyVersionDataArgs = {
  version: Scalars['String']['input'];
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

export type TopologyDiscoveryMutation = {
  __typename?: 'topologyDiscoveryMutation';
  /**
   * Creation of the backup from the whole database including all graphs.
   * Name of the backup database is derived from the current timestamp and returned in the response.
   */
  createBackup: CreateBackupResponse;
  /**
   * Removing backups that are older than the specified number of hours.
   * Response contains the list of removed backup databases.
   */
  deleteBackups: DeleteBackupsResponse;
  /**
   * Enable debug session to the remote Python debug server.
   * If debug session has already been enabled, it will be reloaded with new settings.
   * Debug session is automatically closed after client stops debugging.
   * Response contains version of the debug library.
   */
  enableRemoteDebugSession: Scalars['String']['output'];
  /** Refresh the coordinates of nodes in the specified topology by using the ForceAtlas2 algorithm. */
  refreshCoordinates: RefreshCoordinatesResponse;
  /**
   * Synchronization of the devices in the specified topology.
   * Topology represents an abstraction layer of observed network from the operational view
   * (for example, physical topology that is built from LLDP data, or network topology that is built from BGP-LS data).
   * During synchronization topology-discovery service reads topological information from network devices,
   * parses read data using drivers into graph data model, and builds the graph that is stored in the graph database.
   * Response contains information about synced devices and their neighbors.
   */
  sync: SyncResponse;
  /**
   * Updating the coordinates of the specified nodes on the graph (x,y fractional values).
   * Response contains list of successfully and unsuccessfully updated nodes.
   */
  updateCoordinates: CoordinatesResponse;
  /**
   * Updating status of the specified device or attached interfaces and edges between device and interfaces.
   * A: If there is status and device_name param, status is changed for PhyDevice / PtpDevice document.
   * B: If there is also interface_name, status is changed only for PhyInterface / PtpInterface and PhyHas / PtpHas documents.
   * JSON response:
   * A: {"device": device_document},
   * B: {"has": has_document, "interface": interface_document}
   */
  updateNodeStatus: Scalars['JSON']['output'];
};


export type TopologyDiscoveryMutationDeleteBackupsArgs = {
  deleteAge?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryMutationEnableRemoteDebugSessionArgs = {
  host: Scalars['String']['input'];
  port?: InputMaybe<Scalars['Int']['input']>;
  stderrToServer?: InputMaybe<Scalars['Boolean']['input']>;
  stdoutToServer?: InputMaybe<Scalars['Boolean']['input']>;
};


export type TopologyDiscoveryMutationRefreshCoordinatesArgs = {
  topologyType?: InputMaybe<TopologyType>;
};


export type TopologyDiscoveryMutationSyncArgs = {
  devices?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  labels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  topologyType: TopologyType;
};


export type TopologyDiscoveryMutationUpdateCoordinatesArgs = {
  coordinatesList: Array<CoordinatesInput>;
  topologyType?: InputMaybe<TopologyType>;
};


export type TopologyDiscoveryMutationUpdateNodeStatusArgs = {
  deviceName: Scalars['String']['input'];
  interfaceName?: InputMaybe<Scalars['String']['input']>;
  status: NodeStatus;
  topologyType?: InputMaybe<TopologyType>;
};

export type TopologyDiscoveryQuery = {
  __typename?: 'topologyDiscoveryQuery';
  /**
   * Read list of created backups.
   * List of backup database names are converted to ISO datetime format: %Y-%m-%dT%H:%M:%S.%f. Example:
   * Name of the backup database: backup_20221014130000.
   * Formatted identifier: 2022-10-14T13:00:00.000000.
   */
  backups: Array<Scalars['String']['output']>;
  /**
   * Find nodes that have connection to all selected nodes in the specified database.
   * In case of the PhyDevice devices, the common nodes represent devices that contain physical interface-based
   * link to all specified input devices.
   * In case of other types of nodes (for example, in the network topology), implementation logic may vary.
   */
  commonNodes: CommonNodesResponse;
  /** Read devices that match specified filter. */
  deviceMetadata: MetadataConnection;
  /** Read MPLS devices that match the specified filter. */
  mplsDevices: MplsDeviceConnection;
  /**
   * Returns a list of LSPs based on to which device they are headed.
   * Also return the count of incoming and outcoming tunnels from / to that device.
   */
  mplsLspCount: Maybe<Array<Maybe<MplsTotalLsps>>>;
  /**
   * Finds a LSP path between two devices based on start device ID and LSP ID.
   * Also return MPLS LSP metadata about start device if they exist.
   */
  mplsLspPath: MplsLspPath;
  /** Find identifiers of all neighbour devices of the specified device in the specified topology. */
  neighbors: Maybe<Array<Neighbor>>;
  /** Read network devices that match specified filter. */
  netDevices: NetDeviceConnection;
  /**
   * Find routing paths between two network devices in the network topology.
   * Routing paths are ordered from the shortest to the longest based on the summarized weights.
   */
  netRoutingPaths: Maybe<NetRoutingPathConnection>;
  /**
   * Read node by its unique object identifier.
   * Example subtypes of Node interface: PhyDevice, PhyInterface, NetDevice, NetInterface, NetNetwork.
   */
  node: Maybe<Node>;
  /** Read physical devices that match specified filter. */
  phyDevices: PhyDeviceConnection;
  /** Read list of support device types in the specified topology. */
  provider: ProviderResponse;
  /** Read list of available topology providers (e.g. physical, etp, eth_sync, etc.). */
  providers: Array<TopologyType>;
  /** Read ptp devices that match specified filter. */
  ptpDevices: PtpDeviceConnection;
  /**
   * Find devices that have different upstream path in PTP topology vs SyncE topology.
   * Return a list of PTP nodes that:
   * - do not have SyncE setup
   * - use different parent node in SyncE
   * - use different interface towards parent node in SyncE
   */
  ptpDiffSynce: PtpDiffSynceConnection;
  /**
   * Find path between selected PTP device clock and its current grandmaster clock.
   * If synced PTP topology does not contain active path from specified device to grandmaster, empty path is returned.
   * If invalid device identifier is specified, error is returned.
   */
  ptpPathToGmClock: PtpPath;
  /** Read synce devices that match specified filter. */
  synceDevices: SynceDeviceConnection;
  /**
   * Find path between selected SYNCE device and its current grandmaster.
   * If synced SYNCED topology does not contain active path from specified device to grandmaster, empty path is returned.
   * If invalid device identifier is specified, error is returned.
   */
  syncePathToGm: SyncePath;
  /**
   * Find identifiers of the topologies where the specified device is present.
   * The query returns a list in which each entry contains a topology identifier and a device identifier.
   */
  topologies: Maybe<Array<TopologyDevice>>;
  /**
   * Computation of the diff between two databases per collections - created, deleted, and changed entries.
   * Only documents that belong to the specified topology are included in the diff.
   */
  topologyDiff: TopologyResponse;
  /**
   * Returns an overlay between two topologies.
   * The overlay works in such a way that it takes the first topology, and tries to find devices / interfaces
   * from the first topology in the second one.
   * The first topology can be taken as a reference topology. The second topology is joined to the first one (similar to LEFT JOIN in databases)
   */
  topologyOverlay: TopologyOverlayDeviceConnection;
};


export type TopologyDiscoveryQueryCommonNodesArgs = {
  dbName?: InputMaybe<Scalars['String']['input']>;
  selectedNodes: Array<Scalars['String']['input']>;
  topologyType?: InputMaybe<TopologyType>;
};


export type TopologyDiscoveryQueryDeviceMetadataArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<DeviceMetadataFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQueryMplsDevicesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<MplsDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQueryMplsLspCountArgs = {
  deviceId: Scalars['ID']['input'];
};


export type TopologyDiscoveryQueryMplsLspPathArgs = {
  deviceId: Scalars['ID']['input'];
  lspId: Scalars['ID']['input'];
};


export type TopologyDiscoveryQueryNeighborsArgs = {
  deviceName: Scalars['String']['input'];
  topologyType: TopologyType;
};


export type TopologyDiscoveryQueryNetDevicesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<NetDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQueryNetRoutingPathsArgs = {
  deviceFrom: Scalars['ID']['input'];
  deviceTo: Scalars['ID']['input'];
  outputCollection?: InputMaybe<NetRoutingPathOutputCollections>;
};


export type TopologyDiscoveryQueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type TopologyDiscoveryQueryPhyDevicesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<PhyDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQueryProviderArgs = {
  topologyType: TopologyType;
};


export type TopologyDiscoveryQueryPtpDevicesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<PtpDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQueryPtpDiffSynceArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<PtpDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQueryPtpPathToGmClockArgs = {
  deviceFrom: Scalars['ID']['input'];
  outputCollection?: InputMaybe<PtpPathOutputCollections>;
};


export type TopologyDiscoveryQuerySynceDevicesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<SynceDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TopologyDiscoveryQuerySyncePathToGmArgs = {
  deviceFrom: Scalars['ID']['input'];
  outputCollection?: InputMaybe<SyncePathOutputCollections>;
};


export type TopologyDiscoveryQueryTopologiesArgs = {
  deviceName: Scalars['String']['input'];
};


export type TopologyDiscoveryQueryTopologyDiffArgs = {
  collectionType: TopologyType;
  newDb: Scalars['String']['input'];
  oldDb: Scalars['String']['input'];
};


export type TopologyDiscoveryQueryTopologyOverlayArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<TopologyOverlayDeviceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstTopology: TopologyType;
  secondTopology: TopologyType;
};

export type DeviceLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type DeviceLabelsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } };

export type VersionsQueryVariables = Exact<{ [key: string]: never; }>;


export type VersionsQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', topologyVersions: Array<string> | null } };

export type SelectedNodeUsageSubscriptionVariables = Exact<{
  deviceName: Scalars['String']['input'];
  refreshEverySec?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SelectedNodeUsageSubscription = { __typename?: 'Subscription', deviceInventory: { __typename?: 'deviceInventorySubscription', deviceUsage: { __typename?: 'DeviceUsage', cpuLoad: number | null, memoryLoad: number | null } | null } };

export type UpdatePositionMutationVariables = Exact<{
  input: UpdateGraphNodeCoordinatesInput;
}>;


export type UpdatePositionMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateGraphNodeCoordinates: { __typename?: 'UpdateGraphNodeCoordinatesPayload', deviceNames: Array<string> } } };

export type TopologyCommonNodesQueryVariables = Exact<{
  nodes: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type TopologyCommonNodesQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', topologyCommonNodes: { __typename?: 'TopologyCommonNodes', commonNodes: Array<string> } | null } };

export type UpdateSyncePositionMutationVariables = Exact<{
  input: UpdateGraphNodeCoordinatesInput;
}>;


export type UpdateSyncePositionMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateGraphNodeCoordinates: { __typename?: 'UpdateGraphNodeCoordinatesPayload', deviceNames: Array<string> } } };

export type GetMplsLspCountQueryVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type GetMplsLspCountQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', mplsLspCount: { __typename?: 'MplsLspCount', counts: Array<{ __typename?: 'MplsLspCountItem', target: string | null, incomingLsps: number | null, outcomingLsps: number | null } | null> | null } | null } };

export type LspPathQueryVariables = Exact<{
  deviceId: Scalars['String']['input'];
  lspId: Scalars['String']['input'];
}>;


export type LspPathQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', lspPath: { __typename?: 'LspPath', path: Array<string>, metadata: { __typename?: 'LspPathMetadata', fromDevice: string | null, toDevice: string | null, signalization: string | null, uptime: number | null } | null } | null } };

export type ShortestPathQueryVariables = Exact<{
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
}>;


export type ShortestPathQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', shortestPath: Array<{ __typename?: 'NetRoutingPathNode', weight: number | null, nodes: Array<{ __typename?: 'NetRoutingPathNodeInfo', weight: number | null, name: string | null }> }> } };

export type UpdatePtpPositionMutationVariables = Exact<{
  input: UpdateGraphNodeCoordinatesInput;
}>;


export type UpdatePtpPositionMutation = { __typename?: 'Mutation', deviceInventory: { __typename?: 'deviceInventoryMutation', updateGraphNodeCoordinates: { __typename?: 'UpdateGraphNodeCoordinatesPayload', deviceNames: Array<string> } } };

export type GetGrandMasterPathQueryVariables = Exact<{
  deviceFrom: Scalars['String']['input'];
}>;


export type GetGrandMasterPathQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', ptpPathToGrandMaster: Array<string> | null } };

export type GetPtpDiffSynceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPtpDiffSynceQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', ptpDiffSynce: { __typename?: 'PtpDiffSynce', edges: Array<{ __typename?: 'PtpDiffSynceEdges', node: { __typename?: 'PtpDiffSynceNode', id: string } }> } } };

export type GetSynceGrandMasterPathQueryVariables = Exact<{
  deviceFrom: Scalars['String']['input'];
}>;


export type GetSynceGrandMasterPathQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', syncePathToGrandMaster: Array<string> | null } };

export type TopologyQueryVariables = Exact<{
  labels?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type TopologyQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', topology: { __typename?: 'Topology', nodes: Array<{ __typename?: 'GraphNode', id: string, name: string, deviceType: string | null, softwareVersion: string | null, device: { __typename?: 'Device', id: string, name: string, isInstalled: boolean, createdAt: string, serviceState: DeviceServiceState, deviceSize: DeviceSize } | null, interfaces: Array<{ __typename?: 'GraphNodeInterface', id: string, status: GraphEdgeStatus, name: string }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }>, edges: Array<{ __typename?: 'GraphEdge', id: string, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }> } | null } };

export type TopologyVersionDataQueryVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type TopologyVersionDataQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', phyTopologyVersionData: { __typename?: 'PhyTopologyVersionData', edges: Array<{ __typename?: 'GraphVersionEdge', id: string, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }>, nodes: Array<{ __typename?: 'GraphVersionNode', id: string, name: string, interfaces: Array<{ __typename?: 'GraphNodeInterface', id: string, status: GraphEdgeStatus, name: string }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }> } } };

export type PtpTopologyVersionDataQueryVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type PtpTopologyVersionDataQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', ptpTopologyVersionData: { __typename?: 'PtpTopologyVersionData', edges: Array<{ __typename?: 'GraphVersionEdge', id: string, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }>, nodes: Array<{ __typename?: 'PtpGraphNode', id: string, name: string, interfaces: Array<{ __typename?: 'PtpGraphNodeInterface', id: string, status: GraphEdgeStatus, name: string }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }> } } };

export type SynceTopologyVersionDataQueryVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type SynceTopologyVersionDataQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', synceTopologyVersionData: { __typename?: 'SynceTopologyVersionData', edges: Array<{ __typename?: 'GraphVersionEdge', id: string, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }>, nodes: Array<{ __typename?: 'SynceGraphNode', id: string, name: string, interfaces: Array<{ __typename?: 'SynceGraphNodeInterface', id: string, status: GraphEdgeStatus, name: string }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }> } } };

export type MplsTopologyVersionDataQueryVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type MplsTopologyVersionDataQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', mplsTopologyVersionData: { __typename?: 'MplsTopologyVersionData', edges: Array<{ __typename?: 'GraphVersionEdge', id: string, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }>, nodes: Array<{ __typename?: 'MplsGraphNode', id: string, name: string, interfaces: Array<{ __typename?: 'MplsGraphNodeInterface', id: string, status: GraphEdgeStatus, name: string }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }> } } };

export type NetTopologyQueryVariables = Exact<{ [key: string]: never; }>;


export type NetTopologyQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', netTopology: { __typename?: 'NetTopology', nodes: Array<{ __typename?: 'NetNode', id: string, phyDeviceName: string | null, nodeId: string, name: string, interfaces: Array<{ __typename?: 'InventoryNetInterface', id: string, name: string }>, networks: Array<{ __typename?: 'InventoryNetNetwork', id: string, subnet: string, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }>, edges: Array<{ __typename?: 'GraphEdge', id: string, weight: number | null, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }> } | null } };

export type NetTopologyVersionDataQueryVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type NetTopologyVersionDataQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', netTopologyVersionData: { __typename?: 'NetTopologyVersionData', nodes: Array<{ __typename?: 'NetNode', id: string, name: string, phyDeviceName: string | null, interfaces: Array<{ __typename?: 'InventoryNetInterface', id: string, name: string }>, networks: Array<{ __typename?: 'InventoryNetNetwork', id: string, subnet: string, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number } }>, edges: Array<{ __typename?: 'GraphVersionEdge', id: string, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }> } } };

export type PtpTopologyQueryVariables = Exact<{ [key: string]: never; }>;


export type PtpTopologyQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', ptpTopology: { __typename?: 'PtpTopology', nodes: Array<{ __typename?: 'PtpGraphNode', id: string, nodeId: string, name: string, status: GraphEdgeStatus, labels: Array<string> | null, interfaces: Array<{ __typename?: 'PtpGraphNodeInterface', id: string, status: GraphEdgeStatus, name: string, details: { __typename?: 'PtpGraphNodeInterfaceDetails', ptpStatus: string, adminOperStatus: string, ptsfUnusable: string } | null }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number }, ptpDeviceDetails: { __typename?: 'PtpDeviceDetails', clockType: string | null, domain: number | null, ptpProfile: string | null, clockId: string | null, parentClockId: string | null, gmClockId: string | null, clockClass: number | null, clockAccuracy: string | null, clockVariance: string | null, timeRecoveryStatus: string | null, globalPriority: number | null, userPriority: number | null } }>, edges: Array<{ __typename?: 'GraphEdge', id: string, weight: number | null, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }> } | null } };

export type SynceTopologyQueryVariables = Exact<{ [key: string]: never; }>;


export type SynceTopologyQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', synceTopology: { __typename?: 'SynceTopology', nodes: Array<{ __typename?: 'SynceGraphNode', id: string, nodeId: string, name: string, status: GraphEdgeStatus, labels: Array<string> | null, interfaces: Array<{ __typename?: 'SynceGraphNodeInterface', id: string, name: string, status: GraphEdgeStatus, details: { __typename?: 'SynceGraphNodeInterfaceDetails', synceEnabled: boolean | null, rxQualityLevel: string | null, qualifiedForUse: string | null, notQualifiedDueTo: string | null, notSelectedDueTo: string | null } | null }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number }, synceDeviceDetails: { __typename?: 'SynceDeviceDetails', selectedForUse: string | null } }>, edges: Array<{ __typename?: 'GraphEdge', id: string, weight: number | null, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }> } | null } };

export type MplsTopologyQueryVariables = Exact<{ [key: string]: never; }>;


export type MplsTopologyQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', mplsTopology: { __typename?: 'MplsTopology', nodes: Array<{ __typename?: 'MplsGraphNode', id: string, nodeId: string, name: string, status: GraphEdgeStatus, labels: Array<string> | null, interfaces: Array<{ __typename?: 'MplsGraphNodeInterface', id: string, name: string, status: GraphEdgeStatus }>, coordinates: { __typename?: 'GraphNodeCoordinates', x: number, y: number }, mplsDeviceDetails: { __typename?: 'InventoryMplsDeviceDetails', lspTunnels: Array<{ __typename?: 'InventoryLspTunnel', lspId: string, fromDevice: string | null, toDevice: string | null, uptime: number | null, signalization: Signalization | null } | null> | null, mplsData: Array<{ __typename?: 'InventoryMplsData', lspId: string, inputLabel: number | null, inputInterface: string | null, outputLabel: number | null, outputInterface: string | null, operState: string | null, ldpPrefix: string | null, mplsOperation: string | null } | null> | null } }>, edges: Array<{ __typename?: 'GraphEdge', id: string, weight: number | null, source: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string }, target: { __typename?: 'EdgeSourceTarget', nodeId: string, interface: string } }> } | null } };

export type GeoMapDataQueryQueryVariables = Exact<{
  filter?: InputMaybe<FilterDevicesMetadatasInput>;
}>;


export type GeoMapDataQueryQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', deviceMetadata: { __typename?: 'DeviceMetadata', nodes: Array<{ __typename?: 'GeoMapDevice', id: string, deviceName: string, locationName: string | null, geolocation: { __typename?: 'Geolocation', latitude: number, longitude: number } | null } | null> | null } | null } };

export type NeighboursQueryVariables = Exact<{
  filter?: InputMaybe<FilterNeighborInput>;
}>;


export type NeighboursQuery = { __typename?: 'Query', deviceInventory: { __typename?: 'deviceInventoryQuery', deviceNeighbor: { __typename?: 'DeviceNeighbors', neighbors: Array<{ __typename?: 'Neighbor', deviceName: string, deviceId: string } | null> | null } | null } };

export type RefreshCoordinatesMutationVariables = Exact<{
  topologyType?: InputMaybe<TopologyType>;
}>;


export type RefreshCoordinatesMutation = { __typename?: 'Mutation', topologyDiscovery: { __typename?: 'topologyDiscoveryMutation', refreshCoordinates: { __typename?: 'RefreshCoordinatesResponse', nodes: Array<{ __typename?: 'NodeCoordinates', nodeId: string, x: number, y: number }> } } };
