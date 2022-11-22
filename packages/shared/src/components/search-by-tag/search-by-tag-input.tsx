import { Box } from '@chakra-ui/react';
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import React, { FC } from 'react';

type Props = {
  selectedTags: string[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: string[]) => void;
  onTagCreate?: (label: string) => void;
  tagText?: string;
};

const SearchByTagInput: FC<Props> = ({
  selectedTags,
  onTagCreate,
  isCreationDisabled = false,
  onSelectionChange,
  tagText = 'Select tags',
}) => {
  const selectedTagList = selectedTags.map((tag) => ({ label: tag, value: tag }));

  const handleOnCreate = (label: Item) => {
    if (onTagCreate) {
      onTagCreate(label.value);
    }
  };

  const handleOnChange = (labels?: Item[]) => {
    onSelectionChange(labels?.map((label) => label.value));
  };

  return (
    // autocomplete lib has some weird styling at the bottom
    <Box position="relative" paddingBottom={0}>
      <CUIAutoComplete
        label={tagText}
        labelStyleProps={{
          marginBottom: 0,
        }}
        inputStyleProps={{
          variant: 'outline',
        }}
        placeholder="Start typing..."
        onCreateItem={handleOnCreate}
        items={[]}
        selectedItems={selectedTagList}
        onSelectedItemsChange={(changes) => handleOnChange(changes.selectedItems)}
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
