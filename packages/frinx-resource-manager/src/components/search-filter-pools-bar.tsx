import { HStack, Select, Spacer, Button } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { SearchByTag } from '@frinx/shared/src';
import { Searchbar } from './searchbar';

type Props = {
  searchText: string;
  resourceTypes?: { Name: string; id: string }[];
  selectedResourceType?: string;
  selectedTags: string[];
  canFilterByResourceType?: boolean;
  setSearchText: (text: string) => void;
  setSelectedResourceType?: (value: string) => void;
  onClearSearch?: () => void;
  clearAllTags: () => void;
  onTagClick: (tag: string) => void;
};

const SearchFilterPoolsBar: VoidFunctionComponent<Props> = ({
  searchText,
  setSearchText,
  selectedTags,
  resourceTypes,
  clearAllTags,
  onClearSearch,
  onTagClick,
  selectedResourceType,
  setSelectedResourceType,
  canFilterByResourceType = false,
}) => {
  return (
    <>
      <HStack mb={5}>
        <Searchbar data-cy="search-by-name" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        {canFilterByResourceType && resourceTypes != null && (
          <Select
            data-cy="select-resource-type"
            value={selectedResourceType}
            onChange={(e) =>
              setSelectedResourceType &&
              setSelectedResourceType(e.target.value === 'Select resource type to filter' ? '' : e.target.value)
            }
            variant="outline"
            bgColor="white"
          >
            <option onChange={() => setSelectedResourceType && setSelectedResourceType('')}>
              Select resource type to filter
            </option>
            {resourceTypes.map(({ Name, id }) => (
              <option key={id} value={id}>
                {Name}
              </option>
            ))}
          </Select>
        )}
      </HStack>
      <HStack mb={5}>
        <SearchByTag selectedTags={selectedTags} onTagClick={onTagClick} clearAllTags={clearAllTags} />
        <Spacer />
        <Button
          data-cy="clear-all-btn"
          variant="outline"
          colorScheme="red"
          onClick={() => onClearSearch && onClearSearch()}
        >
          Clear all
        </Button>
      </HStack>
    </>
  );
};

export default SearchFilterPoolsBar;
