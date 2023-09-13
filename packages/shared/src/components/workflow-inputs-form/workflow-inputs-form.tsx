import React, { VoidFunctionComponent } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
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
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      {inputParameterKeys.map((inputParameterKey) => (
        <GridItem key={inputParameterKey}>
          <WorkflowFormInput
            inputParameterKey={inputParameterKey}
            onChange={onChange}
            values={values}
            parsedInputParameters={parsedInputParameters}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default WorkflowInputsForm;
