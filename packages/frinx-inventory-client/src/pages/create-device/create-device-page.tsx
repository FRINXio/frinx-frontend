import { Container, Heading, Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import CreateDeviceForm from './create-device-form';
import { createEmptyDevice } from '../../helpers/device.helpers';
import { Device } from '../../helpers/types';

const CreateDevicePage: FC = () => {
  const handleSubmit = (device: Device, mountParams: string) => {
    console.log(device, mountParams);
  };

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2">
        Create device
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2} height="100%">
        <CreateDeviceForm device={createEmptyDevice()} onSubmit={handleSubmit} mountParameters="" />
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
