import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Switch,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { InputParameter } from '../../helpers/workflow.helpers';
import Editor from '../editor/editor';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  inputParameterKey: string;
  parsedInputParameters?: InputParameter | null;
  onChange: (key: string, value: string | boolean | number) => void;
};

const WorkflowFormInput: VoidFunctionComponent<Props> = ({
  inputParameterKey,
  onChange,
  values,
  parsedInputParameters,
}) => {
  const isToggle = parsedInputParameters?.[inputParameterKey]?.type === 'toggle';
  const isTextarea = parsedInputParameters?.[inputParameterKey]?.type === 'textarea';
  const isSelect = parsedInputParameters?.[inputParameterKey]?.type === 'select';
  const isNumber = parsedInputParameters?.[inputParameterKey]?.type === 'int';
  const isJson = parsedInputParameters?.[inputParameterKey]?.type === 'json';

  const isInput = !isToggle && !isTextarea && !isSelect && !isNumber && !isJson;

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

      {isJson && <Editor value={values[inputParameterKey]} onChange={(e) => onChange(inputParameterKey, e ?? '')} />}

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

      {isNumber && (
        <NumberInput
          name={inputParameterKey}
          value={values[inputParameterKey]}
          onChange={(_, number) => {
            if (Number.isNaN(number)) {
              return onChange(inputParameterKey, 0);
            }
            return onChange(inputParameterKey, number);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}

      {isInput && (
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

export default WorkflowFormInput;
