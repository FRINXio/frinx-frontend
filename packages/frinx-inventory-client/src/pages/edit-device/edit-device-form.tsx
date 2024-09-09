import { useFormik } from 'formik';
import React, { FC, useMemo } from 'react';
import * as yup from 'yup';
import { Item } from 'chakra-ui-autocomplete';
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Select,
  Spacer,
} from '@chakra-ui/react';
import { Autocomplete, Editor, jsonParse } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { Device, DeviceSizeEnum, deviceSizeOptions, serviceStateOptions } from '../../helpers/types';
import {
  DeviceServiceState,
  Label,
  LabelsQuery,
  ZonesQuery,
  DeviceSize,
  LocationsQuery,
} from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

type FormValues = {
  zoneId: string;
  mountParameters: string | null;
  labelIds: string[];
  serviceState: DeviceServiceState;
  deviceSize: DeviceSize;
  vendor: string | null;
  model: string | null;
  address: string | null;
  locationId: string | null;
};

type FormLabel = { id: string; name: string };

export type FormDevice = Device & { labels: FormLabel[] };

type Props = {
  labels: LabelsQuery['deviceInventory']['labels']['edges'];
  zones: ZonesQuery['deviceInventory']['zones']['edges']; // eslint-disable-line react/no-unused-prop-types
  device: FormDevice;
  locations: LocationsQuery['deviceInventory']['locations']['edges'];
  onUpdate: (values: FormValues) => void;
  onLabelCreate: (label: string) => Promise<Label | null>;
  onCancel: () => void;
};

const EditDeviceFormSchema = yup.object().shape({
  serviceState: yup.string().required('Service state is required'),
  vendor: yup.string(),
  model: yup.string(),
  address: yup.string(),
  deviceSize: yup.lazy((deviceSize) => {
    if (deviceSize === '') {
      return yup.string();
    }

    if (
      deviceSize !== DeviceSizeEnum.SMALL &&
      deviceSize !== DeviceSizeEnum.MEDIUM &&
      deviceSize !== DeviceSizeEnum.LARGE
    ) {
      return yup.string().required('Please select device size');
    }

    return yup.string();
  }),
});

const EditDeviceForm: FC<Props> = ({ labels, device, onUpdate, onLabelCreate, onCancel, locations }): JSX.Element => {
  const INITIAL_VALUES = useMemo(() => {
    return {
      zoneId: device.zone.id,
      mountParameters: device.mountParameters ?? '',
      labelIds: device.labels.map((label) => label.id),
      serviceState: device.serviceState,
      vendor: device.vendor ?? '',
      model: device.model ?? '',
      address: device.host ?? '',
      deviceSize: device.deviceSize,
      locationId: device.locationId ?? null,
    };
  }, [device]);

  const [selectedLabels, setSelectedLabels] = React.useState<Item[]>(
    device.labels.map(({ id, name }) => ({ value: id, label: name })),
  );

  const { values, isSubmitting, handleSubmit, setFieldValue, handleChange, errors, setSubmitting } =
    useFormik<FormValues>({
      initialValues: INITIAL_VALUES,
      validationSchema: EditDeviceFormSchema,
      onSubmit: (data) => {
        const updatedData = {
          ...data,
          labelIds: selectedLabels.map((label) => label.value),
          mountParameters: jsonParse(data.mountParameters) ?? null,
        };
        onUpdate({
          ...updatedData,
          mountParameters: JSON.stringify(updatedData.mountParameters),
        });
        setSubmitting(false);
      },
    });

  const handleLabelCreation = (labelName: Item) => {
    onLabelCreate(labelName.label).then((label) => {
      if (label != null) {
        setSelectedLabels(selectedLabels.concat({ label: label.name, value: label.id }));
      }
    });
  };

  const handleOnSelectionChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedLabels([...new Set(selectedItems)]);
    }
  };

  const parsedMountParameters = jsonParse(values.mountParameters);
  const isMountParametersValid = parsedMountParameters != null && typeof parsedMountParameters === 'string';
  const locationOptions = locations.map(({ node: location }) => ({
    label: location.name,
    value: location.name,
  }));

  const locationList = locations.map((l) => l.node);

  const handleLocationChange = (locationName?: string | null) => {
    if (locationName) {
      const location = locationList.find((loc) => loc.name === locationName)?.id;
      setFieldValue('locationId', location);
    }
  };

  const location = locationList.find((loc) => loc.id === values.locationId);
  const selectedLocation = {
    label: location?.name || '',
    value: location?.name || '',
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl my={6} isRequired isInvalid={errors.serviceState != null}>
        <FormLabel>Service state</FormLabel>
        <Select
          data-cy="device-edit-state"
          onChange={(event) => {
            event.persist();
            setFieldValue('serviceState', event.target.value);
          }}
          name="serviceState"
          placeholder="Select service state"
          defaultValue={values.serviceState}
        >
          {serviceStateOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.serviceState}</FormErrorMessage>
      </FormControl>

      <HStack my={6} alignItems="flex-start">
        <FormControl>
          <FormLabel>Vendor</FormLabel>
          <Input
            data-cy="device-edit-vendor"
            name="vendor"
            onChange={handleChange}
            placeholder="Enter vendor of the device"
            value={values.vendor || ''}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Model</FormLabel>
          <Input
            data-cy="device-edit-model"
            name="model"
            onChange={handleChange}
            placeholder="Enter model of the device"
            value={values.model || ''}
          />
        </FormControl>

        <FormControl isInvalid={errors.deviceSize != null}>
          <FormLabel>Device size</FormLabel>
          <Select
            data-cy="device-edit-size"
            name="deviceSize"
            onChange={handleChange}
            placeholder="Select size of the device"
            value={values.deviceSize}
          >
            {deviceSizeOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.deviceSize}</FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>Address</FormLabel>
        <Input
          data-cy="device-edit-address"
          name="address"
          onChange={handleChange}
          placeholder="Enter address of the device"
          value={values.address || ''}
        />
      </FormControl>

      <FormControl my={6}>
        <SearchByLabelInput
          data-cy="device-edit-labels"
          items={labels}
          selectedLabels={selectedLabels}
          onLabelCreate={handleLabelCreation}
          onSelectionChange={handleOnSelectionChange}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Location</FormLabel>
        <Flex gap="5px">
          <Autocomplete
            items={locationOptions}
            onChange={(e) => handleLocationChange(e?.value)}
            selectedItem={selectedLocation}
          />
          <IconButton
            aria-label="x-square"
            icon={<Icon size={12} as={FeatherIcon} icon="x-square" />}
            onClick={() => setFieldValue('locationId', null)}
            colorScheme="red"
          />
        </Flex>
      </FormControl>
      <FormControl my={6}>
        <FormLabel data-cy="ace-editor">Mount parameters</FormLabel>
        <Editor
          data-cy="device-edit-editor"
          height="450px"
          width="100%"
          language="json"
          onChange={(value) => {
            setFieldValue('mountParameters', value);
          }}
          value={isMountParametersValid ? parsedMountParameters : values.mountParameters ?? ''}
        />
      </FormControl>

      <Divider my={6} />
      <FormControl mb={6}>
        <HStack>
          <Spacer />
          <Button data-cy="device-edit-cancel" onClick={onCancel} colorScheme="gray" ml={3}>
            Cancel
          </Button>
          <Button data-cy="device-edit-save" type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Save changes
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default EditDeviceForm;
