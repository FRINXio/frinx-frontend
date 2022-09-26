import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import {
  GraphNode,
  NODE_CIRCLE_RADIUS,
  PositionGroupsMap,
  PositionsWithGroupsMap,
} from '../../pages/topology/graph.helpers';

type Props = {
  positions: PositionsWithGroupsMap;
  isSelected: boolean;
  isFocused: boolean;
  node: GraphNode;
  onPointerDown: (event: PointerEvent<SVGRectElement>) => void;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerUp: (event: PointerEvent<SVGRectElement>) => void;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const getNodeInterfaceGroups = (nodeId: string, interfaceGroupPositions: PositionGroupsMap) => {
  return Object.entries(interfaceGroupPositions).filter(([groupId]) => {
    return groupId.startsWith(nodeId);
  });
};

const NodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isFocused,
  isSelected,
  node,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  const { device } = node;
  const { x, y } = positions.nodes[node.device.name];
  const interfaceGroups = getNodeInterfaceGroups(device.name, positions.interfaceGroups);

  return (
    <G
      cursor="pointer"
      transform={`translate3d(${x}px, ${y}px, 0)`}
      transformOrigin="center center"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Circle
        r={isFocused ? `${NODE_CIRCLE_RADIUS}px` : 0}
        fill="blackAlpha.100"
        strokeOpacity={0.4}
        stroke="gray.500"
        transition="all .2s ease-in-out"
      />
      <G>
        <G>
          {interfaceGroups.map(([groupId, data]) => {
            const iPosition = data.position;
            return iPosition ? (
              <Circle
                r="4px"
                fill="purple"
                key={groupId}
                style={{
                  transform: isFocused ? `translate3d(${iPosition.x - x}px, ${iPosition.y - y}px, 0)` : undefined,
                }}
              />
            ) : null;
          })}
        </G>
        <Circle
          r={`${NODE_CIRCLE_RADIUS / 2}px`}
          fill={isSelected ? 'blue.500' : 'gray.400'}
          strokeWidth={1}
          stroke={isSelected ? 'blue.600' : 'gray.400'}
        />
      </G>
      <Text
        height={`${NODE_CIRCLE_RADIUS / 2}px`}
        transform="translate3d(35px, 5px, 0)"
        fontWeight="600"
        userSelect="none"
      >
        {device.name}
      </Text>
      <G
        fill="none"
        stroke={isSelected ? 'whiteAlpha.800' : 'gray.600'}
        strokeWidth="2px"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate3d(-10px, -10px, 0) scale(.8)"
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
