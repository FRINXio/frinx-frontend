import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Button, Container, Flex, Heading } from '@chakra-ui/react';
import DeviceTable from './device-table';
import callbackUtils from '../../callback-utils';
import { Device } from '../../helpers/types';

type Props = {
  onAddButtonClick: () => void;
};

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick }) => {
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
        <Button colorScheme="blue" onClick={onAddButtonClick}>
          Add device
        </Button>
      </Flex>
      <DeviceTable devices={devices} />
    </Container>
  ) : null;
};

export default DeviceList;
