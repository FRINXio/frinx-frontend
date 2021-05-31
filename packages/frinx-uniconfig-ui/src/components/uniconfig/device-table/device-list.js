import React, { useEffect, useState } from 'react';
import DeviceTable from './device-table';
import _ from 'lodash';
import { createNodeObject } from './device.helpers';
import callbackUtils from '../../../utils/callback.utils';
import {
  Stack,
  Grid,
  GridItem,
  Container,
  Button,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getOsVersions = (nodes) => {
  return [...new Set(nodes.map((node) => node.osVersion))];
};

async function tryCatch(fn, defaultValue) {
  try {
    return fn();
  } catch (e) {
    return Promise.resolve(defaultValue);
  }
}

const DeviceList = ({ onMountBtnClick, onDeviceClick, onEditClick }) => {
  const [nodes, setNodes] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
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
    setIsChecked([]);
  }, [query, osVersion, nodes]);

  const fetchData = async () => {
    const getCliTopology = callbackUtils.getCliTopologyCallback();
    const getNetconfTopology = callbackUtils.getNetconfTopologyCallback();

    const topologyCli = await tryCatch(getCliTopology, []);
    const topologyNetconf = await tryCatch(getNetconfTopology, []);

    const nodesCli = await Promise.all(
      (topologyCli?.topology[0]?.node || []).map(async (node) => {
        return createNodeObject(topologyCli?.topology[0]['topology-id'], node);
      }),
    );

    const nodesNetconf = await Promise.all(
      (topologyNetconf?.topology[0]?.node || []).map(async (node) => {
        return createNodeObject(topologyNetconf?.topology[0]['topology-id'], node);
      }),
    );

    setNodes([...nodesCli, ...nodesNetconf]);
  };

  const updateNode = async (topologyId, nodeId) => {
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
    onMountBtnClick(isChecked.length === 1 ? isChecked[0] : null);
  };

  const unmountNodes = async () => {
    let unmounted = await Promise.all(
      isChecked.map(async (node) => {
        return await unmountNode(node);
      }),
    );

    unmounted.forEach((response) => {
      if (response.status !== 204) {
        console.log('Device didnt unmount successfully');
      }
    });

    setIsChecked([]);
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
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Devices
        </Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={mountNode} marginLeft={4}>
          Mount {isChecked.length === 1 ? `as ${isChecked[0]?.nodeId}` : null}
        </Button>
      </Flex>

      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={7}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
            <Input
              variant="outline"
              background="white"
              placeholder="Search devices ( id, host, status, version ... )"
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </GridItem>
        <GridItem colSpan={3}>
          <Select
            variant="outline"
            background="white"
            color="gray.400"
            placeholder="Select version"
            onChange={(e) => setOsVersion(e.target.value)}
          >
            {getOsVersions(nodes).map((v) => (
              <option key={`option-${v}`} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </GridItem>
        <GridItem colSpan={2}>
          <Stack direction="row">
            <Button
              isFullWidth
              style={{ backgroundColor: '#d9e0e6' }}
              disabled={isChecked.length === 0}
              onClick={unmountNodes}
            >
              Unmount ({isChecked.length})
            </Button>
            <IconButton
              icon={<FontAwesomeIcon icon={faRedo} />}
              style={{ backgroundColor: '#d9e0e6' }}
              onClick={fetchData}
            >
              Refresh Devices
            </IconButton>
          </Stack>
        </GridItem>
      </Grid>
      <DeviceTable
        nodes={filteredNodes}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        updateNode={updateNode}
        onDeviceClick={onDeviceClick}
        onEditClick={onEditClick}
      />
    </Container>
  );
};

export default DeviceList;
