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
  callbackUtils,
  ScheduledWorkflow,
  ScheduleWorkflowInput,
  parseInputParameters,
  getDynamicInputParametersFromWorkflow,
  ClientWorkflow,
  getInitialValuesFromParsedInputParameters,
} from '@frinx/shared/src';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useFetch } from '@frinx/shared/src/hooks/use-fetch';
import ExecuteWorkflowModalFormInput from '@frinx/shared/src/components/execute-workflow-modal/execute-workflow-modal-form-input';
import { throttle } from 'lodash';
import FeatherIcon from 'feather-icons-react';

const DEFAULT_CRON_STRING = '* * * * *';
const CRON_REGEX = /^(\*|[0-5]?\d)(\s(\*|[01]?\d|2[0-3])){2}(\s(\*|[1-9]|[12]\d|3[01])){2}$/;

type Props = {
  scheduledWorkflow?: ScheduledWorkflow;
  workflow: ClientWorkflow;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: Partial<ScheduledWorkflow>) => void;
};

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

const ScheduleWorkflowModal: FC<Props> = ({ scheduledWorkflow, workflow, isOpen, onClose, onSubmit }) => {
  const { getSchedules } = callbackUtils.getCallbacks;

  const parsedInputParameters = parseInputParameters(workflow.inputParameters);
  const dynamicInputParameters = getDynamicInputParametersFromWorkflow(workflow);

  const [shouldShowInputParams, { toggle: toggleShouldShowInputParams }] = useBoolean(false);

  const { data: scheduledWorkflows, loading: isLoadingScheduledWorkflows } = useFetch(() => getSchedules());

  const { values, errors, handleChange, submitForm, setFieldValue, setFieldError, resetForm } =
    useFormik<ScheduleWorkflowInput>({
      enableReinitialize: true,
      validationSchema,
      validateOnMount: false,
      initialValues: {
        workflowName: scheduledWorkflow?.workflowName ?? workflow.name,
        workflowVersion: scheduledWorkflow?.workflowVersion ?? workflow.version?.toString() ?? '',
        workflowContext:
          scheduledWorkflow?.workflowContext ??
          getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
        name: '',
        cronString: scheduledWorkflow?.cronString || DEFAULT_CRON_STRING,
        enabled: scheduledWorkflow?.enabled ?? false,
      },
      onSubmit: (formValues) => {
        const formattedValues = {
          ...formValues,
          ...(formValues.fromDate && { fromDate: moment(formValues.fromDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ') }),
          ...(formValues.toDate && { toDate: moment(formValues.toDate).format('yyyy-MM-DDTHH:mm:ss.SSSZ') }),
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

  const handleUniquenessOfName = throttle((name: string) => {
    const isNameUnique = !scheduledWorkflows?.some((wf) => wf.name === name);

    if (!isNameUnique) {
      setFieldError('name', 'Schedule name must be unique');
    }
  }, 500);

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
                handleUniquenessOfName(e.target.value);
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
                      onChange={setFieldValue}
                      values={values}
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
