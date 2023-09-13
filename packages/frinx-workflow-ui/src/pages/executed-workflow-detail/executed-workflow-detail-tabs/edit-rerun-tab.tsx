import React, { ChangeEvent, FC } from 'react';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  inputs: {
    descriptions: string[];
    values: string[];
    labels: string[];
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
  onRerunClick: () => void;
};

const getValue = (i: number, values: string[]) => {
  if (values[i] != null && typeof values[i] === 'object') {
    return JSON.stringify(values[i]);
  }

  if (values[i] != null && typeof values[i] === 'number') {
    return values[i].toString();
  }

  if (values[i] != null && typeof values[i] === 'string') {
    return values[i];
  }

  return '';
};

const EditRerunTab: FC<Props> = ({ onInputChange, onRerunClick, inputs }) => {
  const { descriptions, labels, values } = inputs;

  return (
    <>
      {labels.map((label: string, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={`col1-${i}`}>
          <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input
              onChange={(e) => onInputChange(e, label)}
              placeholder="Enter the input"
              value={getValue(i, values)}
            />
            <FormHelperText className="text-muted">{descriptions[i]}</FormHelperText>
          </FormControl>
        </Box>
      ))}
      <Button float="right" marginRight={4} marginY={10} colorScheme="blue" onClick={onRerunClick}>
        Execute
      </Button>
    </>
  );
};

export default EditRerunTab;
