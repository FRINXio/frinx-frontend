import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Editor, ExtendedTask, LambdaInputParams } from '@frinx/shared';
import { FormikErrors } from 'formik';
import React, { FC, useState } from 'react';
import * as yup from 'yup';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

export const LambdaInputParamsSchema = yup.object({
  inputParameters: yup.object({
    lambdaValue: yup.string().required('Lambda value is required'),
    scriptExpression: yup.string().required('Script expression is required'),
  }),
});

type Props = {
  params: LambdaInputParams;
  errors: FormikErrors<{ inputParameters: LambdaInputParams }>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: LambdaInputParams) => void;
};

const LambdaInputsForm: FC<Props> = ({ params, errors, onChange, tasks, task }) => {
  const { lambdaValue, scriptExpression } = params;
  const [lambdaVal, setLambdaValue] = useState(lambdaValue);

  const handleOnChange = (updatedInputValue: string) => {
    setLambdaValue(updatedInputValue);

    onChange({
      ...params,
      lambdaValue: updatedInputValue,
    });
  };

  return (
    <>
      <FormControl id="lambdaValue" my={6} isInvalid={errors.inputParameters?.lambdaValue != null}>
        <FormLabel>Lambda value</FormLabel>
        <AutocompleteTaskReferenceNameMenu tasks={tasks} onChange={handleOnChange} inputValue={lambdaVal} task={task}>
          <Input
            autoComplete="off"
            name="lambdaValue"
            variant="filled"
            value={lambdaVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value);
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
        <FormErrorMessage>{errors.inputParameters?.lambdaValue}</FormErrorMessage>
      </FormControl>
      <FormControl id="scriptExpression" my={6} isInvalid={errors.inputParameters?.scriptExpression != null}>
        <FormLabel>Script expression</FormLabel>
        <Editor
          language="javascript"
          value={scriptExpression}
          onChange={(value) => {
            onChange({
              ...params,
              scriptExpression: value ?? '',
            });
          }}
          height="200px"
        />
        <FormErrorMessage>{errors.inputParameters?.scriptExpression}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default LambdaInputsForm;
