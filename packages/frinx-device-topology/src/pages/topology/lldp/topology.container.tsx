import { difference } from 'lodash';
import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation, useQuery } from 'urql';
import {
  getBackupNodesAndEdges,
  getDeviceMetadata,
  getNodesAndEdges,
  setCommonNodeIds,
  setMode,
  setSelectedNodeIdsToFindCommonNode,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  TopologyCommonNodesQuery,
  TopologyCommonNodesQueryVariables,
  UpdatePositionMutation,
  UpdatePositionMutationVariables,
} from '../../../__generated__/graphql';
import { height, Position, width } from '../graph.helpers';
import TopologyGraph from '../topology-graph';

const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition($input: UpdateGraphNodeCoordinatesInput!) {
    deviceInventory {
      updateGraphNodeCoordinates(input: $input) {
        deviceNames
      }
    }
  }
`;

const TOPOLOGY_COMMON_NODES = gql`
  query TopologyCommonNodes($nodes: [String!]!) {
    deviceInventory {
      topologyCommonNodes(nodes: $nodes) {
        commonNodes
      }
    }
  }
`;

const TopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { state, dispatch } = useStateContext();
  const { selectedNodeIds, unconfirmedSelectedNodeIds, selectedLabels, selectedVersion, topologyLayer } = state;
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

  useEffect(() => {
    if (selectedVersion == null) {
      intervalRef.current = window.setInterval(() => {
        dispatch(getNodesAndEdges(client, selectedLabels));
        dispatch(getDeviceMetadata(client, { topologyType: null }));
      }, 10000);
      dispatch(getNodesAndEdges(client, selectedLabels));
      dispatch(getDeviceMetadata(client, { topologyType: null }));
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, selectedLabels, selectedVersion, topologyLayer]);

  useEffect(() => {
    if (selectedVersion != null) {
      window.clearInterval(intervalRef.current);
      dispatch(getBackupNodesAndEdges(client, selectedVersion));
    }
  }, [client, dispatch, selectedVersion]);

  const handleNodePositionUpdate = async (positions: { deviceName: string; position: Position }[]) => {
    const coordinates = [
      ...new Set(
        positions.map((p) => ({ deviceName: p.deviceName, x: p.position.x / width, y: p.position.y / height })),
      ),
    ];
    updatePosition({
      input: {
        coordinates,
        layer: 'PHYSICAL_TOPOLOGY',
      },
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
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleCommonNodesSearch = () => {
    if (difference(unconfirmedSelectedNodeIds, selectedNodeIds)) {
      dispatch(setSelectedNodeIdsToFindCommonNode());
    }
  };

  useEffect(() => {
    const data = commonNodesData?.deviceInventory.topologyCommonNodes?.commonNodes || [];
    dispatch(setCommonNodeIds([...data]));
  }, [commonNodesData, dispatch]);

  return (
    <TopologyGraph
      onNodePositionUpdate={handleNodePositionUpdate}
      onCommonNodesSearch={handleCommonNodesSearch}
      isCommonNodesFetching={isCommonNodesFetching}
    />
  );
};

export default TopologyContainer;
