import React, { VoidFunctionComponent } from 'react';
import { Box, Button, FormControl, FormLabel, Grid, HStack, Input } from '@chakra-ui/react';

export type EvcFilters = {
  circuitReference: string | null;
  carrierReference: string | null;
  inputBandwidth: string | null;
  customerName: string | null;
  adminStatus: string | null;
  operStatus: string | null;
};

export function getDefaultEvcFilters(): EvcFilters {
  return {
    circuitReference: null,
    carrierReference: null,
    inputBandwidth: null,
    customerName: null,
    adminStatus: null,
    operStatus: null,
  };
}

type Props = {
  filters: EvcFilters;
  onFilterChange: (filter: EvcFilters) => void;
  onFilterSubmit: () => void;
};

const SiteFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterSubmit }) => {
  return (
    <HStack marginBottom="4" alignItems="flex-end">
      <Grid flex="1" templateColumns="repeat(3, 1fr)" gap={4}>
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
          <FormLabel>Input Bandwidth:</FormLabel>
          <Input
            name="inputBandwidth"
            variant="filled"
            bgColor="white"
            value={filters.inputBandwidth || ''}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                inputBandwidth: event.target.value,
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

export default SiteFilter;
