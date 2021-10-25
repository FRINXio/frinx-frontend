import React, { FC, FormEvent, useState } from 'react';
import { Button, Divider, Input, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import { VpnCarrier } from './bearer-types';

type Props = {
  carrier: VpnCarrier;
  onSubmit: (c: VpnCarrier) => void;
  onCancel: () => void;
};

const CarrierForm: FC<Props> = ({ carrier, onSubmit, onCancel }) => {
  const [vpnCarrier, setVpnCarrier] = useState(carrier);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(vpnCarrier);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="vpn-carrier-name" my={6}>
        <FormLabel>Carrier Name</FormLabel>
        <Input
          variant="filled"
          name="vpn-carrier-name"
          value={vpnCarrier.name}
          onChange={(event) => {
            setVpnCarrier({
              ...vpnCarrier,
              name: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Description</FormLabel>
        <Input
          variant="filled"
          name="service-type"
          value={vpnCarrier.description || ''}
          onChange={(event) => {
            setVpnCarrier({
              ...vpnCarrier,
              description: event.target.value || null,
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

export default CarrierForm;
