import React, { FC } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { ExtendedTask, JsonJQInputParams } from '../../helpers/types';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

export const JsonJQNInputParamsSchema = yup.object({
  inputParameters: yup.object({
    key: yup.string().required('Task reference name is required'),
    queryExpression: yup.string().notOneOf(['.key | '], 'Query expression is required'),
  }),
});

type Props = {
  params: JsonJQInputParams;
  errors: FormikErrors<{ inputParameters: JsonJQInputParams }>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: JsonJQInputParams) => void;
};

const JsonJQInputsForm: FC<Props> = ({ params, errors, onChange, tasks, task }) => {
  return (
    <>
      <FormControl id="queryExpression" my={6} isInvalid={errors.inputParameters?.queryExpression != null}>
        <FormLabel>Query Expression</FormLabel>
        <Input
          type="text"
          name="queryExpression"
          value={params.queryExpression.replace(/^\.key( \| )?/, '')}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              queryExpression: `.key | ${event.target.value}`,
            });
          }}
        />
        <FormErrorMessage>{errors.inputParameters?.queryExpression}</FormErrorMessage>
      </FormControl>

      <FormControl id="key" my={6} isInvalid={errors.inputParameters?.key != null}>
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
          inputValue={params.key || ''}
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
        <FormErrorMessage>{errors.inputParameters?.key}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default JsonJQInputsForm;
