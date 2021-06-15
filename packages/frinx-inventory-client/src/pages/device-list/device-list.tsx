import React, { VoidFunctionComponent } from 'react';
import { Container, Flex, Heading } from '@chakra-ui/react';
import DeviceTable from './device-table';

const DeviceList: VoidFunctionComponent = () => {
  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Devices
        </Heading>
      </Flex>
      <DeviceTable />
    </Container>
  );
};

export default DeviceList;
