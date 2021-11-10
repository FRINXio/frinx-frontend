import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SiteDevice } from './site-types';

const DeviceSchema = yup.object().shape({
  deviceId: yup.string().required('Device Id is required'),
  locationId: yup.string().nullable(),
  managementIP: yup.string().required('Management IP is required'),
});

type Props = {
  mode: 'add' | 'edit';
  siteId: string;
  device: SiteDevice;
  locationId: string;
  onSubmit: (device: SiteDevice) => void;
  onCancel: () => void;
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({ mode, device, locationId, onSubmit, onCancel }) => {
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...device,
    },
    validationSchema: DeviceSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="site-device-id" my={6} isRequired isInvalid={errors.deviceId != null}>
        <FormLabel>Device ID</FormLabel>
        <Input name="deviceId" value={values.deviceId} isReadOnly={mode === 'edit'} onChange={handleChange} />
        {errors.deviceId && <FormErrorMessage>{errors.deviceId}</FormErrorMessage>}
      </FormControl>

      <FormControl id="device-locations" my={6}>
        <FormLabel>Location ID</FormLabel>
        <Input type="text" value={locationId} isReadOnly />
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.managementIP != null}>
        <FormLabel>Management IP</FormLabel>
        <Input name="managementIP" value={values.managementIP} onChange={handleChange} />
        {errors.managementIP && <FormErrorMessage>{errors.managementIP}</FormErrorMessage>}
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
