import React, { VoidFunctionComponent } from 'react';
import { VStack } from '@chakra-ui/react';
import WorkflowFormInput from './workflow-form-input';
import { InputParameter } from '../../helpers/workflow.helpers';

type Props = {
  parsedInputParameters?: InputParameter | null;
  inputParameterKeys: string[];
  values: Record<string, unknown>;
  onChange: (propertyName: string, value: string | number | boolean | string[]) => void;
};

const WorkflowInputsForm: VoidFunctionComponent<Props> = ({
  values,
  inputParameterKeys,
  parsedInputParameters,
  onChange,
}) => {
  return (
    <VStack spacing={4}>
      {inputParameterKeys.map((inputParameterKey) => (
        <WorkflowFormInput
          key={inputParameterKey}
          inputParameterKey={inputParameterKey}
          onChange={onChange}
          values={values}
          parsedInputParameters={parsedInputParameters}
        />
      ))}
    </VStack>
  );
};

export default WorkflowInputsForm;
