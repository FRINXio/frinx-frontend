import {
  CliConfigurationalState,
  CliDeviceTranslations,
  CliOperationalState,
  CliTopology,
  MountPayload,
  NetconfConfigurationalState,
  NetconfOperationalState,
  NetconfTopology,
} from '../../helpers/types/uniconfig-types';
import { sendGetRequest, sendPutRequest, sendDeleteRequest, sendPostRequest } from './api-helpers';
import {
  isCliOperationalState,
  isNetconfOperationalState,
  isCliConfigurationalState,
  isNetconfConfigurationalState,
  isNetconfTopology,
  isCliTopology,
  isCliDeviceTranslations,
} from '../../helpers/types/uniconfig-type-guards';

const BASE_CLI_URL = '/rests/data/network-topology:network-topology/topology=cli';
const BASE_NETCONF_URL = '/rests/data/network-topology:network-topology/topology=topology-netconf';

const CLI_TOPOLOGY_URL = `${BASE_CLI_URL}?content=nonconfig`;
const NETCONF_TOPOLOGY_URL = `${BASE_NETCONF_URL}?content=nonconfig`;

export async function getCliOperationalState(nodeId: string): Promise<CliOperationalState> {
  const response = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=nonconfig`);
  const state = (response as { node: unknown[] }).node[0];

  if (isCliOperationalState(state)) {
    return state;
  }

  throw new Error(`Expected CliOperationalState, got '${JSON.stringify(state)}'.`);
}

export async function getNetconfOperationalState(nodeId: string): Promise<NetconfOperationalState> {
  const response = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=nonconfig`);
  const state = (response as { node: unknown[] }).node[0];

  if (isNetconfOperationalState(state)) {
    return state;
  }

  throw new Error(`Expected NetconfOperationalState, got '${JSON.stringify(state)}'.`);
}

export async function getCliConfigurationalState(nodeId: string): Promise<CliConfigurationalState> {
  const response = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=config`);
  const state = (response as { node: unknown[] }).node[0];

  if (isCliConfigurationalState(state)) {
    return state;
  }

  throw new Error(`Expected CliConfigurationalState, got '${JSON.stringify(state)}'.`);
}

export async function getNetconfConfigurationalState(nodeId: string): Promise<NetconfConfigurationalState> {
  const response = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=config`);
  const state = (response as { node: unknown[] }).node[0];

  if (isNetconfConfigurationalState(state)) {
    return state;
  }

  throw new Error(`Expected NetconfConfigurationalState, got '${JSON.stringify(state)}'.`);
}

export async function mountCliNode(nodeId: string, payload: MountPayload): Promise<unknown> {
  const datastore = await sendPutRequest(`${BASE_CLI_URL}/node=${nodeId}`, payload);

  return datastore;
}

export async function mountNetconfNode(nodeId: string, payload: MountPayload): Promise<unknown> {
  const datastore = await sendPutRequest(`${BASE_NETCONF_URL}/node=${nodeId}`, payload);

  return datastore;
}

export async function unmountCliNode(nodeId: string): Promise<unknown> {
  const datastore = await sendDeleteRequest(`${BASE_CLI_URL}/node=${nodeId}`);

  return datastore;
}

export async function unmountNetconfNode(nodeId: string): Promise<unknown> {
  const datastore = await sendDeleteRequest(`${BASE_NETCONF_URL}/node=${nodeId}`);

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

export async function getCliDeviceTranslations(): Promise<CliDeviceTranslations> {
  const translations = await sendGetRequest(
    `/rests/data/cli-translate-registry:available-cli-device-translations?content=nonconfig&depth=3`,
  );

  if (isCliDeviceTranslations(translations)) {
    return translations;
  }

  throw new Error(`Expected CliDeviceTranslations, got '${JSON.stringify(translations)}'.`);
}

export async function getCliConfigurationalDataStore(nodeId: string): Promise<unknown> {
  const datastore = await sendGetRequest(
    `/rests/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration?content=config`,
  );

  return datastore;
}

export async function updateCliConfigurationalDataStore(nodeId: string, data: unknown): Promise<unknown> {
  const datastore = await sendPutRequest(
    `/rests/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration`,
    data,
  );

  return datastore;
}

export async function getCliOperationalDataStore(nodeId: string): Promise<unknown> {
  const datastore = await sendGetRequest(
    `/rests/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration?content=nonconfig`,
  );

  return datastore;
}

export async function calculateDiff(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/uniconfig-manager:calculate-diff`, target);

  return output;
}

export async function commitToNetwork(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/uniconfig-manager:commit`, target);

  return output;
}

export async function dryRunCommit(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/dryrun-manager:dryrun-commit`, target);

  return output;
}

export async function syncFromNetwork(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/uniconfig-manager:sync-from-network`, target);

  return output;
}

export async function replaceConfigWithOperational(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/uniconfig-manager:replace-config-with-operational`, target);

  return output;
}

export async function getSnapshots(): Promise<unknown> {
  const output = await sendGetRequest(`/rests/data/network-topology:network-topology?content=config`);

  return output;
}

export async function createSnapshot(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/snapshot-manager:create-snapshot`, target);

  return output;
}

export async function deleteSnapshot(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/snapshot-manager:delete-snapshot`, target);

  return output;
}

export async function replaceConfigWithSnapshot(target: unknown): Promise<unknown> {
  const output = await sendPostRequest(`/rests/operations/snapshot-manager:replace-config-with-snapshot`, target);

  return output;
}
