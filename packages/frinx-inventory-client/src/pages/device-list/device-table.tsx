import React, { VoidFunctionComponent } from 'react';
import { Badge, Button, HStack, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { SettingsIcon, InfoIcon } from '@chakra-ui/icons';

const SAMPLE_DEVICES = [
  {
    name: 'Sample device 1',
    vendor: 'CISCO',
    model: '1234',
    host: '127.0.0.1:123',
    zone: 123,
    status: 'INSTALLED',
  },
  {
    name: 'Sample device 2',
    vendor: 'NOKIA',
    model: 'abcde',
    host: '127.0.0.1:301',
    zone: 456,
    status: 'N/A',
  },
];

const DeviceTable: VoidFunctionComponent = () => {
  return (
    <Table colorScheme="blue">
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
        {SAMPLE_DEVICES.map((device) => (
          <Tr>
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
