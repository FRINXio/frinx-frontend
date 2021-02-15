/* eslint-disable @typescript-eslint/naming-convention */

/* 
TODO:
These types can include more attributes depending on initial 
mount parameters and topology type, these types are minimal
basic example with only mandatory parameters for now
*/

export type DataStore =
  | {
      'node-id': string;
      'cli-topology:host': string;
      'cli-topology:port': number;
    }
  | {
      'node-id': string;
      'netconf-node-topolog:host': string;
      'netconf-node-topolog:port': number;
    };

export type ConfigurationalDataStore = DataStore &
  (
    | {
        'cli-topology:password': string;
        'cli-topology:username': string;
      }
    | {
        'netconf-node-topology:username': string;
        'netconf-node-topology:password': string;
      }
  );

export type OperationalDataStore = DataStore &
  (
    | {
        'cli-topology:connected-message': string;
        'cli-topology:connection-status': string;
      }
    | {
        'netconf-node-topology:connected-message': string;
        'netconf-node-topology:connection-status': string;
      }
  );

export type CliConfigurationalDataStore = ConfigurationalDataStore & {
  'cli-topology:device-type': string;
  'cli-topology:device-version': string;
  'cli-topology:transport-type': string;
  'cli-topology:journal-size': number;
};

export type NetconfConfigurationalDataStore = ConfigurationalDataStore & {
  'netconf-node-topology:tcp-only': boolean;
};

export type CliOperationalDataStore = OperationalDataStore;

export type NetconfOperationalDataStore = OperationalDataStore;

export type CliTopology = {
  topology: [{ 'topology-id': 'cli'; node: CliOperationalDataStore[] }];
};

export type NetconfTopology = {
  topology: [{ 'topology-id': 'topology-netconf'; node: NetconfOperationalDataStore[] }];
};

export type MountPayload = {
  'network-topology:node':
    | {
        'network-topology:node-id': string;
        'cli-topology:host': string;
        'cli-topology:port': number;
        'cli-topology:transport-type': string;
        'cli-topology:device-type': string;
        'cli-topology:device-version': string;
        'cli-topology:username': string;
        'cli-topology:password': string;
      }
    | {
        'network-topology:node-id': string;
        'netconf-node-topology:host': string;
        'netconf-node-topology:port': number;
        'netconf-node-topology:username': string;
        'netconf-node-topology:password': string;
      };
};
