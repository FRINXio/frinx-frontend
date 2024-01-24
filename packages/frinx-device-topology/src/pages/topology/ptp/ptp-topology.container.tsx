import React, { useCallback, useEffect, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation, useQuery } from 'urql';
import { findGmPath, getPtpNodesAndEdges, setGmPathIds, setMode } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  GetGrandMasterPathQuery,
  GetGrandMasterPathQueryVariables,
  UpdatePtpPositionMutation,
  UpdatePtpPositionMutationVariables,
} from '../../../__generated__/graphql';
import { height, width, Position } from '../graph.helpers';
import PtpTopologyGraph from './ptp-topology-graph';

const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePtpPosition($input: UpdateGraphNodeCoordinatesInput!) {
    deviceInventory {
      updateGraphNodeCoordinates(input: $input) {
        deviceNames
      }
    }
  }
`;

const GET_GM_PATH = gql`
  query GetGrandMasterPath($deviceFrom: String!) {
    deviceInventory {
      ptpPathToGrandMaster(deviceFrom: $deviceFrom)
    }
  }
`;

const PTP_DIFF_SYNCE = gql`
  query PtPDiffSyncE{
    ptpDiffSyncE {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const PtpTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const { dispatch, state } = useStateContext();
  const { selectedGmPathNodeId } = state;

  const [{ data: ptpDiffSynce, error }] = useQuery<any, any>(PTP_DIFF_SYNCE);

  

  const [, updatePosition] = useMutation<UpdatePtpPositionMutation, UpdatePtpPositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const [{ data: gmPathData, fetching: isGmPathFetching }] = useQuery<
    GetGrandMasterPathQuery,
    GetGrandMasterPathQueryVariables
  >({
    query: GET_GM_PATH,
    variables: {
      deviceFrom: selectedGmPathNodeId as string,
    },
    pause: selectedGmPathNodeId === null,
  });

  useEffect(() => {
    const gmPathDataIds =
      gmPathData?.deviceInventory.ptpPathToGrandMaster?.map((p) => {
        return p;
      }) ?? [];
    dispatch(setGmPathIds(gmPathDataIds));
  }, [dispatch, gmPathData]);

  useEffect(() => {
    dispatch(getPtpNodesAndEdges(client));
  }, [client, dispatch]);

  const handleNodePositionUpdate = async (positions: { deviceName: string; position: Position }[]) => {
    const coordinates = [
      ...new Set(
        positions.map((p) => ({ deviceName: p.deviceName, x: p.position.x / width, y: p.position.y / height })),
      ),
    ];
    updatePosition({
      input: {
        coordinates,
        layer: 'PtpTopology',
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
    <PtpTopologyGraph
      onNodePositionUpdate={handleNodePositionUpdate}
      onGrandMasterPathSearch={handleSearchClick}
      isGrandMasterPathFetching={isGmPathFetching}
    />
  );
};

export default PtpTopologyContainer;
