import { omitNullValue } from '@frinx/shared';
import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation, useQuery } from 'urql';
import {
  getMplsNodesAndEdges,
  setMode,
  setLspCounts,
  getMplsBackupNodesAndEdges,
  findLspPath,
  setLspPath,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  LspPathQuery,
  LspPathQueryVariables,
  GetMplsLspCountQuery,
  GetMplsLspCountQueryVariables,
  UpdateSyncePositionMutation,
  UpdateSyncePositionMutationVariables,
} from '../../../__generated__/graphql';
import { getLspCounts, height, Position, width } from '../graph.helpers';
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

const GET_MPLS_LPS_COUNT = gql`
  query GetMplsLspCount($deviceId: String!) {
    deviceInventory {
      mplsLspCount(deviceId: $deviceId) {
        counts {
          target
          incomingLsps
          outcomingLsps
        }
      }
    }
  }
`;

const GET_LSP_PATH = gql`
  query LspPath($deviceId: String!, $lspId: String!) {
    deviceInventory {
      lspPath(deviceId: $deviceId, lspId: $lspId) {
        path
        metadata {
          fromDevice
          toDevice
          signalization
          uptime
        }
      }
    }
  }
`;

const MplsTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const { topologyLayer, selectedVersion, selectedNode, selectedLspPathNodeId, selectedLspId } = state;

  const [, updatePosition] = useMutation<UpdateSyncePositionMutation, UpdateSyncePositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const [{ data: lspCountData }] = useQuery<GetMplsLspCountQuery, GetMplsLspCountQueryVariables>({
    query: GET_MPLS_LPS_COUNT,
    requestPolicy: 'network-only',
    variables: {
      deviceId: selectedNode?.id as string,
    },
    pause: selectedNode?.id === null,
  });

  const [{ data: lspPathData, fetching: isLspPathFetching }] = useQuery<LspPathQuery, LspPathQueryVariables>({
    query: GET_LSP_PATH,
    requestPolicy: 'network-only',
    variables: {
      deviceId: selectedLspPathNodeId as string,
      lspId: selectedLspId as string,
    },
    pause: selectedLspPathNodeId === null || selectedLspId === null,
  });

  useEffect(() => {
    const lspPathDataIds = lspPathData?.deviceInventory?.lspPath?.path ?? [];
    const metadata = lspPathData?.deviceInventory.lspPath?.metadata ?? null;
    dispatch(setLspPath(lspPathDataIds, metadata));
  }, [dispatch, lspPathData]);

  useEffect(() => {
    const lspCounts =
      lspCountData?.deviceInventory.mplsLspCount?.counts
        ?.map((p) => {
          return p;
        })
        .filter(omitNullValue)
        .map(getLspCounts) ?? [];
    dispatch(setLspCounts(lspCounts));
  }, [dispatch, lspCountData]);

  useEffect(() => {
    if (selectedVersion == null) {
      intervalRef.current = window.setInterval(() => {
        dispatch(getMplsNodesAndEdges(client));
      }, 10000);
      dispatch(getMplsNodesAndEdges(client));
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, topologyLayer, selectedVersion]);

  useEffect(() => {
    if (selectedVersion != null) {
      window.clearInterval(intervalRef.current);
      dispatch(getMplsBackupNodesAndEdges(client, selectedVersion));
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
        layer: 'MplsTopology',
      },
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const { code } = event;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        dispatch(setMode('LSP_PATH'));
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
    dispatch(findLspPath());
  };

  return (
    <MplsTopologyGraph
      onLspPathSearch={handleSearchClick}
      onNodePositionUpdate={handleNodePositionUpdate}
      isLspPathFetching={isLspPathFetching}
    />
  );
};

export default MplsTopologyContainer;
