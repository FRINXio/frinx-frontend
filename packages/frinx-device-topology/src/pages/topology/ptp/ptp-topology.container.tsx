import { Box, Button } from '@chakra-ui/react';
import { partition } from 'lodash';
import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useQuery } from 'urql';
import Edge from '../../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../../helpers/topology-helpers';
import {
  clearGmPathSearch,
  findGmPath,
  getPtpNodesAndEdges,
  setGmPathIds,
  setMode,
  setSelectedEdge,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GetGrandMasterPathQuery, GetGrandMasterPathQueryVariables } from '../../../__generated__/graphql';
import {
  getControlPoints,
  getLinePoints,
  getNameFromNode,
  height,
  isTargetingActiveNode,
  width,
} from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import PtpNodes from './ptp-nodes';

const EDGE_GAP = 75;

const GET_GM_PATH = gql`
  query GetGrandMasterPath($deviceFrom: String!) {
    deviceInventory {
      ptpPathToGrandMaster(deviceFrom: $deviceFrom)
    }
  }
`;

const isGmPathPredicate = (gmPath: string[], edge: GraphEdgeWithDiff): boolean => {
  const fromInterfaceIndex = gmPath.findIndex((deviceInterface) => deviceInterface === edge.source.interface);
  if (fromInterfaceIndex === -1) {
    return false;
  }
  return gmPath.includes(edge.target.interface, fromInterfaceIndex);
};

const PtpTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const {
    ptpEdges,
    ptpNodePositions,
    ptpInterfaceGroupPositions,
    ptpNodes,
    selectedNode,
    connectedNodeIds,
    topologyLayer,
    unconfirmedSelectedGmPathNodeId,
    selectedGmPathNodeId,
    isWeightVisible,
    gmPathIds,
  } = state;

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
    intervalRef.current = window.setInterval(() => {
      dispatch(getPtpNodesAndEdges(client));
    }, 10000);
    dispatch(getPtpNodesAndEdges(client));

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, topologyLayer]);

  const handleEdgeClick = (edge: GraphEdgeWithDiff | null) => {
    dispatch(setSelectedEdge(edge));
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

  const handleClearGmPath = () => {
    dispatch(clearGmPathSearch());
  };

  const handleSearchClick = () => {
    dispatch(findGmPath());
  };

  const [gmEdges, nonGmEdges] = partition(ptpEdges, (edge) => isGmPathPredicate(gmPathIds, edge));
  const sortedPtpEdges = [...nonGmEdges, ...gmEdges];

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g>
          {sortedPtpEdges.map((edge) => {
            if (isTargetingActiveNode(edge, getNameFromNode(selectedNode), ptpInterfaceGroupPositions)) {
              return null;
            }
            const isActive = !!selectedNode?.interfaces.find((i) => i.id === edge.source.interface);
            const linePoints = getLinePoints({
              edge,
              connectedNodeIds,
              nodePositions: ptpNodePositions,
              interfaceGroupPositions: ptpInterfaceGroupPositions,
            });
            if (!linePoints) {
              return null;
            }
            const { start, end } = linePoints;
            const controlPoints = isActive
              ? getControlPoints({
                  edge,
                  interfaceGroupPositions: ptpInterfaceGroupPositions,
                  sourcePosition: start,
                  targetPosition: end,
                  edgeGap: EDGE_GAP,
                })
              : [];
            const isUnknown = false;
            const isShortestPath = false;
            const isGmPathEgge =
              gmEdges.findIndex(
                (e) => e.source.interface === edge.source.interface && e.target.interface === edge.target.interface,
              ) > -1;

            return (
              <Edge
                controlPoints={controlPoints}
                edge={edge}
                isActive={isActive}
                linePoints={linePoints}
                onClick={handleEdgeClick}
                key={edge.id}
                isUnknown={isUnknown}
                isShortestPath={isShortestPath}
                isGmPath={isGmPathEgge}
                isWeightVisible={(isWeightVisible && isActive) || false}
                weight={edge.weight}
              />
            );
          })}
        </g>
        <PtpNodes nodes={ptpNodes} />
      </svg>
      {unconfirmedSelectedGmPathNodeId && (
        <Box position="absolute" top={2} left="2" background="transparent">
          <Button onClick={handleClearGmPath} marginRight={2}>
            Clear GM path
          </Button>
          <Button onClick={handleSearchClick} isDisabled={isGmPathFetching} marginRight={2}>
            Find GM path
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PtpTopologyContainer;
