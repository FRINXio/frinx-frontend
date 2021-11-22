import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

export type SiteNetworkAccessFilters = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
};

type Props = {
  filters: SiteNetworkAccessFilters;
  onFilterChange: (filter: SiteNetworkAccessFilters) => void;
  onFilterSubmit: () => void;
};

const SiteNetworkAccessFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterSubmit }) => {
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
        <FormLabel>Location Id:</FormLabel>
        <Input
          name="customerName"
          variant="filled"
          bgColor="white"
          value={filters.locationId || ''}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              locationId: event.target.value,
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Device Id:</FormLabel>
        <Input
          name="deviceId"
          variant="filled"
          bgColor="white"
          value={filters.deviceId || ''}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              deviceId: event.target.value,
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

export default SiteNetworkAccessFilter;
