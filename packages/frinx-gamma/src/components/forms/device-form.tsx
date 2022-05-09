import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Stack,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React, { VoidFunctionComponent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SiteDevice } from './site-types';
import Autocomplete2 from '../autocomplete-2/autocomplete-2';
import { CustomerLocation } from '../../network-types';
import unwrap from '../../helpers/unwrap';

function getDeviceSchema(existingDeviceNames: string[]): unknown {
  const deviceSchema = yup.object().shape({
    deviceId: yup
      .mixed()
      .notOneOf(existingDeviceNames, (input) => `Device Id: ${input.value} is already taken, choose another one`)
      .required('Device Id is required'),
    locationId: yup.string().nullable(),
    managementIP: yup.string().required('Management IP is required'),
  });
  return deviceSchema;
}

type Props = {
  mode: 'add' | 'edit';
  device: SiteDevice;
  existingDeviceNames: string[];
  locations: CustomerLocation[];
  onSubmit: (device: SiteDevice) => void;
  onCancel: () => void;
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({
  mode,
  device,
  locations,
  existingDeviceNames,
  onSubmit,
  onCancel,
}) => {
  const { values, errors, dirty, setFieldValue, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...device,
    },
    validationSchema: getDeviceSchema(existingDeviceNames),
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

  const locationItems = locations.map((l) => ({
    value: unwrap(l.locationId),
    label: `${l.city}, ${l.street} (id: ${l.locationId})`,
  }));

  const [selectedLocation] = locationItems.filter((l) => {
    return l.value === values.locationId;
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="site-device-id" my={6} isRequired isInvalid={errors.deviceId != null}>
        <FormLabel>Device ID</FormLabel>
        <Input name="deviceId" value={values.deviceId} isReadOnly={mode === 'edit'} onChange={handleChange} />
        {errors.deviceId && <FormErrorMessage>{errors.deviceId}</FormErrorMessage>}
      </FormControl>

      {/* <FormControl id="device-locations" my={6}>
        <FormLabel>Location ID</FormLabel>
        <Input type="text" name="locationId" value={values.locationId || ''} onChange={handleChange} />
      </FormControl> */}
      <FormControl id="locationId" my={6}>
        <FormLabel>Location ID</FormLabel>
        <Flex>
          <Box flex="1">
            <Autocomplete2
              items={locationItems}
              selectedItem={selectedLocation}
              onChange={(item) => {
                setFieldValue('locationId', item ? item.value : '');
              }}
            />
          </Box>
          <Box marginLeft={4} alignSelf="center">
            <IconButton
              size="sm"
              aria-label="Deselect Customer Name"
              icon={<CloseIcon />}
              onClick={() => setFieldValue('locationId', null)}
            />
          </Box>
        </Flex>
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.managementIP != null}>
        <FormLabel>Management IP</FormLabel>
        <Input name="managementIP" value={values.managementIP} onChange={handleChange} />
        {errors.managementIP && <FormErrorMessage>{errors.managementIP}</FormErrorMessage>}
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

export default CreateDeviceForm;
