import { unwrap } from '@frinx/shared/src';
import React, { useRef, useState, VoidFunctionComponent } from 'react';
import NodeIcon from '../../components/device-info-panel/node-icon';
import { Position } from './graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};
type Props = {
  nodes: { id: string; device: { name: string; id: string } }[];
  positions: Record<string, Position>;
  selectedDeviceId: string | null;
  onNodePositionUpdate: (nodeId: string, position: Position) => void;
  onDeviceIdSelect: (deviceId: string) => void;
};

const Nodes: VoidFunctionComponent<Props> = ({
  nodes,
  positions,
  selectedDeviceId,
  onNodePositionUpdate,
  onDeviceIdSelect,
}) => {
  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });
  const timeoutRef = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent<SVGCircleElement>, device: { id: string; name: string }) => {
    timeoutRef.current = Number(
      setTimeout(() => {
        onDeviceIdSelect(device.id);
      }, 250),
    );
    const el = event.currentTarget;
    const bbox = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bbox.left;
    const y = event.clientY - bbox.top;
    el.setPointerCapture(event.pointerId);
    setPosition({
      nodeId: device.name,
      isActive: true,
      offset: {
        x,
        y,
      },
    });
  };
  const handlePointerMove = (event: React.PointerEvent<SVGCircleElement>) => {
    if (position.isActive) {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
      const bbox = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bbox.left;
      const y = event.clientY - bbox.top;
      const nodeId = unwrap(position.nodeId);
      const newX = positions[nodeId].x - (position.offset.x - x);
      const newY = positions[nodeId].y - (position.offset.y - y);
      onNodePositionUpdate(nodeId, { x: newX, y: newY });
    }
  };
  const handlePointerUp = () => {
    setPosition({
      offset: { x: 0, y: 0 },
      nodeId: null,
      isActive: false,
    });
  };

  return (
    <g>
      {nodes.map((node) => (
        <NodeIcon
          key={node.id}
          onPointerDown={(event) => {
            handlePointerDown(event, node.device);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          position={positions[node.device.name]}
          isSelected={selectedDeviceId === node.device.id}
        />
      ))}
    </g>
  );
};

export default Nodes;
