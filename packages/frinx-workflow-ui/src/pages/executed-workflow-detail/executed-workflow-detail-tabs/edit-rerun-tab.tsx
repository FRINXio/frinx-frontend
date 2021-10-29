import React, { ChangeEvent, FC } from 'react';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import { WorkflowPayload } from '../../../types/uniflow-types';

type Props = {
  workflowPayload: WorkflowPayload | null;
  inputParameters: string[] | undefined;
  onInputChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
  onRerunClick: () => void;
  isExecuting: boolean;
  workflowDetails: string;
};

const EditRerunTab: FC<Props> = ({
  workflowPayload,
  inputParameters,
  onInputChange,
  onRerunClick,
  isExecuting,
  workflowDetails,
}) => {
  const input = workflowPayload?.input ?? {};
  const inputParams = inputParameters || [];

  const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim;
  let match = inputCaptureRegex.exec(workflowDetails);
  const inputLabels = new Set<string>([]);

  while (match != null) {
    inputLabels.add(match[1]);
    match = inputCaptureRegex.exec(workflowDetails);
  }

  const inputValues = [...inputLabels].map((label: string) => {
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
      {[...inputLabels].map((label: string, i) => {
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
      <Button marginRight={4} marginTop={10} colorScheme="blue" isDisabled={isExecuting} onClick={onRerunClick}>
        Execute
      </Button>
    </>
  );
};

export default EditRerunTab;
