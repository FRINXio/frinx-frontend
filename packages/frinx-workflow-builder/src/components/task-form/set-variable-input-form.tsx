import React, { FC, useState } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { ExtendedTask, SetVariableInputParams } from '@frinx/shared/src';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

export const SetVariableInputParamsSchema = yup.object({
  inputParameters: yup.object({
    variableName: yup.string().required('Variable name is required'),
    variableValue: yup.string().required('Variable value is required'),
  }),
});

type Props = {
  params: SetVariableInputParams;
  errors: FormikErrors<{ inputParameters: SetVariableInputParams }>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: SetVariableInputParams) => void;
};

const SetVariableInputsForm: FC<Props> = ({ params, errors, onChange, tasks, task }) => {
  const { variableName, variableValue } = params;
  const [, setName] = useState(variableName);
  const [, setValue] = useState(variableValue);

  const handleNameOnChange = (updatedVariableName: string) => {
    setName(updatedVariableName);
    onChange({
      ...params,
      variableName: updatedVariableName,
    });
  };

  const handleValueOnChange = (updatedVariableValue: string) => {
    setValue(updatedVariableValue);
    onChange({
      ...params,
      variableValue: updatedVariableValue,
    });
  };

  return (
    <>
      <FormControl id="lambdaValue" my={6} isInvalid={errors.inputParameters?.variableName != null}>
        <FormLabel>Variable name</FormLabel>
        <AutocompleteTaskReferenceNameMenu
          tasks={tasks}
          onChange={handleNameOnChange}
          inputValue={variableName}
          task={task}
        >
          <Input
            autoComplete="off"
            name="variableName"
            placeholder="Set variable name"
            variant="filled"
            value={variableName}
            onChange={(event) => {
              event.persist();
              handleNameOnChange(event.target.value);
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
        <FormErrorMessage>{errors.inputParameters?.variableName}</FormErrorMessage>
      </FormControl>
      <FormControl id="scriptExpression" my={6} isInvalid={errors.inputParameters?.variableValue != null}>
        <FormLabel>Variable value</FormLabel>
        <AutocompleteTaskReferenceNameMenu
          tasks={tasks}
          onChange={handleValueOnChange}
          inputValue={variableName}
          task={task}
        >
          <Input
            autoComplete="off"
            name="variableValue"
            placeholder="Set variable value"
            variant="filled"
            value={variableValue}
            onChange={(event) => {
              event.persist();
              handleValueOnChange(event.target.value);
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
        <FormErrorMessage>{errors.inputParameters?.variableValue}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default SetVariableInputsForm;
