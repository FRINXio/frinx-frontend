export const MOUNTED_DEVICES = "MOUNTED_DEVICES";

const http = require('../../server/HttpServerSide').HttpClient;

const getTopologyDevices = async (topologyType) => {
    const devices = await http.get('/api/odl/oper/all/status/' + topologyType);
    const topologies = Object.keys(devices);
    const topology = Object.keys(devices[Object.keys(devices)]);
    return devices[topologies][topology]["node"].map((node) => {return node["node-id"]});
};

export const getMountedDevices = () => {
    return async (dispatch) => {
        const allCliDevices = await getTopologyDevices('cli');
        const allNetconfDevices = await getTopologyDevices('topology-netconf');
        dispatch(updateDevices(allCliDevices.concat(allNetconfDevices)));
    }
};

export const updateDevices = (devices) => {
    return {type: MOUNTED_DEVICES, devices}
};