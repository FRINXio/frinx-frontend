import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import React, { VoidFunctionComponent } from 'react';
import { ActionTask, EventHandlerAction, StartWorkflow } from './event-handler-form';
import EventHandlerFormActionRecord from './event-handler-form-action-record';

type Props = {
  initialValues?: EventHandlerAction[] | null;
  values: EventHandlerAction[];
  onChange: (actions: EventHandlerAction[]) => void;
  onActionRemove: (index: number) => void;
};

type StartWorkflowActionProps = {
  initialValues?: StartWorkflow | null;
  values: StartWorkflow;
  errors: FormikErrors<StartWorkflow>;
  onChange: (event: StartWorkflow) => void;
  onRemove: () => void;
};

type ActionProps = {
  initialValues?: ActionTask | null;
  values: ActionTask;
  errors: FormikErrors<ActionTask>;
  onChange: (event: ActionTask) => void;
  onRemove: () => void;
};

const StartWorkflowAction: VoidFunctionComponent<StartWorkflowActionProps> = ({
  initialValues,
  values,
  errors,
  onChange,
  onRemove,
}) => {
  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, name: event.target.value });
  };

  const handleOnVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, version: Number(event.target.value) });
  };

  const handleOnCorrelationIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, correlationId: event.target.value });
  };

  const handleOnInputChange = (input: Record<string, string | number>) => {
    onChange({ ...values, input: JSON.stringify(input) });
  };

  const handleOnTaskToDomainChange = (taskToDomain: Record<string, string | number>) => {
    onChange({ ...values, taskToDomain: JSON.stringify(taskToDomain) });
  };

  return (
    <Card p={5}>
      <HStack>
        <Text>Start workflow action</Text>

        <Spacer />

        <Button colorScheme="red" onClick={onRemove}>
          Remove action
        </Button>
      </HStack>

      <HStack>
        <FormControl isInvalid={values.name != null}>
          <FormLabel>Workflow name</FormLabel>
          <Input
            onChange={handleOnNameChange}
            value={values.name ?? undefined}
            defaultValue={initialValues?.name ?? undefined}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={values.version != null}>
          <FormLabel>Workflow version</FormLabel>
          <Input
            onChange={handleOnVersionChange}
            value={values.version ?? undefined}
            defaultValue={initialValues?.version ?? undefined}
          />
          <FormErrorMessage>{errors.version}</FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl isInvalid={values.correlationId != null}>
        <FormLabel>Correlation ID</FormLabel>
        <Input
          onChange={handleOnCorrelationIdChange}
          value={values.correlationId ?? undefined}
          defaultValue={initialValues?.correlationId ?? undefined}
        />
        <FormErrorMessage>{errors.correlationId}</FormErrorMessage>
      </FormControl>

      <FormLabel>Input</FormLabel>
      <EventHandlerFormActionRecord
        values={JSON.parse(values.input ?? '{}')}
        initialValues={JSON.parse(initialValues?.input ?? '{}')}
        onChange={handleOnInputChange}
      />

      <FormLabel>Tasks to Domain Mapping</FormLabel>
      <EventHandlerFormActionRecord
        values={JSON.parse(values.taskToDomain ?? '{}')}
        initialValues={JSON.parse(initialValues?.taskToDomain ?? '{}')}
        onChange={handleOnTaskToDomainChange}
      />
    </Card>
  );
};

const TaskAction: VoidFunctionComponent<ActionProps> = ({ initialValues, values, errors, onChange, onRemove }) => {
  const [showOnlyTaskId, setShowOnlyTaskId] = React.useState<boolean>(true);

  const handleOnTaskIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, taskId: event.target.value });
  };

  const handleOnWorkflowIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, workflowId: event.target.value });
  };

  const handleOnTaskRefNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, taskRefName: event.target.value });
  };

  const handleOnOutputChange = (output: Record<string, string | number>) => {
    onChange({ ...values, output: JSON.stringify(output) });
  };

  return (
    <Card p={5}>
      <HStack>
        <Text>Task action</Text>
        <Spacer />

        <Button colorScheme="red" onClick={onRemove}>
          Remove action
        </Button>
      </HStack>
      <Text textColor="gray.500">Choose one of following options</Text>
      <HStack>
        <RadioGroup
          onChange={(e) => {
            setShowOnlyTaskId(e === '2');
          }}
          value={showOnlyTaskId ? '2' : '1'}
        >
          <Stack direction="row">
            <Radio value="1">Workflow id + task ref name</Radio>
            <Radio value="2">Task id</Radio>
          </Stack>
        </RadioGroup>
      </HStack>

      {showOnlyTaskId ? (
        <FormControl isInvalid={values.taskId != null}>
          <FormLabel>Task ID</FormLabel>
          <Input
            onChange={handleOnTaskIdChange}
            value={values.taskId ?? undefined}
            defaultValue={initialValues?.taskId ?? undefined}
          />
          <FormErrorMessage>{errors.taskId}</FormErrorMessage>
        </FormControl>
      ) : (
        <HStack>
          <FormControl isInvalid={values.workflowId != null}>
            <FormLabel>Workflow ID</FormLabel>
            <Input
              onChange={handleOnWorkflowIdChange}
              value={values.workflowId ?? undefined}
              defaultValue={initialValues?.workflowId ?? undefined}
            />
            <FormErrorMessage>{errors.workflowId}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={values.taskRefName != null}>
            <FormLabel>Task reference name</FormLabel>
            <Input
              onChange={handleOnTaskRefNameChange}
              value={values.taskRefName ?? undefined}
              defaultValue={initialValues?.taskRefName ?? undefined}
            />
            <FormErrorMessage>{errors.taskRefName}</FormErrorMessage>
          </FormControl>
        </HStack>
      )}

      <FormLabel>Output</FormLabel>
      <EventHandlerFormActionRecord
        values={JSON.parse(values.output ?? '{}')}
        initialValues={JSON.parse(initialValues?.output ?? '{}')}
        onChange={handleOnOutputChange}
      />
    </Card>
  );
};

const EventHandlerFormActions: VoidFunctionComponent<Props> = ({ initialValues, values, onChange, onActionRemove }) => {
  const handleOnActionChange = (event: EventHandlerAction, index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1, event);
    onChange(newValues);
  };

  const handleOnActionRemove = (index: number) => {
    onActionRemove(index);
  };

  return (
    <>
      {values.map((action, index) => (
        <>
          {action.action === 'start_workflow' && (
            <StartWorkflowAction
              // eslint-disable-next-line react/no-array-index-key
              key={action.id}
              initialValues={initialValues?.[index].startWorkflow ?? {}}
              values={action.startWorkflow ?? {}}
              errors={{}}
              onChange={(event) => handleOnActionChange({ ...action, startWorkflow: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'complete_task' && (
            <TaskAction
              // eslint-disable-next-line react/no-array-index-key
              key={action.id}
              initialValues={initialValues?.[index].completeTask ?? {}}
              values={action.completeTask ?? {}}
              errors={{}}
              onChange={(event) => handleOnActionChange({ ...action, completeTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'fail_task' && (
            <TaskAction
              // eslint-disable-next-line react/no-array-index-key
              key={action.id}
              initialValues={initialValues?.[index].failTask ?? {}}
              values={action.failTask ?? {}}
              errors={{}}
              onChange={(event) => handleOnActionChange({ ...action, failTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}
        </>
      ))}
    </>
  );
};

export default EventHandlerFormActions;
