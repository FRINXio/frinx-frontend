import React, { FC } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { TerminateInputParams } from 'helpers/types';

type Props = {
  params: TerminateInputParams;
  onChange: (p: TerminateInputParams) => void;
};

const TerminateInputForm: FC<Props> = ({ params, onChange }) => {
  const { terminationStatus, workflowOutput } = params;

  return (
    <>
      <FormControl id="terminationStatus" my={6}>
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
      </FormControl>
      <FormControl id="workflowOutput" my={6}>
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
      </FormControl>
    </>
  );
};

export default TerminateInputForm;
