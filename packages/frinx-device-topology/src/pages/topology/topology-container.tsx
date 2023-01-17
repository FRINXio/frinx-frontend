import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { difference } from 'lodash';
import React, { useCallback, useEffect, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import LabelsFilter from '../../components/labels-filter/labels-filter';
import VersionSelect from '../../components/version-select/version-select';
import { setCommonNodeIds, setMode, setSelectedNodeIdsToFindCommonNode } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import {
  TopologyCommonNodesQuery,
  TopologyCommonNodesQueryVariables,
  UpdatePositionMutation,
  UpdatePositionMutationVariables,
} from '../../__generated__/graphql';
import { Position } from './graph.helpers';
import TopologyGraph from './topology-graph';

const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition($input: [PositionInput!]!) {
    updateDeviceMetadata(input: $input) {
      devices {
        id
        position {
          x
          y
        }
      }
    }
  }
`;

const TOPOLOGY_COMMON_NODES = gql`
  query TopologyCommonNodes($nodes: [String!]!) {
    topologyCommonNodes(nodes: $nodes) {
      commonNodes
    }
  }
`;

const TopologyContainer: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { mode, selectedNodeIds, unconfirmedSelectedNodeIds } = state;
  const [, updatePosition] = useMutation<UpdatePositionMutation, UpdatePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const [{ data: commonNodesData, fetching: isCommonNodesFetching }] = useQuery<
    TopologyCommonNodesQuery,
    TopologyCommonNodesQueryVariables
  >({
    query: TOPOLOGY_COMMON_NODES,
    variables: {
      nodes: selectedNodeIds,
    },
    pause: selectedNodeIds.length < 2 && difference(unconfirmedSelectedNodeIds, selectedNodeIds).length > 0,
  });

  const handleNodePositionUpdate = async (positions: { deviceId: string; position: Position }[]) => {
    updatePosition({
      input: positions,
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const { code } = event;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        dispatch(setMode('COMMON_NODES'));
      }
    },
    [dispatch],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent): void => {
      const { code } = event;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        dispatch(setMode('NORMAL'));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleCommonNodesSearch = () => {
    if (difference(unconfirmedSelectedNodeIds, selectedNodeIds)) {
      dispatch(setSelectedNodeIdsToFindCommonNode());
    }
  };

  useEffect(() => {
    const data = commonNodesData?.topologyCommonNodes?.commonNodes || [];
    dispatch(setCommonNodeIds([...data]));
  }, [commonNodesData, dispatch]);

  return (
    <Container maxWidth={1280} cursor={mode === 'NORMAL' ? 'default' : 'not-allowed'}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Device topology
        </Heading>
      </Flex>
      <Flex gridGap={4}>
        <Box flex={1} paddingBottom="24px">
          <VersionSelect />
        </Box>
        <Box flex={1}>
          <LabelsFilter />
        </Box>
      </Flex>
      <Box>
        <TopologyGraph
          onNodePositionUpdate={handleNodePositionUpdate}
          onCommonNodesSearch={handleCommonNodesSearch}
          isCommonNodesFetching={isCommonNodesFetching}
        />
      </Box>
    </Container>
  );
};

export default TopologyContainer;
