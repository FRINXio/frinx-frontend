import { Progress } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { LabelItem, setSelectedLabels } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { DeviceLabelsQuery, DeviceLabelsQueryVariables } from '../../__generated__/graphql';
import SelectedLabels from './selected-labels';

const DEVICE_LABELS_QUERY = gql`
  query DeviceLabels {
    deviceInventory {
      labels {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const LabelsFilter: VoidFunctionComponent = () => {
	const { state, dispatch } = useStateContext();
	const [{ data: labelsData, fetching: isFetchingLabels }] = useQuery<DeviceLabelsQuery, DeviceLabelsQueryVariables>({
		query: DEVICE_LABELS_QUERY,
	});
	const { selectedLabels, selectedVersion } = state;

	const handleSelectedLabelsChange = (selectedItems: LabelItem[]) => {
		if (selectedItems) {
			dispatch(setSelectedLabels([...new Set(selectedItems)]));
		}
	};

	if (isFetchingLabels) {
		return <Progress size="xs" isIndeterminate mt={-10} />;
	}

	const labels = (labelsData?.labels.edges ?? []).map((e) => ({
		label: e.node.name,
		value: e.node.id,
	}));

	if (selectedVersion) {
		return null;
	}

	return (
		<SelectedLabels
			items={labels}
			selectedLabels={selectedLabels}
			labelText="Filter by labels:"
			onSelectionChange={handleSelectedLabelsChange}
		/>
	);
};

export default LabelsFilter;
