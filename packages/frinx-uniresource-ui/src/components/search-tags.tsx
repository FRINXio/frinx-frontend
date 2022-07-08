import React, { VoidFunctionComponent } from 'react';
import { Icon, InfoIcon } from '@chakra-ui/icons';
import { HStack, Button, Tooltip, Tag, Text } from '@chakra-ui/react';

type Props = {
  selectedTags: string[];
  handleOnTagClick: (tag: string) => void;
  clearAllTags: () => void;
};

const SearchTags: VoidFunctionComponent<Props> = ({ selectedTags, handleOnTagClick, clearAllTags }) => {
  return (
    <HStack mb={5}>
      {selectedTags.length > 0 ? (
        <Button onClick={clearAllTags}>Clear all</Button>
      ) : (
        <HStack>
          <Text fontSize="sm">Currently you have not selected any tag</Text>
          <Tooltip
            label="By clicking on tag of resource pool you can start filtering. By clicking on the same tag you will unselect
    tag"
          >
            <Icon cursor="pointer" as={InfoIcon} />
          </Tooltip>
        </HStack>
      )}
      <HStack>
        {selectedTags.map((tag) => (
          <Tag variant="solid" colorScheme="blue" cursor="pointer" key={tag} onClick={() => handleOnTagClick(tag)}>
            {tag}
          </Tag>
        ))}
      </HStack>
    </HStack>
  );
};

export default SearchTags;
