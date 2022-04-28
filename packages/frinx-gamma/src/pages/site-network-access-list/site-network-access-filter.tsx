import React, { VoidFunctionComponent } from 'react';
import { Button, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

export type SiteNetworkAccessFilters = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
};

export const getDefaultSiteNetworkAccessFilters = (): SiteNetworkAccessFilters => ({
  id: null,
  locationId: null,
  deviceId: null,
});

type Props = {
  filters: SiteNetworkAccessFilters;
  onFilterChange: (filter: SiteNetworkAccessFilters) => void;
  onFilterReset: (filter: SiteNetworkAccessFilters) => void;
  onFilterSubmit: () => void;
};

const SiteNetworkAccessFilter: VoidFunctionComponent<Props> = ({
  filters,
  onFilterChange,
  onFilterReset,
  onFilterSubmit,
}) => {
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
      <HStack>
        <Button onClick={() => onFilterReset(getDefaultSiteNetworkAccessFilters())} colorScheme="red">
          Clear
        </Button>
        <Button onClick={onFilterSubmit} colorScheme="blue">
          Search
        </Button>
      </HStack>
    </HStack>
  );
};

export default SiteNetworkAccessFilter;
