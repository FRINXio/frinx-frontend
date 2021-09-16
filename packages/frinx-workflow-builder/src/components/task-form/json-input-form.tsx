import React, { FC } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ExtendedTask, JsonJQInputParams } from '../../helpers/types';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

type Props = {
  params: JsonJQInputParams;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: JsonJQInputParams) => void;
  onValidation: (isValid: boolean) => void;
};

const JsonJQInputsForm: FC<Props> = ({ params, onChange, tasks, task }) => {
  return (
    <>
      <FormControl id="queryExpression" my={6}>
        <FormLabel>Query Expression</FormLabel>
        <Input
          type="text"
          name="queryExpression"
          value={params.queryExpression.replace(/^\.key/, '')}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              queryExpression: `.key${event.target.value}`,
            });
          }}
        />
      </FormControl>

      <FormControl id="key" my={6}>
        <FormLabel>Task Reference Name:</FormLabel>
        <AutocompleteTaskReferenceNameMenu
          tasks={tasks}
          task={task}
          onChange={(updatedInputValue) => {
            onChange({
              ...params,
              key: updatedInputValue,
            });
          }}
          inputValue={params.key}
        >
          <Input
            type="text"
            name="key"
            value={params.key}
            onChange={(event) => {
              event.persist();
              onChange({
                ...params,
                key: event.target.value,
              });
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
      </FormControl>
    </>
  );
};

export default JsonJQInputsForm;
