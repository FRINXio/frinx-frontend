import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  Spacer,
  Switch,
  useDisclosure,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useState, VoidFunctionComponent } from 'react';
import * as yup from 'yup';
import { Item } from 'chakra-ui-autocomplete';
import { Editor, jsonParse } from '@frinx/shared';
import parse from 'json-templates';
import {
  DeviceBlueprintsQuery,
  DeviceServiceState,
  DeviceSize as DeviceSizeType,
  Label,
  LabelsQuery,
  LocationsQuery,
  ZonesQuery,
} from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';
import { ServiceState, serviceStateOptions, DeviceSizeEnum, deviceSizeOptions } from '../../helpers/types';
import { LocationData } from './create-device-page';
import AddDeviceLocationModal from '../../components/add-device-location-modal';

type Props = {
  onAddDeviceLocation: (locationData: LocationData) => void;
  locations: LocationsQuery['deviceInventory']['locations']['edges'];
  isSubmitting: boolean;
  zones: ZonesQuery['deviceInventory']['zones']['edges'];
  labels: LabelsQuery['deviceInventory']['labels']['edges'];
  blueprints: DeviceBlueprintsQuery['deviceInventory']['blueprints']['edges'];
  onFormSubmit: (device: FormValues) => void;
  onLabelCreate: (labelName: string) => Promise<Label | null>;
  deviceNameError: string | null;
};

export type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string | null;
  labelIds: string[];
  serviceState: DeviceServiceState;
  blueprintId: string | null;
  model: string;
  address: string;
  username: string;
  password: string;
  deviceType: string;
  deviceSize: DeviceSizeType;
  version: string;
  vendor: string;
  port: number;
  locationId: string;
};

