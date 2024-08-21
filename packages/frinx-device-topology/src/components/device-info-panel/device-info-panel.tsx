import { Badge, Box, Button, Flex, Heading, HStack, Icon, Text, IconButton } from '@chakra-ui/react';
import { format } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { useEffect, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useClient } from 'urql';
import { getDeviceUsage, getDeviceUsageColor, getLocalDateFromUTC, usePerformanceMonitoring } from '@frinx/shared';
import { Device } from '../../pages/topology/graph.helpers';
import { DeviceUsage } from '../../__generated__/graphql';
import { useStateContext } from '../../state.provider';
import { getDeviceMetadata, setMapTopologyType, setSelectedMapDeviceName, setTopologyLayer } from '../../state.actions';

type Props = {
  name: string;
  device: Device | null;
  onClose: () => void;
  deviceType: string | null;
  softwareVersion: string | null;
  isShowingLoad: boolean;
  nodeLoad?: DeviceUsage | null;
};

const DeviceInfoPanel: VoidFunctionComponent<Props> = ({
  name,
  device,
  onClose,
  deviceType,
  softwareVersion,
  nodeLoad,
  isShowingLoad,
}) => {
  const { state, dispatch } = useStateContext();
  const { devicesMetadata } = state;

  const client = useClient();

  useEffect(() => {
    dispatch(getDeviceMetadata(client, { topologyType: 'PhysicalTopology' }));
  }, [client, dispatch]);

  const { isEnabled: isPerformanceMonitoringEnabled } = usePerformanceMonitoring();
  const localDate = device ? getLocalDateFromUTC(device.createdAt) : null;
  const nodeLoadUsage = getDeviceUsage(nodeLoad?.cpuLoad, nodeLoad?.memoryLoad);
  const nodeLoadUsageColor = isShowingLoad ? getDeviceUsageColor(nodeLoad?.cpuLoad, nodeLoad?.memoryLoad) : 'gray';
  const handleShowDeviceOnMap = () => {
    dispatch(setTopologyLayer('Map'));
    dispatch(setMapTopologyType('PhysicalTopology'));
    dispatch(setSelectedMapDeviceName(name));
  };

  return (
    <Box>
      <Flex alignItems="center">
        <Heading as="h3" size="sm">
          {name}
        </Heading>
        {isShowingLoad && isPerformanceMonitoringEnabled && (
          <Badge marginLeft="auto" colorScheme={nodeLoadUsageColor}>
            {nodeLoadUsage}
          </Badge>
        )}
      </Flex>
      {localDate && (
        <Text as="span" fontSize="xs" color="gray.700">
          {format(localDate, 'dd/MM/yyyy, k:mm')}
        </Text>
      )}
      <Flex marginTop={2} justifyContent="space-between">
        {deviceType != null && (
          <Box flex={1}>
            <Heading as="h4" fontSize="xs">
              Device type
            </Heading>
            {deviceType}
          </Box>
        )}
        {softwareVersion != null && (
          <Box flex={1}>
            <Heading as="h4" fontSize="xs">
              Software version
            </Heading>
            {softwareVersion}
          </Box>
        )}
      </Flex>
      <HStack spacing={2} marginTop={4}>
        {device && (
          <Button
            as={Link}
            to={`/inventory/${device.id}/edit`}
            size="sm"
            colorScheme="blue"
            leftIcon={<Icon as={FeatherIcon} icon="settings" size={20} />}
          >
            Config
          </Button>
        )}
        <IconButton
          size="sm"
          aria-label="Map"
          icon={<Icon as={FeatherIcon} icon="map" size={20} />}
          isDisabled={!devicesMetadata?.find((d) => d.deviceName === name)}
          onClick={handleShowDeviceOnMap}
          colorScheme="blue"
        />
        <Button size="sm" onClick={onClose}>
          Close
        </Button>
      </HStack>
    </Box>
  );
};

export default DeviceInfoPanel;
