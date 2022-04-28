import React, { useState, VoidFunctionComponent } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, FormLabel, Grid, HStack, Input, Text } from '@chakra-ui/react';

export type VpnBearerFilters = {
  id: string | null;
  description: string | null;
  neId: string | null;
  portId: string | null;
  carrierName: string | null;
  carrierReference: string | null;
  serviceType: string | null;
  serviceStatus: string | null;

  circuitReference: string | null;
  carrierEvcReference: string | null;
  inputBandwidth: string | null;
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

    circuitReference: null,
    carrierEvcReference: null,
    inputBandwidth: null,
    adminStatus: null,
    operStatus: null,
  };
}

type Props = {
  filters: VpnBearerFilters;
  onFilterChange: (filter: VpnBearerFilters) => void;
  onFilterReset: (filter: VpnBearerFilters) => void;
  onFilterSubmit: () => void;
};

const VpnBearerFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterReset, onFilterSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Box my="2">
        <Button onClick={() => setIsOpen(!isOpen)} variant="link">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          <Text paddingLeft={1}>Filters</Text>
        </Button>
      </Box>
      {isOpen && (
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

            {/* evc filters */}
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
              <FormLabel>Carrier Evc Reference:</FormLabel>
              <Input
                name="carrierEvcReference"
                variant="filled"
                bgColor="white"
                value={filters.carrierEvcReference || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    carrierEvcReference: event.target.value,
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
            <Button onClick={() => onFilterReset(getDefaultBearerFilters())} colorScheme="red">
              Clear
            </Button>
            <Button onClick={onFilterSubmit} colorScheme="blue">
              Search
            </Button>
          </HStack>
        </HStack>
      )}
    </>
  );
};

export default VpnBearerFilter;
