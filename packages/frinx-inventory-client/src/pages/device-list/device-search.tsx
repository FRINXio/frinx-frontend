import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import { Box, Button, Flex, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  text: string | null;
  onChange: (searchText: string | null) => void;
};

const DeviceSearch: VoidFunctionComponent<Props> = ({ text, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <Box>
      <FormLabel htmlFor="device-search" marginBottom="4">
        Search Device by Name:
      </FormLabel>
      <Flex>
        <Input
          data-cy="search-by-name"
          id="device-search"
          type="text"
          value={text || ''}
          onChange={handleChange}
          background="white"
          placeholder="Search device"
        />
        <Button data-cy="search-button" type="submit" colorScheme="blue" px="6" marginLeft="2">
          Search
        </Button>
      </Flex>
    </Box>
  );
};

export default DeviceSearch;
