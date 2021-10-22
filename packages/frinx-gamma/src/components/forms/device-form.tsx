import { Button, Divider, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import React, { FormEvent, useState, VoidFunctionComponent } from 'react';
import { SiteDevice } from './site-types';

type Props = {
  siteId: string;
  device: SiteDevice;
  locationId: string;
  onSubmit: (device: SiteDevice) => void;
  onCancel: () => void;
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({ device, locationId, onSubmit, onCancel }) => {
  const [vpnDevice, setVpnDevice] = useState<SiteDevice>(device);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(vpnDevice);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="site-device-id" my={6}>
        <FormLabel>Device ID</FormLabel>
        <Input
          variant="filled"
          name="site-device-id"
          value={vpnDevice.deviceId}
          onChange={(event) => {
            setVpnDevice({
              ...vpnDevice,
              deviceId: event.target.value,
            });
          }}
        />
      </FormControl>

      <FormControl id="device-locations" my={6}>
        <FormLabel>Location ID</FormLabel>
        <Input type="text" variant="filled" value={locationId} isReadOnly />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Management IP</FormLabel>
        <Input
          variant="filled"
          name="management-ip"
          value={vpnDevice.managementIP}
          onChange={(event) => {
            setVpnDevice({
              ...vpnDevice,
              managementIP: event.target.value,
            });
          }}
        />
      </FormControl>
      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue">
          Save changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default CreateDeviceForm;
