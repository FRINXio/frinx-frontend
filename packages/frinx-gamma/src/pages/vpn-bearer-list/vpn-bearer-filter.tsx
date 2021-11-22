import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

export type VpnBearerFilters = {
  id: string | null;
  description: string | null;
};

type Props = {
  filters: VpnBearerFilters;
  onFilterChange: (filter: VpnBearerFilters) => void;
  onFilterSubmit: () => void;
};

const VpnBearerFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterSubmit }) => {
  return (
    <HStack marginBottom="4" alignItems="flex-end">
      <FormControl>
        <FormLabel>Id:</FormLabel>
        <Input
          name="id"
          variant="filled"
          bgColor="white"
          value={filters.id || ''}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              id: event.target.value,
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description:</FormLabel>
        <Input
          name="description"
          variant="filled"
          bgColor="white"
          value={filters.description || ''}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              description: event.target.value,
            })
          }
        />
      </FormControl>
      <Box>
        <Button onClick={onFilterSubmit} colorScheme="blue">
          Search
        </Button>
      </Box>
    </HStack>
  );
};

export default VpnBearerFilter;
