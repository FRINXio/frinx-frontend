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
  Progress,
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
} from 'packages/shared/src';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import ExecuteWorkflowModalFormInput from 'packages/shared/src/components/execute-workflow-modal/execute-workflow-modal-form-input';
import FeatherIcon from 'feather-icons-react';
import { gql, useQuery } from 'urql';
import { SchedulesQuery, SchedulesQueryVariables } from '../../__generated__/graphql';

const SCHEDULED_WORKFLOWS_QUERY = gql`
  query GetSchedules {
    schedules {
      edges {
        node {
          name
        }
      }
    }
  }
`;

const DEFAULT_CRON_STRING = '* * * * *';
const CRON_REGEX = /^(\*|[0-5]?\d)(\s(\*|[01]?\d|2[0-3])){2}(\s(\*|[1-9]|[12]\d|3[01])){2}$/;

type Props = {
  workflow: ClientWorkflow;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: CreateScheduledWorkflow) => void;
};

const ScheduleWorkflowModal: FC<Props> = ({ workflow, isOpen, onClose, onSubmit }) => {
  const [{ data: scheduledWorkflows, fetching: isLoadingScheduledWorkflows }] = useQuery<
    SchedulesQuery,
    SchedulesQueryVariables
  >({
    query: SCHEDULED_WORKFLOWS_QUERY,
  });

  const validationSchema = Yup.object().shape({
    workflowName: Yup.string().required('Workflow name is required'),
    workflowVersion: Yup.number().required('Workflow version is required'),
    name: Yup.string()
      .required('Schedule name is required')
      .test({
        name: 'name',
        message: 'Schedule name must be unique',
        test: (value) => {
          const scheduleNames = scheduledWorkflows?.schedules.edges.map((edge) => {
            return edge?.node.name;
          });
          const isNameUnique = !scheduleNames?.some((wfName) => wfName === value);
          if (!isNameUnique) {
            return false;
          }
          return true;
        },
      }),
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
      workflowName: workflow.name,
      workflowVersion: workflow.version?.toString() ?? '',
      workflowContext: getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
      name: '',
      cronString: DEFAULT_CRON_STRING,
      isEnabled: false,
      performFromDate: undefined,
      performTillDate: undefined,
    },
    onSubmit: (formValues) => {
      const formattedValues = {
        ...formValues,
        cronString: formValues.cronString || DEFAULT_CRON_STRING,
        ...(formValues.performFromDate && {
          performFromDate: moment(formValues.performFromDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ'),
        }),
        ...(formValues.performTillDate && {
          performTillDate: moment(formValues.performTillDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ'),
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

  if (isLoadingScheduledWorkflows) {
    return <Progress size="xs" isIndeterminate />;
  }

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
            <FormControl isInvalid={errors.performFromDate != null}>
              <FormLabel>From</FormLabel>
              <Input
                value={values.performFromDate}
                onChange={handleChange}
                name="performFromDate"
                placeholder="Enter from date"
                type="datetime-local"
              />
              <FormErrorMessage>{errors.performFromDate}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.performTillDate != null}>
              <FormLabel>To</FormLabel>
              <Input
                value={values.performTillDate}
                onChange={handleChange}
                name="performTillDate"
                placeholder="Enter to date"
                type="datetime-local"
              />
              <FormErrorMessage>{errors.performTillDate}</FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack my={5} alignItems="flex-start">
            <FormControl isInvalid={errors.isEnabled != null} isRequired>
              <FormLabel>Enabled</FormLabel>
              <Checkbox onChange={handleChange} name="isEnabled" isChecked={values.isEnabled}>
                Enabled
              </Checkbox>
              <FormErrorMessage>{errors.isEnabled}</FormErrorMessage>
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