import React, { FC, useRef } from 'react';
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
  getInitialValuesFromParsedInputParameters,
  ExecuteWorkflowModalFormInput,
  ClientWorkflowWithTasks,
} from '@frinx/shared';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import FeatherIcon from 'feather-icons-react';
import { gql, useQuery } from 'urql';
import { CreateScheduleInput, GetSchedulesQuery, GetSchedulesQueryVariables } from '../../__generated__/graphql';

const SCHEDULED_WORKFLOWS_QUERY = gql`
  query GetSchedules {
    scheduler {
      schedules {
        edges {
          node {
            name
          }
        }
      }
    }
  }
`;

const DEFAULT_CRON_STRING = '* * * * *';
const CRON_REGEX =
  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;

function getCrontabGuruUrl(cronString: string = DEFAULT_CRON_STRING) {
  return `https://crontab.guru/#${cronString.replace(/\s/g, '_')}`;
}
function createValidationSchema(schedules: GetSchedulesQuery['scheduler']['schedules']) {
  return Yup.object().shape({
    workflowName: Yup.string().required('Workflow name is required'),
    workflowVersion: Yup.number().required('Workflow version is required'),
    name: Yup.string()
      .required('Schedule name is required')
      .test({
        name: 'name',
        message: 'Schedule name must be unique',
        test: (value) => {
          const scheduleNames = schedules?.edges.map((edge) => {
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
}

type Props = {
  workflow: ClientWorkflowWithTasks;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: CreateScheduleInput) => void;
};

type ClientSchedule = Omit<CreateScheduleInput, 'workflowContext'> & {
  workflowContext: Record<string, string>;
};

const ScheduleWorkflowModal: FC<Props> = ({ workflow, isOpen, onClose, onSubmit }) => {
  const [{ data: scheduledWorkflows, fetching: isLoadingScheduledWorkflows }] = useQuery<
    GetSchedulesQuery,
    GetSchedulesQueryVariables
  >({
    query: SCHEDULED_WORKFLOWS_QUERY,
  });

  const { current: validationSchema } = useRef(createValidationSchema(scheduledWorkflows?.scheduler.schedules ?? null));

  const parsedInputParameters = parseInputParameters(workflow.inputParameters);
  const dynamicInputParameters = getDynamicInputParametersFromWorkflow(workflow);

  const [shouldShowInputParams, { toggle: toggleShouldShowInputParams }] = useBoolean(false);

  const { values, errors, handleChange, submitForm, setFieldValue, resetForm } = useFormik<ClientSchedule>({
    enableReinitialize: true,
    validationSchema,
    validateOnMount: false,
    initialValues: {
      workflowName: workflow.name,
      workflowVersion: workflow.version?.toString() ?? '',
      workflowContext: getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
      name: '',
      cronString: DEFAULT_CRON_STRING,
      enabled: false,
      fromDate: undefined,
      toDate: undefined,
    },
    onSubmit: (formValues) => {
      const formattedValues: CreateScheduleInput = {
        ...formValues,
        workflowContext: JSON.stringify(formValues.workflowContext),
        cronString: formValues.cronString || DEFAULT_CRON_STRING,
        ...(formValues.fromDate && {
          fromDate: moment(formValues.fromDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ'),
        }),
        ...(formValues.toDate && {
          toDate: moment(formValues.toDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ'),
        }),
      };

      onSubmit(formattedValues);
      onClose();
    },
  });

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
            <FormControl isInvalid={errors.fromDate != null}>
              <FormLabel>From</FormLabel>
              <Input
                value={values.fromDate}
                onChange={handleChange}
                name="fromDate"
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
              <Checkbox onChange={handleChange} name="enabled" isChecked={values.enabled ?? false}>
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
              <FormHelperText>
                Verify using <Link href={getCrontabGuruUrl(values.cronString)}>crontab.guru</Link>
              </FormHelperText>
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
                      onChange={(key, value) =>
                        setFieldValue(`workflowContext`, {
                          ...values.workflowContext,
                          [key]: value,
                        })
                      }
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
