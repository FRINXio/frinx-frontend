import {
  CliOperationalDataStore,
  NetconfOperationalDataStore,
  CliConfigurationalDataStore,
  NetconfConfigurationalDataStore,
  CliTopology,
  NetconfTopology,
} from '../helpers/types';

export function isCliOperationalDataStore(datastore: unknown): datastore is CliOperationalDataStore {
  return (
    typeof (datastore as CliOperationalDataStore)['node-id'] === 'string' &&
    typeof (datastore as CliOperationalDataStore)['cli-topology:host'] === 'string' &&
    typeof (datastore as CliOperationalDataStore)['cli-topology:port'] === 'number' &&
    typeof (datastore as CliOperationalDataStore)['cli-topology:connected-message'] === 'string' &&
    typeof (datastore as CliOperationalDataStore)['cli-topology:connection-status'] === 'string'
  );
}

export function isNetconfOperationalDataStore(datastore: unknown): datastore is NetconfOperationalDataStore {
  return (
    typeof (datastore as NetconfOperationalDataStore)['node-id'] === 'string' &&
    typeof (datastore as NetconfOperationalDataStore)['netconf-node-topology:host'] === 'string' &&
    typeof (datastore as NetconfOperationalDataStore)['netconf-node-topology:port'] === 'number' &&
    typeof (datastore as NetconfOperationalDataStore)['netconf-node-topology:connected-message'] === 'string' &&
    typeof (datastore as NetconfOperationalDataStore)['netconf-node-topology:connection-status'] === 'string'
  );
}

export function isCliConfigurationalDataStore(datastore: unknown): datastore is CliConfigurationalDataStore {
  return (
    typeof (datastore as CliConfigurationalDataStore)['node-id'] === 'string' &&
    typeof (datastore as CliConfigurationalDataStore)['cli-topology:host'] === 'string' &&
    typeof (datastore as CliConfigurationalDataStore)['cli-topology:port'] === 'number' &&
    typeof (datastore as CliConfigurationalDataStore)['cli-topology:device-type'] === 'string' &&
    typeof (datastore as CliConfigurationalDataStore)['cli-topology:device-version'] === 'string'
  );
}

export function isNetconfConfigurationalDataStore(datastore: unknown): datastore is NetconfConfigurationalDataStore {
  return (
    typeof (datastore as NetconfConfigurationalDataStore)['node-id'] === 'string' &&
    typeof (datastore as NetconfConfigurationalDataStore)['netconf-node-topology:host'] === 'string' &&
    typeof (datastore as NetconfConfigurationalDataStore)['netconf-node-topology:port'] === 'number' &&
    typeof (datastore as NetconfConfigurationalDataStore)['netconf-node-topology:tcp-only'] === 'string'
  );
}

export function isCliTopology(topology: unknown): topology is CliTopology {
  return typeof (topology as CliTopology).topology[0]['topology-id'] === 'string';
}

export function isNetconfTopology(topology: unknown): topology is NetconfTopology {
  return typeof (topology as NetconfTopology).topology[0]['topology-id'] === 'string';
}
