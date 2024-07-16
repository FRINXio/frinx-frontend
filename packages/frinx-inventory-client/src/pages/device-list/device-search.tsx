import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import { Box, Flex, FormLabel, Input } from '@chakra-ui/react';

type Props = {
  text: string | null;
  onChange: (searchText: string | null) => void;
};

const DeviceSearch: VoidFunctionComponent<Props> = ({ text, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box mb={6}>
      <FormLabel htmlFor="device-search">Search by name</FormLabel>
      <Flex mt={2}>
        <Input
          data-cy="search-by-name"
          id="device-search"
          type="text"
          value={text || ''}
          onChange={handleChange}
          background="white"
          placeholder="Search device"
        />
      </Flex>
    </Box>
  );
};

export default DeviceSearch;
