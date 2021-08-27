import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import React, { FC } from 'react';
import Editor from 'react-ace';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Label, LabelsQuery, ZonesQuery } from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

type Props = {
  zones: ZonesQuery['zones']['edges'];
  labels: LabelsQuery['labels']['edges'];
  onFormSubmit: (device: FormValues) => Promise<void>;
  onLabelCreate: (labelName: string) => Promise<Label>;
};

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
  labels: string[];
};

const deviceSchema = yup.object({
  name: yup.string().required('Please enter name of device'),
  zoneId: yup.string().required('Please enter zone of device'),
  mountParameters: yup.string(),
});

const INITIAL_VALUES: FormValues = {
  name: '',
  zoneId: '',
  mountParameters: '{}',
  labels: [],
};

const CreateDeviceForm: FC<Props> = ({ onFormSubmit, zones, labels, onLabelCreate }) => {
  const [selectedLabels, setSelectedLabels] = React.useState<Pick<Label, 'id' | 'name'>[]>([]);
  const { errors, values, handleSubmit, handleChange, isSubmitting, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: deviceSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (data) => {
      const updatedData = { ...data, labels: selectedLabels.map((label) => label.id) };
      onFormSubmit(updatedData);
    },
  });

  const handleLabelRemoval = (label: Pick<Label, 'id' | 'name'>) => {
    setSelectedLabels(selectedLabels.filter((l) => l.id !== label.id));
  };

  const handleLabelCreation = (labelName: string) => {
    onLabelCreate(labelName).then((label) => {
      setSelectedLabels(selectedLabels.concat(label));
    });
  };

  const handleLabelAddition = (label: Pick<Label, 'id' | 'name'>) => {
    setSelectedLabels((prev) => prev.concat(label));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isInvalid={errors.name !== undefined}>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter name of device" onChange={handleChange} name="name" value={values.name} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl id="zone" marginY={5} isInvalid={errors.zoneId !== undefined}>
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

      <FormControl my={6}>
        <FormLabel>Labels</FormLabel>
        <SearchByLabelInput
          labels={labels}
          onRemove={handleLabelRemoval}
          onAdd={handleLabelAddition}
          selectedLabels={selectedLabels}
          onLabelCreate={handleLabelCreation}
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
          onChange={(event) => setFieldValue('mountParameters', event)}
          value={values.mountParameters}
        />
      </FormControl>

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
