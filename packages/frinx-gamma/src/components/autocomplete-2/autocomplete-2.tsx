import { Box, Icon, IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import FeatherIcon from 'feather-icons-react';
import React, { useState, useEffect, useRef, VoidFunctionComponent } from 'react';
import Fuse from 'fuse.js';
import AutocompleteMenu from './autocomplete-menu';
import unwrap from '../../helpers/unwrap';

const MAX_MENU_HEIGHT = 200;

export type Item = {
  label: string;
  value: string;
};

type Direction = 'up' | 'down';

type Props = {
  items: Item[];
  onChange: (item?: Item | null) => void;
  inputVariant?: InputProps['variant'];
  selectedItem: Item | null | undefined;
  onCreateItem?: (item: Item) => void;
  isDisabled?: boolean;
};

// we wanna remove 'id' and 'name' from props returned from `useCombobox`
// as we wanna set them from parent `FormControl` component
function getStrippedInputProps(inputProps: InputProps): Omit<InputProps, 'id' | 'name'> {
  const { id, name, ...rest } = inputProps;
  return rest;
}

function initFuse(items: Item[]): Fuse<Item> {
  const options = {
    keys: ['label', 'value'],
    fieldNormWeight: 1,
  };
  return new Fuse(items, options);
}

const Autocomplete2: VoidFunctionComponent<Props> = ({
  items,
  onCreateItem,
  onChange,
  inputVariant,
  selectedItem,
  isDisabled,
}) => {
  const fuse = initFuse(items);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [inputItems, setInputItems] = useState(items);
  const [menuDirection, setMenuDirection] = useState<Direction>('down');

  const onInputValueChange = ({ inputValue }: UseComboboxStateChange<Item>) => {
    const filteredItems: Item[] = inputValue ? fuse.search(inputValue).map((result) => result.item) : inputItems;

    if (isCreating && filteredItems.length > 0) {
      setIsCreating(false);
    }

    setInputItems(filteredItems);
  };

  const onSelectedItemChange = (changes: UseComboboxStateChange<Item>) => {
    onChange(changes.selectedItem);
  };

  const scrollHandler = () => {
    const { y } = unwrap(inputRef.current).getBoundingClientRect();
    const { innerHeight: height } = window;

    const newDirection = height - y > MAX_MENU_HEIGHT ? 'down' : 'up';
    setMenuDirection(newDirection);
  };

  const {
    isOpen,
    closeMenu,
    selectItem,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setHighlightedIndex,
    inputValue,
  } = useCombobox({
    items: inputItems,
    onSelectedItemChange,
    selectedItem: selectedItem ?? null,
    onInputValueChange,
    itemToString: (item) => (item ? item.value : ''),
    onStateChange: (changes) => {
      if (changes.selectedItem?.value === inputValue && !items.includes(changes.selectedItem)) {
        if (onCreateItem) {
          onCreateItem({
            ...changes.selectedItem,
            label: changes.selectedItem.value,
          });
          closeMenu();
        }
        setInputItems(inputItems);
        setIsCreating(false);
      }
    },
  });

  useEffect(() => {
    setInputItems(items);
  }, [items]);

  useEffect(() => {
    if (!onCreateItem) {
      return;
    }
    const isInputvalueExisitingItem = items.map((i) => i.value.toLowerCase()).includes(inputValue);
    if (!isInputvalueExisitingItem) {
      setIsCreating(true);
      setHighlightedIndex(0);
    }
  }, [items, inputItems, setIsCreating, setHighlightedIndex, inputValue, onCreateItem]);

  useEffect(() => {
    if (!inputRef.current) {
      scrollHandler();
      window.addEventListener('scroll', scrollHandler, true);
    }

    return () => {
      window.removeEventListener('scroll', scrollHandler, true);
    };
  }, []);

  return (
    <Box ref={inputRef}>
      <InputGroup {...getComboboxProps()} position="relative">
        <Input isDisabled={isDisabled} variant={inputVariant} {...getStrippedInputProps(getInputProps())} />
        <InputRightElement>
          <IconButton
            isDisabled={isDisabled}
            variant="ghost"
            size="sm"
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            icon={<Icon as={FeatherIcon} icon={isOpen ? 'chevron-up' : 'chevron-down'} />}
          />
        </InputRightElement>
        <AutocompleteMenu
          direction={menuDirection}
          items={inputItems}
          menuProps={getMenuProps()}
          highlightedIndex={highlightedIndex}
          getItemProps={getItemProps}
          isOpen={isOpen}
          isCreating={isCreating}
          inputValue={inputValue}
          selectItem={selectItem}
        />
      </InputGroup>
    </Box>
  );
};

export default Autocomplete2;
