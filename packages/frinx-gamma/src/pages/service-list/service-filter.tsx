import React, { FormEvent, VoidFunctionComponent } from 'react';
import { Button, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';

export type ServiceFilters = {
  id: string | null;
  customerName: string | null;
};

export const getDefaultServiceFilters = (): ServiceFilters => ({
  id: null,
  customerName: null,
});

type Props = {
  filters: ServiceFilters;
  onFilterChange: (filter: ServiceFilters) => void;
  onFilterReset: (filter: ServiceFilters) => void;
  onFilterSubmit: () => void;
};

const ServiceFilter: VoidFunctionComponent<Props> = ({ filters, onFilterChange, onFilterReset, onFilterSubmit }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack marginBottom="4" alignItems="flex-end">
        <FormControl>
          <FormLabel>VPN ID:</FormLabel>
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
          <FormLabel>Customer Name / VPN Description:</FormLabel>
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
        {/* <FormControl>
        <FormLabel>Default C Vlan:</FormLabel>
        <Select
          bgColor="white"
          value={filters.defaultCVlan || ''}
          onChange={(event) =>
            onFilterChange({
              ...filters,
              defaultCVlan: event.target.value,
            })
          }
        >
          <option value="">none</option>
          {[...Object.entries(DefaultCVlanEnum)].map((e) => {
            const [k, v] = e;
            return (
              <option key={k} value={v}>
                {`${k} (${v})`}
              </option>
            );
          })}
        </Select>
      </FormControl> */}
        <HStack>
          <Button onClick={() => onFilterReset(getDefaultServiceFilters())} colorScheme="red">
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

export default ServiceFilter;
