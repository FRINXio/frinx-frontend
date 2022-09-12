import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Select, Switch } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useState, VoidFunctionComponent } from 'react';
import * as yup from 'yup';
import { Item } from 'chakra-ui-autocomplete';
import { Editor } from '@frinx/shared/src';
import { DeviceBlueprintsQuery, Label, LabelsQuery, ZonesQuery } from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';
import BlueprintForm from './blueprint-form';
import { ServiceState, serviceStateOptions } from '../../helpers/types';

type Props = {
  zones: ZonesQuery['zones']['edges'];
  labels: LabelsQuery['labels']['edges'];
  blueprints: DeviceBlueprintsQuery['blueprints']['edges'];
  onFormSubmit: (device: FormValues) => Promise<void>;
  onLabelCreate: (labelName: string) => Promise<Label | null>;
};

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
  labels: string[];
  serviceState: ServiceState;
  vendor: string;
  model: string;
  address: string;
};

const deviceSchema = yup.object({
  name: yup.string().required('Please enter name of device'),
  zoneId: yup.string().required('Please enter zone of device'),
  mountParameters: yup.string(),
  vendor: yup.string(),
  model: yup.string(),
  address: yup.string(),
});

const INITIAL_VALUES: FormValues = {
  name: '',
  zoneId: '',
  mountParameters: '{}',
  labels: [],
  serviceState: ServiceState.PLANNING,
  model: '',
  vendor: '',
  address: '',
};

const CreateDeviceForm: VoidFunctionComponent<Props> = ({ onFormSubmit, zones, labels, onLabelCreate, blueprints }) => {
  const [selectedLabels, setSelectedLabels] = React.useState<Item[]>([]);
  const [isUsingBlueprints, setIsUsingBlueprints] = useState(false);
  const { errors, values, handleSubmit, handleChange, isSubmitting, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: deviceSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (data) => {
      const updatedData = { ...data, labels: selectedLabels.map((label) => label.value) };
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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isRequired isInvalid={errors.name !== undefined}>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter name of device" onChange={handleChange} name="name" value={values.name} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl id="zone" isRequired marginY={6} isInvalid={errors.zoneId !== undefined}>
        <FormLabel>Zone</FormLabel>
        <Select
          onChange={(event) => {
            event.persist();
            setFieldValue('zoneId', event.target.value);
          }}
          name="zone"
          placeholder="Select zone of device"
        >
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
          onChange={(event) => {
            event.persist();
            setFieldValue('serviceState', event.target.value);
          }}
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
      <FormControl>
        <FormLabel>Use blueprint?</FormLabel>
        <Switch
          size="lg"
          id="isUsingBlueprints"
          isChecked={isUsingBlueprints}
          onChange={(event) => {
            event.persist();
            setIsUsingBlueprints(event.target.checked);
          }}
        />
      </FormControl>

      {isUsingBlueprints ? (
        <BlueprintForm
          blueprints={blueprints}
          onFormSubmit={(mParameters) => {
            setFieldValue('mountParameters', mParameters);
            setIsUsingBlueprints(false);
          }}
        />
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
      <FormControl>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Add device
        </Button>
      </FormControl>
    </form>
  );
};

export default CreateDeviceForm;
