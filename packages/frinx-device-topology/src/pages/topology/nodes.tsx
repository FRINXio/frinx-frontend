import { unwrap } from '@frinx/shared';
import React, { useState, VoidFunctionComponent } from 'react';
import { Position } from './graph.helpers';

type StatePosition = {
  nodeId: string | null;
  isActive: boolean;
  offset: Position;
};
type Props = {
  nodes: { id: string; device: { name: string } }[];
  positions: Record<string, Position>;
  onNodePositionUpdate: (nodeId: string, position: Position) => void;
};

const Nodes: VoidFunctionComponent<Props> = ({ nodes, positions, onNodePositionUpdate }) => {
  const [position, setPosition] = useState<StatePosition>({
    nodeId: null,
    isActive: false,
    offset: { x: 0, y: 0 },
  });

  const handlePointerDown = (event: React.PointerEvent<SVGCircleElement>, nodeId: string) => {
    const el = event.currentTarget;
    const bbox = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bbox.left;
    const y = event.clientY - bbox.top;
    el.setPointerCapture(event.pointerId);
    setPosition({
      nodeId,
      isActive: true,
      offset: {
        x,
        y,
      },
    });
  };
  const handlePointerMove = (event: React.PointerEvent<SVGCircleElement>) => {
    if (position.isActive) {
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
            handlePointerDown(event, node.device.name);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      ))}
    </g>
  );
};

export default Nodes;
