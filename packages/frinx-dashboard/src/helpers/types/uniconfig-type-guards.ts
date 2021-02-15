import {
  CliOperationalDataStore,
  NetconfOperationalDataStore,
  CliConfigurationalDataStore,
  NetconfConfigurationalDataStore,
  CliTopology,
  NetconfTopology,
} from './uniconfig-types';

export function isCliOperationalDataStore(datastore: unknown): datastore is CliOperationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return 'node-id' in datastore! && typeof datastore['node-id'] === 'string';
  }
  return false;
}

export function isNetconfOperationalDataStore(datastore: unknown): datastore is NetconfOperationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return 'node-id' in datastore! && typeof datastore['node-id'] === 'string';
  }
  return false;
}

export function isCliConfigurationalDataStore(datastore: unknown): datastore is CliConfigurationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return 'node-id' in datastore! && typeof datastore['node-id'] === 'string';
  }
  return false;
}

export function isNetconfConfigurationalDataStore(datastore: unknown): datastore is NetconfConfigurationalDataStore {
  if (datastore !== null && typeof datastore === 'object') {
    return 'node-id' in datastore! && typeof datastore['node-id'] === 'string';
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
