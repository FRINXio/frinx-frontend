import {
  CliConfigurationalState,
  CliDeviceTranslations,
  CliOperationalState,
  CliTopology,
  MountPayload,
  NetconfConfigurationalState,
  NetconfOperationalState,
  NetconfTopology,
} from './types';
// import { sendGetRequest, sendPutRequest, sendDeleteRequest, sendPostRequest } from './api-helpers';
import {
  isCliOperationalState,
  isNetconfOperationalState,
  isCliConfigurationalState,
  isNetconfConfigurationalState,
  isNetconfTopology,
  isCliTopology,
  isCliDeviceTranslations,
} from './type-guards';
import { ApiHelpers } from '../api-helpers';

const BASE_CLI_URL = '/data/network-topology:network-topology/topology=cli';
const BASE_NETCONF_URL = '/data/network-topology:network-topology/topology=topology-netconf';

const CLI_TOPOLOGY_URL = `${BASE_CLI_URL}?content=nonconfig`;
const NETCONF_TOPOLOGY_URL = `${BASE_NETCONF_URL}?content=nonconfig`;

export type UniconfigApiClient = {
  getCliOperationalState: (nodeId: string) => Promise<CliOperationalState>;
  getNetconfOperationalState: (nodeId: string) => Promise<NetconfOperationalState>;
  getCliConfigurationalState: (nodeId: string) => Promise<CliConfigurationalState>;
  getNetconfConfigurationalState: (nodeId: string) => Promise<NetconfConfigurationalState>;
  mountCliNode: (nodeId: string, mountPayload: MountPayload) => Promise<unknown>;
  mountNetconfNode: (nodeId: string, mountPayload: MountPayload) => Promise<unknown>;
  unmountCliNode: (nodeId: string) => Promise<unknown>;
  unmountNetconfNode: (nodeId: string) => Promise<unknown>;
  getCliTopology: () => Promise<CliTopology>;
  getNetconfTopology: () => Promise<NetconfTopology>;
  getCliDeviceTranslations: () => Promise<CliDeviceTranslations>;
  getCliConfigurationalDataStore: (nodeId: string) => Promise<unknown>;
  updateCliConfigurationalDataStore: (nodeId: string, data: unknown) => Promise<unknown>;
  getCliOperationalDataStore: (nodeId: string) => Promise<unknown>;
  calculateDiff: (target: unknown) => Promise<unknown>;
  commitToNetwork: (target: unknown) => Promise<unknown>;
  dryRunCommit: (target: unknown) => Promise<unknown>;
  syncFromNetwork: (target: unknown) => Promise<unknown>;
  replaceConfigWithOperational: (target: unknown) => Promise<unknown>;
  getSnapshots: () => Promise<unknown>;
  createSnapshot: (target: unknown) => Promise<unknown>;
  deleteSnapshot: (target: unknown) => Promise<unknown>;
  replaceConfigWithSnapshot: (target: unknown) => Promise<unknown>;
};

