import React, { FC, useState, useEffect } from 'react';
import { Text, ListItem, Box, List, Input } from '@chakra-ui/react';
import Fuse from 'fuse.js';

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

  // const fuse = new Fuse(items, {
  //   threshold: 0.4,
  //   shouldSort: false,
  // });

  useEffect(() => {
    setInputValue(selectedItem);
  }, [selectedItem]);

  const autocompleteItem = (item: string): void => {
    console.log('autocompleteItem: ', item);
    setInputValue(item);
    onChange(item);
  };

  const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('inputValueChanged', inputValue);
    setInputValue(event.target.value);
  };

  // const searchedItems = inputValue ? fuse.search(inputValue).map((fr) => fr.item) : items;

  const filteredItems = items
    .filter((item) => {
      return item !== selectedItem;
    })
    .filter((item) => {
      return item.toLowerCase().startsWith(inputValue.toLowerCase());
    });

  console.log(filteredItems);
  console.log('render autocomplete', inputValue, isInputActive);

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
              onChange={(event) => {
                event.persist();
                autocompleteItem(t);
              }}
              onClick={(event) => {
                event.persist();
                autocompleteItem(t);
              }}
              onBlur={(event) => {
                event.persist();
                setIsInputActive(false);
              }}
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
