import {
  CliOperationalDataStore,
  NetconfOperationalDataStore,
  CliConfigurationalDataStore,
  NetconfConfigurationalDataStore,
  CliTopology,
  NetconfTopology,
} from '../helpers/types';

export function isCliOperationalDataStore(datastore: unknown): datastore is CliOperationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return (
      'node-id' in datastore! &&
      typeof datastore['node-id'] === 'string' &&
      'cli-topology:host' in datastore! &&
      typeof datastore['cli-topology:host'] === 'string' &&
      'cli-topology:port' in datastore! &&
      typeof datastore['cli-topology:port'] === 'number' &&
      'cli-topology:connected-message' in datastore! &&
      typeof datastore['cli-topology:connected-message'] === 'string' &&
      'cli-topology:connection-status' in datastore! &&
      typeof datastore['cli-topology:connection-status'] === 'string'
    );
  }
  return false;
}

export function isNetconfOperationalDataStore(datastore: unknown): datastore is NetconfOperationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return (
      'node-id' in datastore! &&
      typeof datastore['node-id'] === 'string' &&
      'netconf-node-topology:host' in datastore! &&
      typeof datastore['netconf-node-topology:host'] === 'string' &&
      'netconf-node-topology:port' in datastore! &&
      typeof datastore['netconf-node-topology:port'] === 'number' &&
      'netconf-node-topology:connected-message' in datastore! &&
      typeof datastore['netconf-node-topology:connected-message'] === 'string' &&
      'netconf-node-topology:connection-status' in datastore! &&
      typeof datastore['netconf-node-topology:connection-status'] === 'string'
    );
  }
  return false;
}

export function isCliConfigurationalDataStore(datastore: unknown): datastore is CliConfigurationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return (
      'node-id' in datastore! &&
      typeof datastore['node-id'] === 'string' &&
      'cli-topology:host' in datastore! &&
      typeof datastore['cli-topology:host'] === 'string' &&
      'cli-topology:port' in datastore! &&
      typeof datastore['cli-topology:port'] === 'number' &&
      'cli-topology:device-type' in datastore! &&
      typeof datastore['cli-topology:device-type'] === 'string' &&
      'cli-topology:device-version' in datastore! &&
      typeof datastore['cli-topology:device-version'] === 'string'
    );
  }
  return false;
}

export function isNetconfConfigurationalDataStore(datastore: unknown): datastore is NetconfConfigurationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return (
      'node-id' in datastore! &&
      typeof datastore['node-id'] === 'string' &&
      'netconf-node-topology:host' in datastore! &&
      typeof datastore['netconf-node-topology:host'] === 'string' &&
      'netconf-node-topology:port' in datastore! &&
      typeof datastore['netconf-node-topology:port'] === 'number' &&
      'netconf-node-topology:tcp-only' in datastore! &&
      typeof datastore['netconf-node-topology:tcp-only'] === 'string'
    );
  }
  return false;
}

export function isCliTopology(topology: unknown): topology is CliTopology {
  if (topology !== null && typeof topology === 'object') {
    return 'topology' in topology! && typeof topology['topology'][0]['topology-id'] === 'string';
  }
  return false;
}

export function isNetconfTopology(topology: unknown): topology is NetconfTopology {
  if (topology !== null && typeof topology === 'object') {
    return 'topology' in topology! && typeof topology['topology'][0]['topology-id'] === 'string';
  }
  return false;
}
