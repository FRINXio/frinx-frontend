import {
  Button,
  Card,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { ActionTask, EventHandlerAction, StartWorkflow } from './event-handler-form';
import EventHandlerFormActionRecord from './event-handler-form-action-record';

type Props = {
  values: EventHandlerAction[];
  onChange: (actions: EventHandlerAction[]) => void;
  onActionRemove: (index: number) => void;
};

type StartWorkflowActionProps = {
  values: StartWorkflow;
  onChange: (event: StartWorkflow) => void;
  onRemove: () => void;
};

type ActionProps = {
  isCompleteTask: boolean;
  values: ActionTask;
  onChange: (event: ActionTask) => void;
  onRemove: () => void;
};

const StartWorkflowAction: VoidFunctionComponent<StartWorkflowActionProps> = ({ values, onChange, onRemove }) => {
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
    <Card p={5} mb={5}>
      <HStack mb={3}>
        <Heading size="md" as="h3">
          Start workflow
        </Heading>

        <Spacer />

        <Button colorScheme="red" size="sm" variant="outline" onClick={onRemove}>
          Remove action
        </Button>
      </HStack>

      <HStack mb={3}>
        <FormControl>
          <FormLabel>Workflow name</FormLabel>
          <Input
            // eslint-disable-next-line no-template-curly-in-string
            placeholder="${event.payload.workflow_name}"
            onChange={handleOnNameChange}
            value={values.name ?? undefined}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Workflow version</FormLabel>
          <Input placeholder="latest" onChange={handleOnVersionChange} value={values.version ?? undefined} />
        </FormControl>
      </HStack>

      <FormControl mb={3}>
        <FormLabel>Correlation ID</FormLabel>
        <Input
          // eslint-disable-next-line no-template-curly-in-string
          placeholder="${event.payload.correlation_id}"
          onChange={handleOnCorrelationIdChange}
          value={values.correlationId ?? undefined}
        />
      </FormControl>

      <FormLabel>Input</FormLabel>
      <EventHandlerFormActionRecord values={JSON.parse(values.input ?? '{}')} onChange={handleOnInputChange} />

      <FormLabel>Tasks to Domain Mapping</FormLabel>
      <EventHandlerFormActionRecord
        values={JSON.parse(values.taskToDomain ?? '{}')}
        onChange={handleOnTaskToDomainChange}
      />
    </Card>
  );
};

const TaskAction: VoidFunctionComponent<ActionProps> = ({ isCompleteTask, values, onChange, onRemove }) => {
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
    <Card p={5} mb={5}>
      <HStack mb={3}>
        <Heading size="md" as="h3">
          {isCompleteTask ? 'Complete task' : 'Fail task'}
        </Heading>
        <Spacer />

        <Button colorScheme="red" size="sm" variant="outline" onClick={onRemove}>
          Remove action
        </Button>
      </HStack>

      <Text textColor="gray.500" fontSize="sm">
        Choose one of following options
      </Text>
      <HStack mb={3}>
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
        <FormControl mb={3}>
          <FormLabel>Task ID</FormLabel>
          <Input
            // eslint-disable-next-line no-template-curly-in-string
            placeholder="${event.payload.task_id}"
            onChange={handleOnTaskIdChange}
            value={values.taskId ?? undefined}
          />
        </FormControl>
      ) : (
        <HStack mb={3}>
          <FormControl>
            <FormLabel>Workflow ID</FormLabel>
            <Input
              // eslint-disable-next-line no-template-curly-in-string
              placeholder="${event.payload.workflow_id}"
              onChange={handleOnWorkflowIdChange}
              value={values.workflowId ?? undefined}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Task reference name</FormLabel>
            <Input
              // eslint-disable-next-line no-template-curly-in-string
              placeholder="${event.payload.taskReferenceName}"
              onChange={handleOnTaskRefNameChange}
              value={values.taskRefName ?? undefined}
            />
          </FormControl>
        </HStack>
      )}

      <FormLabel>Output</FormLabel>
      <EventHandlerFormActionRecord values={JSON.parse(values.output ?? '{}')} onChange={handleOnOutputChange} />
    </Card>
  );
};

const EventHandlerFormActions: VoidFunctionComponent<Props> = ({ values, onChange, onActionRemove }) => {
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
              values={action.startWorkflow ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, startWorkflow: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'complete_task' && (
            <TaskAction
              isCompleteTask
              // eslint-disable-next-line react/no-array-index-key
              key={action.id}
              values={action.completeTask ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, completeTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'fail_task' && (
            <TaskAction
              isCompleteTask={false}
              // eslint-disable-next-line react/no-array-index-key
              key={action.id}
              values={action.failTask ?? {}}
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
