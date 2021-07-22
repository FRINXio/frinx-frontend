import { Container, Heading, Box, useToast } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import callbackUtils from '../../callback-utils';
import { Zone } from '../../helpers/types';
import CreateDeviceForm from './create-device-form';

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
};
type Props = {
  onAddDeviceSuccess: () => void;
};

const CreateDevicePage: FC<Props> = ({ onAddDeviceSuccess }) => {
  const toast = useToast();
  const [zones, setZones] = useState<Zone[] | null>(null);

  useEffect(() => {
    const getZones = callbackUtils.getZonesCallback();

    getZones().then((zns) => {
      setZones(zns);
    });
  }, []);

  const handleSubmit = (device: FormValues) => {
    const addDevice = callbackUtils.getAddDeviceCallback();
    addDevice(device).then(() => {
      toast({
        variant: 'success',
      });
      onAddDeviceSuccess();
    });
  };

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={2}>
        Add device
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2} height="100%">
        {zones != null && <CreateDeviceForm onFormSubmit={handleSubmit} zones={zones} />}
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
