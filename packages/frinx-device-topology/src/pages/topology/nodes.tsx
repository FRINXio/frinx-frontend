import { unwrap } from '@frinx/shared/src';
import React, { useRef, useState, VoidFunctionComponent } from 'react';
import { Position } from './graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};
type Props = {
  nodes: { id: string; device: { name: string; id: string } }[];
  positions: Record<string, Position>;
  onNodePositionUpdate: (nodeId: string, position: Position) => void;
  onDeviceIdSelect: (deviceId: string) => void;
};

const Nodes: VoidFunctionComponent<Props> = ({ nodes, positions, onNodePositionUpdate, onDeviceIdSelect }) => {
  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (event: React.PointerEvent<SVGCircleElement>, device: { id: string; name: string }) => {
    timeoutRef.current = setTimeout(() => {
      onDeviceIdSelect(device.id);
    }, 250);
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
      clearTimeout(timeoutRef.current);
      const bbox = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bbox.left;
      const y = event.clientY - bbox.top;
      const nodeId = unwrap(position.nodeId);
      const newX = positions[nodeId].x - (position.offset.x - x);
      const newY = positions[nodeId].y - (position.offset.y - y);
      onNodePositionUpdate(nodeId, { x: newX, y: newY });
    }
  };
  const handlePointerUp = (event: React.PointerEvent<SVGCircleElement>) => {
    console.log(position.isActive);
    setPosition({
      offset: { x: 0, y: 0 },
      nodeId: null,
      isActive: false,
    });
  };

  const handleNodeClick = (deviceId: string) => {
    console.log('click');
    // onDeviceIdSelect(deviceId);
  };

  return (
    <g>
      {nodes.map((node) => (
        <circle
          r={10}
          fill="gray.400"
          cursor="pointer"
          key={node.id}
          style={{
            transform: `translate3d(${positions[node.device.name].x}px, ${positions[node.device.name].y}px, 0)`,
            transformOrigin: 'center center',
          }}
          onPointerDown={(event) => {
            handlePointerDown(event, node.device);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(event) => {
            event.stopPropagation();
            handleNodeClick(node.device.id);
          }}
        />
      ))}
    </g>
  );
};

export default Nodes;
