import {
  Card,
  HStack,
  Heading,
  Spacer,
  Button,
  RadioGroup,
  Stack,
  Radio,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { hasObjectUniqueKeys } from '../../../helpers/event-handlers.helpers';
import { ActionTask } from '../../../types/event-listeners.types';
import EventHandlerFormActionRecord from './event-handler-form-action-record';

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

const TaskAction: VoidFunctionComponent<ActionProps> = ({ isCompleteTask, values, onChange, onRemove }) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>(values.taskId ? ViewModeEnum.TASK_ONLY : ViewModeEnum.ALL);

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

export default TaskAction;
