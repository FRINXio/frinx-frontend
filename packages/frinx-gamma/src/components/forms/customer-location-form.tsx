import React, { VoidFunctionComponent } from 'react';
import { Button, FormLabel, FormErrorMessage, Input, Select, Stack, FormControl } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { CustomerLocation } from './site-types';
import { getSelectOptions } from './options.helper';
import { generateLocationId } from '../../helpers/id-helpers';

const LocationSchema = yup.object().shape({
  locationId: yup.string().required(),
  street: yup.string().required('Street is required field'),
  postalCode: yup.string().required('Postal code is required field'),
  state: yup.string(),
  city: yup.string().required('City is required field'),
  countryCode: yup.mixed().oneOf(['UK', 'IE']).required(),
});

type Props = {
  mode: 'CREATE' | 'UPDATE';
  siteId: string;
  location: CustomerLocation;
  buttonText: string;
  onSubmit: (location: CustomerLocation) => void;
};

const CustomerLocationForm: VoidFunctionComponent<Props> = ({ mode, location, buttonText, onSubmit, siteId }) => {
  const { values, errors, dirty, isValid, resetForm, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...location,
    },
    validationSchema: LocationSchema,
    onSubmit: (formValues) => {
      const formValuesForSubmit =
        mode === 'CREATE'
          ? { ...formValues, locationId: `${formValues.locationId}_${generateLocationId()}` }
          : { ...formValues };
      onSubmit(formValuesForSubmit);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {mode === 'CREATE' && (
        <FormControl id="locationId" my={6} isRequired isInvalid={errors.locationId != null}>
          <FormLabel>Location Name</FormLabel>
          <Input name="locationId" value={values.locationId} onChange={handleChange} />
          {errors.locationId && <FormErrorMessage>{errors.locationId}</FormErrorMessage>}
        </FormControl>
      )}
      <FormControl id="customer-locations-street" my={6} isRequired isInvalid={errors.street != null}>
        <FormLabel>Street</FormLabel>
        <Input name="street" value={values.street} onChange={handleChange} />
        {errors.street && <FormErrorMessage>{errors.street}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6} isInvalid={errors.state != null}>
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
      <FormControl my={6} isRequired isInvalid={errors.postalCode != null}>
        <FormLabel>Postal Code</FormLabel>
        <Input name="postalCode" value={values.postalCode} onChange={handleChange} />
        {errors.postalCode && <FormErrorMessage>{errors.postalCode}</FormErrorMessage>}
      </FormControl>
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!dirty || !isValid}>
          {buttonText}
        </Button>
        <Button onClick={() => resetForm()}>Clear</Button>
        <Button as={Link} to={`../sites/${siteId}/locations`}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default CustomerLocationForm;
