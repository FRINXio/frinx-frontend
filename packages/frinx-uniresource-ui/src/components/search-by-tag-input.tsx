import { Box } from '@chakra-ui/react';
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import React, { FC } from 'react';

type Props = {
  selectedLabels: Item[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
  onLabelCreate?: (label: Item) => void;
  labelText?: string;
};

const SearchByTagInput: FC<Props> = ({
  selectedLabels,
  onLabelCreate,
  isCreationDisabled = false,
  onSelectionChange,
  labelText = 'Select labels',
}) => {
  const selectedLabelList = selectedLabels.map(({ label, value }) => {
    return { label, value };
  });

  return (
    // autocomplete lib has some weird styling at the bottom
    <Box position="relative" paddingBottom={selectedLabelList.length ? 0 : '28px'}>
      <CUIAutoComplete
        label={labelText}
        labelStyleProps={{
          marginBottom: 0,
        }}
        inputStyleProps={{
          variant: 'filled',
        }}
        placeholder="Start typing..."
        onCreateItem={onLabelCreate}
        items={[]}
        selectedItems={selectedLabelList}
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
