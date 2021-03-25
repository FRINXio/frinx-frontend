import React, { FC } from 'react';
import { FormControl, FormLabel, Input, useTheme } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import { LambdaInputParams } from '../../helpers/types';
// import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

type Props = {
  params: LambdaInputParams;
  onChange: (p: LambdaInputParams) => void;
};

const LambdaInputsForm: FC<Props> = ({ params, onChange }) => {
  const { lambdaValue, scriptExpression } = params;
  const theme = useTheme();

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
        <AceEditor
          mode="javascript"
          theme="textmate"
          wrapEnabled
          value={scriptExpression}
          onChange={(value) => {
            onChange({
              ...params,
              scriptExpression: value,
            });
          }}
          enableBasicAutocompletion
          fontSize={16}
          tabSize={2}
          width="100%"
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
