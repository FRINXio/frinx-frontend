import React, { FC, useState } from 'react';
import { Box, Button, FormLabel, Input, Select, FormControl } from '@chakra-ui/react';
import { CountryCode, CustomerLocation } from './site-types';

type Props = {
  location: CustomerLocation;
  buttonText: string;
  onChange: (location: CustomerLocation) => void;
};

const CustomerLocationForm: FC<Props> = ({ location, buttonText, onChange }) => {
  const [formState, setFormState] = useState(location);

  const handleChange = () => {
    onChange(formState);
  };

  return (
    <>
      <FormControl id="customer-locations-street" my={6}>
        <FormLabel>Street</FormLabel>
        <Input
          variant="filled"
          name="street"
          value={formState.street}
          onChange={(event) => {
            setFormState({
              ...formState,
              street: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Postal Code</FormLabel>
        <Input
          variant="filled"
          name="postalCode"
          value={formState.postalCode}
          onChange={(event) => {
            setFormState({
              ...formState,
              postalCode: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>State</FormLabel>
        <Input
          variant="filled"
          name="state"
          value={formState.state}
          onChange={(event) => {
            setFormState({
              ...formState,
              state: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>City</FormLabel>
        <Input
          variant="filled"
          name="city"
          value={formState.city}
          onChange={(event) => {
            setFormState({
              ...formState,
              city: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Country Code</FormLabel>
        <Select
          variant="filled"
          name="countryCode"
          value={formState.countryCode}
          onChange={(event) => {
            setFormState({
              ...formState,
              countryCode: event.target.value as CountryCode,
            });
          }}
        >
          <option value="UK">UK</option>
          <option value="Ireland">Ireland</option>
        </Select>
      </FormControl>
      <Box my={6}>
        <Button type="button" colorScheme="blue" onClick={handleChange}>
          {buttonText}
        </Button>
      </Box>
    </>
  );
};

export default CustomerLocationForm;
