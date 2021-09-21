import React, { FC, useState, useEffect } from 'react';
import { Text, ListItem, Box, List, Input } from '@chakra-ui/react';

type Item = string;

type Props = {
  items: Item[];
  selectedItem: Item;
  onChange: (updatedInputValue: string) => void;
};

const AutocompleteMenu: FC<Props> = ({ items, selectedItem, onChange }) => {
  //   const itemList: Item[] = items;
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState(selectedItem);

  useEffect(() => {
    setInputValue(selectedItem);
  }, [selectedItem]);

  const autocompleteItem = (item: string): void => {
    setInputValue(item);
    onChange(item);
  };

  const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const filteredItems = items.filter((item: string) => {
    return item !== selectedItem;
  });

  return (
    <Box
      position="relative"
      onClick={() => setIsInputActive(true)}
      onBlur={() => {
        setTimeout(() => setIsInputActive(false), 150);
      }}
    >
      <Input
        name="inputValue"
        value={inputValue}
        onChange={handleInputValueChange}
        onBlur={() => setInputValue(selectedItem)}
      />
      {isInputActive && (
        <List
          borderX="1px solid #e9e9e9"
          position="absolute"
          borderTop="none"
          zIndex="99"
          top="100%"
          left={0}
          right={0}
          listStyleType="none"
          borderBottom="1px solid #e9e9e9"
        >
          {filteredItems.map((t, i) => (
            <ListItem
              padding={4}
              cursor="pointer"
              backgroundColor="#fff"
              _hover={{ backgroundColor: '#e9e9e9' }}
              key={`autocomplete-item-${t}`}
              borderBottomRadius={i === filteredItems.length - 1 ? 0 : 2}
              borderBottom={i === filteredItems.length - 1 ? '' : '1px solid #e9e9e9'}
              onChange={() => autocompleteItem(t)}
              onClick={() => {
                autocompleteItem(t);
              }}
              onBlur={() => setIsInputActive(false)}
            >
              <Text>{t}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AutocompleteMenu;
