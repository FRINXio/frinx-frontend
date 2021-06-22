import React, { VoidFunctionComponent } from 'react';
import { Badge, HStack, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { SettingsIcon, InfoIcon } from '@chakra-ui/icons';
import { Device } from '../../helpers/types';

type Props = {
  devices: Device[];
};

const DeviceTable: VoidFunctionComponent<Props> = ({ devices }) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Vendor</Th>
          <Th>Model</Th>
          <Th>Address</Th>
          <Th>Zone</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices.map((device) => (
          <Tr key={device.id}>
            <Td>
              <Text as="span" fontWeight={600}>
                {device.name}
              </Text>
            </Td>
            <Td>{device.vendor}</Td>
            <Td>{device.model}</Td>
            <Td>
              <Text as="span" fontFamily="monospace" color="red">
                {device.host}
              </Text>
            </Td>
            <Td>{device.zone}</Td>
            <Td>
              <Badge colorScheme={device.status === 'INSTALLED' ? 'green' : 'yellow'}>{device.status}</Badge>
            </Td>
            <Td>
              <HStack spacing={2}>
                <IconButton size="sm" colorScheme="blue" aria-label="configure" icon={<SettingsIcon />} />
                <IconButton size="sm" aria-label="information" icon={<InfoIcon />} />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DeviceTable;
