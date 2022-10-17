import { useFormik } from 'formik';
import React, { FC, useMemo } from 'react';
import * as yup from 'yup';

import { Item } from 'chakra-ui-autocomplete';
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
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared/src';

import { Device, DeviceSizeEnum, deviceSizeOptions, serviceStateOptions } from '../../helpers/types';
import { DeviceServiceState, Label, LabelsQuery, ZonesQuery, DeviceSize } from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

type FormValues = {
  zoneId: string;
  mountParameters: string;
  labelIds: string[];
  serviceState: DeviceServiceState;
  deviceSize: DeviceSize;
  vendor: string | null;
  model: string | null;
  address: string | null;
};

type FormLabel = { id: string; name: string };

export type FormDevice = Device & { labels: FormLabel[] };

type Props = {
  labels: LabelsQuery['labels']['edges'];
  zones: ZonesQuery['zones']['edges']; // eslint-disable-line react/no-unused-prop-types
  device: FormDevice;
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

const EditDeviceForm: FC<Props> = ({ labels, device, onUpdate, onLabelCreate, onCancel }): JSX.Element => {
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
        const updatedData = { ...data, labelIds: selectedLabels.map((label) => label.value) };
        onUpdate(updatedData);
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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl my={6} isRequired isInvalid={errors.serviceState != null}>
        <FormLabel>Service state</FormLabel>
        <Select
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
            name="vendor"
            onChange={handleChange}
            placeholder="Enter vendor of the device"
            value={values.vendor || ''}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Model</FormLabel>
          <Input
            name="model"
            onChange={handleChange}
            placeholder="Enter model of the device"
            value={values.model || ''}
          />
        </FormControl>

        <FormControl isInvalid={errors.deviceSize != null}>
          <FormLabel>Device size</FormLabel>
          <Select
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
          name="address"
          onChange={handleChange}
          placeholder="Enter address of the device"
          value={values.address || ''}
        />
      </FormControl>

      <FormControl my={6}>
        <SearchByLabelInput
          items={labels}
          selectedLabels={selectedLabels}
          onLabelCreate={handleLabelCreation}
          onSelectionChange={handleOnSelectionChange}
        />
      </FormControl>

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

      <Divider my={6} />
      <FormControl mb={6}>
        <HStack>
          <Spacer />
          <Button onClick={onCancel} colorScheme="gray" ml={3}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Save changes
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default EditDeviceForm;
