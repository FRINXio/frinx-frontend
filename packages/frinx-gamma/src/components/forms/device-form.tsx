import { Button, Divider, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import React, { FormEvent, useState, VoidFunctionComponent } from 'react';
import unwrap from '../../helpers/unwrap';
import { SiteDevice, CustomerLocation } from './site-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';

type Props = {
  siteId: string;
  device: SiteDevice;
  locations: CustomerLocation[];
  onSubmit: (device: SiteDevice) => void;
  onCancel: () => void;
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({ device, locations, onSubmit, onCancel }) => {
  const [vpnDevice, setVpnDevice] = useState<SiteDevice>(device);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(vpnDevice);
  };

  const locationItems = locations.map((l) => ({
    label: `${l.street}, ${l.city}, (${l.locationId})`,
    value: unwrap(l.locationId),
  }));

  const [selectedLocationItem] = locationItems.filter((l) => l.value === vpnDevice.locationId);
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
        <Autocomplete2
          items={locationItems}
          selectedItem={selectedLocationItem}
          onChange={(item?: Item | null) => {
            setVpnDevice({
              ...vpnDevice,
              locationId: item ? item.value : null,
            });
          }}
        />
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
