import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  HStack,
  Icon,
  IconButton,
  Input,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  values: Record<string, string | number>;
  onChange: (value: Record<string, string | number>) => void;
};

const EventHandlerFormActionRecord: VoidFunctionComponent<Props> = ({ values, onChange }) => {
  const entries = Object.entries(values);
  const [isKeyUnique, setIsKeyUnique] = React.useState<number | null>(null);

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    let changedKey = event.currentTarget.value;
    setIsKeyUnique(null);
    if (Object.keys(values).includes(event.target.value)) {
      changedKey += '_';
      setIsKeyUnique(changedIndex);
    }

    const oldEntry = entries[changedIndex];
    const newEntries = [
      ...entries.slice(0, changedIndex),
      [changedKey, oldEntry[1]],
      ...entries.slice(changedIndex + 1),
    ];

    onChange(Object.fromEntries(newEntries));
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
            {isKeyUnique != null && isKeyUnique === index && (
              <FormHelperText>
                The key you tried to add was not unique. You can remove underscore, but keep in mind that value of the
                first key with same name will be rewrite.
              </FormHelperText>
            )}
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
