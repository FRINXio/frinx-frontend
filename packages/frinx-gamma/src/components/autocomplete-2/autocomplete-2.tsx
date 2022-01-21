import { Icon, IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import FeatherIcon from 'feather-icons-react';
import React, { useState, useEffect, VoidFunctionComponent } from 'react';
import AutocompleteMenu from './autocomplete-menu';

export type Item = {
  label: string;
  value: string;
};
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

const Autocomplete2: VoidFunctionComponent<Props> = ({
  items,
  onCreateItem,
  onChange,
  inputVariant,
  selectedItem,
  isDisabled,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [inputItems, setInputItems] = useState(items);

  const onInputValueChange = ({ inputValue }: UseComboboxStateChange<Item>) => {
    const filteredItems = items.filter((item) => item.value.toLowerCase().includes((inputValue || '').toLowerCase()));

    if (isCreating && filteredItems.length > 0) {
      setIsCreating(false);
    }

    setInputItems(filteredItems);
  };

  const onSelectedItemChange = (changes: UseComboboxStateChange<Item>) => {
    onChange(changes.selectedItem);
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
    const isInputvalueExisitingItem = items.map((i) => i.value.toLowerCase()).includes(inputValue);
    if (!isInputvalueExisitingItem) {
      setIsCreating(true);
      if (onCreateItem) {
        setHighlightedIndex(0);
      }
    }
  }, [items, inputItems, setIsCreating, setHighlightedIndex, inputValue, onCreateItem]);

  return (
    <>
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
    </>
  );
};

export default Autocomplete2;
