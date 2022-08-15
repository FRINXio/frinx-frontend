import React, { VoidFunctionComponent, useState } from 'react';
import { HStack, Button, Tooltip, Tag, Text, Box, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';

type Props = {
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  clearAllTags: () => void;
};

const SearchTags: VoidFunctionComponent<Props> = ({ selectedTags, onTagClick, clearAllTags }) => {
  return (
    <HStack>
      {selectedTags.length > 0 ? (
        <Button onClick={clearAllTags}>Clear tags</Button>
      ) : (
        <HStack>
          <Text fontSize="sm">Currently you have not selected any tag</Text>
          <Tooltip
            openDelay={10}
            placement="right"
            label="By clicking on tag of resource pool you can start filtering. By clicking on the same tag you will unselect tag"
          >
            <Box>
              <Icon verticalAlign="middle" as={FeatherIcon} icon="info" />
            </Box>
          </Tooltip>
        </HStack>
      )}
      <Box>
        {selectedTags.map((tag) => (
          <Tag variant="solid" colorScheme="blue" cursor="pointer" m={1} key={tag} onClick={() => onTagClick(tag)}>
            {tag}
          </Tag>
        ))}
      </Box>
    </HStack>
  );
};

export default SearchTags;
