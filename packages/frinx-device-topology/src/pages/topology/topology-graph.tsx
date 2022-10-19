import { Box } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { FunctionComponent, useRef } from 'react';
import DeviceInfoPanel from '../../components/device-info-panel/device-info-panel';
import { setSelectedNode, updateNodePosition } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import Edges from './edges';
import { Position } from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import Nodes from './nodes';

const width = 1248;
const height = 600;

// eslint-disable-next-line no-shadow
export enum DeviceSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

type Props = {
  onNodePositionUpdate: (positions: { deviceId: string; position: Position }[]) => Promise<void>;
};

const TopologyGraph: FunctionComponent<Props> = ({ onNodePositionUpdate }) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceId: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceId: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { nodes, selectedNode } = state;

  const handleNodePositionUpdate = (nodeId: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodes.find((n) => n.device.name === nodeId));
    lastPositionRef.current = { deviceId: node.device.id, position };
    dispatch(updateNodePosition(nodeId, position));
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

  const handleInfoPanelClose = () => {
    dispatch(setSelectedNode(null));
  };

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges />
        <Nodes
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
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
