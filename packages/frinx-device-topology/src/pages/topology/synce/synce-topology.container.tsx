import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, VoidFunctionComponent } from 'react';
import { useClient } from 'urql';
import Edge from '../../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../../helpers/topology-helpers';
import { getSynceNodesAndEdges, setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import {
  getControlPoints,
  getLinePoints,
  getNameFromNode,
  height,
  isTargetingActiveNode,
  width,
} from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import SynceNodes from './synce-nodes';

const EDGE_GAP = 75;

const SynceTopologyContainer: VoidFunctionComponent = () => {
  const client = useClient();
  const intervalRef = useRef<number>();
  const { dispatch, state } = useStateContext();
  const {
    selectedNode,
    connectedNodeIds,
    topologyLayer,
    isWeightVisible,
    synceEdges,
    synceInterfaceGroupPositions,
    synceNodePositions,
    synceNodes,
  } = state;

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      dispatch(getSynceNodesAndEdges(client));
    }, 10000);
    dispatch(getSynceNodesAndEdges(client));

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [client, dispatch, topologyLayer]);

  const handleEdgeClick = (edge: GraphEdgeWithDiff | null) => {
    dispatch(setSelectedEdge(edge));
  };

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g>
          {synceEdges.map((edge) => {
            if (isTargetingActiveNode(edge, getNameFromNode(selectedNode), synceInterfaceGroupPositions)) {
              return null;
            }
            const isActive = !!selectedNode?.interfaces.find((i) => i.id === edge.source.interface);
            const linePoints = getLinePoints({
              edge,
              connectedNodeIds,
              nodePositions: synceNodePositions,
              interfaceGroupPositions: synceInterfaceGroupPositions,
            });
            if (!linePoints) {
              return null;
            }
            const { start, end } = linePoints;
            const controlPoints = isActive
              ? getControlPoints({
                  edge,
                  interfaceGroupPositions: synceInterfaceGroupPositions,
                  sourcePosition: start,
                  targetPosition: end,
                  edgeGap: EDGE_GAP,
                })
              : [];
            const isUnknown = false;
            const isShortestPath = false;

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
                isGmPath={false}
                isWeightVisible={(isWeightVisible && isActive) || false}
                weight={edge.weight}
              />
            );
          })}
        </g>
        <SynceNodes nodes={synceNodes} />
      </svg>
    </Box>
  );
};

export default SynceTopologyContainer;
