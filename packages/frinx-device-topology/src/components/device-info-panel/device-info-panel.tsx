import { Badge, Box, Button, Flex, Heading, HStack, Icon, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { getLocalDateFromUTC } from '@frinx/shared';
import { Device } from '../../pages/topology/graph.helpers';

type Props = {
  name: string;
  device: Device | null;
  onClose: () => void;
  deviceType: string | null;
  softwareVersion: string | null;
};

const DeviceInfoPanel: VoidFunctionComponent<Props> = ({ name, device, onClose, deviceType, softwareVersion }) => {
  const localDate = device ? getLocalDateFromUTC(device.createdAt) : null;

  return (
    <Box>
      <Flex alignItems="center">
        <Heading as="h3" size="sm">
          {name}
        </Heading>
        {device?.serviceState && <Badge marginLeft="auto">{device.serviceState}</Badge>}
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
        <Button size="sm" onClick={onClose}>
          Close
        </Button>
      </HStack>
    </Box>
  );
};

export default DeviceInfoPanel;
