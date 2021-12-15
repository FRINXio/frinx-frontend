import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, Grid, HStack, Input } from '@chakra-ui/react';

export type VpnBearerFilters = {
  id: string | null;
  description: string | null;
  neId: string | null;
  portId: string | null;
  carrierName: string | null;
  carrierReference: string | null;
  serviceType: string | null;
  serviceStatus: string | null;
  adminStatus: string | null;
  operStatus: string | null;
};

export function getDefaultBearerFilters(): VpnBearerFilters {
  return {
    id: null,
    description: null,
    neId: null,
    portId: null,
    carrierName: null,
    carrierReference: null,
    serviceType: null,
    serviceStatus: null,
    adminStatus: null,
    operStatus: null,
  };
}

type Props = {
  filters: VpnBearerFilters;
  onFilterChange: (filter: VpnBearerFilters) => void;
  onFilterSubmit: () => void;
};

const VpnBearerFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterSubmit }) => {
  return (
    <HStack marginBottom="4" alignItems="flex-end">
      <Grid templateColumns="repeat(5, 1fr)" gap={2}>
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
        <FormControl>
          <FormLabel>NeId:</FormLabel>
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
          <FormLabel>PortId:</FormLabel>
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
          <FormLabel>Carrier Name:</FormLabel>
          <Input
            name="carrierName"
            variant="filled"
            bgColor="white"
            value={filters.carrierName || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                carrierName: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Carrier Reference:</FormLabel>
          <Input
            name="carrierReference"
            variant="filled"
            bgColor="white"
            value={filters.carrierReference || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                carrierReference: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Service Type:</FormLabel>
          <Input
            name="serviceType"
            variant="filled"
            bgColor="white"
            value={filters.serviceType || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                serviceType: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Service Status:</FormLabel>
          <Input
            name="serviceStatus"
            variant="filled"
            bgColor="white"
            value={filters.serviceStatus || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                serviceStatus: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Admin Status:</FormLabel>
          <Input
            name="adminStatus"
            variant="filled"
            bgColor="white"
            value={filters.adminStatus || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                adminStatus: event.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Oper Status:</FormLabel>
          <Input
            name="operStatus"
            variant="filled"
            bgColor="white"
            value={filters.operStatus || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                operStatus: event.target.value,
              })
            }
          />
        </FormControl>
      </Grid>
      <Box>
        <Button onClick={onFilterSubmit} colorScheme="blue">
          Search
        </Button>
      </Box>
    </HStack>
  );
};

export default VpnBearerFilter;
