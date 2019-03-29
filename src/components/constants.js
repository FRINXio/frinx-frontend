export const CONFIG = 'http://www.json-generator.com/api/json/get/cgfQfXbVAi?indent=2';

export const OPER = 'http://www.json-generator.com/api/json/get/cgfQfXbVAi?indent=2';

export const mountNetconfTemplate = JSON.stringify( {
    "node-id": "xr5",
    "netconf-node-topology:host": "192.168.1.215",
    "netconf-node-topology:port": 830,
    "netconf-node-topology:keepalive-delay": 0,
    "netconf-node-topology:tcp-only": false,
    "netconf-node-topology:username": "cisco",
    "netconf-node-topology:password": "cisco"
});

export const mountCliTemplate = JSON.stringify( {
    "network-topology:node-id": "xr5",
    "cli-topology:host": "192.168.1.215",
    "cli-topology:port": "22",
    "cli-topology:transport-type": "ssh",
    "cli-topology:device-type": "ios xr",
    "cli-topology:device-version": "*",
    "cli-topology:username": "cisco",
    "cli-topology:password": "cisco",
    "node-extension:reconcile": false,
    "cli-topology:journal-size": 150
});

