
export const mountNetconfTemplate = JSON.stringify( {
    "node-id": ["xr6","Unique identifier of device across all systems"],
    "netconf-node-topology:host": ["192.168.1.213","IP or hostname of the management endpoint on a device"],
    "netconf-node-topology:port": [830,"TCP port of the management endpoint of a device"],
    "netconf-node-topology:username": ["cisco","Username credential"],
    "netconf-node-topology:password": ["cisco","Password credential"],
});

export const mountNetconfTemplateAdv = JSON.stringify({
    "netconf-node-topology:tcp-only": [false,""],
    "netconf-node-topology:keepalive-delay": [0,""],
    "node-extension:reconcile": [false,""]
});

export const mountNetconfTemplateDryRunOFF = JSON.stringify({
});

export const mountNetconfTemplateDryRunON = JSON.stringify({
    "netconf-node-topology:dry-run-journal-size": [180,""],
});

export const mountNetconfTemplateOverrideON = JSON.stringify({
    "netconf-node-topology:override": [true,"Select capabilities"]
});

export const mountNetconfTemplateOverrideOFF = JSON.stringify({
});

export const mountNetconfTemplateUnativeON = JSON.stringify({
    "uniconfig-config:uniconfig-native-enabled": [true,""]
});

export const mountNetconfTemplateUnativeOFF = JSON.stringify({
});

export const mountNetconfTemplateCapabilities = JSON.stringify({
    "netconf-node-topology:yang-module-capabilities": {
        "capability": []
    }
});

export const uniconfigBlacklist = JSON.stringify({
    "uniconfig-config:blacklist": {
        "uniconfig-config:path": ["openconfig-interfaces:interfaces", "ietf-interfaces:interfaces", "openconfig-vlan:vlans", "openconfig-routing-policy:routing-policy"]
    }
});

export const mountCliTemplate = JSON.stringify( {
    "network-topology:node-id": ["xr5","Unique identifier of device across all systems"],
    "cli-topology:host": ["192.168.1.215","IP or hostname of the management endpoint on a device"],
    "cli-topology:port": ["22","TCP port s the management endpoint of a device"],
    "cli-topology:transport-type": ["ssh","CLI management transport protocol e.g. tcp or ssh"],
    "cli-topology:device-type": ["ios xr","Type of device or device IOS e.g. ios, ios xr"],
    "cli-topology:device-version": ["*","Version of device or device OS e.g. 15.2"],
    "cli-topology:username": ["cisco","Username credential"],
    "cli-topology:password": ["cisco","Password credential"],
});

export const mountCliTemplateAdv = JSON.stringify({
    "node-extension:reconcile": [false,""],
    "cli-topology:journal-size": [150,""],
});

export const mountCliTemplateDryRunOFF = JSON.stringify({
});

export const mountCliTemplateDryRunON = JSON.stringify({
    "cli-topology:dry-run-journal-size": [150,""],
});

export const mountCliTemplateLazyOFF = JSON.stringify({
    "cli-topology:keepalive-delay" : [45,""],
    "cli-topology:keepalive-timeout" : [45,""]
});

export const mountCliTemplateLazyON = JSON.stringify({
    "cli-topology:command-timeout": [60,""],
    "cli-topology:connection-lazy-timeout": [60,""],
    "cli-topology:connection-establish-timeout": [60,""]
});
