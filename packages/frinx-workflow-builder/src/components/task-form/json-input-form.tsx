import React, { FC, useEffect, useState } from 'react';
import { FormControl, FormLabel, Input, useTheme } from '@chakra-ui/react';
import { pick, omit } from 'lodash';
import { JsonJQInputParams } from '../../helpers/types';
import Editor from '../common/editor';

type Props = {
  params: JsonJQInputParams;
  onChange: (p: JsonJQInputParams) => void;
  onValidation: (isValid: boolean) => void;
};

const JsonJQInputsForm: FC<Props> = ({ params, onChange, onValidation }) => {
  const theme = useTheme();
  const [inputJson, setInputJson] = useState(JSON.stringify(omit(params, ['queryExpression']), null, 2));
  const [queryExpression, setQueryExpression] = useState<string>(
    pick(params, 'queryExpression').queryExpression as string,
  );

  useEffect(() => {
    try {
      const json = JSON.parse(inputJson);
      onValidation(true);
      onChange({
        ...json,
        queryExpression,
      });
    } catch {
      onValidation(false);
    }
  }, [inputJson, queryExpression]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FormControl id="queryExpression" my={6}>
        <FormLabel>Query Expression</FormLabel>
        <Input
          type="text"
          name="queryExpression"
          value={queryExpression}
          onChange={(event) => {
            event.persist();
            setQueryExpression(event.target.value);
          }}
        />
      </FormControl>

      <FormControl id="inputParams" my={6}>
        <FormLabel>JSON:</FormLabel>
        <Editor
          name="inputParams"
          value={inputJson}
          onChange={(value) => {
            setInputJson(value);
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
