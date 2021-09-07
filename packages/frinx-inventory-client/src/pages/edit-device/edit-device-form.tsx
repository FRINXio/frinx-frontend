import { useFormik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';
import Editor from 'react-ace';

import { Item } from 'chakra-ui-autocomplete';
import { Button, Divider, FormControl, FormLabel, HStack, Select } from '@chakra-ui/react';

import { ServiceState, serviceStateOptions } from '../../helpers/types';
import { Label, LabelsQuery, ZonesQuery } from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

type FormValues = {
  zoneId: string;
  mountParameters: string;
  labels: string[];
  serviceState: ServiceState;
};

type Props = {
  zoneId: string;
  mountParameters: string;
  labels: LabelsQuery['labels']['edges'];
  initialSelectedLabels: LabelsQuery['labels']['edges'];
  serviceState: ServiceState;
  zones: ZonesQuery['zones']['edges'];
  onUpdate: (values: FormValues) => void;
  onLabelCreate: (label: string) => Promise<Label | null>;
  onCancel: () => void;
};

const EditDeviceFormSchema = yup.object().shape({
  // zoneId: yup.string().required('Zone is required'),
  serviceState: yup.string().required('Service state is required'),
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
  const INITIAL_VALUES = {
    zoneId,
    mountParameters,
    labels: initialSelectedLabels.map(({ node: { id } }) => id),
    serviceState,
  };

  const [selectedLabels, setSelectedLabels] = React.useState<Item[]>(
    initialSelectedLabels.map(({ node: { id, name } }) => ({ value: id, label: name })),
  );

  const { values, isSubmitting, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: EditDeviceFormSchema,
    onSubmit: (data) => {
      const updatedData = { ...data, labels: selectedLabels.map((label) => label.value) };
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
      {/* <FormControl id="zone" marginY={6} isInvalid={errors.zoneId !== undefined}>
        <FormLabel>Zone</FormLabel>
        <Select
          onChange={(event) => {
            event.persist();
            setFieldValue('zoneId', event.target.value);
          }}
          name="zone"
          placeholder="Select zone of device"
          defaultValue={values.zoneId}
        >
          {zones.map(({ node: zone }) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.zoneId}</FormErrorMessage>
      </FormControl> */}

      <FormControl>
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
      </FormControl>

      <FormControl my={6}>
        <SearchByLabelInput
          labels={labels}
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
      <FormControl>
        <HStack justify="flex-end">
          <Button onClick={onCancel} colorScheme="gray" ml={3}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Edit device
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default EditDeviceForm;
