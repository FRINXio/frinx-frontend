import { Box, Button, Center, FormControl, HStack, Icon, IconButton, Input, Spacer, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  values: Record<string, string | number>;
  onChange: (value: Record<string, string | number>) => void;
};

const EventHandlerFormActionRecord: VoidFunctionComponent<Props> = ({ values, onChange }) => {
  const entries = Object.entries(values);

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    const changedKey = event.currentTarget.value;
    const oldEntry = entries[changedIndex];
    const newValues = [...entries];
    newValues.splice(changedIndex, 1, [changedKey, oldEntry[1]]);
    onChange(Object.fromEntries(newValues));
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    const changedValue = event.currentTarget.value;
    const oldEntry = entries[changedIndex];
    const newValues = [...entries];
    newValues.splice(changedIndex, 1, [oldEntry[0], changedValue]);
    onChange(Object.fromEntries(newValues));
  };

  const handleAdd = () => {
    const newValues = [...entries, ['', '']];
    onChange(Object.fromEntries(newValues));
  };

  const handleDelete = (index: number) => {
    const newValues = [...entries];
    newValues.splice(index, 1);
    onChange(Object.fromEntries(newValues));
  };

  return (
    <Box mb={3}>
      {entries.length === 0 && (
        <Center>
          <Text>No items yet.</Text>
        </Center>
      )}
      {entries.map(([key, value], index) => (
        // eslint-disable-next-line react/no-array-index-key
        <HStack key={`record-${index}`} mb={3}>
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
