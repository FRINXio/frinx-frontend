import { Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { GraphEdge } from '../../__generated__/graphql';
import { Position } from './graph.helpers';

type Props = {
  edges: GraphEdge[];
  positions: Record<string, Position>;
};

const Edges: VoidFunctionComponent<Props> = ({ edges, positions }) => {
  return (
    <g>
      {edges.map((edge) => (
        <Box
          as="line"
          key={edge.id}
          x1={positions[edge.source].x}
          y1={positions[edge.source].y}
          x2={positions[edge.target].x}
          y2={positions[edge.target].y}
          stroke="gray.800"
          strokeWidth={1}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

export default Edges;
