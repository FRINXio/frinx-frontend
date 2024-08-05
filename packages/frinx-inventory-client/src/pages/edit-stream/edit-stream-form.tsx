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
import { StreamQuery } from '../../__generated__/graphql';

type Props = {
  isSubmitting: boolean;
  editedStream: FormValues;
  devices: StreamQuery['deviceInventory']['devices']['edges'];
  streams: StreamQuery['deviceInventory']['streams']['edges'];
  blueprints: StreamQuery['deviceInventory']['blueprints']['edges'];
  onUpdate: (stream: FormValues) => void;
  onCancel: () => void;
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

function getStreamSchema(streamSet: StreamSet, initialValues: FormValues) {
  return yup.object({
    deviceName: yup.string().required('Please enter name of device'),
    streamName: yup
      .string()
      .required('Please enter name of stream')
      .test('duplicateStream', 'Stream name is duplicate for selected device', (value, context) => {
        const { streamName } = initialValues;
        return streamName === value || !streamSet.has(getStreamFullName(context.parent.deviceName, value ?? ''));
      }),
    blueprintId: yup.string().nullable(),
    streamParameters: yup.string(),
  });
}

const EditStreamForm: VoidFunctionComponent<Props> = ({
  editedStream,
  devices,
  streams,
  blueprints,
  isSubmitting,
  onUpdate,
  onCancel,
}) => {
  const [blueprintParameterValues, setBlueprintParameterValues] = useState<Record<string, string>>({});
  const [isUsingBlueprints, setIsUsingBlueprints] = useState(false);
  const { errors, values, isValid, handleSubmit, handleChange, setFieldValue } = useFormik<FormValues>({
    initialValues: editedStream,
    validationSchema: getStreamSchema(
      new Set(streams.map((s) => getStreamFullName(s.node.deviceName, s.node.streamName))),
      editedStream,
    ),
    onSubmit: (data) => {
      const blueprintParameters = parse(
        blueprints.find((blueprint) => blueprint.node.id === values.blueprintId)?.node.template ?? {},
      );

      // TODO: we parse it and stringify later to remove all escape characters
      // so it is always saved as json object in prisma
      // we should find better solution
      const createStreamParamerers = isUsingBlueprints
        ? JSON.parse(blueprintParameters(blueprintParameterValues))
        : JSON.parse(data.streamParameters ?? '{}');

      onUpdate({
        ...data,
        streamParameters: JSON.stringify(createStreamParamerers),
      });
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
              <GridItem key={key}>
                <FormControl marginY={6} isRequired>
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
            value={isStreamParametersValid ? parsedStreamParameters : (values.streamParameters ?? '')}
          />
        </FormControl>
      )}

      <Divider my={6} />
      <FormControl mb={6}>
        <HStack>
          <Spacer />
          <Button data-cy="stream-edit-cancel" onClick={onCancel} colorScheme="gray" ml={3}>
            Cancel
          </Button>
          <Button
            data-cy="stream-edit-save"
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            isDisabled={!isValid || !isBlueprintValuesValid}
          >
            Save changes
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default EditStreamForm;
