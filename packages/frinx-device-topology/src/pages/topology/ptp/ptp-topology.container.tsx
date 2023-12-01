import { Box } from '@chakra-ui/react';
import { omitNullValue } from '@frinx/shared';
import { partition } from 'lodash';
import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { useClient } from 'urql';
import ActionControls from '../../../components/action-controls/action-controls';
import Edge from '../../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../../helpers/topology-helpers';
import { getPtpNodesAndEdges, setMode, setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { ShortestPathInfo } from '../../../state.reducer';
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

const isShortestPathPredicate = (shortestPathInfo: ShortestPathInfo | null, edge: GraphEdgeWithDiff): boolean => {
  const shortestPathIds = shortestPathInfo?.nodes.map((n) => n.name).filter(omitNullValue) ?? [];
  const fromInterfaceIndex = shortestPathIds.findIndex((deviceInterface) => deviceInterface === edge.source.interface);
  if (fromInterfaceIndex === -1) {
    return false;
  }
  return shortestPathIds.includes(edge.target.interface, fromInterfaceIndex);
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
    alternativeShortestPaths,
    selectedAlternativeShortestPathIndex,
    isWeightVisible,
  } = state;

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
        dispatch(setMode('SHORTEST_PATH'));
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

  const shortestPathInfo = alternativeShortestPaths.at(selectedAlternativeShortestPathIndex) ?? null;

  const [shortestPathEdges, nonShortestPathEdges] = partition(ptpEdges, (edge) =>
    isShortestPathPredicate(shortestPathInfo, edge),
  );
  const sortedPtpEdges = [...nonShortestPathEdges, ...shortestPathEdges];

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

            return (
              <Edge
                controlPoints={controlPoints}
                edge={edge}
                isActive={isActive}
                linePoints={linePoints}
                onClick={handleEdgeClick}
                key={edge.id}
                isUnknown={isUnknown}
                isShortestPath={false}
                isWeightVisible={(isWeightVisible && isActive) || false}
                weight={edge.weight}
              />
            );
          })}
        </g>
        <PtpNodes nodes={ptpNodes} />
      </svg>
      <Box position="absolute" top={2} right={2}>
        <ActionControls />
      </Box>
    </Box>
  );
};

export default PtpTopologyContainer;
