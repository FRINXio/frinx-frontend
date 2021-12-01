import React, { VoidFunctionComponent } from 'react';
import { Button, FormLabel, FormErrorMessage, Input, Select, Stack, FormControl } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CustomerLocation } from './site-types';
import { getSelectOptions } from './options.helper';

const LocationSchema = yup.object().shape({
  locationId: yup.string(),
  street: yup.string().required('Street is required field'),
  postalCode: yup.string().required('Postal code is required field'),
  state: yup.string().required('State is required field'),
  city: yup.string().required('City is required field'),
  countryCode: yup.mixed().oneOf(['UK', 'Ireland']).required(),
});

type Props = {
  location: CustomerLocation;
  buttonText: string;
  onSubmit: (location: CustomerLocation) => void;
  onCancel: () => void;
};

const CustomerLocationForm: VoidFunctionComponent<Props> = ({ location, buttonText, onSubmit, onCancel }) => {
  const { values, errors, dirty, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...location,
    },
    validationSchema: LocationSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="customer-locations-street" my={6} isRequired isInvalid={errors.street != null}>
        <FormLabel>Street</FormLabel>
        <Input name="street" value={values.street} onChange={handleChange} />
        {errors.street && <FormErrorMessage>{errors.street}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.postalCode != null}>
        <FormLabel>Postal Code</FormLabel>
        <Input name="postalCode" value={values.postalCode} onChange={handleChange} />
        {errors.postalCode && <FormErrorMessage>{errors.postalCode}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.state != null}>
        <FormLabel>State</FormLabel>
        <Input name="state" value={values.state} onChange={handleChange} />
        {errors.state && <FormErrorMessage>{errors.state}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.city != null}>
        <FormLabel>City</FormLabel>
        <Input name="city" value={values.city} onChange={handleChange} />
        {errors.city && <FormErrorMessage>{errors.city}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.countryCode != null}>
        <FormLabel>Country Code</FormLabel>
        <Select name="countryCode" value={values.countryCode} onChange={handleChange}>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.site.location).map((item) => {
            return (
              <option key={`maximum-routes-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
        {errors.countryCode && <FormErrorMessage>{errors.countryCode}</FormErrorMessage>}
      </FormControl>
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!dirty}>
          {buttonText}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default CustomerLocationForm;
