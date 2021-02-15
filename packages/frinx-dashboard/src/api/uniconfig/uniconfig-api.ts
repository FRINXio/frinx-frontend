import {
  CliConfigurationalDataStore,
  CliOperationalDataStore,
  CliTopology,
  MountPayload,
  NetconfConfigurationalDataStore,
  NetconfOperationalDataStore,
  NetconfTopology,
} from '../../helpers/types/uniconfig-types';
import { sendGetRequest, sendPutRequest, sendDeleteRequest } from './api-helpers';
import {
  isCliOperationalDataStore,
  isNetconfOperationalDataStore,
  isCliConfigurationalDataStore,
  isNetconfConfigurationalDataStore,
  isNetconfTopology,
  isCliTopology,
} from '../../helpers/types/uniconfig-type-guards';

const BASE_CLI_URL = '/rests/data/network-topology:network-topology/topology=cli';
const BASE_NETCONF_URL = '/rests/data/network-topology:network-topology/topology=topology-netconf';

const CLI_TOPOLOGY_URL = `${BASE_CLI_URL}?content=nonconfig`;
const NETCONF_TOPOLOGY_URL = `${BASE_NETCONF_URL}?content=nonconfig`;

export async function getCliOperationalDataStore(nodeId: string): Promise<CliOperationalDataStore> {
  const datastore = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=nonconfig`);

  if (isCliOperationalDataStore(datastore)) {
    return datastore;
  }

  throw new Error(`Expected CliOperationalDataStore, got '${JSON.stringify(datastore)}'.`);
}

export async function getNetconfOperationalDataStore(nodeId: string): Promise<NetconfOperationalDataStore> {
  const datastore = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=nonconfig`);

  if (isNetconfOperationalDataStore(datastore)) {
    return datastore;
  }

  throw new Error(`Expected CliOperationalDataStore, got '${JSON.stringify(datastore)}'.`);
}

export async function getCliConfigurationalDataStore(nodeId: string): Promise<CliConfigurationalDataStore> {
  const datastore = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=config`);

  if (isCliConfigurationalDataStore(datastore)) {
    return datastore;
  }

  throw new Error(`Expected CliConfigurationalDataStore, got '${datastore}'.`);
}

export async function getNetconfConfigurationalDataStore(nodeId: string): Promise<NetconfConfigurationalDataStore> {
  const datastore = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=config`);

  if (isNetconfConfigurationalDataStore(datastore)) {
    return datastore;
  }

  throw new Error(`Expected NetconfConfigurationalDataStore, got '${JSON.stringify(datastore)}'.`);
}

export async function mountCliNode(nodeId: string, payload: MountPayload): Promise<unknown> {
  const datastore = await sendPutRequest(`${BASE_CLI_URL}/node=${nodeId}`, payload);

  return datastore;
}

export async function unmountCliNode(nodeId: string): Promise<unknown> {
  const datastore = await sendDeleteRequest(`${BASE_CLI_URL}/node=${nodeId}`);

  return datastore;
}

export async function getCliTopology(): Promise<CliTopology> {
  const topology = await sendGetRequest(CLI_TOPOLOGY_URL);

  if (isCliTopology(topology)) {
    return topology;
  }

  throw new Error(`Expected CliTopology, got '${JSON.stringify(topology)}'.`);
}

export async function getNetconfTopology(): Promise<NetconfTopology> {
  const topology = await sendGetRequest(NETCONF_TOPOLOGY_URL);

  if (isNetconfTopology(topology)) {
    return topology;
  }

  throw new Error(`Expected NetconfTopology, got '${JSON.stringify(topology)}'.`);
}
