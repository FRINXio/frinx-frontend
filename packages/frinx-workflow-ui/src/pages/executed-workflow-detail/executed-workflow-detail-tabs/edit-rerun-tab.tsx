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
      <Button marginRight={4} marginTop={10} colorScheme="blue" isDisabled={isExecuting} onClick={onRerunClick}>
        Execute
      </Button>
    </>
  );
};

export default EditRerunTab;
