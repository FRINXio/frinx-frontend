import React, { FC } from 'react';
import { Container, Box, Table, Tr, Th, Td, Tbody, Thead } from '@chakra-ui/react';
import Panel from '../panel/panel';
import { ServiceKey } from '../../types';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const Dashboard: FC<Props> = ({ enabledServices }) => {
  return (
    <Box padding={6}>
      <Table background="white" size="lg">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Created</Th>
            <Th>Zone</Th>
            <Th>Service state</Th>
            <Th>Installation</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td colSpan={6}>some service data</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default Dashboard;
