import { InputGroup } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Label, LabelsQuery } from '../__generated__/graphql';
import LabelOptions from './label-options-dropdown';
import SelectedLabels from './selected-labels';

type Props = {
  labels: LabelsQuery['labels']['edges'];
  selectedLabels: Pick<Label, 'id' | 'name'>[];
  onRemove: (label: Pick<Label, 'id' | 'name'>) => void;
  onAdd: (label: Pick<Label, 'id' | 'name'>) => void;
  onLabelCreate?: (label: string) => void;
};

const SearchByLabelInput: FC<Props> = ({ labels, selectedLabels, onAdd, onRemove, onLabelCreate }) => {
  const [filteredLabels, setFilteredLabels] = React.useState(labels.map(({ node }) => node));

  const labelList = labels.map(({ node: l }) => l) ?? [];

  const handleOnLabelAdd = (label: Pick<Label, 'id' | 'name'>) => {
    const labelIndex = labelList.indexOf(label);
    setFilteredLabels([...labelList.slice(0, labelIndex), ...labelList.slice(labelIndex + 1)]);
  };

  const handleOnLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredLabels(labelList.filter((l) => l.name.toLowerCase().includes(e.target.value.toLowerCase())));
  };

  const handleOnAdd = (label: Pick<Label, 'id' | 'name'>): void => {
    handleOnLabelAdd(label);
    onAdd(label);
  };

  const handleOnRemove = (label: Pick<Label, 'id' | 'name'>): void => {
    setFilteredLabels(filteredLabels?.concat(label));
    onRemove(label);
  };

  return (
    <InputGroup>
      <SelectedLabels labels={selectedLabels} onRemove={handleOnRemove} />
      <LabelOptions
        labels={filteredLabels}
        selectedLabels={selectedLabels}
        onAdd={handleOnAdd}
        onLabelCreate={onLabelCreate}
        onChange={handleOnLabelInputChange}
      />
    </InputGroup>
  );
};

export default SearchByLabelInput;
