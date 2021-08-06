import React, { FC, useState } from 'react';
import { FormControl, FormLabel, Input, useTheme } from '@chakra-ui/react';
import { LambdaInputParams } from '../../helpers/types';
import Editor from '../common/editor';
import { useWorkflowTasks } from '../../helpers/task.helpers';
import AutocompleteTaskReferenceName from '../autocomplete-task-reference-name/autocomplete-task-reference-name';

type Props = {
  params: LambdaInputParams;
  onChange: (p: LambdaInputParams) => void;
};

const LambdaInputsForm: FC<Props> = ({ params, onChange }) => {
  const { lambdaValue, scriptExpression } = params;
  const theme = useTheme();
  const { tasks } = useWorkflowTasks();
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
      <FormControl id="lambdaValue" my={6}>
        <FormLabel>Lambda value</FormLabel>
        <AutocompleteTaskReferenceName tasks={tasks} onChange={handleOnChange} inputValue={lambdaVal}>
          <Input
            name="lambdaValue"
            variant="filled"
            value={lambdaVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value);
            }}
          />
        </AutocompleteTaskReferenceName>
      </FormControl>
      <FormControl id="scriptExpression" my={6}>
        <FormLabel>Script expression</FormLabel>
        <Editor
          name="lambda-editor"
          mode="javascript"
          value={scriptExpression}
          onChange={(value) => {
            onChange({
              ...params,
              scriptExpression: value,
            });
          }}
          enableBasicAutocompletion
          height="200px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
    </>
  );
};

export default LambdaInputsForm;
