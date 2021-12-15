import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

export type DeviceFilters = {
  deviceId: string | null;
  managementIp: string | null;
};

export const getDefaultDeviceFilters = (): DeviceFilters => ({
  deviceId: null,
  managementIp: null,
});

type Props = {
  filters: DeviceFilters;
  onFilterChange: (filter: DeviceFilters) => void;
  onFilterSubmit: () => void;
};

const SiteFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterSubmit }) => {
  return (
    <HStack marginBottom="4" alignItems="flex-end">
      <FormControl>
        <FormLabel>Id:</FormLabel>
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
      <FormControl>
        <FormLabel>Management IP:</FormLabel>
        <Input
          name="managementIp"
          variant="filled"
          bgColor="white"
          value={filters.managementIp || ''}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              managementIp: event.target.value,
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

export default SiteFilter;
