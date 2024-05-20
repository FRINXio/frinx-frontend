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
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useState, VoidFunctionComponent } from 'react';
import * as yup from 'yup';
import { Autocomplete, Editor, jsonParse } from '@frinx/shared';
import parse from 'json-templates';
import { DevicesAndBlueprintsQuery } from '../../__generated__/graphql';

type Props = {
  isSubmitting: boolean;
  devices: DevicesAndBlueprintsQuery['deviceInventory']['devices']['edges'];
  streams: DevicesAndBlueprintsQuery['deviceInventory']['streams']['edges'];
  blueprints: DevicesAndBlueprintsQuery['deviceInventory']['blueprints']['edges'];
  onFormSubmit: (device: FormValues) => void;
};

type FormValues = {
  deviceName: string;
  streamName: string;
  blueprintId: string | null;
  streamParameters: string | null;
};

type StreamSet = Set<string>;

function getStreamFullName(deviceName: string, streamName: string) {
  return `${deviceName}>>${streamName}`;
}

function getStreamSchema(streamSet: StreamSet) {
  return yup.object({
    deviceName: yup.string().required('Please enter name of device'),
    streamName: yup
      .string()
      .required('Please enter name of stream')
      .test('duplicateStream', 'Stream name is duplicate for selected device', (value, context) => {
        return !streamSet.has(getStreamFullName(context.parent.deviceName, value ?? ''));
      }),
    blueprintId: yup.string().nullable(),
    streamParameters: yup.string(),
  });
}

const INITIAL_VALUES: FormValues = {
  deviceName: '',
  streamName: '',
  blueprintId: null,
  streamParameters: '{}',
};

const CreateStreamForm: VoidFunctionComponent<Props> = ({
  devices,
  streams,
  onFormSubmit,
  blueprints,
  isSubmitting,
}) => {
  const [blueprintParameterValues, setBlueprintParameterValues] = useState<Record<string, string>>({});
  const [isUsingBlueprints, setIsUsingBlueprints] = useState(false);
  const { errors, values, isValid, handleSubmit, handleChange, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: getStreamSchema(
      new Set(streams.map((s) => getStreamFullName(s.node.deviceName, s.node.streamName))),
    ),
    onSubmit: (data) => {
      onFormSubmit(data);
    },
  });

  const blueprintParameters = parse(
    blueprints.find((blueprint) => blueprint.node.id === values.blueprintId)?.node.template ?? {},
  ).parameters.map(({ key }) => key);

  const isBlueprintValuesValid =
    Object.keys(blueprintParameterValues).length === blueprintParameters.length &&
    Object.values(blueprintParameterValues).every((value) => value !== '');

  const parsedStreamParameters = jsonParse(values.streamParameters);
  const isStreamParametersValid = parsedStreamParameters != null && typeof parsedStreamParameters === 'string';

  const deviceItems = devices.map((d) => ({
    label: d.node.name,
    value: d.node.name,
  }));

  const selectedDeviceItem = {
    label: values.deviceName,
    value: values.deviceName,
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="deviceName" my={6} isRequired isInvalid={errors.deviceName != null}>
        <FormLabel>Device Name</FormLabel>
        <Autocomplete
          items={deviceItems}
          selectedItem={selectedDeviceItem}
          onChange={(item) => setFieldValue('deviceName', item?.value)}
        />
        <FormErrorMessage>{errors.deviceName}</FormErrorMessage>
      </FormControl>

      <FormControl id="streamName" my={6} isRequired isInvalid={errors.streamName != null}>
        <FormLabel>Stream Name</FormLabel>
        <Input
          data-cy="add-stream-name"
          placeholder=""
          onChange={handleChange}
          name="streamName"
          value={values.streamName}
        />
        <FormErrorMessage>{errors.streamName}</FormErrorMessage>
      </FormControl>

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
          <FormLabel data-cy="ace-editor">Stream parameters</FormLabel>
          <Editor
            key="streamName"
            height="450px"
            width="100%"
            language="json"
            onChange={(value) => {
              setFieldValue('streamParameters', value);
            }}
            value=""
          />
        </FormControl>
      )}

      <Divider my={6} />
      <HStack mb={6}>
        <Spacer />
        <Button
          data-cy="add-stream-button"
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!isValid}
        >
          Add stream
        </Button>
      </HStack>
    </form>
  );
};

export default CreateStreamForm;
