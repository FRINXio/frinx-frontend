import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, VoidFunctionComponent } from 'react';
import { useClient } from 'urql';
import Edge from '../../components/edge/edge';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { getNetNodesAndEdges, setSelectedEdge } from '../../state.actions';
import { useStateContext } from '../../state.provider';
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
  } = state;

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

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g>
          {netEdges.map((edge) => {
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

            return (
              <Edge
                controlPoints={controlPoints}
                edge={edge}
                isActive={isActive}
                linePoints={linePoints}
                onClick={handleEdgeClick}
                key={edge.id}
                isUnknown={isUnknown}
              />
            );
          })}
        </g>
        <NetNodes nodes={netNodes} />
      </svg>
    </Box>
  );
};

export default NetTopologyContainer;
