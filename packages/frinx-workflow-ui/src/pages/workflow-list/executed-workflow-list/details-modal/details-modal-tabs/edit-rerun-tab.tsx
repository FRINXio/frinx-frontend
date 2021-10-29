import React, { ChangeEvent, FC } from 'react';
import { Box, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import { WorkflowPayload } from '../../../../../types/uniflow-types';

type Props = {
  workflowPayload: WorkflowPayload | null;
  inputParameters: string[] | undefined;
  inputLabels: string[];
  onInputChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
};

const EditRerunTab: FC<Props> = ({ workflowPayload, inputParameters, inputLabels, onInputChange }) => {
  const input = workflowPayload?.input ?? {};
  const inputParams = inputParameters || [];

  const inputValues = inputLabels.map((label: string) => {
    return input[label] != null ? input[label] : '';
  });

  const matchParam = (param: string) => {
    return param.match(/\[(.*?)]/);
  };

  const descriptions = inputParams.map((param: string) => {
    if (matchParam(param) && matchParam(param)?.length) {
      return matchParam(param)![1];
    }

    return '';
  });

  return (
    <>
      {inputLabels.map((label: string, i) => {
        return (
          <Box key={`col1-${i}`}>
            <FormControl>
              <FormLabel>{label}</FormLabel>
              <Input
                onChange={(e) => onInputChange(e, label)}
                placeholder="Enter the input"
                value={
                  inputValues[i]
                    ? typeof inputValues[i] === 'object'
                      ? JSON.stringify(inputValues[i])
                      : inputValues[i]
                    : ''
                }
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
