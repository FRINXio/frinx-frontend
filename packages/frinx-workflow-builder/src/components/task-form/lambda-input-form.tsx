import React, { FC } from 'react';
import { FormControl, FormLabel, Input, useTheme } from '@chakra-ui/react';
import { LambdaInputParams } from '../../helpers/types';
import Editor from '../common/editor';
import { useWorkflowTasks } from '../../helpers/task.helpers';

type Props = {
  params: LambdaInputParams;
  onChange: (p: LambdaInputParams) => void;
};

const LambdaInputsForm: FC<Props> = ({ params, onChange }) => {
  const { lambdaValue, scriptExpression } = params;
  const theme = useTheme();
  const { tasks } = useWorkflowTasks();

  return (
    <>
      <FormControl id="lambdaValue" my={6}>
        <FormLabel>Lambda value</FormLabel>
        <Input
          name="lambdaValue"
          variant="filled"
          value={lambdaValue}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              lambdaValue: event.target.value,
            });
          }}
        />
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
