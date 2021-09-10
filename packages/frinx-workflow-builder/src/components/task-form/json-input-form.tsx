import React, { FC, useEffect, useState } from 'react';
import { FormControl, FormLabel, useTheme } from '@chakra-ui/react';
import { JsonJQInputParams } from '../../helpers/types';
import Editor from '../common/editor';

type Props = {
  params: JsonJQInputParams;
  onChange: (p: JsonJQInputParams) => void;
  onValidation: (isValid: boolean) => void;
};

const JsonJQInputsForm: FC<Props> = ({ params, onChange, onValidation }) => {
  const theme = useTheme();
  const [inputParams, setInputParams] = useState(JSON.stringify(params, null, 2));

  useEffect(() => {
    try {
      const json = JSON.parse(inputParams);
      onValidation(true);
      onChange({
        ...json,
      });
    } catch {
      onValidation(false);
    }
  }, [inputParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FormControl id="headers">
        <FormLabel>Params</FormLabel>

        <Editor
          name="inputParams"
          value={inputParams}
          onChange={(value) => {
            setInputParams(value);
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

export default JsonJQInputsForm;
