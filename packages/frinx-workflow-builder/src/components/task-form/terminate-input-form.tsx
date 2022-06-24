import React, { FC } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { TerminateInputParams } from '../../helpers/types';

export const TerminateInputParamsSchema = yup.object({
  inputParameters: yup.object({
    terminationStatus: yup.string().required('Termination Status is required'),
    workflowOutput: yup.string().required('Workflow output is requried'),
  }),
});

type Props = {
  params: TerminateInputParams;
  errors: FormikErrors<{ inputParameters: TerminateInputParams }>;
  onChange: (p: TerminateInputParams) => void;
};

const TerminateInputForm: FC<Props> = ({ params, errors, onChange }) => {
  const { terminationStatus, workflowOutput } = params;

  return (
    <>
      <FormControl id="terminationStatus" my={6} isInvalid={errors.inputParameters?.terminationStatus != null}>
        <FormLabel>Termination status</FormLabel>
        <Input
          name="terminationStatus"
          variant="filled"
          value={terminationStatus}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              terminationStatus: event.target.value,
            });
          }}
        />
        <FormErrorMessage>{errors.inputParameters?.terminationStatus}</FormErrorMessage>
      </FormControl>
      <FormControl id="workflowOutput" my={6} isInvalid={errors.inputParameters?.workflowOutput != null}>
        <FormLabel>Expected workflow output</FormLabel>
        <Input
          name="workflowOutput"
          variant="filled"
          value={workflowOutput}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              workflowOutput: event.target.value,
            });
          }}
        />
        <FormErrorMessage>{errors.inputParameters?.workflowOutput}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default TerminateInputForm;
