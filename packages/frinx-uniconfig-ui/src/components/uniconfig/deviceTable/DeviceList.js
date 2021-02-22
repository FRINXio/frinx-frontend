// @flow
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import DeviceFilters from './DeviceFilters';
import DeviceTable from './DeviceTable';
import DeviceListHeader from './DeviceListHeader';
import _ from 'lodash';
import { createNodeObject } from './deviceUtils';
import callbackUtils from '../../../utils/callbackUtils';

type Props = {
  onMountBtnClick: (templateNode: any) => void,
  onDeviceClick: (deviceId: string, topologyId: string) => void,
  onEditClick: (deviceId: string) => void,
};

const DeviceList = (props: Props) => {
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
              if (node[searchedKeys[i]]?.toString().toLowerCase().includes(query.toLocaleLowerCase())) {
                return true;
              }
            }
            return false;
          });
    setFilteredNodes(results);
    setChecked([]);
  }, [query, osVersion, nodes]);

  const fetchData = async () => {
    const getCliTopology = callbackUtils.getCliTopologyCallback();
    const getNetconfTopology = callbackUtils.getNetconfTopologyCallback();

    const topologyCli = await getCliTopology();
    const topologyNetconf = await getNetconfTopology();

    const nodesCli = await Promise.all(
      (topologyCli?.topology[0]?.node || []).map(async (node) => {
        return await createNodeObject(topologyCli?.topology[0]['topology-id'], node);
      }),
    );

    const nodesNetconf = await Promise.all(
      (topologyNetconf?.topology[0]?.node || []).map(async (node) => {
        return await createNodeObject(topologyNetconf?.topology[0]['topology-id'], node);
      }),
    );

    setNodes([...nodesCli, ...nodesNetconf]);
  };

  const updateNode = async (node) => {
    const { nodeId, topologyId } = node;

    const getCliOperationalState = callbackUtils.getCliOperationalStateCallback();
    const getNetconfOperationalState = callbackUtils.getNetconfOperationalStateCallback();

    const newNode =
      topologyId === 'cli' ? await getCliOperationalState(nodeId) : await getNetconfOperationalState(nodeId);

    if (!newNode) {
      fetchData();
      return;
    }

    let newNodeObj = await createNodeObject(topologyId, newNode);

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
    const { nodeId, topologyId } = node;

    const unmountCliNode = callbackUtils.unmountCliNodeCallback();
    const unmountNetconfNode = callbackUtils.unmountNetconfNodeCallback();

    if (topologyId === 'cli') {
      return await unmountCliNode(nodeId);
    } else {
      return await unmountNetconfNode(nodeId);
    }
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
