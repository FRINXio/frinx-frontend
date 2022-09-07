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
  blueprintId?: InputMaybe<Scalars['String']>;
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
  blueprint: Maybe<Blueprint>;
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

export type EdgeSourceTarget = {
  __typename?: 'EdgeSourceTarget';
  interface: Scalars['String'];
  nodeId: Scalars['String'];
};

export type FilterDevicesInput = {
  deviceName?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<Scalars['String']>>;
};

export type GraphEdge = {
  __typename?: 'GraphEdge';
  id: Scalars['ID'];
  source: EdgeSourceTarget;
  target: EdgeSourceTarget;
};

export type GraphNode = {
  __typename?: 'GraphNode';
  device: Device;
  id: Scalars['ID'];
  interfaces: Array<Scalars['String']>;
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
  blueprintId?: InputMaybe<Scalars['String']>;
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


export type DeviceNameQuery = { __typename?: 'Query', node: { __typename?: 'Blueprint' } | { __typename?: 'Country' } | { __typename?: 'Device', id: string, name: string } | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Zone' } | null };

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


export type BlueprintQuery = { __typename?: 'Query', blueprint: { __typename?: 'Blueprint', name: string, template: string, id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', id: string } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'Zone', id: string } | null };

export type UpdateBlueprintMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateBlueprintInput;
}>;


export type UpdateBlueprintMutation = { __typename?: 'Mutation', updateBlueprint: { __typename?: 'UpdateBlueprintPayload', blueprint: { __typename?: 'Blueprint', id: string, name: string, template: string } } };

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeviceQuery = { __typename?: 'Query', device: { __typename?: 'Blueprint', id: string } | { __typename?: 'Country', id: string } | { __typename?: 'Device', name: string, serviceState: DeviceServiceState, mountParameters: string | null, id: string, zone: { __typename?: 'Zone', id: string, name: string }, labels: { __typename?: 'LabelConnection', edges: Array<{ __typename?: 'LabelEdge', node: { __typename?: 'Label', id: string, name: string } }> } } | { __typename?: 'Label', id: string } | { __typename?: 'Location', id: string } | { __typename?: 'Zone', id: string } | null };

export type UpdateDeviceMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateDeviceInput;
}>;


export type UpdateDeviceMutation = { __typename?: 'Mutation', updateDevice: { __typename?: 'UpdateDevicePayload', device: { __typename?: 'Device', id: string, name: string, isInstalled: boolean, zone: { __typename?: 'Zone', id: string, name: string } } | null } };

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
