import { Box, Flex } from '@chakra-ui/react';
import React, { FC, HTMLAttributes } from 'react';

type Item = string;
type Props = {
  items: Item[];
  menuProps: HTMLAttributes<HTMLElement>;
  isOpen: boolean;
  highlightedIndex: number;
  getItemProps: (options: { item: string; index: number }) => HTMLAttributes<HTMLElement>;
};

const AutocompleteMenu: FC<Props> = ({ items, menuProps, isOpen, highlightedIndex, getItemProps }) => {
  return (
    <Box {...menuProps} position="absolute" top="100%" right="0" left="0" zIndex="dropdown" transform="translateY(6px)">
      {isOpen && (
        <Box
          paddingY={2}
          background="white"
          borderRadius="md"
          borderColor="gray.200"
          borderWidth="1px"
          borderStyle="solid"
          outline="#000 2px"
          outlineOffset="2px"
          boxShadow="sm"
          maxHeight={60}
          overflowY="auto"
        >
          {items.map((item, index) => {
            return (
              <Flex
                as="button"
                type="button"
                key={item}
                alignItems="center"
                paddingY={1.5}
                paddingX={3}
                width="100%"
                minHeight={12}
                outline="#000 2px"
                outlineOffset="2px"
                background={highlightedIndex === index ? 'gray.200' : 'transparent'}
                _hover={{
                  background: 'gray.100',
                }}
                {...getItemProps({ item, index })}
              >
                {item}
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AutocompleteMenu;
