import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Select,
  Spacer,
  Switch,
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared';
import EventHandlerFormActions from './event-handler-form-actions';
import { ActionTask, StartWorkflow } from '../../types/event-listeners.types';
import { hasObjectUniqueKeys, isOfEntriesType } from '../../helpers/event-handlers.helpers';

export type EventHandlerAction = {
  id: string;
  action?: 'start_workflow' | 'complete_task' | 'fail_task' | null;
  startWorkflow?: StartWorkflow | null;
  completeTask?: ActionTask | null;
  failTask?: ActionTask | null;
  expandInlineJSON?: boolean | null;
};

export type FormValues = {
  name: string;
  event: string;
  actions: EventHandlerAction[];
  condition?: string | null;
  isActive?: boolean | null;
  evaluatorType?: string | null;
};

type Props = {
  isEditing?: boolean | null;
  formValues: FormValues;
  onSubmit: (values: FormValues) => void;
};

const objectUniqueKeysValidationSchema = yup
  .array()
  .of(yup.array().min(2, 'Key and value are required').max(2, 'Key and value are required'))
  .test('unique-keys', 'Keys must be unique', (value) => {
    if (value == null || value.length === 0) {
      return true;
    }

    if (isOfEntriesType<[string, string | number][]>(value)) {
      return hasObjectUniqueKeys(value);
    }

    return true;
  })
  .nullable();

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  event: yup.string().required('Event is required'),
  actions: yup
    .array()
    .of(
      yup.object().shape({
        action: yup.string(),
        startWorkflow: yup
          .object()
          .shape({
            name: yup.string().nullable(),
            version: yup.number().nullable(),
            input: objectUniqueKeysValidationSchema,
            correlationId: yup.string().nullable(),
            taskToDomain: objectUniqueKeysValidationSchema,
          })
          .nullable(),
        completeTask: yup
          .object()
          .shape({
            workflowId: yup.string().nullable(),
            taskId: yup.string().nullable(),
            output: objectUniqueKeysValidationSchema,
            taskRefName: yup.string().nullable(),
          })
          .nullable(),
        failTask: yup
          .object()
          .shape({
            workflowId: yup.string().nullable(),
            taskId: yup.string().nullable(),
            output: objectUniqueKeysValidationSchema,
            taskRefName: yup.string().nullable(),
          })
          .nullable(),
        expandInlineJSON: yup.boolean().nullable(),
      }),
    )
    .min(1, 'At least one action is required'),
  condition: yup.string().nullable(),
  isActive: yup.boolean().nullable(),
  evaluatorType: yup.string().nullable(),
});

const EventHandlerForm: VoidFunctionComponent<Props> = ({ isEditing, formValues, onSubmit }) => {
  const [selectedAction, setSelectedAction] = React.useState<string>('');
  const [selectedConditionLanguage, setSelectedConditionLanguage] = React.useState<'javascript' | 'python'>(
    'javascript',
  );
  const { values, errors, handleChange, handleSubmit, handleReset, isSubmitting, isValid, setFieldValue } =
    useFormik<FormValues>({
      validateOnChange: false,
      validateOnBlur: false,
      initialValues: formValues,
      validationSchema,
      onSubmit,
    });

  const handleOnConditionLangSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'javascript') {
      setSelectedConditionLanguage('javascript');
      return;
    }

    setSelectedConditionLanguage('python');
  };

  const handleOnActionAdd = () => {
    const newAction: EventHandlerAction = {
      id: Math.random().toString(36).substring(7),
      action: selectedAction as 'start_workflow' | 'complete_task' | 'fail_task',
      expandInlineJSON: false,
    };

    const startWorkflow: StartWorkflow = {
      name: '',
      version: 0,
      input: [['', '']],
      correlationId: '',
      taskToDomain: [['', '']],
    };

    const task: ActionTask = {
      workflowId: '',
      taskId: '',
      output: [['', '']],
      taskRefName: '',
    };

    if (selectedAction === 'start_workflow') {
      newAction.startWorkflow = startWorkflow;
    }

    if (selectedAction === 'complete_task') {
      newAction.completeTask = task;
    }

    if (selectedAction === 'fail_task') {
      newAction.failTask = task;
    }

    setSelectedAction('');
    setFieldValue('actions', [...values.actions, newAction]);
  };

  console.log(errors);

  return (
    <Card p={10} mb={5}>
      <form onSubmit={handleSubmit}>
        <HStack mb={5}>
          <FormControl isRequired isInvalid={errors.name != null}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              placeholder="start_workflow_when_device_up"
              name="name"
              onChange={handleChange}
              value={values.name}
              readOnly={isEditing ?? false}
            />
            <FormErrorMessage>Name is required</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={errors.event != null}>
            <FormLabel>Event</FormLabel>
            <Input
              name="event"
              placeholder="device_up"
              onChange={handleChange}
              value={values.event}
              readOnly={isEditing ?? false}
            />
            <FormErrorMessage>Event is required</FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack>
          <FormControl isInvalid={errors.evaluatorType != null}>
            <FormLabel>Event</FormLabel>
            <Input
              name="evaluatorType"
              placeholder="default"
              onChange={handleChange}
              value={values.evaluatorType ?? ''}
            />
            <FormErrorMessage>Evaluator type has incorrect value</FormErrorMessage>
          </FormControl>

          <FormControl mb={5} isInvalid={errors.isActive != null}>
            <FormLabel>Active</FormLabel>
            <Switch isChecked={values.isActive ?? false} onChange={handleChange} name="isActive" />
          </FormControl>
        </HStack>

        <FormControl mb={5}>
          <HStack mb={3} alignItems="end">
            <FormLabel mb={0}>Condition</FormLabel>
            <Spacer />
            <Select value={selectedConditionLanguage} onChange={handleOnConditionLangSelect} maxWidth="xs">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </Select>
          </HStack>
          <Editor
            name="condition"
            mode={selectedConditionLanguage}
            value={values.condition ?? ''}
            onChange={(value) => {
              setFieldValue('condition', value);
            }}
          />
          <FormHelperText>Function must return true or false</FormHelperText>
          <FormErrorMessage>Condition is required</FormErrorMessage>
        </FormControl>

        <FormControl mb={5} isInvalid={errors.actions != null && values.actions.length === 0}>
          <FormLabel>Actions</FormLabel>
          <HStack mb={3}>
            <Select value={selectedAction ?? ''} onChange={(e) => setSelectedAction(e.target.value)}>
              <option value="">Select action</option>
              <option value="start_workflow">Start workflow</option>
              <option value="complete_task">Complete task</option>
              <option value="fail_task">Fail task</option>
            </Select>

            <Spacer />

            <Button isDisabled={selectedAction.length === 0} type="button" onClick={handleOnActionAdd}>
              Add action
            </Button>
          </HStack>
          <EventHandlerFormActions
            values={values.actions}
            onChange={(actions) => setFieldValue('actions', actions)}
            onActionRemove={(index) => {
              setFieldValue('actions', [...values.actions].splice(index, 0));
            }}
          />
          {values.actions.length === 0 && <FormErrorMessage>At least one action is required</FormErrorMessage>}
        </FormControl>

        <HStack>
          <Spacer />

          <ButtonGroup>
            <Button type="button" colorScheme="gray" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting} disabled={!isValid}>
              {isEditing ? 'Update handler' : 'Create handler'}
            </Button>
          </ButtonGroup>
        </HStack>
      </form>
    </Card>
  );
};

export default EventHandlerForm;
