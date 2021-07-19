import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Box, Button, Container, Flex, Heading, Progress, useToast } from '@chakra-ui/react';
import DeviceTable from './device-table';
import callbackUtils from '../../callback-utils';
import { Device } from '../../helpers/types';

type Props = {
  onAddButtonClick: () => void;
};

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick }) => {
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchAndSetData = () => {
    const getDevices = callbackUtils.getDevicesCallback();

    getDevices().then((dvcs) => {
      setDevices(dvcs);
    });
  };

  useEffect(() => {
    fetchAndSetData();
  }, []);

  const handleInstallButtonClick = (deviceId: string) => {
    const installDevice = callbackUtils.getInstallDeviceCallback();
    setIsLoading(true);
    installDevice(deviceId).then(() => {
      setIsLoading(false);
      toast({
        position: 'top-right',
        status: 'success',
        variant: 'green',
        title: 'Device was installed succesfully',
      });
      fetchAndSetData();
    });
  };

  const handleUninstallButtonClick = (deviceId: string) => {
    const uninstallDevice = callbackUtils.getUninstallDeviceCallback();
    setIsLoading(true);
    uninstallDevice(deviceId).then(() => {
      setIsLoading(false);
      toast({
        position: 'top-right',
        status: 'success',
        variant: 'green',
        title: 'Device was uninstalled succesfully',
      });
      fetchAndSetData();
    });
  };

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
      <Box position="relative">
        {isLoading && (
          <Box position="absolute" top={0} right={0} left={0}>
            <Progress size="xs" isIndeterminate />
          </Box>
        )}
        <DeviceTable
          devices={devices}
          onInstallButtonClick={handleInstallButtonClick}
          onUninstallButtonClick={handleUninstallButtonClick}
          isLoading={isLoading}
        />
      </Box>
    </Container>
  ) : null;
};

export default DeviceList;