export default function createUniconfigApiClient(apiHelpers: ApiHelpers): UniconfigApiClient {
  const { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } = apiHelpers;

  async function getCliOperationalState(nodeId: string): Promise<CliOperationalState> {
    const response = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=nonconfig`);
    const state = (response as { node: unknown[] }).node[0];

    if (isCliOperationalState(state)) {
      return state;
    }

    throw new Error(`Expected CliOperationalState, got '${JSON.stringify(state)}'.`);
  }

  async function getNetconfOperationalState(nodeId: string): Promise<NetconfOperationalState> {
    const response = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=nonconfig`);
    const state = (response as { node: unknown[] }).node[0];

    if (isNetconfOperationalState(state)) {
      return state;
    }

    throw new Error(`Expected NetconfOperationalState, got '${JSON.stringify(state)}'.`);
  }

  async function getCliConfigurationalState(nodeId: string): Promise<CliConfigurationalState> {
    const response = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=config`);
    const state = (response as { node: unknown[] }).node[0];

    if (isCliConfigurationalState(state)) {
      return state;
    }

    throw new Error(`Expected CliConfigurationalState, got '${JSON.stringify(state)}'.`);
  }

  async function getNetconfConfigurationalState(nodeId: string): Promise<NetconfConfigurationalState> {
    const response = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=config`);
    const state = (response as { node: unknown[] }).node[0];

    if (isNetconfConfigurationalState(state)) {
      return state;
    }

    throw new Error(`Expected NetconfConfigurationalState, got '${JSON.stringify(state)}'.`);
  }

  async function mountCliNode(nodeId: string, payload: MountPayload): Promise<unknown> {
    const datastore = await sendPutRequest(`${BASE_CLI_URL}/node=${nodeId}`, payload);

    return datastore;
  }

  async function mountNetconfNode(nodeId: string, payload: MountPayload): Promise<unknown> {
    const datastore = await sendPutRequest(`${BASE_NETCONF_URL}/node=${nodeId}`, payload);

    return datastore;
  }

  async function unmountCliNode(nodeId: string): Promise<unknown> {
    const datastore = await sendDeleteRequest(`${BASE_CLI_URL}/node=${nodeId}`);

    return datastore;
  }

  async function unmountNetconfNode(nodeId: string): Promise<unknown> {
    const datastore = await sendDeleteRequest(`${BASE_NETCONF_URL}/node=${nodeId}`);

    return datastore;
  }

  async function getCliTopology(): Promise<CliTopology> {
    const topology = await sendGetRequest(CLI_TOPOLOGY_URL);

    if (isCliTopology(topology)) {
      return topology;
    }

    throw new Error(`Expected CliTopology, got '${JSON.stringify(topology)}'.`);
  }

  async function getNetconfTopology(): Promise<NetconfTopology> {
    const topology = await sendGetRequest(NETCONF_TOPOLOGY_URL);

    if (isNetconfTopology(topology)) {
      return topology;
    }

    throw new Error(`Expected NetconfTopology, got '${JSON.stringify(topology)}'.`);
  }

  async function getCliDeviceTranslations(): Promise<CliDeviceTranslations> {
    const translations = await sendGetRequest(
      `/data/cli-translate-registry:available-cli-device-translations?content=nonconfig&depth=3`,
    );

    if (isCliDeviceTranslations(translations)) {
      return translations;
    }

    throw new Error(`Expected CliDeviceTranslations, got '${JSON.stringify(translations)}'.`);
  }

  async function getCliConfigurationalDataStore(nodeId: string): Promise<unknown> {
    const datastore = await sendGetRequest(
      `/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration?content=config`,
    );

    return datastore;
  }

  async function updateCliConfigurationalDataStore(nodeId: string, data: unknown): Promise<unknown> {
    const datastore = await sendPutRequest(
      `/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration`,
      data,
    );

    return datastore;
  }

  async function getCliOperationalDataStore(nodeId: string): Promise<unknown> {
    const datastore = await sendGetRequest(
      `/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration?content=nonconfig`,
    );

    return datastore;
  }

  async function calculateDiff(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/uniconfig-manager:calculate-diff`, target);

    return output;
  }

  async function commitToNetwork(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/uniconfig-manager:commit`, target);

    return output;
  }

  async function dryRunCommit(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/dryrun-manager:dryrun-commit`, target);

    return output;
  }

  async function syncFromNetwork(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/uniconfig-manager:sync-from-network`, target);

    return output;
  }

  async function replaceConfigWithOperational(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/uniconfig-manager:replace-config-with-operational`, target);

    return output;
  }

  async function getSnapshots(): Promise<unknown> {
    const output = await sendGetRequest(`/data/network-topology:network-topology?content=config`);

    return output;
  }

  async function createSnapshot(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/snapshot-manager:create-snapshot`, target);

    return output;
  }

  async function deleteSnapshot(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/snapshot-manager:delete-snapshot`, target);

    return output;
  }

  async function replaceConfigWithSnapshot(target: unknown): Promise<unknown> {
    const output = await sendPostRequest(`/operations/snapshot-manager:replace-config-with-snapshot`, target);

    return output;
  }
  return {
    getCliOperationalState,
    getNetconfOperationalState,
    getCliConfigurationalState,
    getNetconfConfigurationalState,
    mountCliNode,
    mountNetconfNode,
    unmountCliNode,
    unmountNetconfNode,
    getCliTopology,
    getNetconfTopology,
    getCliDeviceTranslations,
    getCliConfigurationalDataStore,
    updateCliConfigurationalDataStore,
    getCliOperationalDataStore,
    calculateDiff,
    commitToNetwork,
    dryRunCommit,
    syncFromNetwork,
    replaceConfigWithOperational,
    getSnapshots,
    createSnapshot,
    deleteSnapshot,
    replaceConfigWithSnapshot,
  };
}
