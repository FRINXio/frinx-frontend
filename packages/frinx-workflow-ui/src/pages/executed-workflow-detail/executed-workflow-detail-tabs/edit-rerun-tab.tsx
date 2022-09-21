import React, { ChangeEvent, FC } from 'react';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  isExecuting: boolean;
  inputs: {
    descriptions: string[];
    values: string[];
    labels: string[];
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
  onRerunClick: () => void;
};

const EditRerunTab: FC<Props> = ({ onInputChange, onRerunClick, isExecuting, inputs }) => {
  const { descriptions, labels, values } = inputs;

  const getValue = (i: number) => {
    if (values[i] != null && typeof values[i] === 'object') {
      return JSON.stringify(values[i]);
    }

    return '';
  };

  return (
    <>
      {labels.map((label: string, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={`col1-${i}`}>
          <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input onChange={(e) => onInputChange(e, label)} placeholder="Enter the input" value={getValue(i)} />
            <FormHelperText className="text-muted">{descriptions[i]}</FormHelperText>
          </FormControl>
        </Box>
      ))}
      <Button
        float="right"
        marginRight={4}
        marginY={10}
        colorScheme="blue"
        isDisabled={isExecuting}
        isLoading={isExecuting}
        onClick={onRerunClick}
      >
        Execute
      </Button>
    </>
  );
};

export default EditRerunTab;
