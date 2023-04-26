import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { isWorkflowNameAvailable, SearchByTagInput, useTagsInput, ClientWorkflow } from '@frinx/shared/src';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ExtendedTask } from '@frinx/shared';

type Props = {
  workflow: ClientWorkflow<ExtendedTask>;
  canEditName: boolean;
  workflows: ClientWorkflow[];
  isCreatingWorkflow: boolean;
  onClose?: () => void;
  onSubmit: (workflow: ClientWorkflow<ExtendedTask>) => void;
  onChangeNotify?: () => void;
};

type FormValues = ClientWorkflow & { labels?: string[] };

const getInitialValues = (initialWorkflow: ClientWorkflow): FormValues => {
  const { description, labels } = JSON.parse(initialWorkflow.description || '{}');
  let initialValues = initialWorkflow;

  if (description != null) {
    initialValues = {
      ...initialValues,
      description,
    };
  }

  if (labels != null) {
    initialValues = {
      ...initialValues,
      labels,
    };
  }

  return initialValues;
};

const validationSchema = (isCreatingWorkflow: boolean) =>
  yup.object({
    name: yup.string().required('Name is required field and must be unique'),
    description: yup.string(),
    labels: yup.array().of(yup.string()),
    version: yup.number().typeError('This field must be a number').required('Version is required field'),
    restartable: yup.boolean().typeError('Restartable must be true or false'),
    ...(!isCreatingWorkflow && {
      timeoutPolicy: yup.string().required('Timeout policy is required'),
      timeoutSeconds: yup
        .number()
        .typeError('This field must be a number')
        .required('Timeout seconds is required field'),
    }),
  });

