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

export type AddDeviceInput = {
  name: Scalars['String'];
  zoneId: Scalars['String'];
  mountParameters?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  vendor?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type AddDevicePayload = {
  __typename?: 'AddDevicePayload';
  device: Device;
};

export type AddZoneInput = {
  name: Scalars['String'];
};

export type AddZonePayload = {
  __typename?: 'AddZonePayload';
  zone: Zone;
};

export type CommitConfigPayload = {
  __typename?: 'CommitConfigPayload';
  isOk: Maybe<Scalars['Boolean']>;
};

export type DataStore = {
  __typename?: 'DataStore';
  config: Maybe<Scalars['String']>;
  operational: Maybe<Scalars['String']>;
};

export type DeleteDevicePayload = {
  __typename?: 'DeleteDevicePayload';
  device: Maybe<Device>;
};

export type Device = Node & {
  __typename?: 'Device';
  id: Scalars['ID'];
  name: Scalars['String'];
  model: Maybe<Scalars['String']>;
  vendor: Maybe<Scalars['String']>;
  address: Maybe<Scalars['String']>;
  status: Maybe<DeviceStatus>;
  zone: Maybe<Zone>;
};

export type DeviceEdge = {
  __typename?: 'DeviceEdge';
  node: Device;
  cursor: Scalars['String'];
};

export type DeviceStatus =
  | 'INSTALLED'
  | 'NOT_INSTALLED';

export type DevicesConnection = {
  __typename?: 'DevicesConnection';
  edges: Array<DeviceEdge>;
  pageInfo: PageInfo;
};

export type InstallDevicePayload = {
  __typename?: 'InstallDevicePayload';
  device: Device;
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
  deviceId: Scalars['String'];
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
  devices: DevicesConnection;
  zones: ZonesConnection;
  dataStore: Maybe<DataStore>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryDevicesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
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

export type UninstallDevicePayload = {
  __typename?: 'UninstallDevicePayload';
  device: Device;
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
};

export type UpdateDevicePayload = {
  __typename?: 'UpdateDevicePayload';
  device: Maybe<Device>;
};

export type Zone = Node & {
  __typename?: 'Zone';
  id: Scalars['ID'];
  name: Scalars['String'];
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
};

export type AddDeviceMutationVariables = Exact<{
  input: AddDeviceInput;
}>;


export type AddDeviceMutation = (
  { __typename?: 'Mutation' }
  & { addDevice: (
    { __typename?: 'AddDevicePayload' }
    & { device: (
      { __typename?: 'Device' }
      & Pick<Device, 'id' | 'name' | 'model' | 'address' | 'vendor' | 'status'>
      & { zone: Maybe<(
        { __typename?: 'Zone' }
        & Pick<Zone, 'id' | 'name'>
      )> }
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

export type QueryDataStoreQueryVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type QueryDataStoreQuery = (
  { __typename?: 'Query' }
  & { dataStore: Maybe<(
    { __typename?: 'DataStore' }
    & Pick<DataStore, 'config' | 'operational'>
  )> }
);

export type UpdateDataStoreMutationVariables = Exact<{
  deviceId: Scalars['String'];
  config: UpdateDataStoreInput;
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
  deviceId: Scalars['String'];
}>;


export type CommitDataStoreConfigMutation = (
  { __typename?: 'Mutation' }
  & { commitConfig: (
    { __typename?: 'CommitConfigPayload' }
    & Pick<CommitConfigPayload, 'isOk'>
  ) }
);

export type DevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type DevicesQuery = (
  { __typename?: 'Query' }
  & { devices: (
    { __typename?: 'DevicesConnection' }
    & { edges: Array<(
      { __typename?: 'DeviceEdge' }
      & { node: (
        { __typename?: 'Device' }
        & Pick<Device, 'id' | 'name' | 'model' | 'vendor' | 'address' | 'status'>
        & { zone: Maybe<(
          { __typename?: 'Zone' }
          & Pick<Zone, 'id' | 'name'>
        )> }
      ) }
    )> }
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
      & Pick<Device, 'id' | 'status'>
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
      & Pick<Device, 'id' | 'status'>
    ) }
  ) }
);
