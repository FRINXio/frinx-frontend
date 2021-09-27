import { Box, Flex, Icon, IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';
import { useCombobox } from 'downshift';
import FeatherIcon from 'feather-icons-react';
import React, { FC, useState } from 'react';

type Item = string;
type Props = {
  items: Item[];
  onChange: (item?: string | null) => void;
  inputVariant?: InputProps['variant'];
  selectedItem: string | null | undefined;
};

// we wanna remove 'id' and 'name' from props returned from `useCombobox`
// as we wanna set them from parent `FormControl` component
function getStrippedInputProps(inputProps: InputProps): Omit<InputProps, 'id' | 'name'> {
  const { id, name, ...rest } = inputProps;
  return rest;
}

const Autocomplete2: FC<Props> = ({ items, onChange, inputVariant, selectedItem }) => {
  const [inputItems, setInputItems] = useState(items);
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onSelectedItemChange: (changes) => {
      onChange(changes.selectedItem);
    },
    selectedItem: selectedItem ?? '',
    onInputValueChange: ({ inputValue }) => {
      setInputItems(() => {
        if (inputValue) {
          return items.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()));
        }
        return items;
      });
    },
  });

  return (
    <>
      <InputGroup {...getComboboxProps()} position="relative">
        <Input variant={inputVariant} {...getStrippedInputProps(getInputProps())} />
        <InputRightElement>
          <IconButton
            variant="ghost"
            size="sm"
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            icon={<Icon as={FeatherIcon} icon={isOpen ? 'chevron-up' : 'chevron-down'} />}
          />
        </InputRightElement>
        <Box
          {...getMenuProps()}
          position="absolute"
          top="100%"
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
              {inputItems.map((item, index) => {
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
      </InputGroup>
    </>
  );
};

export default Autocomplete2;
