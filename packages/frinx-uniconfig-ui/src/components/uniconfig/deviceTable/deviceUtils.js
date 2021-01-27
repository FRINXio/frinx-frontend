import {HttpClient as http} from "../../common/HttpClient";
import {globalConstants as global} from "../../common/GlobalContext";

const GET_CLI_OS_VERSION_URL = (node_id) => "/rests/data/network-topology:network-topology/topology=cli/node=" + node_id + "?content=config";

export const getOsVersion = (node_id) => {
    return http.get(global.backendApiUrlPrefix + GET_CLI_OS_VERSION_URL(node_id), global.authToken)
        .then((res) => {
            try {
                let os_version = res["node"]["0"]["cli-topology:device-type"];
                return os_version + " / " + res["node"]["0"]["cli-topology:device-version"];
            } catch (e) {
                console.log(e);
                return null
            }
        });
};

export const createNodeObject = async (topology, node) => {
    if (topology === "cli") {
        let osVersion = await getOsVersion(node["node-id"]);
        return {
            topologyId: topology,
            nodeId: node["node-id"],
            osVersion: osVersion,
            connectionStatus: osVersion === null ? "unmounting" : node["cli-topology:connection-status"],
            connectedMessage: node["cli-topology:connected-message"],
            commitErrorPatterns: node["cli-topology:default-commit-error-patterns"],
            errorPatterns: node["cli-topology:default-error-patterns"],
            host: node["cli-topology:host"],
            port: node["cli-topology:port"],
            availableCapabilities: node["cli-topology:available-capabilities"]
        }
    }
    if (topology === "topology-netconf") {
        return {
            topologyId: topology,
            nodeId: node["node-id"],
            osVersion: "netconf",
            unavailableCapabilities: node["netconf-node-topology:unavailable-capabilities"],
            nonModuleCapabilities: node["netconf-node-topology:non-module-capabilities"],
            availableCapabilities: node["netconf-node-topology:available-capabilities"],
            yangModuleCapabilities: node["netconf-node-topology:yang-module-capabilities"],
            host: node["netconf-node-topology:host"],
            port: node["netconf-node-topology:port"],
            connectedMessage: node["netconf-node-topology:connected-message"],
            connectionStatus: node["netconf-node-topology:connection-status"],
            fingerPrint: node["topology-node-extension:node-type-fingerprint"]
        }
    }
};