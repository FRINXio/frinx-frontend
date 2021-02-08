// @flow
import React, { useContext, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import DeviceFilters from './DeviceFilters';
import DeviceTable from './DeviceTable';
import DeviceListHeader from './DeviceListHeader';
import { HttpClient as http } from '../../common/HttpClient';
import { GlobalContext } from '../../common/GlobalContext';
import _ from 'lodash';
import { createNodeObject } from './deviceUtils';

const GET_CLI_TOPOLOGY_URL = '/rests/data/network-topology:network-topology/topology=cli?content=nonconfig';
const GET_NETCONF_TOPOLOGY_URL =
  '/rests/data/network-topology:network-topology/topology=topology-netconf?content=nonconfig';

const GET_NODE_URL = (topology, node_id) =>
  '/rests/data/network-topology:network-topology/topology=' + topology + '/node=' + node_id + '?content=nonconfig';
const UNMOUNT_NODE_URL = (topology, node_id) =>
  '/rests/data/network-topology:network-topology/topology=' + topology + '/node=' + node_id;

type Props = {
  onMountBtnClick: (templateNode: any) => void,
  onDeviceClick: (deviceId: string, topologyId: string) => void,
  onEditClick: (deviceId: string) => void,
};

const DeviceList = (props: Props) => {
  const global = useContext(GlobalContext);
  const [nodes, setNodes] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [checked, setChecked] = useState([]);
  const [query, setQuery] = useState('');
  const [osVersion, setOsVersion] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let results =
      !query && !osVersion
        ? nodes
        : nodes.filter((node) => {
            let searchedKeys = ['nodeId', 'topologyId', 'osVersion', 'connectionStatus', 'host', 'port'];

            if (osVersion && node['osVersion'] !== osVersion) {
              return false;
            }

            // search for keywords in "searchedKeys"
            for (let i = 0; i < searchedKeys.length; i += 1) {
              if (node[searchedKeys[i]].toString().toLowerCase().includes(query.toLocaleLowerCase())) {
                return true;
              }
            }
            return false;
          });
    setFilteredNodes(results);
    setChecked([]);
  }, [query, osVersion, nodes]);

  const fetchData = async () => {
    let topologyCli = await getTopology('cli');
    let topologyNetconf = await getTopology('netconf');

    let nodesCli = await Promise.all(
      (topologyCli?.node || []).map(async (node) => {
        return await createNodeObject(topologyCli['topology-id'], node);
      }),
    );

    let nodesNetconf = await Promise.all(
      (topologyNetconf?.node || []).map(async (node) => {
        return await createNodeObject(topologyNetconf['topology-id'], node);
      }),
    );

    setNodes([...nodesCli, ...nodesNetconf]);
  };

  const updateNode = async (node) => {
    let result = await http.get(
      global.backendApiUrlPrefix + GET_NODE_URL(node.topologyId, node.nodeId),
      global.authToken,
    );
    let newNode = result?.node?.[0];

    if (!newNode) {
      fetchData();
      return;
    }

    let newNodeObj = await createNodeObject(node.topologyId, newNode);

    let updatedNodes = _.uniqBy([...nodes, newNodeObj], 'nodeId');
    setNodes(updatedNodes);
  };

  const mountNode = () => {
    props.onMountBtnClick(checked.length === 1 ? checked[0] : null);
  };

  const unmountNodes = async () => {
    let unmounted = await Promise.all(
      checked.map(async (node) => {
        return await unmountNode(node);
      }),
    );

    unmounted.forEach((response) => {
      if (response.status !== 204) {
        console.log('Device didnt unmount successfully');
      }
    });

    setChecked([]);
    fetchData();
  };

  const unmountNode = async (node) => {
    return await http.delete(
      global.backendApiUrlPrefix + UNMOUNT_NODE_URL(node.topologyId, node.nodeId),
      global.authToken,
    );
  };

  const getTopology = async (topology) => {
    const URL = topology === 'cli' ? GET_CLI_TOPOLOGY_URL : GET_NETCONF_TOPOLOGY_URL;
    const result = await http.get(global.backendApiUrlPrefix + URL, global.authToken);
    return result?.topology?.[0];
  };

  return (
    <Container>
      <DeviceListHeader
        title={'Devices'}
        checked={checked}
        fetchData={fetchData}
        mountNode={mountNode}
        unmountNodes={unmountNodes}
      />
      <DeviceFilters nodes={nodes} setQuery={setQuery} setOsVersion={setOsVersion} />
      <DeviceTable
        nodes={filteredNodes}
        checked={checked}
        setChecked={setChecked}
        updateNode={updateNode}
        onDeviceClick={props.onDeviceClick}
        onEditClick={props.onEditClick}
      />
    </Container>
  );
};

export default DeviceList;
