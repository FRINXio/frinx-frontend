import { Box, Input } from '@chakra-ui/react';
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import React, { FC } from 'react';
import { LabelsQuery } from '../__generated__/graphql';

type Props = {
  items: LabelsQuery['deviceInventory']['labels']['edges'];
  selectedLabels: Item[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
  onLabelCreate?: (label: Item) => void;
  labelText?: string;
};

const SearchByLabelInput: FC<Props> = ({
  items,
  selectedLabels,
  onLabelCreate,
  isCreationDisabled = false,
  onSelectionChange,
  labelText = 'Select labels',
}) => {
  const labelList = items.map(({ node: l }) => {
    return { label: l.name, value: l.id };
  });

  const selectedLabelList = selectedLabels.map(({ label, value }) => {
    return { label, value };
  });

  return (
    // autocomplete lib has some weird styling at the bottom
    <Box width="100%" position="relative" mb={-4}>
      <CUIAutoComplete
        label={labelText}
        labelStyleProps={{
          marginBottom: -2,
        }}
        renderCustomInput={(inputProps) => (
          <Input data-cy="search-by-label" {...inputProps} variant="outline" backgroundColor="white" />
        )}
        placeholder="Start typing..."
        onCreateItem={onLabelCreate}
        items={labelList}
        selectedItems={selectedLabelList}
        onSelectedItemsChange={(changes) => onSelectionChange(changes.selectedItems)}
        disableCreateItem={isCreationDisabled}
        hideToggleButton
      />
    </Box>
  );
};

export default SearchByLabelInput;
