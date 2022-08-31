import { Box } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { FunctionComponent, useRef, useState } from 'react';
import DeviceInfoPanel from '../../components/device-info-panel/device-info-panel';
import { GraphEdge } from '../../__generated__/graphql';
import Edges from './edges';
import { getDefaultNodesPositions, getUpdatedInterfacesPositions, GraphNode, Position } from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import Nodes from './nodes';

const width = 1248;
const height = 600;

type Props = {
  data: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  onNodePositionUpdate: (positions: { deviceId: string; position: Position }[]) => Promise<void>;
};

const TopologyGraph: FunctionComponent<Props> = ({ data, onNodePositionUpdate }) => {
  const [positions, setPositions] = useState(getDefaultNodesPositions(data.nodes));
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const lastPositionRef = useRef<{ deviceId: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceId: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { nodes, edges } = data;

  const handleNodePositionUpdate = (nodeId: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    setPositions((prev) => {
      const node = unwrap(nodes.find((n) => n.device.name === nodeId));
      lastPositionRef.current = { deviceId: node.device.id, position };
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [nodeId]: position,
        },
        interfaces: {
          ...prev.interfaces,
          ...getUpdatedInterfacesPositions(node, position),
        },
      };
    });
  };

  const handleNodePositionUpdateFinish = () => {
    if (lastPositionRef.current) {
      positionListRef.current.push(lastPositionRef.current);
      lastPositionRef.current = null;
      timeoutRef.current = Number(
        setTimeout(() => {
          onNodePositionUpdate(positionListRef.current).then(() => {
            positionListRef.current = [];
            clearTimeout(timeoutRef.current);
          });
        }, 3000),
      );
    }
  };

  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleInfoPanelClose = () => {
    setSelectedNode(null);
  };

  const connectedEdges = edges.filter(
    (e) => selectedNode?.device.name === e.source.nodeId || selectedNode?.device.name === e.target.nodeId,
  );
  const connectedNodeIds = [
    ...new Set([...connectedEdges.map((e) => e.source.nodeId), ...connectedEdges.map((e) => e.target.nodeId)]),
  ];

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edges={edges} positions={positions} selectedNodeIds={connectedNodeIds} />
        <Nodes
          nodes={nodes}
          positions={positions}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodeSelect={handleNodeSelect}
          selectedNodeIds={connectedNodeIds}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
          selectedDeviceId={selectedNode?.device.id ?? null}
        />
      </svg>
      {selectedNode != null && (
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
          <DeviceInfoPanel deviceId={selectedNode.device.id} onClose={handleInfoPanelClose} />
        </Box>
      )}
    </Box>
  );
};

export default TopologyGraph;
