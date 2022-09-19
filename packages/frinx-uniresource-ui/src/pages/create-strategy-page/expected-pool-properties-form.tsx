import { Button, FormControl, FormLabel, HStack, IconButton, Input } from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  expectedPoolProperties: { key: string; type: string }[];
  onPoolPropertyChange: ({ key, type }: { key: string; type: string }) => void;
  onPoolPropertyAdd: () => void;
  onPoolPropertyDelete: ({ key }: { key: string }) => void;
};

const ExpectedPoolProperties: FC<Props> = ({
  expectedPoolProperties,
  onPoolPropertyAdd,
  onPoolPropertyDelete,
  onPoolPropertyChange,
}) => {
  const handleOnDeletePoolProperty = (key: string) => {
    onPoolPropertyDelete({ key });
  };

  const handleOnPoolPropertyChange = (key: string, type: string) => {
    onPoolPropertyChange({ key, type });
  };

  return (
    <FormControl>
      <FormLabel>Expected pool properties</FormLabel>
      {expectedPoolProperties.map((poolProperty) => (
        <HStack key={poolProperty.key}>
          <Input
            value={poolProperty.key}
            onChange={(e) => handleOnPoolPropertyChange(e.target.value, poolProperty.type)}
          />
          <Input
            value={poolProperty.type}
            onChange={(e) => handleOnPoolPropertyChange(poolProperty.key, e.target.value)}
          />
          <IconButton aria-label="Delete pool property" onClick={() => handleOnDeletePoolProperty(poolProperty.key)} />
        </HStack>
      ))}

      <Button onClick={onPoolPropertyAdd}>Add new pool property</Button>
    </FormControl>
  );
};

export default ExpectedPoolProperties;
