import { FormLabel, Progress, Select } from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { ChangeEvent, VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { getLocalDateFromUTC } from '@frinx/shared';
import { setSelectedVersion, setSynceDiffVisibility } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { VersionsQuery, VersionsQueryVariables } from '../../__generated__/graphql';

const VERSIONS_QUERY = gql`
  query Versions {
    deviceInventory {
      topologyVersions
    }
  }
`;

const VersionSelect: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { selectedVersion } = state;

  const [{ data: versionsData, fetching: isFetchingVersions }] = useQuery<VersionsQuery, VersionsQueryVariables>({
    query: VERSIONS_QUERY,
  });

  const handleSelectVersionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    dispatch(setSelectedVersion(value === 'none' ? null : value));
    dispatch(setSynceDiffVisibility(false));
  };

  if (isFetchingVersions) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  const versions = versionsData?.deviceInventory.topologyVersions ?? [];

  return (
    <>
      <FormLabel marginBottom={4}>Compare current topology with:</FormLabel>
      <Select value={selectedVersion ?? 'none'} onChange={handleSelectVersionChange} background="white">
        <option value="none">None</option>
        {versions.map((v) => (
          <option key={`version-${v}`} value={v}>
            {format(getLocalDateFromUTC(v), 'dd/MM/yyyy, k:mm')}
          </option>
        ))}
      </Select>
    </>
  );
};

export default VersionSelect;
