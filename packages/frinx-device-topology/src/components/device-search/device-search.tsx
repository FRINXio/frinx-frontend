import React, { ChangeEvent, FormEvent, useState, VoidFunctionComponent } from 'react';
import { Box, Button, chakra, FormLabel, Input } from '@chakra-ui/react';
import { useStateContext } from '../../state.provider';
import { setMapTopologyDeviceSearch } from '../../state.actions';

const Form = chakra('form');

const DeviceSearch: VoidFunctionComponent = () => {
  const { dispatch } = useStateContext();
  const [searchText, setSearchText] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const clearFilter = () => {
    setSearchText('');
    dispatch(setMapTopologyDeviceSearch(null));
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(setMapTopologyDeviceSearch(searchText || null));
  };

  return (
    <Form alignItems="flex-end" justifyContent="bottom" width="half" onSubmit={handleSearchSubmit}>
      <FormLabel htmlFor="device-search" marginBottom={4}>
        Search by name:
      </FormLabel>
      <Box display="flex">
        <Input
          data-cy="search-by-name"
          id="device-search"
          type="text"
          onChange={handleChange}
          background="white"
          placeholder="Search device"
          value={searchText}
        />
        <Button mb={6} data-cy="search-button" colorScheme="blue" marginLeft="2" type="submit">
          Search
        </Button>
        <Button mb={6} data-cy="clear-button" onClick={clearFilter} colorScheme="red" variant="outline" marginLeft="2">
          Clear
        </Button>
      </Box>
    </Form>
  );
};

export default DeviceSearch;
