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
import React, { Fragment, VoidFunctionComponent } from 'react';
import { hasObjectUniqueKeys } from '../../helpers/event-handlers.helpers';
import { StartWorkflow, ActionTask } from '../../types/event-listeners.types';
import { EventHandlerAction } from './event-handler-form';
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

type ViewMode = 'all' | 'task_only';

// eslint-disable-next-line no-shadow
enum ViewModeEnum {
  ALL = 'all',
  TASK_ONLY = 'task_only',
}

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

  const handleOnInputChange = (input: [string, string | number][]) => {
    onChange({ ...values, input });
  };

  const handleOnTaskToDomainChange = (taskToDomain: [string, string | number][]) => {
    onChange({ ...values, taskToDomain });
  };

  const areAllKeysUniqueInInput = hasObjectUniqueKeys(values.input);
  const areAllKeysUniqueInTaskToDomain = hasObjectUniqueKeys(values.taskToDomain);

  return (
    <Card
      p={5}
      mb={5}
      border={areAllKeysUniqueInInput || areAllKeysUniqueInTaskToDomain ? '' : '1px solid'}
      borderColor={areAllKeysUniqueInInput || areAllKeysUniqueInTaskToDomain ? '' : 'red.500'}
    >
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
            value={values.name ?? ''}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Workflow version</FormLabel>
          <Input placeholder="latest" onChange={handleOnVersionChange} value={values.version ?? ''} />
        </FormControl>
      </HStack>

      <FormControl mb={3}>
        <FormLabel>Correlation ID</FormLabel>
        <Input
          // eslint-disable-next-line no-template-curly-in-string
          placeholder="${event.payload.correlation_id}"
          onChange={handleOnCorrelationIdChange}
          value={values.correlationId ?? ''}
        />
      </FormControl>

      <FormLabel>Input</FormLabel>
      <EventHandlerFormActionRecord
        values={values.input ?? [['', '']]}
        onChange={handleOnInputChange}
        areAllKeysUnique={areAllKeysUniqueInInput}
      />

      <FormLabel>Tasks to Domain Mapping</FormLabel>
      <EventHandlerFormActionRecord
        values={values.taskToDomain ?? [['', '']]}
        onChange={handleOnTaskToDomainChange}
        areAllKeysUnique={areAllKeysUniqueInTaskToDomain}
      />
    </Card>
  );
};

const TaskAction: VoidFunctionComponent<ActionProps> = ({ isCompleteTask, values, onChange, onRemove }) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewModeEnum.ALL);

  const handleOnTaskIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, taskId: event.target.value });
  };

  const handleOnWorkflowIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, workflowId: event.target.value });
  };

  const handleOnTaskRefNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, taskRefName: event.target.value });
  };

  const handleOnOutputChange = (output: [string, string | number][]) => {
    onChange({ ...values, output });
  };

  return (
    <Card
      p={5}
      mb={5}
      border={hasObjectUniqueKeys(values.output) ? '' : '1px solid'}
      borderColor={hasObjectUniqueKeys(values.output) ? '' : 'red.500'}
    >
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
          onChange={(e: ViewMode) => {
            if (e === ViewModeEnum.ALL) {
              onChange({ ...values, workflowId: '', taskRefName: '' });
            } else {
              onChange({ ...values, taskId: '' });
            }
            setViewMode(e);
          }}
          value={viewMode}
        >
          <Stack direction="row">
            <Radio value={ViewModeEnum.ALL}>Workflow id + task ref name</Radio>
            <Radio value={ViewModeEnum.TASK_ONLY}>Task id</Radio>
          </Stack>
        </RadioGroup>
      </HStack>

      {viewMode === 'task_only' ? (
        <FormControl mb={3}>
          <FormLabel>Task ID</FormLabel>
          <Input
            // eslint-disable-next-line no-template-curly-in-string
            placeholder="${event.payload.task_id}"
            onChange={handleOnTaskIdChange}
            value={values.taskId ?? ''}
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
              value={values.workflowId ?? ''}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Task reference name</FormLabel>
            <Input
              // eslint-disable-next-line no-template-curly-in-string
              placeholder="${event.payload.taskReferenceName}"
              onChange={handleOnTaskRefNameChange}
              value={values.taskRefName ?? ''}
            />
          </FormControl>
        </HStack>
      )}

      <FormLabel>Output</FormLabel>
      <EventHandlerFormActionRecord
        values={values.output ?? [['', '']]}
        onChange={handleOnOutputChange}
        areAllKeysUnique={hasObjectUniqueKeys(values.output)}
      />
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
        <Fragment key={action.id}>
          {action.action === 'start_workflow' && (
            <StartWorkflowAction
              values={action.startWorkflow ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, startWorkflow: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'complete_task' && (
            <TaskAction
              isCompleteTask
              values={action.completeTask ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, completeTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}

          {action.action === 'fail_task' && (
            <TaskAction
              isCompleteTask={false}
              values={action.failTask ?? {}}
              onChange={(event) => handleOnActionChange({ ...action, failTask: event }, index)}
              onRemove={() => handleOnActionRemove(index)}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

export default EventHandlerFormActions;
