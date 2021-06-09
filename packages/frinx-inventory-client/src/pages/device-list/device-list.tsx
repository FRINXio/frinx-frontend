import React, { VoidFunctionComponent } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const SAMPLE_DEVICES = [
  {
    name: 'Sample device 1',
    vendor: 'CISCO',
    model: '1234',
    host: '127.0.0.1:123',
    zone: 123,
    status: 'INSTALLED',
  },
];

const DeviceList: VoidFunctionComponent = () => {
  return (
    <Table>
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
            <Td>{device.name}</Td>
            <Td>{device.vendor}</Td>
            <Td>{device.model}</Td>
            <Td>{device.host}</Td>
            <Td>{device.zone}</Td>
            <Td>{device.status}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DeviceList;
