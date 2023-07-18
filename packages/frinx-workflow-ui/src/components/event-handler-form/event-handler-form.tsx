import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
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

type FormValues = {
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

const EventHandlerForm: VoidFunctionComponent<Props> = ({ isEditing = false, formValues, onSubmit }) => {
  const [selectedAction, setSelectedAction] = React.useState<'start_workflow' | 'complete_task' | 'fail_task' | null>(
    null,
  );
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

  return (
    <form onSubmit={handleSubmit}>
      {isEditing && (
        <HStack>
          <FormControl isRequired isInvalid={errors.name != null}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input name="name" onChange={handleChange} value={values.name} defaultValue={initialValues.name} />
            <FormErrorMessage>Name is required</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={errors.event != null}>
            <FormLabel>Event</FormLabel>
            <Input name="event" onChange={handleChange} value={values.event} defaultValue={initialValues.event} />
            <FormErrorMessage>Event is required</FormErrorMessage>
          </FormControl>
        </HStack>
      )}

      <FormControl>
        <HStack>
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
          value={values.condition ?? undefined}
          defaultValue={initialValues.condition ?? undefined}
          onChange={handleChange}
        />
        <FormErrorMessage>Condition is required</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.actions != null}>
        <FormLabel>Actions</FormLabel>
        <HStack>
          <Select
            value={selectedAction ?? undefined}
            onChange={(e) => setSelectedAction(e.target.value as 'start_workflow' | 'complete_task' | 'fail_task')}
          >
            <option value="start_workflow">Start workflow</option>
            <option value="complete_task">Complete task</option>
            <option value="fail_task">Fail task</option>
          </Select>

          <Spacer />

          <Button
            isDisabled={selectedAction == null}
            type="button"
            colorScheme="blue"
            onClick={() => {
              const newAction: EventHandlerAction = {
                id: Math.random().toString(36).substring(7),
                action: selectedAction,
                startWorkflow: null,
                completeTask: null,
                failTask: null,
                expandInlineJSON: false,
              };

              setFieldValue('actions', [...values.actions, newAction]);
            }}
          >
            Add action
          </Button>
        </HStack>
        <EventHandlerFormActions
          initialValues={initialValues.actions}
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
  );
};

export default EventHandlerForm;
