import { Box, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Searchbar } from './searchbar';

type InputValues = { [key: string]: string };

type Props = {
  allocatedResources: { [key: string]: string };
  setAllocatedResources: React.Dispatch<React.SetStateAction<InputValues>>;
};

const SearchByAllocatedResources: VoidFunctionComponent<Props> = ({ allocatedResources, setAllocatedResources }) => {
  const handleInputChange = (propertyName: string, value: string) => {
    setAllocatedResources((prevInputValues: Record<string, string>) => {
      const { [propertyName]: _, ...updatedInputValues } = prevInputValues;

      return { ...updatedInputValues, ...(value !== '' && { [propertyName]: value }) };
    });
  };

  const properties = ['address', 'prefix', 'subnet', 'from', 'to'];

  return (
    <Box mb={5}>
      <Heading textAlign="left" as="h3" size="l" mb={3}>
        Search by allocated resources
      </Heading>
      <Flex gap={1}>
        {properties.map((property) => {
          return (
            <Searchbar
              key={property}
              mb={5}
              placeholder={property}
              data-cy={`search-by-${property}`}
              value={allocatedResources[property] || ''}
              onChange={(e) => handleInputChange(property, e.target.value)}
            />
          );
        })}
      </Flex>
    </Box>
  );
};

export default SearchByAllocatedResources;
