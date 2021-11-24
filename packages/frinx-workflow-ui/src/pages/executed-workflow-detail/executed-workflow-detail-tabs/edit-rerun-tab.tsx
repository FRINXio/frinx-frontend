import React, { ChangeEvent, FC } from 'react';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  isExecuting: boolean;
  isSuccessfullyExecuted: boolean;
  inputs: {
    descriptions: string[];
    values: string[];
    labels: string[];
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
  onRerunClick: () => void;
};

const EditRerunTab: FC<Props> = ({ onInputChange, onRerunClick, isExecuting, inputs, isSuccessfullyExecuted }) => {
  const { descriptions, labels, values } = inputs;

  return (
    <>
      {labels.map((label: string, i) => {
        return (
          <Box key={`col1-${i}`}>
            <FormControl>
              <FormLabel>{label}</FormLabel>
              <Input
                onChange={(e) => onInputChange(e, label)}
                placeholder="Enter the input"
                value={values[i] ? (typeof values[i] === 'object' ? JSON.stringify(values[i]) : values[i]) : ''}
              />
              <FormHelperText className="text-muted">{descriptions[i]}</FormHelperText>
            </FormControl>
          </Box>
        );
      })}
      <Button
        float="right"
        marginRight={4}
        marginY={10}
        colorScheme="blue"
        isDisabled={isExecuting || isSuccessfullyExecuted}
        isLoading={isExecuting}
        onClick={onRerunClick}
      >
        Execute
      </Button>
    </>
  );
};

export default EditRerunTab;
