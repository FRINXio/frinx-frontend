import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Container, Flex, Heading } from '@chakra-ui/react';
import DeviceTable from './device-table';
import callbackUtils from '../../callback-utils';
import { Device } from '../../helpers/types';

const DeviceList: VoidFunctionComponent = () => {
  const [devices, setDevices] = useState<Device[] | null>(null);

  useEffect(() => {
    const getDevices = callbackUtils.getDevicesCallback();

    getDevices().then((dvcs) => {
      setDevices(dvcs);
    });
  }, []);

  return devices != null ? (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Devices
        </Heading>
      </Flex>
      <DeviceTable devices={devices} />
    </Container>
  ) : null;
};

export default DeviceList;
