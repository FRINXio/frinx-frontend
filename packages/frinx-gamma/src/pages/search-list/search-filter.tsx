import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, Grid, HStack, Input } from '@chakra-ui/react';

export type SearchFilters = {
  vpnId: string | null;
  siteId: string | null;
  customerName: string | null;
  neId: string | null;
  portId: string | null;
  circuitReference: string | null;
  deviceId: string | null;
  bearerReference: string | null;
  siteRole: string | null;
  spBearerReference: string | null;
};

export function getDefaultSearchFilters(): SearchFilters {
  return {
    vpnId: null,
    siteId: null,
    customerName: null,
    neId: null,
    portId: null,
    circuitReference: null,
    deviceId: null,
    bearerReference: null,
    siteRole: null,
    spBearerReference: null,
  };
}

type Props = {
  isFetching: boolean;
  filters: SearchFilters;
  onFilterChange: (filter: SearchFilters) => void;
  onFilterSubmit: () => void;
};

const SearchFilter: VoidFunctionComponent<Props> = ({ isFetching, filters, onFilterChange, onFilterSubmit }) => {
  return (
    <HStack marginBottom="4" alignItems="flex-end">
      <Grid flex="1" templateColumns="repeat(5, 1fr)" gap={4}>
        <FormControl>
          <FormLabel>VPN ID:</FormLabel>
          <Input
            name="id"
            variant="filled"
            bgColor="white"
            value={filters.vpnId || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                vpnId: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Customer Name:</FormLabel>
          <Input
            name="customerName"
            variant="filled"
            bgColor="white"
            value={filters.customerName || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                customerName: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Ne Id:</FormLabel>
          <Input
            name="neId"
            variant="filled"
            bgColor="white"
            value={filters.neId || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                neId: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Port Id:</FormLabel>
          <Input
            name="portId"
            variant="filled"
            bgColor="white"
            value={filters.portId || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                portId: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Site Id:</FormLabel>
          <Input
            name="siteId"
            variant="filled"
            bgColor="white"
            value={filters.siteId || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                siteId: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Circuit Reference:</FormLabel>
          <Input
            name="circuitReference"
            variant="filled"
            bgColor="white"
            value={filters.circuitReference || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                circuitReference: event.target.value,
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
        <FormControl>
          <FormLabel>Bearer Reference:</FormLabel>
          <Input
            name="bearerReference"
            variant="filled"
            bgColor="white"
            value={filters.bearerReference || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                bearerReference: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Site Role:</FormLabel>
          <Input
            name="siteRole"
            variant="filled"
            bgColor="white"
            value={filters.siteRole || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                siteRole: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Sp Bearer Reference:</FormLabel>
          <Input
            name="spBearerReference"
            variant="filled"
            bgColor="white"
            value={filters.spBearerReference || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                spBearerReference: event.target.value,
              })
            }
          />
        </FormControl>
      </Grid>
      <Box>
        <Button onClick={onFilterSubmit} colorScheme="blue" isDisabled={isFetching}>
          Search
        </Button>
      </Box>
    </HStack>
  );
};

export default SearchFilter;
