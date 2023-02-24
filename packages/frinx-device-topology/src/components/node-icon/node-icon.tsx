import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import { GraphNodeWithDiff } from '../../helpers/topology-helpers';
import { PositionsWithGroupsMap } from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import {
  getDeviceNodeTransformProperties,
  getNodeBackgroundColor,
  getNodeIconColor,
  getNodeInterfaceGroups,
  getNodeTextColor,
} from './node-icon.helpers';

type Props = {
  positions: PositionsWithGroupsMap;
  isSelected: boolean;
  isCommon: boolean;
  isFocused: boolean;
  isSelectedForCommonSearch: boolean;
  node: GraphNodeWithDiff;
  topologyMode: TopologyMode;
  onPointerDown: (event: PointerEvent<SVGRectElement>) => void;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerUp: (event: PointerEvent<SVGRectElement>) => void;
  selectedEdge: GraphEdge | null;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isFocused,
  isSelected,
  isCommon,
  isSelectedForCommonSearch,
  node,
  topologyMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  selectedEdge,
}) => {
  const { device, change } = node;
  const { x, y } = positions.nodes[node.device.name];
  const interfaceGroups = getNodeInterfaceGroups(device.name, positions.interfaceGroups);
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties(node.device.deviceSize);

  return (
    <G
      cursor={topologyMode === 'COMMON_NODES' ? 'not-allowed' : 'pointer'}
      transform={`translate3d(${x}px, ${y}px, 0)`}
      transformOrigin="center center"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Circle
        r={isFocused ? `${circleDiameter}px` : 0}
        fill="blackAlpha.100"
        strokeOpacity={0.4}
        stroke="gray.500"
        transition="all .2s ease-in-out"
      />
      <G>
        <Circle
          r={`${circleDiameter / 2}px`}
          fill={getNodeBackgroundColor({ isSelected, change })}
          strokeWidth={1}
          stroke={getNodeBackgroundColor({ isSelected, change })}
        />
      </G>
      <Text
        height={`${circleDiameter / 2}px`}
        transform="translate3d(35px, 5px, 0)"
        fontWeight="600"
        userSelect="none"
        fill={getNodeTextColor(change)}
      >
        {device.name}
      </Text>
      <G
        fill="none"
        stroke={getNodeIconColor({ isSelected, change })}
        strokeWidth="2px"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={sizeTransform}
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
      {isSelectedForCommonSearch && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="red.300"
        />
      )}
      {isCommon && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="green.300"
        />
      )}
      <G>
        {interfaceGroups.map(([groupId, data]) => {
          const iPosition = data.position;
          const sourceInterface = data.interfaces.find((i) => i.id === selectedEdge?.source.interface);
          const targetInterface = data.interfaces.find((i) => i.id === selectedEdge?.target.interface);
          return iPosition ? (
            <G
              transform={isFocused ? `translate3d(${iPosition.x - x}px, ${iPosition.y - y}px, 0)` : undefined}
              opacity={isFocused ? 1 : 0}
              key={groupId}
            >
              {sourceInterface != null && (
                <Text
                  data-id={sourceInterface.id}
                  fontSize="sm"
                  transform="translate(5px, -5px)"
                  fill={sourceInterface.status === 'unknown' ? 'red' : 'black'}
                >
                  {sourceInterface.name}
                </Text>
              )}
              {targetInterface != null && (
                <Text
                  data-id={targetInterface.id}
                  fontSize="sm"
                  transform="translate(5px, -5px)"
                  fill={targetInterface.status === 'unknown' ? 'red' : 'black'}
                >
                  {targetInterface.name}
                </Text>
              )}
              <Circle r="4px" fill="purple" key={groupId} />
            </G>
          ) : null;
        })}
      </G>
    </G>
  );
};

export default NodeIcon;
