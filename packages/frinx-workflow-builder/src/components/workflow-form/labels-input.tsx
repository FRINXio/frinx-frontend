import React, { useState, VoidFunctionComponent } from 'react';
import { HStack, Input, InputGroup, InputLeftAddon, Tag, TagCloseButton, Text } from '@chakra-ui/react';

type Props = {
  labels: string[];
  onChange: (labels: string[]) => void;
};

const LabelsInput: VoidFunctionComponent<Props> = ({ labels, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { value } = event.currentTarget;
    setInputValue(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      if (!labels.includes(inputValue)) {
        const newLabels = [...labels, inputValue];
        onChange(newLabels);
        setInputValue('');
      }
    }
  };

  const handleRemove = (label: string) => {
    const newLabels = labels.filter((l) => l !== label);
    onChange(newLabels);
  };

  return (
    <InputGroup>
      {labels.length && (
        <InputLeftAddon bg="white">
          <HStack spacing={2}>
            {labels.map((l) => {
              return (
                <Tag key={`label-${l}`} size="sm" onClick={() => handleRemove(l)}>
                  <Text>{l}</Text>
                  <TagCloseButton />
                </Tag>
              );
            })}
          </HStack>
        </InputLeftAddon>
      )}
      <Input
        type="text"
        placeholder="Add Labels (press Enter to add)"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      :
    </InputGroup>
  );
};

export default LabelsInput;
