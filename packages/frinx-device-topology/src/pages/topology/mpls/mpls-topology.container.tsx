import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation, useQuery } from 'urql';
import {
  findGmPath,
  getSynceBackupNodesAndEdges,
  getSynceNodesAndEdges,
  setGmPathIds,
  setMode,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  GetSynceGrandMasterPathQuery,
  GetSynceGrandMasterPathQueryVariables,
  UpdateSyncePositionMutation,
  UpdateSyncePositionMutationVariables,
} from '../../../__generated__/graphql';
import { height, Position, width } from '../graph.helpers';
import MplsTopologyGraph from './mpls-topology-graph';

const UPDATE_POSITION_MUTATION = gql`
  mutation UpdateSyncePosition($input: UpdateGraphNodeCoordinatesInput!) {
    deviceInventory {
      updateGraphNodeCoordinates(input: $input) {
        deviceNames
      }
    }
  }
`;

const GET_SYNCE_GM_PATH = gql`
  query GetSynceGrandMasterPath($deviceFrom: String!) {
    deviceInventory {
      syncePathToGrandMaster(deviceFrom: $deviceFrom)
    }
  }
`;

const MplsTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const { topologyLayer, selectedGmPathNodeId, selectedVersion } = state;

  const [, updatePosition] = useMutation<UpdateSyncePositionMutation, UpdateSyncePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const [{ data: gmPathData, fetching: isGmPathFetching }] = useQuery<
    GetSynceGrandMasterPathQuery,
    GetSynceGrandMasterPathQueryVariables
  >({
    query: GET_SYNCE_GM_PATH,
    requestPolicy: 'network-only',
    variables: {
      deviceFrom: selectedGmPathNodeId as string,
    },
    pause: selectedGmPathNodeId === null,
  });

  useEffect(() => {
    const gmPathDataIds =
      gmPathData?.deviceInventory.syncePathToGrandMaster?.map((p) => {
        return p;
      }) ?? [];
    dispatch(setGmPathIds(gmPathDataIds));
  }, [dispatch, gmPathData]);

  useEffect(() => {
    if (selectedVersion == null) {
      intervalRef.current = window.setInterval(() => {
        dispatch(getSynceNodesAndEdges(client));
      }, 10000);
      dispatch(getSynceNodesAndEdges(client));
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, topologyLayer, selectedVersion]);

  useEffect(() => {
    if (selectedVersion != null) {
      window.clearInterval(intervalRef.current);
      dispatch(getSynceBackupNodesAndEdges(client, selectedVersion));
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
        layer: 'EthTopology',
      },
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const { code } = event;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        dispatch(setMode('GM_PATH'));
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

  const handleSearchClick = () => {
    dispatch(findGmPath());
  };

  return (
    <MplsTopologyGraph
      onNodePositionUpdate={handleNodePositionUpdate}
      onGrandMasterPathSearch={handleSearchClick}
      isGrandMasterPathFetching={isGmPathFetching}
    />
  );
};

export default MplsTopologyContainer;
