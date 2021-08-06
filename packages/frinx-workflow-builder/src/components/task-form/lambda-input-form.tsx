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

  const autocompleteTaskRefName = (taskReferenceName: string): void => {
    setLambdaValue('${'.concat(`${taskReferenceName}.input.lambdaValue}`));
  };

  return (
    <>
      <FormControl id="lambdaValue" my={6}>
        <FormLabel>Lambda value</FormLabel>
        <AutocompleteTaskReferenceName tasks={tasks} autocompleteTaskRefName={autocompleteTaskRefName}>
          <Input
            name="lambdaValue"
            variant="filled"
            value={lambdaVal}
            onChange={(event) => {
              event.persist();
              onChange({
                ...params,
                lambdaValue: event.target.value,
              });
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
