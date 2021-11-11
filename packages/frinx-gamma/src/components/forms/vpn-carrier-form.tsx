import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import { uniqBy } from 'lodash';
import { VpnCarrier } from './bearer-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';

const CarrierSchema = yup.object().shape({
  name: yup.string().required('Carrier name is required'),
  description: yup.string().nullable(),
});

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
  const { values, errors, dirty, setFieldValue, setValues, handleSubmit } = useFormik({
    initialValues: {
      ...carrier,
    },
    validationSchema: CarrierSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });
  const [vpnCarriers, setVpnCarriers] = useState(carriers);

  const handleCarrierChange = (item?: Item | null) => {
    if (!item) {
      return;
    }

    const [filteredCarrier] = vpnCarriers.filter((c) => c.name === item.value);
    setValues(filteredCarrier);
  };

  const handleCreateItem = (item: Item) => {
    setVpnCarriers([
      ...vpnCarriers,
      {
        name: item.value,
        description: null,
      },
    ]);
    setValues({
      name: item.value,
      description: '',
    });
  };

  const handleDelete = () => {
    onDelete(values.name);
  };

  const vpnCarrierItems = getCarrierItems(vpnCarriers);
  const [selectedCarrier] = vpnCarrierItems.filter((n) => {
    return n.value === values.name;
  });

  return (
    <form onSubmit={handleSubmit}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" marginBottom={2}>
          Save Carrier
        </Heading>
        <Button onClick={handleDelete} colorScheme="red">
          Delete
        </Button>
      </Flex>
      <FormControl id="vpn-carrier-name" my={6} isRequired isInvalid={errors.name != null}>
        <FormLabel>Carrier Name</FormLabel>
        <Autocomplete2
          items={vpnCarrierItems}
          selectedItem={selectedCarrier}
          onChange={handleCarrierChange}
          onCreateItem={handleCreateItem}
        />
        {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          value={values.description || ''}
          onChange={(event) => {
            setFieldValue('description', event.target.value || null);
          }}
        />
      </FormControl>
      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!dirty}>
          Save changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default CarrierForm;