const deviceSchema = yup.object({
  name: yup.string().required('Please enter name of device'),
  zoneId: yup.string().required('Please enter zone of device'),
  mountParameters: yup.string(),
  vendor: yup.string(),
  model: yup.string(),
  blueprintParams: yup.array().of(yup.string()),
  address: yup.string(),
  blueprintId: yup.string().nullable(),
  port: yup.number().typeError('Number is required').min(0, 'Minimal value is 0'),
  deviceType: yup.string(),
  version: yup.string(),
  username: yup.string(),
  locationId: yup.string(),
  password: yup.string(),
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

const INITIAL_VALUES: FormValues = {
  name: '',
  zoneId: '',
  mountParameters: '{}',
  labelIds: [],
  serviceState: ServiceState.PLANNING,
  model: '',
  vendor: '',
  address: '',
  blueprintId: null,
  deviceType: '',
  deviceSize: DeviceSizeEnum.MEDIUM,
  password: '',
  username: '',
  version: '',
  port: 0,
  locationId: '',
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({
  deviceNameError,
  onFormSubmit,
  zones,
  labels,
  onLabelCreate,
  blueprints,
  isSubmitting,
  locations,
  onAddDeviceLocation,
}) => {
  const [blueprintParameterValues, setBlueprintParameterValues] = useState<Record<string, string>>({});
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [isUsingBlueprints, setIsUsingBlueprints] = useState(false);
  const addDeviceLocationModalDisclosure = useDisclosure();

  const { errors, values, handleSubmit, handleChange, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: deviceSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (data) => {
      const blueprintParameters = parse(
        blueprints.find((blueprint) => blueprint.node.id === values.blueprintId)?.node.template ?? {},
      );

      // TODO: we parse it and stringify later to remove all escape characters
      // so it is always saved as json object in prisma
      // we should find better solution
      const createMountParamerers = isUsingBlueprints
        ? JSON.parse(blueprintParameters(blueprintParameterValues))
        : JSON.parse(data.mountParameters ?? '{}');

      const updatedData = {
        ...data,
        labelIds: selectedLabels.map((label) => label.value),
        port: Number(data.port),
        mountParameters: JSON.stringify(createMountParamerers),
      };

      onFormSubmit(updatedData);
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

  const handleOnLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    setFieldValue('locationId', e.target.value);
  };

  const blueprintParameters = parse(
    blueprints.find((blueprint) => blueprint.node.id === values.blueprintId)?.node.template ?? {},
  ).parameters.map(({ key }) => key);

  const isBlueprintValuesValid =
    Object.keys(blueprintParameterValues).length === blueprintParameters.length &&
    Object.values(blueprintParameterValues).every((value) => value !== '');

  const parsedMountParameters = jsonParse(values.mountParameters);
  const isMountParametersValid = parsedMountParameters != null && typeof parsedMountParameters === 'string';

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isRequired isInvalid={deviceNameError !== null}>
        <FormLabel>Name</FormLabel>
        <Input data-cy="add-device-name" placeholder="R1" onChange={handleChange} name="name" value={values.name} />
        <FormErrorMessage>{deviceNameError}</FormErrorMessage>
      </FormControl>
      <FormControl id="zone" isRequired marginY={6} isInvalid={errors.zoneId !== undefined}>
        <FormLabel>Zone</FormLabel>
        <Select onChange={handleChange} data-cy="add-device-zone" name="zoneId" placeholder="Select zone of device">
          {zones.map(({ node: zone }) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.zoneId}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Service state</FormLabel>
        <Select
          onChange={handleChange}
          data-cy="add-device-state"
          name="serviceState"
          placeholder="Select service state"
          defaultValue={ServiceState.PLANNING}
        >
          {serviceStateOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormControl>
      <HStack my={6} alignItems="flex-start">
        <FormControl>
          <FormLabel>Vendor</FormLabel>
          <Input
            data-cy="add-device-vendor"
            name="vendor"
            onChange={handleChange}
            placeholder="Enter vendor of the device"
            value={values.vendor}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Model</FormLabel>
          <Input
            name="model"
            data-cy="add-device-model"
            onChange={handleChange}
            placeholder="Enter model of the device"
            value={values.model}
          />
        </FormControl>

        <FormControl id="deviceSize" isInvalid={errors.deviceSize !== undefined}>
          <FormLabel>Device size</FormLabel>
          <Select
            data-cy="add-device-size"
            name="deviceSize"
            onChange={handleChange}
            placeholder="Select size of the device"
          >
            {deviceSizeOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.deviceSize}</FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack my={6} alignItems="start">
        <FormControl>
          <FormLabel>Device type</FormLabel>
          <Input
            data-cy="add-device-type"
            name="deviceType"
            onChange={handleChange}
            placeholder="ios xr"
            value={values.deviceType}
          />
          <FormErrorMessage>{errors.deviceType}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Version</FormLabel>
          <Input
            data-cy="add-device-version"
            name="version"
            onChange={handleChange}
            placeholder="5.3.*"
            value={values.version}
          />
          <FormErrorMessage>{errors.version}</FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack my={6} alignItems="flex-start">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            data-cy="add-device-username"
            name="username"
            onChange={handleChange}
            placeholder="cisco"
            value={values.username}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            data-cy="add-device-password"
            name="password"
            onChange={handleChange}
            placeholder="cisco"
            value={values.password}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack my={6} alignItems="flex-start">
        <FormControl isInvalid={errors.address != null}>
          <FormLabel>Address / DNS</FormLabel>
          <Input
            data-cy="add-device-address"
            name="address"
            onChange={handleChange}
            placeholder="192.168.0.1"
            value={values.address}
          />
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.port != null}>
          <FormLabel>Port</FormLabel>
          <Input data-cy="add-device-port" name="port" onChange={handleChange} placeholder="22" value={values.port} />
          <FormErrorMessage>{errors.port}</FormErrorMessage>
        </FormControl>
      </HStack>
      <FormControl my={6}>
        <SearchByLabelInput
          items={labels}
          selectedLabels={selectedLabels}
          onLabelCreate={handleLabelCreation}
          onSelectionChange={handleOnSelectionChange}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Location</FormLabel>
        <HStack>
          <Select
            data-cy="add-device-location"
            name="locationId"
            id="locationId"
            placeholder="Select location"
            onChange={(e) => {
              handleOnLocationChange(e);
            }}
            value={values.locationId}
          >
            {locations.map(({ node: location }) => {
              return (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              );
            })}
          </Select>
          <Button onClick={addDeviceLocationModalDisclosure.onOpen} colorScheme="blue">
            +
          </Button>
        </HStack>
      </FormControl>
      <AddDeviceLocationModal
        onAddDeviceLocation={onAddDeviceLocation}
        isOpen={addDeviceLocationModalDisclosure.isOpen}
        onClose={addDeviceLocationModalDisclosure.onClose}
        title="Add device location"
      />
      <FormControl>
        <FormLabel>Use blueprint?</FormLabel>
        <Switch
          data-cy="add-device-switch"
          size="lg"
          id="isUsingBlueprints"
          isChecked={isUsingBlueprints}
          onChange={(event) => {
            event.persist();
            setIsUsingBlueprints(event.target.checked);
            if (!event.target.checked) {
              setFieldValue('blueprintId', null);
            }
          }}
        />
      </FormControl>
      {isUsingBlueprints ? (
        <>
          <FormControl marginY={6}>
            <Select
              data-cy="add-device-blueprint"
              name="blueprintId"
              id="blueprintId"
              placeholder="Select blueprint"
              onChange={(e) => {
                handleChange(e);
              }}
              value={values.blueprintId || ''}
            >
              {blueprints.map(({ node: blueprint }) => {
                return (
                  <option key={blueprint.id} value={blueprint.id}>
                    {blueprint.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>

          <Grid templateColumns="repeat(3, 1fr)" gap={1.5}>
            {blueprintParameters.map((key) => (
              <GridItem>
                <FormControl key={key} marginY={6} isRequired>
                  <FormLabel>{key}</FormLabel>
                  <Input
                    name={key}
                    onChange={(e) =>
                      setBlueprintParameterValues((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={key}
                    value={blueprintParameterValues[key] ?? ''}
                  />
                </FormControl>
              </GridItem>
            ))}
          </Grid>
        </>
      ) : (
        <FormControl my={6}>
          <FormLabel data-cy="ace-editor">Mount parameters</FormLabel>
          <Editor
            height="450px"
            width="100%"
            language="json"
            onChange={(value) => {
              setFieldValue('mountParameters', value);
            }}
            value={isMountParametersValid ? parsedMountParameters : values.mountParameters ?? ''}
          />
        </FormControl>
      )}
      <Divider my={6} />
      <HStack mb={6}>
        <Spacer />
        <Button
          data-cy="add-device-button"
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!isBlueprintValuesValid}
        >
          Add device
        </Button>
      </HStack>
    </form>
  );
};

export default CreateDeviceForm;
