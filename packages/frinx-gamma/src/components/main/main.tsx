import React, { FC } from 'react';
import { Box, Table, Tr, Th, Td, Tbody, Thead } from '@chakra-ui/react';

const Main: FC = () => {
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

export default Main;
