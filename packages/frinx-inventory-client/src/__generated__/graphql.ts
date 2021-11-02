export type Maybe<T> = T | null;
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
  name: Scalars['String'];
  zoneId: Scalars['String'];
  labelIds?: Maybe<Array<Scalars['String']>>;
  serviceState?: Maybe<DeviceServiceState>;
  mountParameters?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  vendor?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type AddDevicePayload = {
  __typename?: 'AddDevicePayload';
  device: Device;
};

export type AddLocationInput = {
  name: Scalars['String'];
  countryId: Scalars['String'];
};

export type AddLocationPayload = {
  __typename?: 'AddLocationPayload';
  location: Location;
};

export type AddSnapshotInput = {
  name: Scalars['String'];
  deviceId: Scalars['String'];
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
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  template: Scalars['String'];
};

export type BlueprintConnection = {
  __typename?: 'BlueprintConnection';
  edges: Array<BlueprintEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type BlueprintEdge = {
  __typename?: 'BlueprintEdge';
  node: Blueprint;
  cursor: Scalars['String'];
};

export type CalculatedDiffPayload = {
  __typename?: 'CalculatedDiffPayload';
  output: Maybe<Scalars['String']>;
};

export type CommitConfigInput = {
  deviceId: Scalars['String'];
  shouldDryRun?: Maybe<Scalars['Boolean']>;
};

export type CommitConfigPayload = {
  __typename?: 'CommitConfigPayload';
  isOk: Scalars['Boolean'];
  output: Scalars['String'];
};

export type Country = Node & {
  __typename?: 'Country';
  id: Scalars['ID'];
  name: Scalars['String'];
  code: Scalars['String'];
};

export type CountryConnection = {
  __typename?: 'CountryConnection';
  edges: Array<CountryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type CountryEdge = {
  __typename?: 'CountryEdge';
  node: Country;
  cursor: Scalars['String'];
};

export type CreateLabelInput = {
  name: Scalars['String'];
};

export type CreateLabelPayload = {
  __typename?: 'CreateLabelPayload';
  label: Maybe<Label>;
};

export type DataStore = {
  __typename?: 'DataStore';
  config: Maybe<Scalars['String']>;
  operational: Maybe<Scalars['String']>;
  snapshots: Array<Snapshot>;
};

export type DeleteDevicePayload = {
  __typename?: 'DeleteDevicePayload';
  device: Maybe<Device>;
};

export type DeleteLabelPayload = {
  __typename?: 'DeleteLabelPayload';
  label: Maybe<Label>;
};

export type Device = Node & {
  __typename?: 'Device';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  model: Maybe<Scalars['String']>;
  vendor: Maybe<Scalars['String']>;
  address: Maybe<Scalars['String']>;
  mountParameters: Maybe<Scalars['String']>;
  source: DeviceSource;
  serviceState: DeviceServiceState;
  isInstalled: Scalars['Boolean'];
  zone: Zone;
  labels: LabelConnection;
  location: Maybe<Location>;
};


export type DeviceLabelsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};

export type DeviceConnection = {
  __typename?: 'DeviceConnection';
  edges: Array<DeviceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DeviceEdge = {
  __typename?: 'DeviceEdge';
  node: Device;
  cursor: Scalars['String'];
};

export type DeviceServiceState =
  | 'PLANNING'
  | 'IN_SERVICE'
  | 'OUT_OF_SERVICE';

export type DeviceSource =
  | 'MANUAL'
  | 'DISCOVERED'
  | 'IMPORTED';

export type FilterDevicesInput = {
  labelIds?: Maybe<Array<Scalars['String']>>;
  deviceName?: Maybe<Scalars['String']>;
};

export type InstallDevicePayload = {
  __typename?: 'InstallDevicePayload';
  device: Device;
};

export type Label = Node & {
  __typename?: 'Label';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
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
  node: Label;
  cursor: Scalars['String'];
};

export type Location = Node & {
  __typename?: 'Location';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  country: Scalars['String'];
};

export type LocationConnection = {
  __typename?: 'LocationConnection';
  edges: Array<LocationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LocationEdge = {
  __typename?: 'LocationEdge';
  node: Location;
  cursor: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addDevice: AddDevicePayload;
  updateDevice: UpdateDevicePayload;
  deleteDevice: DeleteDevicePayload;
  installDevice: InstallDevicePayload;
  uninstallDevice: UninstallDevicePayload;
  addZone: AddZonePayload;
  updateDataStore: UpdateDataStorePayload;
  commitConfig: CommitConfigPayload;
  resetConfig: ResetConfigPayload;
  addSnapshot: Maybe<AddSnapshotPayload>;
  applySnapshot: ApplySnapshotPayload;
  syncFromNetwork: SyncFromNetworkPayload;
  createLabel: CreateLabelPayload;
  deleteLabel: DeleteLabelPayload;
  addLocation: AddLocationPayload;
  addBlueprint: AddBlueprintPayload;
  updateBlueprint: UpdateBlueprintPayload;
};


export type MutationAddDeviceArgs = {
  input: AddDeviceInput;
};


export type MutationUpdateDeviceArgs = {
  id: Scalars['String'];
  input: UpdateDeviceInput;
};


export type MutationDeleteDeviceArgs = {
  id: Scalars['String'];
};


export type MutationInstallDeviceArgs = {
  id: Scalars['String'];
};


export type MutationUninstallDeviceArgs = {
  id: Scalars['String'];
};


export type MutationAddZoneArgs = {
  input: AddZoneInput;
};


export type MutationUpdateDataStoreArgs = {
  deviceId: Scalars['String'];
  input: UpdateDataStoreInput;
};


export type MutationCommitConfigArgs = {
  input: CommitConfigInput;
};


export type MutationResetConfigArgs = {
  deviceId: Scalars['String'];
};


export type MutationAddSnapshotArgs = {
  input: AddSnapshotInput;
};


export type MutationApplySnapshotArgs = {
  input: ApplySnapshotInput;
};


export type MutationSyncFromNetworkArgs = {
  deviceId: Scalars['String'];
};


export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
};


export type MutationDeleteLabelArgs = {
  id: Scalars['String'];
};


export type MutationAddLocationArgs = {
  input: AddLocationInput;
};


export type MutationAddBlueprintArgs = {
  input: AddBlueprintInput;
};


export type MutationUpdateBlueprintArgs = {
  id: Scalars['String'];
  input: UpdateBlueprintInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  startCursor: Maybe<Scalars['String']>;
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  node: Maybe<Node>;
  devices: DeviceConnection;
  zones: ZonesConnection;
  dataStore: Maybe<DataStore>;
  calculatedDiff: CalculatedDiffPayload;
  labels: LabelConnection;
  countries: CountryConnection;
  locations: LocationConnection;
  blueprints: BlueprintConnection;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryDevicesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<FilterDevicesInput>;
  sort?: Maybe<SortingInput>;
};


export type QueryZonesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryDataStoreArgs = {
  deviceId: Scalars['String'];
};


export type QueryCalculatedDiffArgs = {
  deviceId: Scalars['String'];
};


export type QueryLabelsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryCountriesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryLocationsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryBlueprintsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};

export type ResetConfigPayload = {
  __typename?: 'ResetConfigPayload';
  dataStore: DataStore;
};

export type Snapshot = {
  __typename?: 'Snapshot';
  name: Scalars['String'];
  createdAt: Scalars['String'];
};

export type SortDeviceBy =
  | 'NAME'
  | 'CREATED_AT';

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type SortingInput = {
  sortBy: SortDeviceBy;
  direction: SortDirection;
};

export type SyncFromNetworkPayload = {
  __typename?: 'SyncFromNetworkPayload';
  dataStore: Maybe<DataStore>;
};

export type UninstallDevicePayload = {
  __typename?: 'UninstallDevicePayload';
  device: Device;
};

export type UpdateBlueprintInput = {
  name?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
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
  mountParameters?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  vendor?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  labelIds?: Maybe<Array<Scalars['String']>>;
  serviceState?: Maybe<DeviceServiceState>;
  locationId?: Maybe<Scalars['String']>;
};

export type UpdateDevicePayload = {
  __typename?: 'UpdateDevicePayload';
  device: Maybe<Device>;
};

export type Zone = Node & {
  __typename?: 'Zone';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ZoneEdge = {
  __typename?: 'ZoneEdge';
  node: Zone;
  cursor: Scalars['String'];
};

export type ZonesConnection = {
  __typename?: 'ZonesConnection';
  edges: Array<ZoneEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AddBlueprintMutationVariables = Exact<{
  input: AddBlueprintInput;
}>;


export type AddBlueprintMutation = (
  { __typename?: 'Mutation' }
  & { addBlueprint: (
    { __typename?: 'AddBlueprintPayload' }
    & { blueprint: (
      { __typename?: 'Blueprint' }
      & Pick<Blueprint, 'id' | 'createdAt' | 'name'>
    ) }
  ) }
);

export type AddDeviceMutationVariables = Exact<{
  input: AddDeviceInput;
}>;


export type AddDeviceMutation = (
  { __typename?: 'Mutation' }
  & { addDevice: (
    { __typename?: 'AddDevicePayload' }
    & { device: (
      { __typename?: 'Device' }
      & Pick<Device, 'id' | 'name' | 'isInstalled'>
      & { zone: (
        { __typename?: 'Zone' }
        & Pick<Zone, 'id' | 'name'>
      ) }
    ) }
  ) }
);

export type ZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type ZonesQuery = (
  { __typename?: 'Query' }
  & { zones: (
    { __typename?: 'ZonesConnection' }
    & { edges: Array<(
      { __typename?: 'ZoneEdge' }
      & { node: (
        { __typename?: 'Zone' }
        & Pick<Zone, 'id' | 'name'>
      ) }
    )> }
  ) }
);

export type DeviceBlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type DeviceBlueprintsQuery = (
  { __typename?: 'Query' }
  & { blueprints: (
    { __typename?: 'BlueprintConnection' }
    & { edges: Array<(
      { __typename?: 'BlueprintEdge' }
      & { node: (
        { __typename?: 'Blueprint' }
        & Pick<Blueprint, 'id' | 'name' | 'template'>
      ) }
    )> }
  ) }
);

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = (
  { __typename?: 'Mutation' }
  & { newLabel: (
    { __typename?: 'CreateLabelPayload' }
    & { label: Maybe<(
      { __typename?: 'Label' }
      & Pick<Label, 'id' | 'name' | 'createdAt' | 'updatedAt'>
    )> }
  ) }
);

export type LabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type LabelsQuery = (
  { __typename?: 'Query' }
  & { labels: (
    { __typename?: 'LabelConnection' }
    & { edges: Array<(
      { __typename?: 'LabelEdge' }
      & { node: (
        { __typename?: 'Label' }
        & Pick<Label, 'id' | 'name'>
      ) }
    )> }
  ) }
);

export type BlueprintsQueryVariables = Exact<{ [key: string]: never; }>;


export type BlueprintsQuery = (
  { __typename?: 'Query' }
  & { blueprints: (
    { __typename?: 'BlueprintConnection' }
    & { edges: Array<(
      { __typename?: 'BlueprintEdge' }
      & { node: (
        { __typename?: 'Blueprint' }
        & Pick<Blueprint, 'id' | 'createdAt' | 'name'>
      ) }
    )> }
  ) }
);

export type DeviceNameQueryVariables = Exact<{
  deviceId: Scalars['ID'];
}>;


export type DeviceNameQuery = (
  { __typename?: 'Query' }
  & { node: Maybe<{ __typename?: 'Blueprint' } | { __typename?: 'Country' } | (
    { __typename?: 'Device' }
    & Pick<Device, 'id' | 'name'>
  ) | { __typename?: 'Label' } | { __typename?: 'Location' } | { __typename?: 'Zone' }> }
);

export type DataStoreQueryVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type DataStoreQuery = (
  { __typename?: 'Query' }
  & { dataStore: Maybe<(
    { __typename?: 'DataStore' }
    & Pick<DataStore, 'config' | 'operational'>
    & { snapshots: Array<(
      { __typename?: 'Snapshot' }
      & Pick<Snapshot, 'name' | 'createdAt'>
    )> }
  )> }
);

export type UpdateDataStoreMutationVariables = Exact<{
  deviceId: Scalars['String'];
  input: UpdateDataStoreInput;
}>;


export type UpdateDataStoreMutation = (
  { __typename?: 'Mutation' }
  & { updateDataStore: (
    { __typename?: 'UpdateDataStorePayload' }
    & { dataStore: (
      { __typename?: 'DataStore' }
      & Pick<DataStore, 'config' | 'operational'>
    ) }
  ) }
);

export type CommitDataStoreConfigMutationVariables = Exact<{
  input: CommitConfigInput;
}>;


export type CommitDataStoreConfigMutation = (
  { __typename?: 'Mutation' }
  & { commitConfig: (
    { __typename?: 'CommitConfigPayload' }
    & Pick<CommitConfigPayload, 'isOk'>
  ) }
);

export type ResetConfigMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type ResetConfigMutation = (
  { __typename?: 'Mutation' }
  & { resetConfig: (
    { __typename?: 'ResetConfigPayload' }
    & { dataStore: (
      { __typename?: 'DataStore' }
      & Pick<DataStore, 'config' | 'operational'>
    ) }
  ) }
);

export type AddSnapshotMutationVariables = Exact<{
  input: AddSnapshotInput;
}>;


export type AddSnapshotMutation = (
  { __typename?: 'Mutation' }
  & { addSnapshot: Maybe<(
    { __typename?: 'AddSnapshotPayload' }
    & { snapshot: Maybe<(
      { __typename?: 'Snapshot' }
      & Pick<Snapshot, 'name'>
    )> }
  )> }
);

export type ApplySnapshotMutationVariables = Exact<{
  input: ApplySnapshotInput;
}>;


export type ApplySnapshotMutation = (
  { __typename?: 'Mutation' }
  & { applySnapshot: (
    { __typename?: 'ApplySnapshotPayload' }
    & Pick<ApplySnapshotPayload, 'isOk' | 'output'>
  ) }
);

export type SyncFromNetworkMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type SyncFromNetworkMutation = (
  { __typename?: 'Mutation' }
  & { syncFromNetwork: (
    { __typename?: 'SyncFromNetworkPayload' }
    & { dataStore: Maybe<(
      { __typename?: 'DataStore' }
      & Pick<DataStore, 'operational'>
    )> }
  ) }
);

export type CalculatedDiffQueryVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type CalculatedDiffQuery = (
  { __typename?: 'Query' }
  & { calculatedDiff: (
    { __typename?: 'CalculatedDiffPayload' }
    & Pick<CalculatedDiffPayload, 'output'>
  ) }
);

export type DevicesQueryVariables = Exact<{
  labelIds?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  deviceName?: Maybe<Scalars['String']>;
  sort?: Maybe<SortingInput>;
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
}>;


export type DevicesQuery = (
  { __typename?: 'Query' }
  & { devices: (
    { __typename?: 'DeviceConnection' }
    & { edges: Array<(
      { __typename?: 'DeviceEdge' }
      & { node: (
        { __typename?: 'Device' }
        & Pick<Device, 'id' | 'name' | 'createdAt' | 'isInstalled' | 'serviceState'>
        & { zone: (
          { __typename?: 'Zone' }
          & Pick<Zone, 'id' | 'name'>
        ) }
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'startCursor' | 'endCursor' | 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);

export type InstallDeviceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type InstallDeviceMutation = (
  { __typename?: 'Mutation' }
  & { installDevice: (
    { __typename?: 'InstallDevicePayload' }
    & { device: (
      { __typename?: 'Device' }
      & Pick<Device, 'id' | 'createdAt' | 'isInstalled' | 'serviceState'>
    ) }
  ) }
);

export type UninstallDeviceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UninstallDeviceMutation = (
  { __typename?: 'Mutation' }
  & { uninstallDevice: (
    { __typename?: 'UninstallDevicePayload' }
    & { device: (
      { __typename?: 'Device' }
      & Pick<Device, 'id' | 'createdAt' | 'isInstalled' | 'serviceState'>
    ) }
  ) }
);

export type FilterLabelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FilterLabelsQuery = (
  { __typename?: 'Query' }
  & { labels: (
    { __typename?: 'LabelConnection' }
    & { edges: Array<(
      { __typename?: 'LabelEdge' }
      & { node: (
        { __typename?: 'Label' }
        & Pick<Label, 'id' | 'name'>
      ) }
    )> }
  ) }
);

export type DeleteDeviceMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type DeleteDeviceMutation = (
  { __typename?: 'Mutation' }
  & { deleteDevice: (
    { __typename?: 'DeleteDevicePayload' }
    & { device: Maybe<(
      { __typename?: 'Device' }
      & Pick<Device, 'id'>
    )> }
  ) }
);

export type BlueprintQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BlueprintQuery = (
  { __typename?: 'Query' }
  & { blueprint: Maybe<(
    { __typename?: 'Blueprint' }
    & Pick<Blueprint, 'name' | 'template' | 'id'>
  ) | (
    { __typename?: 'Country' }
    & Pick<Country, 'id'>
  ) | (
    { __typename?: 'Device' }
    & Pick<Device, 'id'>
  ) | (
    { __typename?: 'Label' }
    & Pick<Label, 'id'>
  ) | (
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
  ) | (
    { __typename?: 'Zone' }
    & Pick<Zone, 'id'>
  )> }
);

export type UpdateBlueprintMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateBlueprintInput;
}>;


export type UpdateBlueprintMutation = (
  { __typename?: 'Mutation' }
  & { updateBlueprint: (
    { __typename?: 'UpdateBlueprintPayload' }
    & { blueprint: (
      { __typename?: 'Blueprint' }
      & Pick<Blueprint, 'id' | 'name' | 'template'>
    ) }
  ) }
);

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeviceQuery = (
  { __typename?: 'Query' }
  & { device: Maybe<(
    { __typename?: 'Blueprint' }
    & Pick<Blueprint, 'id'>
  ) | (
    { __typename?: 'Country' }
    & Pick<Country, 'id'>
  ) | (
    { __typename?: 'Device' }
    & Pick<Device, 'name' | 'serviceState' | 'mountParameters' | 'id'>
    & { zone: (
      { __typename?: 'Zone' }
      & Pick<Zone, 'id' | 'name'>
    ), labels: (
      { __typename?: 'LabelConnection' }
      & { edges: Array<(
        { __typename?: 'LabelEdge' }
        & { node: (
          { __typename?: 'Label' }
          & Pick<Label, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename?: 'Label' }
    & Pick<Label, 'id'>
  ) | (
    { __typename?: 'Location' }
    & Pick<Location, 'id'>
  ) | (
    { __typename?: 'Zone' }
    & Pick<Zone, 'id'>
  )> }
);

export type UpdateDeviceMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateDeviceInput;
}>;


export type UpdateDeviceMutation = (
  { __typename?: 'Mutation' }
  & { updateDevice: (
    { __typename?: 'UpdateDevicePayload' }
    & { device: Maybe<(
      { __typename?: 'Device' }
      & Pick<Device, 'id' | 'name' | 'isInstalled'>
      & { zone: (
        { __typename?: 'Zone' }
        & Pick<Zone, 'id' | 'name'>
      ) }
    )> }
  ) }
);
