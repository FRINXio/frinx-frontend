import React, { VoidFunctionComponent } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import DeviceTable from './device-table';

const DeviceList: VoidFunctionComponent = () => {
  return (
    <>
      <Flex marginBottom={16}>
        <Heading as="h1" size="lg">
          Devices
        </Heading>
      </Flex>
      <DeviceTable />
    </>
  );
};

export default DeviceList;
