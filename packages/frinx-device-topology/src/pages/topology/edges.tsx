import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useStateContext } from '../../state.provider';
import { setSelectedEdge } from '../../state.actions';
import { GraphEdge, isTargetingActiveNode, getrCurvePath, getLinePoints, getControlPoints } from './graph.helpers';

const EDGE_GAP = 75;

const Edges: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { edges, nodePositions, interfaceGroupPositions, connectedNodeIds, selectedNode, selectedEdge } = state;

  const handleEdgeClick = (edge: GraphEdge | null) => {
    dispatch(setSelectedEdge(edge));
  };

  return (
    <g>
      {edges.map((edge) => {
        // dont show edges that are connected to active node
        if (isTargetingActiveNode(edge, selectedNode, interfaceGroupPositions)) {
          return null;
        }

        const isActive = selectedNode?.interfaces.includes(edge.source.interface);
        const isSelected = edge.id === selectedEdge?.id;

        const linePoints = getLinePoints(edge, connectedNodeIds, nodePositions, interfaceGroupPositions);
        if (!linePoints) {
          return null;
        }
        const { start, end } = linePoints;
        const controlPoints = isActive ? getControlPoints(edge, interfaceGroupPositions, start, end, EDGE_GAP) : [];

        return (
          <React.Fragment key={edge.id}>
            {isActive ? (
              <g>
                <path
                  strokeWidth={1}
                  stroke="black"
                  strokeLinejoin="round"
                  fill="none"
                  d={getrCurvePath(start, end, controlPoints)}
                  cursor="pointer"
                />
                <path
                  strokeWidth={5}
                  stroke="transparent"
                  strokeLinejoin="round"
                  fill="none"
                  d={getrCurvePath(start, end, controlPoints)}
                  cursor="pointer"
                  onClick={() => handleEdgeClick(edge)}
                />
              </g>
            ) : (
              <Box
                as="line"
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="gray.800"
                strokeWidth={isActive ? 3 : 1}
                strokeLinecap="round"
                borderWidth={3}
                transition="all .2s ease-in-out"
              />
            )}

            {isSelected && (
              <>
                <defs>
                  <path id="sourcePath" d={getrCurvePath(start, end, controlPoints)} />
                </defs>
                <text dx={30} dy={20} fontSize={14}>
                  <textPath href="#sourcePath">{edge.source.interface}</textPath>
                </text>
                <text dx={-30} dy={-10} fontSize={14}>
                  <textPath href="#sourcePath" startOffset="100%" textAnchor="end">
                    {edge.target.interface}
                  </textPath>
                </text>
              </>
            )}
          </React.Fragment>
        );
      })}
    </g>
  );
};

export default Edges;
