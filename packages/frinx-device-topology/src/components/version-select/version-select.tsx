import { FormLabel, Progress, Select } from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { ChangeEvent, useEffect, VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { getLocalDateFromUTC } from '../../helpers/datetime-helpers';
import { setBackupNodesAndEdges, setSelectedVersion } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import {
  TopologyVersionDataQueryQuery,
  TopologyVersionDataQueryQueryVariables,
  VersionsQueryQuery,
  VersionsQueryQueryVariables,
} from '../../__generated__/graphql';

const VERSIONS_QUERY = gql`
  query VersionsQuery {
    topologyVersions
  }
`;

const TOPOLOGY_VERSION_DATA_QUERY = gql`
  query TopologyVersionDataQuery($version: String!) {
    topologyVersionData(version: $version) {
      edges {
        id
        source {
          nodeId
          interface
        }
        target {
          nodeId
          interface
        }
      }
      nodes {
        id
        name
        interfaces
      }
    }
  }
`;

function getBackupVersionDataVariables(
  selectedVersion: string | null,
): TopologyVersionDataQueryQueryVariables | undefined {
  if (selectedVersion != null) {
    return {
      version: selectedVersion,
    };
  }
  return undefined;
}

const VersionSelect: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { selectedVersion } = state;

  const [{ data: versionsData, fetching: isFetchingVersions }] = useQuery<
    VersionsQueryQuery,
    VersionsQueryQueryVariables
  >({ query: VERSIONS_QUERY });

  const [{ data: backupVersionData }] = useQuery<TopologyVersionDataQueryQuery, TopologyVersionDataQueryQueryVariables>(
    {
      query: TOPOLOGY_VERSION_DATA_QUERY,
      pause: selectedVersion == null,
      variables: getBackupVersionDataVariables(selectedVersion),
      requestPolicy: 'network-only',
    },
  );

  useEffect(() => {
    if (backupVersionData != null) {
      dispatch(
        setBackupNodesAndEdges({
          nodes: backupVersionData?.topologyVersionData.nodes || [],
          edges: backupVersionData?.topologyVersionData.edges || [],
        }),
      );
    }
  }, [backupVersionData, dispatch]);

  useEffect(() => {
    if (selectedVersion == null) {
      dispatch(
        setBackupNodesAndEdges({
          nodes: [],
          edges: [],
        }),
      );
    }
  }, [selectedVersion, dispatch]);

  const handleSelectVersionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    dispatch(setSelectedVersion(value === 'none' ? null : value));
  };

  if (isFetchingVersions) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  const versions = versionsData?.topologyVersions ?? [];

  return (
    <>
      <FormLabel marginBottom={4}>Compare with:</FormLabel>
      <Select value={selectedVersion || undefined} onChange={handleSelectVersionChange} background="white">
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
