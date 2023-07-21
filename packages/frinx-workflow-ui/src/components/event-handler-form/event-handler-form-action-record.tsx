import { Box, Button, Center, FormControl, HStack, Icon, IconButton, Input, Spacer, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  values: [string, string | number][];
  areAllKeysUnique: boolean;
  onChange: (value: [string, string | number][]) => void;
};

const EventHandlerFormActionRecord: VoidFunctionComponent<Props> = ({ values, areAllKeysUnique, onChange }) => {
  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    const changedKey = event.target.value;

    onChange([
      ...values.slice(0, changedIndex),
      [changedKey, values[changedIndex][1]],
      ...values.slice(changedIndex + 1),
    ]);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    const changedValue = event.currentTarget.value;

    onChange([
      ...values.slice(0, changedIndex),
      [values[changedIndex][0], changedValue],
      ...values.slice(changedIndex + 1),
    ]);
  };

  const handleAdd = () => {
    onChange([...values, ['', '']]);
  };

  const handleDelete = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <Box mb={3}>
      {values.length === 0 && (
        <Center>
          <Text>No items yet.</Text>
        </Center>
      )}
      {values.map(([key, value], index) => (
        // eslint-disable-next-line react/no-array-index-key
        <HStack key={`record-${index}`} mb={3} alignItems="flex-start">
          <FormControl>
            <Input value={key} placeholder="inputKey" onChange={(e) => handleKeyChange(e, index)} />
          </FormControl>
          <FormControl>
            <Input placeholder="inputValue" value={value} onChange={(e) => handleValueChange(e, index)} />
          </FormControl>
          <IconButton
            icon={<Icon size="sm" as={FeatherIcon} icon="trash-2" />}
            aria-label="Delete Alternative Id"
            onClick={() => handleDelete(index)}
          />
        </HStack>
      ))}

      {!areAllKeysUnique && <Text textColor="red">Keys must be unique.</Text>}

      <HStack>
        <Spacer />
        <Button onClick={handleAdd} size="xs">
          Add property
        </Button>
      </HStack>
    </Box>
  );
};

export default EventHandlerFormActionRecord;
