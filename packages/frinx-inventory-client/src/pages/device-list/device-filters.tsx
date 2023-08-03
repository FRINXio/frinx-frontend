import { Box, Spacer } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import React, { VoidFunctionComponent } from 'react';
import SearchByLabelInput from '../../components/search-by-label-input';
import { LabelsQuery } from '../../__generated__/graphql';

type Props = {
  labels: LabelsQuery['labels']['edges'];
  selectedLabels: Item[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
};
const DeviceFilter: VoidFunctionComponent<Props> = ({
  labels,
  selectedLabels,
  onSelectionChange,
  isCreationDisabled,
}) => {
  return (
    <Box zIndex={999} m={0} p={0}>
      <SearchByLabelInput
        items={labels}
        selectedLabels={selectedLabels}
        onSelectionChange={onSelectionChange}
        isCreationDisabled={isCreationDisabled || false}
        labelText="Filter by labels"
      />
      <Spacer />
    </Box>
  );
};

export default DeviceFilter;
