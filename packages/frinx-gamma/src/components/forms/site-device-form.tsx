import React, { FC, useState } from 'react';
import { Box, Button, FormLabel, Input, FormControl } from '@chakra-ui/react';
import { SiteDevice } from './site-types';

type Props = {
  device: SiteDevice;
  buttonText: string;
  onChange: (location: SiteDevice) => void;
};

const SiteDeviceForm: FC<Props> = ({ device, buttonText, onChange }) => {
  const [formState, setFormState] = useState(device);

  const handleChange = () => {
    onChange(formState);
  };

  return (
    <>
      <FormControl id="site-device-id" my={6}>
        <FormLabel>Device ID</FormLabel>
        <Input
          name="site-device-id"
          value={formState.deviceId}
          onChange={(event) => {
            setFormState({
              ...formState,
              deviceId: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Management IP</FormLabel>
        <Input
          name="management-ip"
          value={formState.managementIP}
          onChange={(event) => {
            setFormState({
              ...formState,
              managementIP: event.target.value,
            });
          }}
        />
      </FormControl>
      <Box my={6}>
        <Button type="button" colorScheme="blue" onClick={handleChange}>
          {buttonText}
        </Button>
      </Box>
    </>
  );
};

export default SiteDeviceForm;
