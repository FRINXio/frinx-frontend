import { Box, Flex } from '@chakra-ui/react';
import React, { HTMLAttributes, VoidFunctionComponent } from 'react';

type Direction = 'down' | 'up';

type Item = {
  label: string;
  value: string;
};
type Props = {
  direction: Direction;
  items: Item[];
  menuProps: HTMLAttributes<HTMLElement>;
  isOpen: boolean;
  inputValue: string;
  isCreating: boolean;
  highlightedIndex: number;
  getItemProps: (options: { item: Item; index: number }) => HTMLAttributes<HTMLElement>;
  selectItem: (item: Item) => void;
};

const AutocompleteMenu: VoidFunctionComponent<Props> = ({
  direction,
  items,
  menuProps,
  isOpen,
  highlightedIndex,
  getItemProps,
  isCreating,
  inputValue,
  selectItem,
}) => {
  const menuDirection =
    direction === 'up'
      ? {
          bottom: '100%',
        }
      : {
          top: '100%',
        };

  return (
    <Box
      {...menuProps}
      {...menuDirection}
      position="absolute"
      right="0"
      left="0"
      zIndex="dropdown"
      transform="translateY(6px)"
    >
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
                key={item.value}
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
                {item.label}
              </Flex>
            );
          })}
          {isCreating && inputValue && (
            <Flex
              as="button"
              type="button"
              key={inputValue}
              alignItems="center"
              paddingY={1.5}
              paddingX={3}
              width="100%"
              minHeight={12}
              outline="#000 2px"
              outlineOffset="2px"
              background="blue.200"
              _hover={{
                background: 'blue.100',
              }}
              onClick={() =>
                selectItem({
                  value: inputValue,
                  label: inputValue,
                })
              }
            >
              {`Create "${inputValue}"`}
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AutocompleteMenu;
