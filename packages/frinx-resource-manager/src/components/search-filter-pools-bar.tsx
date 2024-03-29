import { HStack, Select, Spacer, Button } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { SearchByTag } from '@frinx/shared';
import { Searchbar } from './searchbar';
import SearchByAllocatedResources from './search-by-allocated-resources';

type Props = {
  searchName: string;
  resourceTypes?: { Name: string; id: string }[];
  selectedResourceType?: string;
  allocatedResources?: { [key: string]: string };
  selectedTags: string[];
  canFilterByResourceType?: boolean;
  setAllocatedResources?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setSelectedResourceType?: (value: string) => void;
  onClearSearch?: () => void;
  clearAllTags: () => void;
  onSearchClick?: () => void;
  onTagClick: (tag: string) => void;
  setSearchName: (value: string) => void;
  canFilterByAllocatedResources?: boolean;
  searchBy?: string;
};

const SearchFilterPoolsBar: VoidFunctionComponent<Props> = ({
  searchName,
  onSearchClick,
  allocatedResources,
  setAllocatedResources,
  setSearchName,
  searchBy = 'name',
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
  const onClearSearchClick = () => {
    if (onClearSearch) {
      onClearSearch();
    }
    if (setAllocatedResources) {
      setAllocatedResources({});
    }

    setSearchName('');
  };

  return (
    <>
      <HStack mb={5}>
        <Searchbar
          placeholder={`Search by ${searchBy}`}
          data-cy="search-by-name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
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
      {canFilterByAllocatedResources && allocatedResources && setAllocatedResources && (
        <SearchByAllocatedResources
          allocatedResources={allocatedResources}
          setAllocatedResources={setAllocatedResources}
        />
      )}
      <HStack mb={5}>
        <SearchByTag selectedTags={selectedTags} onTagClick={onTagClick} clearAllTags={clearAllTags} />
        <Spacer />
        <Button data-cy="clear-all-btn" variant="outline" colorScheme="red" onClick={onClearSearchClick}>
          Clear all
        </Button>
        <Button data-cy="Search-btn" colorScheme="blue" onClick={onSearchClick}>
          Search
        </Button>
      </HStack>
    </>
  );
};

export default SearchFilterPoolsBar;
