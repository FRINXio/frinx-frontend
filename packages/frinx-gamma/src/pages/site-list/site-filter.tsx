import React, { FormEvent, useState, VoidFunctionComponent } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, FormLabel, Grid, HStack, Input, Text } from '@chakra-ui/react';

export type SiteFilters = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
  street: string | null;
  postalCode: string | null;
  state: string | null;
  city: string | null;
  countryCode: string | null;
};

export function getDefaultSiteFilter(): SiteFilters {
  return {
    id: null,
    locationId: null,
    deviceId: null,
    street: null,
    postalCode: null,
    state: null,
    city: null,
    countryCode: null,
  };
}

type Props = {
  filters: SiteFilters;
  onFilterChange: (filter: SiteFilters) => void;
  onFilterReset: (filter: SiteFilters) => void;
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
          <Grid templateColumns="repeat(4, 1fr)" gap="2">
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
            <FormControl>
              <FormLabel>Street:</FormLabel>
              <Input
                name="street"
                variant="filled"
                bgColor="white"
                value={filters.street || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    street: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Postal Code:</FormLabel>
              <Input
                name="postalCode"
                variant="filled"
                bgColor="white"
                value={filters.postalCode || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    postalCode: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>State:</FormLabel>
              <Input
                name="state"
                variant="filled"
                bgColor="white"
                value={filters.state || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    state: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>City:</FormLabel>
              <Input
                name="city"
                variant="filled"
                bgColor="white"
                value={filters.city || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    city: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Country Code:</FormLabel>
              <Input
                name="countryCode"
                variant="filled"
                bgColor="white"
                value={filters.countryCode || ''}
                onChange={(event) =>
                  onFilterChange({
                    ...filters,
                    countryCode: event.target.value,
                  })
                }
              />
            </FormControl>
          </Grid>
          <HStack>
            <Button onClick={() => onFilterReset(getDefaultSiteFilter())} colorScheme="red">
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
