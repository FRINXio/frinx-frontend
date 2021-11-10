import React, { FC, FormEvent, useState } from 'react';
import { Button, Divider, Flex, Heading, Input, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import { uniqBy } from 'lodash';
import { VpnCarrier } from './bearer-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';

type Props = {
  carrier: VpnCarrier;
  carriers: VpnCarrier[];
  onDelete: (carrierName: string) => void;
  onSubmit: (c: VpnCarrier) => void;
  onCancel: () => void;
};

const getCarrierItems = (carriers: VpnCarrier[]): Item[] => {
  return uniqBy(
    carriers.map((c) => ({
      value: c.name,
      label: c.name,
    })),
    'value',
  );
};

const CarrierForm: FC<Props> = ({ carrier, carriers, onDelete, onSubmit, onCancel }) => {
  const [vpnCarrier, setVpnCarrier] = useState(carrier);
  const [vpnCarriers, setVpnCarriers] = useState(carriers);
  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(vpnCarrier);
  };

  const handleCarrierChange = (item?: Item | null) => {
    if (!item) {
      return;
    }

    const [filteredCarrier] = vpnCarriers.filter((c) => c.name === item.value);
    setVpnCarrier(filteredCarrier);
  };

  const handleCreateItem = (item: Item) => {
    setVpnCarriers([
      ...vpnCarriers,
      {
        name: item.value,
        description: null,
      },
    ]);
    setVpnCarrier({
      name: item.value,
      description: '',
    });
  };

  const handleDelete = () => {
    onDelete(vpnCarrier.name);
  };

  const vpnCarrierItems = getCarrierItems(vpnCarriers);
  const [selectedCarrier] = vpnCarrierItems.filter((n) => {
    return n.value === vpnCarrier.name;
  });

  return (
    <form onSubmit={handleEdit}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" marginBottom={2}>
          Save Carrier
        </Heading>
        <Button onClick={handleDelete} colorScheme="red">
          Delete
        </Button>
      </Flex>
      <FormControl id="vpn-carrier-name" my={6}>
        <FormLabel>Carrier Name</FormLabel>
        <Autocomplete2
          items={vpnCarrierItems}
          selectedItem={selectedCarrier}
          onChange={handleCarrierChange}
          onCreateItem={handleCreateItem}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Description</FormLabel>
        <Input
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
