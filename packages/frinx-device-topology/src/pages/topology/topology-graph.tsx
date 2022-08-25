import { Box } from '@chakra-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { GraphEdge } from '../../__generated__/graphql';
import Edges from './edges';
import { getDefaultNodesPositions, Position } from './graph.helpers';
import Nodes from './nodes';

const width = 1248;
const height = 600;

type Props = {
  data: {
    nodes: { id: string; device: { name: string } }[];
    edges: GraphEdge[];
  };
};

const TopologyGraph: FunctionComponent<Props> = ({ data }) => {
  const [positions, setPositions] = useState(getDefaultNodesPositions(data.nodes));
  const { nodes, edges } = data;

  const handleNodePositionUpdate = (nodeId: string, position: Position) => {
    setPositions((prev) => ({
      ...prev,
      [nodeId]: position,
    }));
  };

  return (
    <Box background="white" borderRadius="md">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edges={edges} positions={positions} />
        <Nodes nodes={nodes} positions={positions} onNodePositionUpdate={handleNodePositionUpdate} />
      </svg>
    </Box>
  );
};

export default TopologyGraph;
