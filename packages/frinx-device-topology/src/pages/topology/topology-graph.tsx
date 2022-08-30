import { Box } from '@chakra-ui/react';
import React, { FunctionComponent, useState } from 'react';
import DeviceInfoPanel from '../../components/device-info-panel/device-info-panel';
import { GraphEdge } from '../../__generated__/graphql';
import Edges from './edges';
import { getDefaultNodesPositions, Position } from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import Nodes from './nodes';

const width = 1248;
const height = 600;

type Props = {
  data: {
    nodes: { id: string; device: { name: string; id: string } }[];
    edges: GraphEdge[];
  };
};

const TopologyGraph: FunctionComponent<Props> = ({ data }) => {
  const [positions, setPositions] = useState(getDefaultNodesPositions(data.nodes));
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const { nodes, edges } = data;

  const handleNodePositionUpdate = (nodeId: string, position: Position) => {
    setPositions((prev) => ({
      ...prev,
      [nodeId]: position,
    }));
  };

  const handleDeviceIdSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleInfoPanelClose = () => {
    setSelectedDeviceId(null);
  };

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edges={edges} positions={positions} />
        <Nodes
          nodes={nodes}
          positions={positions}
          onNodePositionUpdate={handleNodePositionUpdate}
          onDeviceIdSelect={handleDeviceIdSelect}
          selectedDeviceId={selectedDeviceId}
        />
      </svg>
      {selectedDeviceId != null && (
        <Box
          position="absolute"
          top={2}
          right={2}
          background="white"
          borderRadius="md"
          paddingX={4}
          paddingY={6}
          width={60}
          boxShadow="md"
        >
          <DeviceInfoPanel deviceId={selectedDeviceId} onClose={handleInfoPanelClose} />
        </Box>
      )}
    </Box>
  );
};

export default TopologyGraph;
