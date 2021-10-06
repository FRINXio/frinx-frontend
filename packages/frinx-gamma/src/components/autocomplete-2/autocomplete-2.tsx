import { Icon, IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
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
};

// we wanna remove 'id' and 'name' from props returned from `useCombobox`
// as we wanna set them from parent `FormControl` component
function getStrippedInputProps(inputProps: InputProps): Omit<InputProps, 'id' | 'name'> {
  const { id, name, ...rest } = inputProps;
  return rest;
}

const Autocomplete2: VoidFunctionComponent<Props> = ({ items, onChange, inputVariant, selectedItem }) => {
  const [inputItems, setInputItems] = useState(items);

  const onSelectedItemChange = (changes: UseComboboxStateChange<Item>) => {
    onChange(changes.selectedItem);
  };

  const onInputValueChange = ({ inputValue }: UseComboboxStateChange<Item>) => {
    setInputItems(() => {
      if (inputValue) {
        return items.filter((item) => item.value.toLowerCase().includes(inputValue.toLowerCase()));
      }
      return items;
    });
  };

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
    onSelectedItemChange,
    selectedItem: selectedItem ?? null,
    onInputValueChange,
    itemToString: (item) => (item ? item.value : ''),
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
        <AutocompleteMenu
          items={inputItems}
          menuProps={getMenuProps()}
          highlightedIndex={highlightedIndex}
          getItemProps={getItemProps}
          isOpen={isOpen}
        />
      </InputGroup>
    </>
  );
};

export default Autocomplete2;
