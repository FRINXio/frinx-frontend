import React, { useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { createNodeObject } from './device.helpers';
import ConnectionStatusBadge from '../../common/connection-status-badge';
import _ from 'lodash';
import callbackUtils from '../../../utils/callback.utils';

const nodeKeyValueMap = (node) => {
  const basic = [
    {
      displayValue: 'node ID',
      value: 'nodeId',
    },
    {
      displayValue: 'topology',
      value: 'topologyId',
    },
    {
      displayValue: 'OS/version',
      value: 'osVersion',
    },
    {
      displayValue: 'host',
      value: 'host',
    },
    {
      displayValue: 'port',
      value: 'port',
    },
    {
      displayValue: 'connection status',
      value: 'connectionStatus',
    },
    {
      displayValue: 'connected message',
      value: 'connectedMessage',
    },
  ];

  if (node.topologyId === 'cli') {
    return basic;
  } else if (node.topologyId === 'topology-netconf') {
    return [
      ...basic,
      {
        displayValue: 'fingerprint',
        value: 'fingerPrint',
      },
    ];
  }

  return [];
};

const capabilitiesKeyValueMap = (node) => {
  if (node.topologyId === 'cli') {
    return [
      {
        displayValue: 'Available Capabilities',
        value: node?.availableCapabilities?.['available-capability'] || [],
      },
    ];
  } else if (node.topologyId === 'topology-netconf') {
    return [
      {
        displayValue: 'Available Capabilities',
        value: _.flatMap(node?.availableCapabilities?.['available-capability'] || [], (item) => item?.capability),
      },
      {
        displayValue: 'Yang Module Capabilities',
        value: node?.yangModuleCapabilities?.['capability'] || [],
      },
      {
        displayValue: 'Non Module Capabilities',
        value: node?.nonModuleCapabilities?.['capability'] || [],
      },
      {
        displayValue: 'Unavailable Capabilities',
        value: node?.unavailableCapabilities?.['unavailable-capability'] || [],
      },
    ];
  }

  return [];
};

const errorPatternsKeyValueMap = (node) => {
  if (node.topologyId === 'cli') {
    return [
      {
        displayValue: 'Error Patterns',
        value: node?.errorPatterns?.['error-pattern'] || [],
      },
    ];
  }
  return [];
};

const DeviceDetails = ({ topology, nodeId }) => {
  const [node, setNode] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchDevice(topology, nodeId);
  }, [topology, nodeId]);

  const fetchDevice = async (topologyId, nodeId) => {
    const getCliOperationalState = callbackUtils.getCliOperationalStateCallback();
    const getNetconfOperationalState = callbackUtils.getNetconfOperationalStateCallback();
    let node = null;

    try {
      if (topologyId === 'cli') {
        node = await getCliOperationalState(nodeId);
      } else {
        node = await getNetconfOperationalState(nodeId);
      }
    } catch (e) {
      // TODO: better error hanlding,
      // API's 404 returns body, we are only returing error

      // TODO: toast has issues "updating unmount component"
      return toast({
        title: `${nodeId} is not available`,
        description: `${e.message}`,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }

    let nodeObj = await createNodeObject(topologyId, node);
    setNode(nodeObj);
  };

  return (
    <Container maxWidth={1280}>
      <Heading as="h2" size="3xl" marginBottom={6}>
        {node?.nodeId || 'unknown'}
      </Heading>
      <Box boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4} marginTop={4}>
        <Tabs>
          <TabList>
            <Tab>Basic</Tab>
            <Tab>Capabilities</Tab>
            <Tab isDisabled={node?.topologyId === 'topology-netconf'}>Error Patterns</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {nodeKeyValueMap(node).map(({ displayValue, value }) => (
                <Flex key={displayValue} justify="space-between" align="center" marginBottom={2} marginTop={4}>
                  <Heading as="h6" size="sm">
                    {displayValue}:
                  </Heading>
                  <Text fontSize="lg">
                    {value === 'connectionStatus' ? (
                      <ConnectionStatusBadge node={node} checkConnectionStatus={fetchDevice} />
                    ) : (
                      node[value]
                    )}
                  </Text>
                </Flex>
              ))}
            </TabPanel>
            <TabPanel>
              {capabilitiesKeyValueMap(node).map(({ displayValue, value }) => (
                <Box key={displayValue} marginTop={4}>
                  <Heading as="h4" size="md" marginBottom={4}>
                    {displayValue}
                  </Heading>
                  <Textarea value={JSON.stringify(value, null, 2)} readOnly h={52} />
                </Box>
              ))}
            </TabPanel>
            <TabPanel>
              {errorPatternsKeyValueMap(node).map(({ displayValue, value }) => (
                <Box key={displayValue} marginTop={4}>
                  <Heading as="h4" size="md" marginBottom={4}>
                    {displayValue}
                  </Heading>
                  <Textarea value={JSON.stringify(value, null, 2)} readOnly h={52} />
                </Box>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default DeviceDetails;
