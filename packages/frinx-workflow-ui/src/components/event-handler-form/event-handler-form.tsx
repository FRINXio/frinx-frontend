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
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared';
import EventHandlerFormActions from './event-handler-form-actions';

export type StartWorkflow = {
  name?: string | null;
  version?: number | null;
  input?: string | null;
  correlationId?: string | null;
  taskToDomain?: string | null;
};

export type ActionTask = {
  workflowId?: string | null;
  taskId?: string | null;
  output?: string | null;
  taskRefName?: string | null;
};

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

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  event: yup.string().required('Event is required'),
  actions: yup
    .array()
    .of(
      yup.object().shape({
        action: yup.string(),
        startWorkflow: yup.object().shape({
          name: yup.string(),
          version: yup.number(),
          input: yup.string(),
          correlationId: yup.string(),
          taskToDomain: yup.string(),
        }),
        completeTask: yup.object().shape({
          workflowId: yup.string(),
          taskId: yup.string(),
          output: yup.string(),
          taskRefName: yup.string(),
        }),
        failTask: yup.object().shape({
          workflowId: yup.string(),
          taskId: yup.string(),
          output: yup.string(),
          taskRefName: yup.string(),
        }),
        expandInlineJSON: yup.boolean(),
      }),
    )
    .min(1, 'At least one action is required'),
  condition: yup.string(),
  isActive: yup.boolean(),
  evaluatorType: yup.string(),
});

const EventHandlerForm: VoidFunctionComponent<Props> = ({ isEditing, formValues, onSubmit }) => {
  const [selectedAction, setSelectedAction] = React.useState<string>('');
  const [selectedConditionLanguage, setSelectedConditionLanguage] = React.useState<'javascript' | 'python'>(
    'javascript',
  );
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleReset,
    isSubmitting,
    isValid,
    initialValues,
    setFieldValue,
  } = useFormik<FormValues>({
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
      input: '{}',
      correlationId: '',
      taskToDomain: '{}',
    };

    const task: ActionTask = {
      workflowId: '',
      taskId: '',
      output: '{}',
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
              defaultValue={initialValues.name}
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
              defaultValue={initialValues.event}
              readOnly={isEditing ?? false}
            />
            <FormErrorMessage>Event is required</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl mb={5}>
          <HStack mb={3}>
            <FormLabel>Condition</FormLabel>
            <Spacer />
            <Select
              defaultValue={selectedConditionLanguage}
              value={selectedConditionLanguage}
              onChange={handleOnConditionLangSelect}
              maxWidth="xs"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </Select>
          </HStack>
          <Editor
            mode={selectedConditionLanguage}
            value={values.condition ?? ''}
            defaultValue={initialValues.condition ?? undefined}
            onChange={handleChange}
          />
          <FormHelperText>Function must return true or false</FormHelperText>
          <FormErrorMessage>Condition is required</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.actions != null} mb={5}>
          <FormLabel>Actions</FormLabel>
          <HStack mb={3}>
            <Select value={selectedAction ?? undefined} onChange={(e) => setSelectedAction(e.target.value)}>
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
              setFieldValue(
                'actions',
                values.actions.filter((_, i) => i !== index),
              );
            }}
          />
          <FormErrorMessage>Actions are required</FormErrorMessage>
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
