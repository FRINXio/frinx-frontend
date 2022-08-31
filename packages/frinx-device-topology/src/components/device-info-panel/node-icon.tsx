import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import { Position } from '../../pages/topology/graph.helpers';

type Props = {
  position: Position;
  isSelected: boolean;
  onPointerDown: (event: PointerEvent<SVGCircleElement>) => void;
  onPointerMove: (event: PointerEvent<SVGCircleElement>) => void;
  onPointerUp: (event: PointerEvent<SVGCircleElement>) => void;
};

const Circle = chakra('circle');

const NodeIcon: VoidFunctionComponent<Props> = ({
  position,
  isSelected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  return (
    <Circle
      r={10}
      fill="gray.400"
      strokeWidth={2}
      stroke={isSelected ? 'gray.600' : 'gray.400'}
      style={{
        cursor: 'pointer',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transformOrigin: 'center center',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
};

export default NodeIcon;
