import { Box, Input } from '@chakra-ui/react';
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import React, { FC } from 'react';

type Props = {
  items: Item[];
  selectedLabels: Item[];
  onSelectionChange: (labels: Item[]) => void;
  labelText?: string;
};

const SelectedLabels: FC<Props> = ({ items, selectedLabels, onSelectionChange, labelText = 'Select labels' }) => {
  const selectedLabelList = selectedLabels.map(({ label, value }) => {
    return { label, value };
  });

  return (
    // autocomplete lib has some weird styling at the bottom
    <Box position="relative">
      <CUIAutoComplete
        label={labelText}
        labelStyleProps={{
          marginBottom: 0,
        }}
        renderCustomInput={(inputProps) => <Input {...inputProps} variant="outline" backgroundColor="white" />}
        placeholder="Start typing..."
        items={items}
        selectedItems={selectedLabelList}
        onSelectedItemsChange={(changes) => onSelectionChange(changes.selectedItems || [])}
        disableCreateItem
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

export default SelectedLabels;
