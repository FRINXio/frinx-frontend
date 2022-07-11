import { HStack, Select, Spacer, Button } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import SearchTags from './search-tags';
import { Searchbar } from './searchbar';

type Props = {
  searchText: string;
  resourceTypes?: { Name: string; id: string }[];
  selectedResourceType?: string;
  selectedTags: string[];
  canFilterByResourceType?: boolean;
  setSearchText: (text: string) => void;
  setSelectedResourceType?: (value: string) => void;
  clearSearch?: () => void;
  clearAllTags: () => void;
  handleOnTagClick: (tag: string) => void;
};

const SearchFilterPoolsBar: VoidFunctionComponent<Props> = ({
  searchText,
  setSearchText,
  selectedTags,
  resourceTypes,
  clearAllTags,
  clearSearch,
  handleOnTagClick,
  selectedResourceType,
  setSelectedResourceType,
  canFilterByResourceType = false,
}) => {
  return (
    <>
      <HStack mb={5}>
        <Searchbar value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        {canFilterByResourceType && resourceTypes != null && (
          <Select
            value={selectedResourceType}
            onChange={(e) => setSelectedResourceType && setSelectedResourceType(e.target.value)}
            variant="outline"
            bgColor="white"
          >
            <option onClick={() => setSelectedResourceType && setSelectedResourceType('')}>
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
        <SearchTags selectedTags={selectedTags} handleOnTagClick={handleOnTagClick} clearAllTags={clearAllTags} />
        <Spacer />
        <Button variant="outline" colorScheme="red" onClick={() => clearSearch && clearSearch()}>
          Clear all
        </Button>
      </HStack>
    </>
  );
};

export default SearchFilterPoolsBar;
