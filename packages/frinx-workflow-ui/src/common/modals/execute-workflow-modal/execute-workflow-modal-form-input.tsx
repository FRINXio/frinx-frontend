import { FormControl, FormLabel, Input, FormHelperText, Switch, Textarea, Select } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { InputParameter } from '../../../utils/helpers.utils';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  inputParameterKey: string;
  parsedInputParameters?: InputParameter | null;
  onChange: (key: string, value: string | boolean) => void;
};

export const ExecuteWorkflowModalFormInput: VoidFunctionComponent<Props> = ({
  inputParameterKey,
  onChange,
  values,
  parsedInputParameters,
}) => {
  const isToggle = parsedInputParameters?.[inputParameterKey]?.type === 'toggle';
  const isTextarea = parsedInputParameters?.[inputParameterKey]?.type === 'textarea';
  const isSelect = parsedInputParameters?.[inputParameterKey]?.type === 'select';

  return (
    <FormControl>
      <FormLabel htmlFor={inputParameterKey}>{inputParameterKey}</FormLabel>
      {isToggle && (
        <Switch
          name={inputParameterKey}
          value={values[inputParameterKey]}
          onChange={(e) => onChange(inputParameterKey, e.target.checked)}
        />
      )}

      {isTextarea && (
        <Textarea
          name={inputParameterKey}
          value={values[inputParameterKey]}
          onChange={(e) => onChange(inputParameterKey, e.target.value)}
        />
      )}

      {isSelect && (
        <Select
          name={inputParameterKey}
          value={values[inputParameterKey]}
          onChange={(e) => onChange(inputParameterKey, e.target.value)}
        >
          {parsedInputParameters?.[inputParameterKey]?.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      )}

      {!isToggle && !isTextarea && !isSelect && (
        <Input
          name={inputParameterKey}
          value={values[inputParameterKey]}
          onChange={(e) => onChange(inputParameterKey, e.target.value)}
        />
      )}
      {parsedInputParameters != null && Object.keys(parsedInputParameters).includes(inputParameterKey) && (
        <FormHelperText>{parsedInputParameters[inputParameterKey].description}</FormHelperText>
      )}
    </FormControl>
  );
};
