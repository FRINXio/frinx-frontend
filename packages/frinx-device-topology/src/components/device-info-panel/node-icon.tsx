import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import { GraphNode, Position, POSITIONS, POSITIONS_MAP } from '../../pages/topology/graph.helpers';

type Props = {
  position: Position;
  isSelected: boolean;
  isFocused: boolean;
  node: GraphNode;
  onPointerDown: (event: PointerEvent<SVGRectElement>) => void;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerUp: (event: PointerEvent<SVGRectElement>) => void;
};

const G = chakra('g');
const Rect = chakra('rect');
const Text = chakra('text');

const NodeIcon: VoidFunctionComponent<Props> = ({
  position,
  isFocused,
  isSelected,
  node,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  const { interfaces, device } = node;
  return (
    <G
      cursor="pointer"
      transform={`translate3d(${position.x}px, ${position.y}px, 0)`}
      transformOrigin="center center"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Rect
        width={isFocused ? '60px' : 0}
        height={isFocused ? '60px' : 0}
        fill="blackAlpha.100"
        transform="translate3d(-30px, -30px, 0)"
        strokeOpacity={0.4}
        stroke="gray.500"
        transition="all .2s ease-in-out"
      />
      <G>
        {interfaces.map((intf, i) => {
          const [x, y] = POSITIONS_MAP[POSITIONS[i]];
          return (
            <G
              key={intf}
              transform={isFocused ? `translate3d(${x - 2.5}px, ${y - 2.5}px, 0)` : undefined}
              transition="all .2s ease-in-out"
            >
              <Rect width="5px" height="5px" fill="purple" />
            </G>
          );
        })}
      </G>
      <Rect
        width="30px"
        height="30px"
        transform="translate3d(-15px, -15px, 0)"
        fill={isSelected ? 'blue.500' : 'gray.400'}
        strokeWidth={1}
        stroke={isSelected ? 'blue.600' : 'gray.400'}
      />
      <Text height="15px" transform="translate3d(35px, 5px, 0)" fontWeight="600">
        {device.name}
      </Text>
      <G
        fill="none"
        stroke={isSelected ? 'whiteAlpha.800' : 'gray.600'}
        strokeWidth="2px"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate3d(-12px, -12px, 0)"
      >
        <path strokeWidth="1.2" d="M9 21H3v-6M15 3h6v6M21 3l-7 7M3 21l7-7" />
        <g strokeWidth="1.2">
          <path transform="rotate(90 12 1)" strokeWidth="1.2" d="M15 3h6v6" />
          <path strokeWidth="1.2" d="m9.975 3-7 7" transform="rotate(90 6.488 6.513)" />
        </g>
        <g strokeWidth="1.2">
          <path transform="rotate(-90 23.06 12)" strokeWidth="1.2" d="M15 3h6v6" />
          <path strokeWidth="1.2" d="m9.975 3-7 7" transform="rotate(-90 17.547 6.488)" />
        </g>
      </G>
    </G>
  );
};

export default NodeIcon;
