import React, { FormEvent, VoidFunctionComponent } from 'react';
import { Button, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

export type LocationFilters = {
  locationId: string | null;
  street: string | null;
  postalCode: string | null;
  state: string | null;
  city: string | null;
  countryCode: string | null;
};

export function getDefaultLocationFilters(): LocationFilters {
  return {
    locationId: null,
    street: null,
    postalCode: null,
    state: null,
    city: null,
    countryCode: null,
  };
}

type Props = {
  filters: LocationFilters;
  onFilterChange: (filter: LocationFilters) => void;
  onFilterReset: (filter: LocationFilters) => void;
  onFilterSubmit: () => void;
};

const SiteFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterReset, onFilterSubmit }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack marginBottom="4" alignItems="flex-end">
        <FormControl>
          <FormLabel>Location Id:</FormLabel>
          <Input
            name="locationId"
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
          <FormLabel>Street:</FormLabel>
          <Input
            name="steet"
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
        <HStack>
          <Button onClick={() => onFilterReset(getDefaultLocationFilters())} colorScheme="red">
            Clear
          </Button>
          <Button type="submit" colorScheme="blue">
            Search
          </Button>
        </HStack>
      </HStack>
    </form>
  );
};

export default SiteFilter;
