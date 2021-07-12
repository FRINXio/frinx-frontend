import { Container, Heading, Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import CreateDeviceForm from './create-device-form';

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
};

const CreateDevicePage: FC = () => {
  const handleSubmit = (device: FormValues) => {
    // eslint-disable-next-line no-console
    console.log(device);
  };

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={2}>
        Add device
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2} height="100%">
        <CreateDeviceForm onFormSubmit={handleSubmit} />
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
