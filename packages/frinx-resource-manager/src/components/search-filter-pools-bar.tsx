import { HStack, Select, Spacer, Button, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { SearchByTag } from '@frinx/shared/src';
import { Searchbar } from './searchbar';

type InputValues = { [key: string]: string };

type Props = {
  searchText: string;
  resourceTypes?: { Name: string; id: string }[];
  selectedResourceType?: string;
  allocatedResources: { [key: string]: string };
  selectedTags: string[];
  canFilterByResourceType?: boolean;
  setSearchText: (text: string) => void;
  setAllocatedResources: React.Dispatch<React.SetStateAction<InputValues>>;
  setSelectedResourceType?: (value: string) => void;
  onClearSearch?: () => void;
  clearAllTags: () => void;
  onTagClick: (tag: string) => void;
  canFilterByAllocatedResources?: boolean;
};

const SearchFilterPoolsBar: VoidFunctionComponent<Props> = ({
  searchText,
  allocatedResources,
  setAllocatedResources,
  setSearchText,
  selectedTags,
  resourceTypes,
  clearAllTags,
  onClearSearch,
  onTagClick,
  selectedResourceType,
  setSelectedResourceType,
  canFilterByResourceType = false,
  canFilterByAllocatedResources = false,
}) => {
  const handleInputChange = (propertyName: string, value: string) => {
    setAllocatedResources((prevInputValues: Record<string, string>) => {
      const updatedInputValues = { ...prevInputValues };
      if (value === '') {
        delete updatedInputValues[propertyName];
      } else {
        updatedInputValues[propertyName] = value;
      }
      return updatedInputValues;
    });
  };

  const onClearSearchClick = () => {
    if (onClearSearch) {
      onClearSearch();
    }
    const resourcesCopy = { ...allocatedResources };
    delete resourcesCopy.address;
    delete resourcesCopy.prefix;
    delete resourcesCopy.subnet;
    delete resourcesCopy.from;
    delete resourcesCopy.to;

    setAllocatedResources(resourcesCopy);
  };

  const properties = ['address', 'prefix', 'subnet', 'from', 'to'];

  return (
    <>
      <HStack mb={5}>
        <Searchbar
          placeholder="Search by name"
          data-cy="search-by-name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {canFilterByResourceType && resourceTypes != null && (
          <Select
            data-cy="select-resource-type"
            value={selectedResourceType}
            onChange={(e) => setSelectedResourceType && setSelectedResourceType(e.target.value)}
            variant="outline"
            bgColor="white"
          >
            <option value="">Select resource type to filter</option>
            {resourceTypes.map(({ Name, id }) => (
              <option key={id} value={id}>
                {Name}
              </option>
            ))}
          </Select>
        )}
      </HStack>
      <Heading as="h3" size="l" mb={3}>
        Search by allocated resources
      </Heading>
      <Flex gap={1}>
        {canFilterByAllocatedResources &&
          properties.map((property) => {
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
      <HStack mb={5}>
        <SearchByTag selectedTags={selectedTags} onTagClick={onTagClick} clearAllTags={clearAllTags} />
        <Spacer />
        <Button data-cy="clear-all-btn" variant="outline" colorScheme="red" onClick={onClearSearchClick}>
          Clear all
        </Button>
      </HStack>
    </>
  );
};

export default SearchFilterPoolsBar;
