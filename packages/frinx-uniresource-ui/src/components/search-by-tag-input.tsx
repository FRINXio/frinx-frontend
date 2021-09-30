import { Box } from '@chakra-ui/react';
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import React, { FC } from 'react';

type Props = {
  selectedTags: Item[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
  onTagCreate?: (label: Item) => void;
  tagText?: string;
};

const SearchByTagInput: FC<Props> = ({
  selectedTags,
  onTagCreate,
  isCreationDisabled = false,
  onSelectionChange,
  tagText = 'Select tags',
}) => {
  const selectedTagList = selectedTags.map(({ label, value }) => {
    return { label, value };
  });

  return (
    // autocomplete lib has some weird styling at the bottom
    <Box position="relative" paddingBottom={0}>
      <CUIAutoComplete
        label={tagText}
        labelStyleProps={{
          marginBottom: 0,
        }}
        inputStyleProps={{
          variant: 'filled',
        }}
        placeholder="Start typing..."
        onCreateItem={onTagCreate}
        items={[]}
        selectedItems={selectedTagList}
        onSelectedItemsChange={(changes) => onSelectionChange(changes.selectedItems)}
        disableCreateItem={isCreationDisabled}
        hideToggleButton
        listStyleProps={{
          position: 'absolute',
          right: 0,
          left: 0,
          zIndex: 100,
        }}
      />
    </Box>
  );
};

export default SearchByTagInput;
