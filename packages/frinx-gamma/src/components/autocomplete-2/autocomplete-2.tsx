import { Icon, IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import FeatherIcon from 'feather-icons-react';
import React, { FC, useState } from 'react';
import AutocompleteMenu from './autocomplete-menu';

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

  const onSelectedItemChange = (changes: UseComboboxStateChange<string>) => {
    onChange(changes.selectedItem);
  };

  const onInputValueChange = ({ inputValue }: UseComboboxStateChange<string>) => {
    setInputItems(() => {
      if (inputValue) {
        return items.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()));
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
    selectedItem: selectedItem ?? '',
    onInputValueChange,
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
