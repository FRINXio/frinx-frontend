import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation, useQuery } from 'urql';
import {
  findGmPath,
  getPtpBackupNodesAndEdges,
  getPtpNodesAndEdges,
  setGmPathIds,
  setMode,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  GetGrandMasterPathQuery,
  GetGrandMasterPathQueryVariables,
  UpdatePtpPositionMutation,
  UpdatePtpPositionMutationVariables,
  GetPtpDiffSynceQuery,
} from '../../../__generated__/graphql';
import { height, width, Position } from '../graph.helpers';
import PtpTopologyGraph from './ptp-topology-graph';

type Props = {
  isPtpDiffSynceShown: boolean;
  refreshGraph: boolean;
  onGraphRefreshed: () => void;
};

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

const GET_PTP_DIFF_SYNCE = gql`
  query GetPtpDiffSynce {
    deviceInventory {
      ptpDiffSynce {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

const PtpTopologyContainer: VoidFunctionComponent<Props> = ({
  isPtpDiffSynceShown,
  refreshGraph,
  onGraphRefreshed
}) => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const { selectedGmPathNodeId } = state;

  const [{ data: ptpDiffSynce }] = useQuery<GetPtpDiffSynceQuery>({
    query: GET_PTP_DIFF_SYNCE,
    requestPolicy: 'network-only',
    pause: !isPtpDiffSynceShown,
  });

  const [, updatePosition] = useMutation<UpdatePtpPositionMutation, UpdatePtpPositionMutationVariables>(
    UPDATE_POSITION_MUTATION,
  );

  const [{ data: gmPathData, fetching: isGmPathFetching }] = useQuery<
    GetGrandMasterPathQuery,
    GetGrandMasterPathQueryVariables
  >({
    query: GET_GM_PATH,
    requestPolicy: 'network-only',
    variables: {
      deviceFrom: selectedGmPathNodeId as string,
    },
    pause: selectedGmPathNodeId === null,
  });

  const ptpDiffSynceIds = ptpDiffSynce?.deviceInventory.ptpDiffSynce.edges.map((diff) => {
    return diff.node.id;
  });

  useEffect(() => {
    const gmPathDataIds =
      gmPathData?.deviceInventory.ptpPathToGrandMaster?.map((p) => {
        return p;
      }) ?? [];
    dispatch(setGmPathIds(gmPathDataIds));
  }, [dispatch, gmPathData]);

  useEffect(() => {
    if (state.selectedVersion == null) {
      intervalRef.current = window.setInterval(() => {
        dispatch(getPtpNodesAndEdges(client));
      }, 10000);
      dispatch(getPtpNodesAndEdges(client));
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, state.selectedVersion, state.topologyLayer]);

  useEffect(() => {
    if (state.selectedVersion != null) {
      window.clearInterval(intervalRef.current);
      dispatch(getPtpBackupNodesAndEdges(client, state.selectedVersion));
    }
  }, [client, dispatch, state.selectedVersion]);

  const handleNodePositionUpdate = async (positions: { deviceName: string; position: Position }[]) => {
    const coordinates = [
      ...new Set(
        positions.map((p) => ({ deviceName: p.deviceName, x: p.position.x / width, y: p.position.y / height })),
      ),
    ];
    updatePosition({
      input: {
        coordinates,
        layer: 'PTP_TOPOLOGY',
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

  useEffect(() => {
    if (refreshGraph) {
      if (state.selectedVersion == null) {
        dispatch(getPtpNodesAndEdges(client));
      } else {
        dispatch(getPtpBackupNodesAndEdges(client, state.selectedVersion))
      }
      onGraphRefreshed();
    }
  }, [dispatch, client, state.selectedVersion, refreshGraph, onGraphRefreshed]);

  return (
    <PtpTopologyGraph
      isPtpDiffSynceShown={isPtpDiffSynceShown}
      ptpDiffSynceIds={ptpDiffSynceIds || []}
      onNodePositionUpdate={handleNodePositionUpdate}
      onGrandMasterPathSearch={handleSearchClick}
      isGrandMasterPathFetching={isGmPathFetching}
    />
  );
};

export default PtpTopologyContainer;
