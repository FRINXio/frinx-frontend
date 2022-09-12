import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { GraphEdge } from '../../__generated__/graphql';
import { PositionsMap } from './graph.helpers';

type Props = {
  edges: GraphEdge[];
  positions: PositionsMap;
  selectedNodeIds: string[];
};

const Edges: VoidFunctionComponent<Props> = ({ edges, positions, selectedNodeIds }) => {
  return (
    <g>
      {edges.map((edge) => {
        const sourcePosition = selectedNodeIds.includes(edge.source.nodeId)
          ? positions.interfaces[edge.source.interface]
          : positions.nodes[edge.source.nodeId];
        const targetPosition = selectedNodeIds.includes(edge.target.nodeId)
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
            transition="all .2s ease-in-out"
          />
        );
      })}
    </g>
  );
};

export default Edges;
