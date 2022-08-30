import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { GraphEdge } from '../../__generated__/graphql';
import { PositionsMap } from './graph.helpers';

type Props = {
  edges: GraphEdge[];
  positions: PositionsMap;
  selectedNodeId: string | null;
};

const Edges: VoidFunctionComponent<Props> = ({ edges, positions, selectedNodeId }) => {
  return (
    <g>
      {edges.map((edge) => {
        const sourcePosition =
          selectedNodeId === edge.source.nodeId
            ? positions.interfaces[edge.source.interface]
            : positions.nodes[edge.source.nodeId];
        const targetPosition =
          selectedNodeId === edge.target.nodeId
            ? positions.interfaces[edge.target.interface]
            : positions.nodes[edge.target.nodeId];
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
          />
        );
      })}
    </g>
  );
};

export default Edges;
