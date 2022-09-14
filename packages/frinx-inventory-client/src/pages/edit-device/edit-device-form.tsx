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

import { serviceStateOptions } from '../../helpers/types';
import { DeviceServiceState, Label, LabelsQuery, ZonesQuery } from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

type FormValues = {
  zoneId: string;
  mountParameters: string;
  labelIds: string[];
  serviceState: DeviceServiceState;
  vendor: string;
  model: string;
  address: string;
};

type Props = {
  zoneId: string;
  mountParameters: string | null;
  labels: LabelsQuery['labels']['edges'];
  initialSelectedLabels: LabelsQuery['labels']['edges'];
  serviceState: DeviceServiceState;
  zones: ZonesQuery['zones']['edges']; // eslint-disable-line react/no-unused-prop-types
  onUpdate: (values: FormValues) => void;
  onLabelCreate: (label: string) => Promise<Label | null>;
  onCancel: () => void;
};

const EditDeviceFormSchema = yup.object().shape({
  // zoneId: yup.string().required('Zone is required'),
  serviceState: yup.string().required('Service state is required'),
  vendor: yup.string(),
  model: yup.string(),
  address: yup.string(),
});

const EditDeviceForm: FC<Props> = ({
  zoneId,
  mountParameters,
  labels,
  initialSelectedLabels,
  serviceState,
  onUpdate,
  onLabelCreate,
  onCancel,
}): JSX.Element => {
  const INITIAL_VALUES = useMemo(() => {
    return {
      zoneId,
      mountParameters: mountParameters ?? '',
      labelIds: initialSelectedLabels.map(({ node: { id } }) => id),
      serviceState,
      vendor: '',
      model: '',
      address: '',
    };
  }, [zoneId, mountParameters, initialSelectedLabels, serviceState]);

  const [selectedLabels, setSelectedLabels] = React.useState<Item[]>(
    initialSelectedLabels.map(({ node: { id, name } }) => ({ value: id, label: name })),
  );

  const { values, isSubmitting, handleSubmit, setFieldValue, handleChange, errors } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: EditDeviceFormSchema,
    onSubmit: (data) => {
      const updatedData = { ...data, labelIds: selectedLabels.map((label) => label.value) };
      onUpdate(updatedData);
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

      <FormControl my={6}>
        <FormLabel>Vendor</FormLabel>
        <Input name="vendor" onChange={handleChange} placeholder="Enter vendor of the device" value={values.vendor} />
      </FormControl>

      <FormControl my={6}>
        <FormLabel>Model</FormLabel>
        <Input name="model" onChange={handleChange} placeholder="Enter model of the device" value={values.model} />
      </FormControl>

      <FormControl my={6}>
        <FormLabel>Address</FormLabel>
        <Input
          name="address"
          onChange={handleChange}
          placeholder="Enter address of the device"
          value={values.address}
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
