import React, { FC } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import {
  parseInputParameters,
  getDynamicInputParametersFromWorkflow,
  ClientWorkflow,
  getInitialValuesFromParsedInputParameters,
  CreateScheduledWorkflow,
  ExecuteWorkflowModalFormInput,
} from '@frinx/shared';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import FeatherIcon from 'feather-icons-react';

const DEFAULT_CRON_STRING = '* * * * *';
const CRON_REGEX = /^(\*|[0-5]?\d)(\s(\*|[01]?\d|2[0-3])){2}(\s(\*|[1-9]|[12]\d|3[01])){2}$/;

type Props = {
  scheduledWorkflow: CreateScheduledWorkflow;
  workflow: Omit<ClientWorkflow, 'outputParameters' | 'tasks'>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: CreateScheduledWorkflow) => void;
};

const resetDateFormat = (dateTime: string | undefined): string => {
  return moment(dateTime).format('yyyy-MM-DDTHH:mm');
};

const ScheduleWorkflowModal: FC<Props> = ({ scheduledWorkflow, workflow, isOpen, onClose, onSubmit }) => {
  const validationSchema = Yup.object().shape({
    workflowName: Yup.string().required('Workflow name is required'),
    workflowVersion: Yup.number().required('Workflow version is required'),
    name: Yup.string().required('Schedule name is required'),
    cronString: Yup.string()
      .required('Cron expression is required')
      .test({
        name: 'cronString',
        message: 'Cron expression is invalid',
        test: (value) => {
          if (!value) {
            return true;
          } else {
            return CRON_REGEX.test(value);
          }
        },
      }),
    enabled: Yup.boolean(),
    workflowContext: Yup.object(),
    fromDate: Yup.string(),
    toDate: Yup.string(),
  });

  const parsedInputParameters = parseInputParameters(workflow.inputParameters);
  const dynamicInputParameters = getDynamicInputParametersFromWorkflow(workflow);

  const [shouldShowInputParams, { toggle: toggleShouldShowInputParams }] = useBoolean(false);

  const { values, errors, handleChange, submitForm, setFieldValue, resetForm } = useFormik<CreateScheduledWorkflow>({
    enableReinitialize: true,
    validationSchema,
    validateOnMount: false,
    initialValues: {
      workflowName: scheduledWorkflow?.workflowName ?? workflow.name,
      workflowVersion: scheduledWorkflow?.workflowVersion ?? workflow.version?.toString() ?? '',
      workflowContext: scheduledWorkflow?.workflowContext
        ? scheduledWorkflow.workflowContext
        : getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
      name: scheduledWorkflow?.name || '',
      cronString: scheduledWorkflow?.cronString || DEFAULT_CRON_STRING,
      enabled: scheduledWorkflow?.enabled ?? false,
      fromDate: scheduledWorkflow?.fromDate && resetDateFormat(scheduledWorkflow?.fromDate),
      toDate: scheduledWorkflow?.fromDate && resetDateFormat(scheduledWorkflow?.toDate),
    },
    onSubmit: (formValues) => {
      const formattedValues = {
        ...formValues,
        cronString: formValues.cronString || DEFAULT_CRON_STRING,
        ...(formValues.fromDate && {
          performFromDate: moment(formValues.fromDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ'),
        }),
        ...(formValues.toDate && {
          toDate: moment(formValues.toDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ'),
        }),
        ...(formValues.workflowContext && {
          workflowContext: formValues.workflowContext,
        }),
      };

      onSubmit(formattedValues);
      onClose();
    },
  });

  const getCrontabGuruUrl = () => {
    const cronString = values.cronString || DEFAULT_CRON_STRING;
    const url = `https://crontab.guru/#${cronString.replace(/\s/g, '_')}`;
    return (
      <Link href={url} color="blue.500">
        crontab.guru
      </Link>
    );
  };

  const inputParametersKeys = Object.keys(values.workflowContext);

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Schedule Details - {values.workflowName}:{values.workflowVersion}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errors.name != null} isRequired>
            <FormLabel>Schedule name</FormLabel>
            <Input
              disabled={scheduledWorkflow?.name.length !== undefined}
              value={values.name}
              onChange={(e) => {
                handleChange(e);
              }}
              name="name"
              placeholder="Enter name for scheduled workflow"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <HStack my={5}>
            <FormControl isInvalid={errors.fromDate != null}>
              <FormLabel>From</FormLabel>
              <Input
                value={values.fromDate}
                onChange={handleChange}
                name="performFromDate"
                placeholder="Enter from date"
                type="datetime-local"
              />
              <FormErrorMessage>{errors.fromDate}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.toDate != null}>
              <FormLabel>To</FormLabel>
              <Input
                value={values.toDate}
                onChange={handleChange}
                name="toDate"
                placeholder="Enter to date"
                type="datetime-local"
              />
              <FormErrorMessage>{errors.toDate}</FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack my={5} alignItems="flex-start">
            <FormControl isInvalid={errors.enabled != null} isRequired>
              <FormLabel>Enabled</FormLabel>
              <Checkbox onChange={handleChange} name="enabled" isChecked={values.enabled}>
                Enabled
              </Checkbox>
              <FormErrorMessage>{errors.enabled}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.cronString != null} isRequired>
              <FormLabel>Cron Expression</FormLabel>
              <Input
                value={values.cronString}
                onChange={handleChange}
                name="cronString"
                placeholder="Enter cron expression"
              />
              <FormHelperText>Verify using {getCrontabGuruUrl()}</FormHelperText>
              <FormErrorMessage>{errors.cronString}</FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack
            my={5}
            px={5}
            py={3}
            onClick={toggleShouldShowInputParams}
            border="gray"
            rounded="lg"
            bgColor="gray.50"
            cursor="pointer"
          >
            <Text>Show input parameters</Text>
            <Spacer />
            <Icon as={FeatherIcon} size={40} icon={shouldShowInputParams ? 'chevron-up' : 'chevron-down'} />
          </HStack>
          <Box hidden={!shouldShowInputParams}>
            {inputParametersKeys == null || inputParametersKeys.length === 0 ? (
              <Text>To successfully execute this workflow there are not provided any input parameters</Text>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                {inputParametersKeys.map((inputParameterKey) => (
                  <GridItem key={inputParameterKey}>
                    <ExecuteWorkflowModalFormInput
                      inputParameterKey={inputParameterKey}
                      onChange={(key, value) => setFieldValue(`workflowContext.${key}`, value)}
                      values={values.workflowContext}
                      parsedInputParameters={parsedInputParameters}
                    />
                  </GridItem>
                ))}
              </Grid>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Close
            </Button>
            <Button colorScheme="blue" onClick={submitForm}>
              Schedule workflow
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleWorkflowModal;
