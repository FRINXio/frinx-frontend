import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useStateContext } from '../../state.provider';

const Edges: VoidFunctionComponent = () => {
  const { state } = useStateContext();
  const { edges, nodePositions, interfacePositions, connectedNodeIds } = state;
  return (
    <g>
      {edges.map((edge) => {
        const sourcePosition = connectedNodeIds.includes(edge.source.nodeId)
          ? interfacePositions[edge.source.interface]
          : nodePositions[edge.source.nodeId];
        const targetPosition = connectedNodeIds.includes(edge.target.nodeId)
          ? interfacePositions[edge.target.interface]
          : nodePositions[edge.target.nodeId];
        return (
          <Box
            as="line"
            key={edge.id}
            x1={sourcePosition.x}
            y1={sourcePosition.y}
            x2={targetPosition.x}
            y2={targetPosition.y}
            stroke="gray.800"
            strokeWidth={1}
            strokeLinecap="round"
            transition="all .2s ease-in-out"
          />
        );
      })}
    </g>
  );
};

export default Edges;
