import { Box, Button, Select } from '@chakra-ui/react';
import { omitNullValue } from '@frinx/shared';
import { partition } from 'lodash';
import React, { useCallback, useEffect, useRef, VoidFunctionComponent } from 'react';
import { gql, useClient, useQuery } from 'urql';
import ActionControls from '../../components/action-controls/action-controls';
import Edge from '../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import {
  clearShortestPathSearch,
  findShortestPath,
  getNetNodesAndEdges,
  setAlternativePaths,
  setMode,
  setSelectedAlternativePath,
  setSelectedEdge,
} from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { ShortestPathQuery, ShortestPathQueryVariables } from '../../__generated__/graphql';
import {
  getControlPoints,
  getLinePoints,
  getNameFromNode,
  height,
  isTargetingActiveNode,
  width,
} from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import NetNodes from './net-nodes';

const EDGE_GAP = 75;

const SHORTEST_PATH_QUERY = gql`
  query ShortestPath($from: String!, $to: String!) {
    shortestPath(from: $from, to: $to) {
      shortestPath
      alternativePaths
    }
  }
`;

const isShortestPadhPredicate = (shortestPathIds: string[], edge: GraphEdgeWithDiff): boolean => {
  const fromInterfaceIndex = shortestPathIds.findIndex((deviceInterface) => deviceInterface === edge.source.interface);
  if (fromInterfaceIndex === -1) {
    return false;
  }
  return shortestPathIds.includes(edge.target.interface, fromInterfaceIndex);
};

const NetTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const {
    netEdges,
    netNodePositions,
    netInterfaceGroupPositions,
    netNodes,
    selectedNode,
    connectedNodeIds,
    topologyLayer,
    unconfirmedShortestPathNodeIds,
    selectedShortestPathNodeIds,
    alternativeShortestPaths,
    selectedAlternativeShortestPathIndex,
    isWeightVisible,
  } = state;

  const [{ data: shorthestPathData, fetching: isShortestPathFetching }] = useQuery<
    ShortestPathQuery,
    ShortestPathQueryVariables
  >({
    query: SHORTEST_PATH_QUERY,
    variables: {
      from: selectedShortestPathNodeIds[0] as string,
      to: selectedShortestPathNodeIds[1] as string,
    },
    pause: selectedShortestPathNodeIds.filter(omitNullValue).length !== 2,
  });

  useEffect(() => {
    dispatch(setAlternativePaths(shorthestPathData?.shortestPath?.alternativePaths ?? []));
  }, [dispatch, shorthestPathData]);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      dispatch(getNetNodesAndEdges(client));
    }, 10000);
    dispatch(getNetNodesAndEdges(client));

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

  const handleClearShortestPath = () => {
    dispatch(clearShortestPathSearch());
  };

  const handleSearchClick = () => {
    dispatch(findShortestPath());
  };

  const handleAlternativePathChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    dispatch(setSelectedAlternativePath(Number(value)));
  };

  const selectedAlternativeIds = alternativeShortestPaths[selectedAlternativeShortestPathIndex] ?? [];

  const [shortestPathEdges, nonShortestPathEdges] = partition(netEdges, (edge) =>
    isShortestPadhPredicate(selectedAlternativeIds, edge),
  );
  const sortedNetEdges = [...nonShortestPathEdges, ...shortestPathEdges];

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g>
          {sortedNetEdges.map((edge) => {
            if (isTargetingActiveNode(edge, getNameFromNode(selectedNode), netInterfaceGroupPositions)) {
              return null;
            }
            const isActive = !!selectedNode?.interfaces.find((i) => i.id === edge.source.interface);
            const linePoints = getLinePoints({
              edge,
              connectedNodeIds,
              nodePositions: netNodePositions,
              interfaceGroupPositions: netInterfaceGroupPositions,
            });
            if (!linePoints) {
              return null;
            }
            const { start, end } = linePoints;
            const controlPoints = isActive
              ? getControlPoints({
                  edge,
                  interfaceGroupPositions: netInterfaceGroupPositions,
                  sourcePosition: start,
                  targetPosition: end,
                  edgeGap: EDGE_GAP,
                })
              : [];
            const isUnknown = false;
            const isShortestPathEdge =
              shortestPathEdges.findIndex(
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
                isShortestPath={isShortestPathEdge}
                isWeightVisible={isWeightVisible}
              />
            );
          })}
        </g>
        <NetNodes nodes={netNodes} />
      </svg>
      {unconfirmedShortestPathNodeIds.filter(omitNullValue).length > 0 && (
        <Box position="absolute" top={2} left="2" background="transparent">
          <Button onClick={handleClearShortestPath} marginRight={2}>
            Clear shortest path
          </Button>
          <Button onClick={handleSearchClick} isDisabled={isShortestPathFetching} marginRight={2}>
            Find shortest path
          </Button>
          {alternativeShortestPaths.length > 0 && (
            <Select
              onChange={handleAlternativePathChange}
              value={selectedAlternativeShortestPathIndex ?? 0}
              background="white"
              width={300}
              display="inline-block"
            >
              {[...alternativeShortestPaths.keys()].map((key) => (
                <option key={`alternative-key-${key}`} value={key}>
                  {key === 0 ? 'shortest path' : `alternative path ${key}`}
                </option>
              ))}
            </Select>
          )}
        </Box>
      )}
      <Box position="absolute" top={2} right={2}>
        <ActionControls />
      </Box>
    </Box>
  );
};

export default NetTopologyContainer;
