import { FormLabel, Progress, Select } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
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
      pause: state.selectedVersion == null,
      variables: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore query is called only when pause is not null, based on `pause` option
        version: state.selectedVersion,
      },
    },
  );

  useEffect(() => {
    if (backupVersionData) {
      dispatch(
        setBackupNodesAndEdges({
          nodes: backupVersionData?.topologyVersionData.nodes || [],
          edges: backupVersionData?.topologyVersionData.edges || [],
        }),
      );
    }
  }, [backupVersionData, dispatch]);

  useEffect(() => {
    if (!selectedVersion) {
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
      <FormLabel>Backup Version:</FormLabel>
      <Select value={selectedVersion || undefined} onChange={handleSelectVersionChange}>
        <option value="none">none</option>
        {versions.map((v) => (
          <option key={`version-${v}`} value={v}>
            {v}
          </option>
        ))}
      </Select>
    </>
  );
};

export default VersionSelect;
