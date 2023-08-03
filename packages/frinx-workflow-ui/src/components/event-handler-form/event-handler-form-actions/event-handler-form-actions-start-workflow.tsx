import { Card, HStack, Heading, Spacer, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { hasObjectUniqueKeys } from '../../../helpers/event-handlers.helpers';
import { StartWorkflow } from '../../../types/event-listeners.types';
import EventHandlerFormActionRecord from './event-handler-form-action-record';

type Props = {
  values: StartWorkflow;
  onChange: (event: StartWorkflow) => void;
  onRemove: () => void;
};

const StartWorkflowAction: VoidFunctionComponent<Props> = ({ values, onChange, onRemove }) => {
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

export default StartWorkflowAction;
