import React, { FormEvent, VoidFunctionComponent, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, FormLabel, Grid, HStack, Input, Text } from '@chakra-ui/react';

export type EvcFilters = {
  evcType: string | null;
  circuitReference: string | null;
  carrierReference: string | null;
  svlanId: string | null;
  inputBandwidth: string | null;
  qosProfile: string | null;
  customerName: string | null;
  adminStatus: string | null;
  operStatus: string | null;
};

export function getDefaultEvcFilters(): EvcFilters {
  return {
    evcType: null,
    circuitReference: null,
    carrierReference: null,
    svlanId: null,
    inputBandwidth: null,
    qosProfile: null,
    customerName: null,
    adminStatus: null,
    operStatus: null,
  };
}

type Props = {
  filters: EvcFilters;
  onFilterChange: (filter: EvcFilters) => void;
  onFilterReset: (filter: EvcFilters) => void;
  onFilterSubmit: () => void;
};

const SiteFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterReset, onFilterSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box my="2">
        <Button onClick={() => setIsOpen(!isOpen)} variant="link">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          <Text paddingLeft={1}>Filters</Text>
        </Button>
      </Box>
      {isOpen && (
        <HStack marginBottom="4" alignItems="flex-end">
          <Grid flex="1" templateColumns="repeat(5, 1fr)" gap={4}>
            <FormControl>
              <FormLabel>EVC Type:</FormLabel>
              <Input
                name="evcType"
                variant="filled"
                bgColor="white"
                value={filters.evcType || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    evcType: event.target.value,
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
              <FormLabel>Svlan Id:</FormLabel>
              <Input
                name="svlanId"
                variant="filled"
                bgColor="white"
                value={filters.svlanId || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    svlanId: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Qos Profile:</FormLabel>
              <Input
                name="qosProfile"
                variant="filled"
                bgColor="white"
                value={filters.qosProfile || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    qosProfile: event.target.value,
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
          <HStack>
            <Button onClick={() => onFilterReset(getDefaultEvcFilters())} colorScheme="red">
              Clear
            </Button>
            <Button type="submit" colorScheme="blue">
              Search
            </Button>
          </HStack>
        </HStack>
      )}
    </form>
  );
};

export default SiteFilter;
