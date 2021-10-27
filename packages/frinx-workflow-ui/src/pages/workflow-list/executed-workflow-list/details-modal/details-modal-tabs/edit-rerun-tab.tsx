import React, { ChangeEvent, FC } from 'react';
import { Box, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import { WorkflowPayload } from '../../../../../types/uniflow-types';

type Props = {
  workflowPayload: WorkflowPayload | null;
  inputParameters: string[] | undefined;
  inputsArray: string[];
  handleInput: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
};

const EditRerunTab: FC<Props> = ({ workflowPayload, inputParameters, inputsArray, handleInput }) => {
  const input = workflowPayload?.input ?? {};
  const iPam = inputParameters || [];
  const labels = inputsArray;
  const values: string[] = [];

  labels.forEach((label: string) => {
    const key = Object.keys(input).findIndex((key) => key === label);
    key > -1 ? values.push(Object.values(input)[key]) : values.push('');
  });

  const matchParam = (param: string) => {
    return param.match(/\[(.*?)]/);
  };

  const descriptions = iPam.map((param: string) => {
    if (matchParam(param) && matchParam(param)?.length) {
      return matchParam(param)![1];
    }

    return '';
  });

  return (
    <>
      {labels.map((label: string, i) => {
        return (
          <Box key={`col1-${i}`}>
            <FormControl>
              <FormLabel>{label}</FormLabel>
              <Input
                onChange={(e) => handleInput(e, labels[i])}
                placeholder="Enter the input"
                value={values[i] ? (typeof values[i] === 'object' ? JSON.stringify(values[i]) : values[i]) : ''}
              />
              <FormHelperText className="text-muted">{descriptions[i]}</FormHelperText>
            </FormControl>
          </Box>
        );
      })}
    </>
  );
};

export default EditRerunTab;
