import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import { Box, Button, Flex, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  text: string | null;
  onChange: (searchText: string | null) => void;
  onSubmit: (searchText: string | null) => void;
};

const DeviceSearch: VoidFunctionComponent<Props> = ({ text, onChange, onSubmit }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  const handleSubmit = () => {
    onSubmit(text);
  };
  return (
    <Box>
      <FormLabel htmlFor="device-search" marginBottom="4">
        Search Device by Name:
      </FormLabel>
      <Flex>
        <Input
          id="device-search"
          type="text"
          value={text || ''}
          onChange={handleChange}
          background="white"
          placeholder="Search device"
        />
        <Button onClick={handleSubmit} colorScheme="blue" px="6" marginLeft="2">
          Search
        </Button>
      </Flex>
    </Box>
  );
};

export default DeviceSearch;