const WorkflowForm: FC<Props> = ({
  workflow,
  onSubmit, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClose,
  workflows,
  canEditName,
  isCreatingWorkflow,
  onChangeNotify,
}) => {
  const { errors, values, handleSubmit, setFieldValue, handleChange } = useFormik<FormValues>({
    initialValues: getInitialValues(workflow),
    onSubmit: (formValues) => {
      const editedWorkflow: ClientWorkflow<ExtendedTask> = {
        ...workflow,
        name: formValues.name,
        description: JSON.stringify({
          description: formValues.description,
          labels: formValues.labels,
        }),
        version: formValues.version,
        restartable: formValues.restartable,
        outputParameters: formValues.outputParameters,
      };
      onSubmit(editedWorkflow);
    },
    validationSchema: validationSchema(isCreatingWorkflow),
    validateOnBlur: true,
  });
  const [newParam, setNewParam] = useState<string>('');

  const handleOnChangeNotify = () => {
    if (onChangeNotify) {
      onChangeNotify();
    }
  };

  const tagsInput = useTagsInput();

  useEffect(() => {
    setFieldValue('labels', tagsInput.selectedTags);
  }, [tagsInput.selectedTags, setFieldValue]);

  const handleOnChange = (e: React.ChangeEvent) => {
    handleChange(e);
    handleOnChangeNotify();
  };

  const isNameInvalid = canEditName ? !isWorkflowNameAvailable(workflows, values.name) : false;
  const outputParameters = values.outputParameters ?? [];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(event);
      }}
    >
      <FormControl my={6} isInvalid={isNameInvalid || errors.name != null} isRequired>
        <FormLabel>Name</FormLabel>
        <Input isDisabled={!canEditName} value={values.name} name="name" onChange={handleOnChange} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl id="description" my={6}>
        <FormLabel>Description</FormLabel>
        <Textarea name="description" value={values.description || ''} onChange={handleOnChange} />
      </FormControl>
      <FormControl my={6}>
        <SearchByTagInput
          tagText="Label"
          data-cy="create-pool-tags"
          selectedTags={tagsInput.selectedTags}
          onTagCreate={(value) => {
            tagsInput.handleTagCreation(value);
          }}
          onSelectionChange={tagsInput.handleOnSelectionChange}
        />
      </FormControl>
      <FormControl id="version" my={6} isRequired isInvalid={errors.version != null}>
        <FormLabel>Version</FormLabel>
        <Input name="version" value={String(values.version)} onChange={handleOnChange} />
        <FormErrorMessage>{errors.version}</FormErrorMessage>
      </FormControl>
      {!isCreatingWorkflow && (
        <HStack spacing={2} my={6} alignItems="start">
          <FormControl id="timeoutPolicy" isRequired isInvalid={errors.timeoutPolicy != null}>
            <FormLabel>Timeout policy</FormLabel>
            <Select name="timeoutPolicy" value={values.timeoutPolicy ?? undefined} onChange={handleOnChange}>
              <option value="TIME_OUT_WF">TIME_OUT_WF</option>
              <option value="ALERT_ONLY">ALERT_ONLY</option>
            </Select>
            <FormErrorMessage>{errors.timeoutPolicy}</FormErrorMessage>
          </FormControl>
          <FormControl id="timeoutSeconds" isRequired isInvalid={errors.timeoutSeconds != null}>
            <FormLabel>Timeout seconds</FormLabel>
            <Input name="timeoutSeconds" value={values.timeoutSeconds} onChange={handleOnChange} />
            <FormErrorMessage>{errors.timeoutSeconds}</FormErrorMessage>
          </FormControl>
        </HStack>
      )}
      <FormControl my={6} isInvalid={errors.restartable != null}>
        <Flex alignItems="center">
          <Checkbox
            name="restartable"
            isChecked={values.restartable === null ? undefined : values.restartable}
            onChange={handleOnChange}
            id="restartable"
          />
          <FormLabel htmlFor="restartable" mb={0} ml={2}>
            Restartable
          </FormLabel>
        </Flex>
        <FormErrorMessage>{errors.restartable}</FormErrorMessage>
      </FormControl>
      <Heading as="h3" size="md">
        Output parameters
      </Heading>
      <Box width="50%">
        <FormControl my={2}>
          <FormLabel>Add new param</FormLabel>
          <HStack spacing={2}>
            <Input
              size="sm"
              type="text"
              borderRadius={6}
              value={newParam}
              onChange={(event) => {
                event.persist();
                setNewParam(event.target.value);
                handleOnChangeNotify();
              }}
            />
            <IconButton
              size="sm"
              isDisabled={newParam === ''}
              aria-label="add param"
              colorScheme="blue"
              icon={<Icon as={FeatherIcon} icon="plus" size={20} />}
              onClick={() => {
                const newParams = [...outputParameters, { key: newParam, value: newParam }];
                setFieldValue('outputParameters', newParams);
                setNewParam('');
                handleOnChangeNotify();
              }}
            />
          </HStack>
        </FormControl>
      </Box>
      <Box width="50%">
        {outputParameters.map((param) => (
          <FormControl id="param" my={2} key={param.key}>
            <FormLabel>{param.key}</FormLabel>
            <HStack spacing={2}>
              <Input
                name="param"
                variant="filled"
                value={param.value}
                onChange={(event) => {
                  const newParams = outputParameters.map((p) => {
                    if (p.key === param.key) {
                      return { ...p, value: event.target.value };
                    }
                    return p;
                  });
                  setFieldValue('outputParameters', newParams);
                  handleOnChangeNotify();
                }}
              />
              <IconButton
                aria-label="remove param"
                colorScheme="red"
                icon={<Icon as={FeatherIcon} icon="trash-2" size={20} />}
                onClick={() => {
                  const newParams = outputParameters.filter((p) => p.key !== param.key);
                  setFieldValue('outputParameters', newParams);
                  handleOnChangeNotify();
                }}
              />
            </HStack>
          </FormControl>
        ))}
      </Box>
      <Divider my={6} />
      <HStack spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={isNameInvalid && values.name.trim().length === 0}>
          Save changes
        </Button>
        {onClose && <Button onClick={onClose}>Cancel</Button>}
      </HStack>
    </form>
  );
};

export default WorkflowForm;
