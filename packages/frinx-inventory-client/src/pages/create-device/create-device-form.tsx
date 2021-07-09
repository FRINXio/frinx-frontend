import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import React, { FC } from 'react';
import Editor from 'react-ace';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Device, Zone } from '../../helpers/types';
import { createEmptyDevice } from '../../helpers/device.helpers';

type Props = {
  onFormSubmit: (device: Device) => void;
};

const deviceSchema = yup.object({
  name: yup.string().required('Please enter name of device'),
  zone: yup.object({
    id: yup.string(),
    name: yup.string().required('Please enter zone of device'),
    tenant: yup.string(),
  }),
  mountParameters: yup.string(),
});

const zones = [{ name: 'jozko', tenant: 'vajda', id: '1234' }] as Zone[];

const CreateDeviceForm: FC<Props> = ({ onFormSubmit }) => {
  const { errors, values, handleSubmit, handleChange, setFieldValue, isSubmitting } = useFormik<Device>({
    initialValues: createEmptyDevice(),
    validationSchema: deviceSchema,
    onSubmit: (data) => {
      onFormSubmit(data);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isInvalid={errors.name !== undefined}>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter name of device" onChange={handleChange} name="name" value={values.name} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl id="zone" marginY={5} isInvalid={errors.zone?.name !== undefined}>
        <FormLabel>Zone</FormLabel>
        <Select onChange={handleChange} name="zone" placeholder="Select zone of device">
          {zones.map((zone: Zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.zone?.name}</FormErrorMessage>
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
            try {
              const parsedParams = JSON.parse(value);
              setFieldValue('mountParameters', parsedParams);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Bad JSON format');
            }
          }}
          value={JSON.stringify(values.mountParameters, null, 2)}
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
