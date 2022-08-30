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
  /** The `Upload` scalar type represents a file upload. */
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
  labelIds?: InputMaybe<Array<Scalars['String']>>;
  model?: InputMaybe<Scalars['String']>;
  mountParameters?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  serviceState?: InputMaybe<DeviceServiceState>;
  vendor?: InputMaybe<Scalars['String']>;
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

export type CreateLabelInput = {
  name: Scalars['String'];
};

export type CreateLabelPayload = {
  __typename?: 'CreateLabelPayload';
  label: Maybe<Label>;
};

export type CreateTransactionPayload = {
  __typename?: 'CreateTransactionPayload';
  transactionId: Maybe<Scalars['String']>;
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

export type Device = Node & {
  __typename?: 'Device';
  address: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  isInstalled: Scalars['Boolean'];
  labels: LabelConnection;
  location: Maybe<Location>;
  model: Maybe<Scalars['String']>;
  mountParameters: Maybe<Scalars['String']>;
  name: Scalars['String'];
  position: Maybe<Position>;
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

export type DeviceSource =
  | 'DISCOVERED'
  | 'IMPORTED'
  | 'MANUAL';

export type DiffData = {
  __typename?: 'DiffData';
  data: Scalars['String'];
  path: Scalars['String'];
};

export type FilterDevicesInput = {
  deviceName?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type GraphEdge = {
  __typename?: 'GraphEdge';
  id: Scalars['ID'];
  source: Scalars['String'];
  target: Scalars['String'];
};

export type GraphNode = {
  __typename?: 'GraphNode';
  device: Device;
  id: Scalars['ID'];
};

export type InstallDevicePayload = {
  __typename?: 'InstallDevicePayload';
  device: Device;
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
  closeTransaction: CloseTransactionPayload;
  commitConfig: CommitConfigPayload;
  createLabel: CreateLabelPayload;
  createTransaction: CreateTransactionPayload;
  deleteBlueprint: DeleteBlueprintPayload;
  deleteDevice: DeleteDevicePayload;
  deleteLabel: DeleteLabelPayload;
  deleteSnapshot: Maybe<DeleteSnapshotPayload>;
  importCSV: Maybe<CsvImport>;
  installDevice: InstallDevicePayload;
  resetConfig: ResetConfigPayload;
  revertChanges: RevertChangesPayload;
  syncFromNetwork: SyncFromNetworkPayload;
  uninstallDevice: UninstallDevicePayload;
  updateBlueprint: UpdateBlueprintPayload;
  updateDataStore: UpdateDataStorePayload;
  updateDevice: UpdateDevicePayload;
  updateDeviceMetadata: UpdateDeviceMetadataPayload;
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


export type MutationDeleteBlueprintArgs = {
  id: Scalars['String'];
};


export type MutationDeleteDeviceArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLabelArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
};


export type MutationImportCsvArgs = {
  input: CsvImportInput;
};


export type MutationInstallDeviceArgs = {
  id: Scalars['String'];
};


export type MutationResetConfigArgs = {
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type MutationRevertChangesArgs = {
  transactionId: Scalars['String'];
};


export type MutationSyncFromNetworkArgs = {
  deviceId: Scalars['String'];
  transactionId: Scalars['String'];
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


export type MutationUpdateDeviceMetadataArgs = {
  input: Array<PositionInput>;
};

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Maybe<Scalars['String']>;
};

export type Position = {
  __typename?: 'Position';
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type PositionInput = {
  deviceId: Scalars['ID'];
  position: PositionInputField;
};

export type PositionInputField = {
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  blueprints: BlueprintConnection;
  calculatedDiff: CalculatedDiffPayload;
  countries: CountryConnection;
  dataStore: Maybe<DataStore>;
  devices: DeviceConnection;
  labels: LabelConnection;
  locations: LocationConnection;
  node: Maybe<Node>;
  topology: Topology;
  transactions: Array<Transaction>;
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
};


export type QueryZonesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ResetConfigPayload = {
  __typename?: 'ResetConfigPayload';
  dataStore: DataStore;
};

export type RevertChangesPayload = {
  __typename?: 'RevertChangesPayload';
  isOk: Scalars['Boolean'];
};

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

export type SyncFromNetworkPayload = {
  __typename?: 'SyncFromNetworkPayload';
  dataStore: Maybe<DataStore>;
};

export type Topology = {
  __typename?: 'Topology';
  edges: Array<GraphEdge>;
  nodes: Array<GraphNode>;
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
  labelIds?: InputMaybe<Array<Scalars['String']>>;
  locationId?: InputMaybe<Scalars['String']>;
  model?: InputMaybe<Scalars['String']>;
  mountParameters?: InputMaybe<Scalars['String']>;
  serviceState?: InputMaybe<DeviceServiceState>;
  vendor?: InputMaybe<Scalars['String']>;
};

export type UpdateDeviceMetadataPayload = {
  __typename?: 'UpdateDeviceMetadataPayload';
  devices: Maybe<Array<Maybe<Device>>>;
};

export type UpdateDevicePayload = {
  __typename?: 'UpdateDevicePayload';
  device: Maybe<Device>;
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

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeviceQuery = { __typename?: 'Query', node: { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device', id: string, name: string, isInstalled: boolean, createdAt: string, serviceState: DeviceServiceState } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Zone' } | null };

export type TopologyQueryVariables = Exact<{ [key: string]: never; }>;


export type TopologyQuery = { __typename?: 'Query', topology: { __typename?: 'Topology', nodes: Array<{ __typename?: 'GraphNode', id: string, device: { __typename?: 'Device', id: string, name: string, position: { __typename?: 'Position', x: number, y: number } | null } }>, edges: Array<{ __typename?: 'GraphEdge', id: string, source: string, target: string }> } };

export type UpdatePositionMutationVariables = Exact<{
  input: Array<PositionInput> | PositionInput;
}>;


export type UpdatePositionMutation = { __typename?: 'Mutation', updateDeviceMetadata: { __typename?: 'UpdateDeviceMetadataPayload', devices: Array<{ __typename?: 'Device', id: string } | null> | null } };
