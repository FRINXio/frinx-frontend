import React, { FC, useState } from 'react';
import { FormControl, FormLabel, Input, useTheme } from '@chakra-ui/react';
import { ExtendedTask, LambdaInputParams } from '../../helpers/types';
import Editor from '../common/editor';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

type Props = {
  params: LambdaInputParams;
  tasks: ExtendedTask[];
  onChange: (p: LambdaInputParams) => void;
};

const LambdaInputsForm: FC<Props> = ({ params, onChange, tasks }) => {
  const { lambdaValue, scriptExpression } = params;
  const theme = useTheme();
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
        <AutocompleteTaskReferenceNameMenu tasks={tasks} onChange={handleOnChange} inputValue={lambdaVal}>
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
