import { Box } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import React, { VoidFunctionComponent } from 'react';
import SearchByLabelInput from '../../components/search-by-label-input';
import { LabelsQuery } from '../../__generated__/graphql';

type Props = {
  labels: LabelsQuery['labels']['edges'];
  selectedLabels: Item[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
  onLabelCreate?: (label: Item) => void;
};
const DeviceFilter: VoidFunctionComponent<Props> = ({ labels, selectedLabels, onSelectionChange }) => {
  return (
    <Box background="white" paddingX={4} paddingTop={4} paddingBottom={0} marginBottom={4}>
      <Box width={80}>
        <SearchByLabelInput
          items={labels}
          selectedLabels={selectedLabels}
          onSelectionChange={onSelectionChange}
          isCreationDisabled
          labelText="Filter by labels"
        />
      </Box>
    </Box>
  );
};

export default DeviceFilter;
