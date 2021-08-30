import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete';
import React, { FC } from 'react';
import { LabelsQuery } from '../__generated__/graphql';

type Props = {
  labels: LabelsQuery['labels']['edges'];
  selectedLabels: Item[];
  disableCreateItem?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
  onLabelCreate?: (label: Item) => void;
};

const SearchByLabelInput: FC<Props> = ({
  labels,
  selectedLabels,
  onLabelCreate,
  disableCreateItem = false,
  onSelectionChange,
}) => {
  const labelList =
    labels.map(({ node: l }) => {
      return { label: l.name, value: l.id };
    }) ?? [];

  const selectedLabelList = selectedLabels.map(({ label, value }) => {
    return { label, value };
  });

  return (
    <CUIAutoComplete
      label="Choose labels"
      placeholder="Type a label"
      onCreateItem={onLabelCreate}
      items={labelList}
      selectedItems={selectedLabelList}
      onSelectedItemsChange={(changes) => onSelectionChange(changes.selectedItems)}
      disableCreateItem={disableCreateItem}
      hideToggleButton
    />
  );
};

export default SearchByLabelInput;
