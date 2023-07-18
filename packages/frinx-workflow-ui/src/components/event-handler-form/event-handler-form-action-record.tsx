import { Box, Center, HStack, FormControl, Input, Button, Text, Icon, IconButton } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  initialValues: Record<string, string | number>;
  values: Record<string, string | number>;
  onChange: (value: Record<string, string | number>) => void;
};

const EventHandlerFormActionRecord: VoidFunctionComponent<Props> = ({ values, initialValues, onChange }) => {
  const entries = Object.entries(values);
  const initialEntries = Object.entries(initialValues);

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
    <Box>
      {entries.length === 0 && (
        <Center>
          <Text>No items yet.</Text>
        </Center>
      )}
      {entries.map(([key, value], index) => (
        // eslint-disable-next-line react/no-array-index-key
        <HStack key={`record-${index}`}>
          <FormControl>
            <Input value={key} defaultValue={initialEntries[index][0]} onChange={(e) => handleKeyChange(e, index)} />
          </FormControl>
          <FormControl>
            <Input
              value={value}
              defaultValue={initialEntries[index][1]}
              onChange={(e) => handleValueChange(e, index)}
            />
          </FormControl>
          <IconButton
            icon={<Icon size="sm" as={FeatherIcon} icon="trash-2" />}
            aria-label="Delete Alternative Id"
            onClick={() => handleDelete(index)}
          />
        </HStack>
      ))}
      <Button onClick={handleAdd}>Add</Button>
    </Box>
  );
};

export default EventHandlerFormActionRecord;
