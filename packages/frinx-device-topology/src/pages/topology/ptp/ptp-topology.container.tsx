import React, { useCallback, useEffect, VoidFunctionComponent } from 'react';
import { gql, useClient, useMutation, useQuery } from 'urql';
import { findGmPath, getPtpNodesAndEdges, setGmPathIds, setMode } from '../../../state.actions';
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
  showPtpDiffSynce: boolean;
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

const PtpTopologyContainer: VoidFunctionComponent<Props> = ({ showPtpDiffSynce }) => {
  const client = useClient();
  const { dispatch, state } = useStateContext();
  const { selectedGmPathNodeId } = state;

  const [{ data: ptpDiffSynce }] = useQuery<GetPtpDiffSynceQuery>({ query: GET_PTP_DIFF_SYNCE });
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
      showPtpDiffSynce={showPtpDiffSynce}
      ptpDiffSynceIds={ptpDiffSynceIds || []}
      onNodePositionUpdate={handleNodePositionUpdate}
      onGrandMasterPathSearch={handleSearchClick}
      isGrandMasterPathFetching={isGmPathFetching}
    />
  );
};

export default PtpTopologyContainer;
