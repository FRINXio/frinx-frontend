import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Spacer,
  Switch,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import * as yup from 'yup';
import { Item } from 'chakra-ui-autocomplete';
import { Editor } from '@frinx/shared/src';
import parse from 'json-templates';
import {
  DeviceBlueprintsQuery,
  DeviceServiceState,
  DeviceSize as DeviceSizeType,
  Label,
  LabelsQuery,
  ZonesQuery,
} from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';
import { ServiceState, serviceStateOptions, DeviceSize, deviceSizeOptions } from '../../helpers/types';

type Props = {
  isSubmitting: boolean;
  zones: ZonesQuery['zones']['edges'];
  labels: LabelsQuery['labels']['edges'];
  blueprints: DeviceBlueprintsQuery['blueprints']['edges'];
  onFormSubmit: (device: FormValues) => void;
  onLabelCreate: (labelName: string) => Promise<Label | null>;
};

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
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
  blueprintParams?: string[];
};

const getWhenOptions = (keyName: string, errorMessage: string) => {
  if (keyName === 'port_number') {
    return {
      is: (blueprintParams: string[]) => {
        return blueprintParams.includes(keyName);
      },
      then: yup.number().required(errorMessage),
    };
  }

  return {
    is: (blueprintParams: string[]) => {
      return blueprintParams.includes(keyName);
    },
    then: yup.string().required(errorMessage),
  };
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
  port: yup
    .number()
    .typeError('Number is required')
    .min(0, 'Minimal value is 0')
    .when('blueprintParams', getWhenOptions('port_number', 'Port number is required by the blueprint')),
  deviceType: yup
    .string()
    .when('blueprintParams', getWhenOptions('device_type', 'Device type is required by the blueprint')),
  version: yup.string().when('blueprintParams', getWhenOptions('version', 'Version is required by the blueprint')),
  username: yup.string().when('blueprintParams', getWhenOptions('user', 'Username is required by the blueprint')),
  password: yup.string().when('blueprintParams', getWhenOptions('password', 'Password is required by the blueprint')),
  deviceSize: yup.lazy((deviceSize) => {
    if (deviceSize === '') {
      return yup.string();
    }

    if (deviceSize !== DeviceSize.SMALL && deviceSize !== DeviceSize.MEDIUM && deviceSize !== DeviceSize.LARGE) {
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
  deviceSize: DeviceSize.MEDIUM,
  password: '',
  username: '',
  version: '',
  port: 0,
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({
  onFormSubmit,
  zones,
  labels,
  onLabelCreate,
  blueprints,
  isSubmitting,
}) => {
  const [selectedLabels, setSelectedLabels] = React.useState<Item[]>([]);
  const [isUsingBlueprints, setIsUsingBlueprints] = useState(false);
  const { errors, values, handleSubmit, handleChange, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: deviceSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (data) => {
      const updatedData = { ...data, labelIds: selectedLabels.map((label) => label.value), port: Number(data.port) };
      const { blueprintParams, ...rest } = updatedData;
      onFormSubmit(rest);
    },
  });

  useEffect(() => {
    const blueprintParameters = parse(
      blueprints.find((blueprint) => blueprint.node.id === values.blueprintId)?.node.template ?? {},
    ).parameters.map(({ key }) => key);
    setFieldValue('blueprintParams', blueprintParameters);
  }, [blueprints, setFieldValue, values.blueprintId]);

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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isRequired isInvalid={errors.name !== undefined}>
        <FormLabel>Name</FormLabel>
        <Input placeholder="R1" onChange={handleChange} name="name" value={values.name} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl id="zone" isRequired marginY={6} isInvalid={errors.zoneId !== undefined}>
        <FormLabel>Zone</FormLabel>
        <Select onChange={handleChange} name="zoneId" placeholder="Select zone of device">
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

      <HStack my={6}>
        <FormControl>
          <FormLabel>Vendor</FormLabel>
          <Input name="vendor" onChange={handleChange} placeholder="Enter vendor of the device" value={values.vendor} />
        </FormControl>

        <FormControl>
          <FormLabel>Model</FormLabel>
          <Input name="model" onChange={handleChange} placeholder="Enter model of the device" value={values.model} />
        </FormControl>

        <FormControl isRequired={values.blueprintParams?.includes('device_type')}>
          <FormLabel>Device type</FormLabel>
          <Input name="deviceType" onChange={handleChange} placeholder="ios xr" value={values.deviceType} />
          <FormErrorMessage>{errors.deviceType}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired={values.blueprintParams?.includes('version')}>
          <FormLabel>Version</FormLabel>
          <Input name="version" onChange={handleChange} placeholder="5.3.*" value={values.version} />
          <FormErrorMessage>{errors.version}</FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl id="deviceSize" my={6} isInvalid={errors.deviceSize !== undefined}>
        <FormLabel>Device size</FormLabel>
        <Select name="deviceSize" onChange={handleChange} placeholder="Select size of the device">
          {deviceSizeOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.deviceSize}</FormErrorMessage>
      </FormControl>

      <HStack my={6}>
        <FormControl isRequired={values.blueprintParams?.includes('user')}>
          <FormLabel>Username</FormLabel>
          <Input name="username" onChange={handleChange} placeholder="cisco" value={values.username} />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired={values.blueprintParams?.includes('password')}>
          <FormLabel>Password</FormLabel>
          <Input name="password" onChange={handleChange} placeholder="cisco" value={values.password} />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
      </HStack>

      <HStack my={6} alignItems="start">
        <FormControl isRequired={values.blueprintParams?.includes('user')} isInvalid={errors.address != null}>
          <FormLabel>Address / DNS</FormLabel>
          <Input name="address" onChange={handleChange} placeholder="192.168.0.1" value={values.address} />
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired={values.blueprintParams?.includes('user')} isInvalid={errors.port != null}>
          <FormLabel>Port</FormLabel>
          <Input name="port" onChange={handleChange} placeholder="22" value={values.port} />
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
      <FormControl>
        <FormLabel>Use blueprint?</FormLabel>
        <Switch
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
        <FormControl marginY={6}>
          <Select
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
      ) : (
        <FormControl my={6}>
          <FormLabel>Mount parameters</FormLabel>
          <Editor
            height="450px"
            width="100%"
            mode="json"
            theme="tomorrow"
            editorProps={{ $blockScrolling: true }}
            fontSize={16}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            onChange={(value) => {
              setFieldValue('mountParameters', value);
            }}
            value={values.mountParameters}
          />
        </FormControl>
      )}

      <Divider my={6} />
      <HStack mb={6}>
        <Spacer />
        <FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Add device
          </Button>
        </FormControl>
      </HStack>
    </form>
  );
};

export default CreateDeviceForm;
