import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import { GraphNodeWithDiff } from '../../helpers/topology-helpers';
import { GraphNodeInterface, PositionsWithGroupsMap } from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import NodeIconImage from './node-icon-image';
import {
  getDeviceNodeTransformProperties,
  getNodeBackgroundColor,
  getNodeInterfaceGroups,
  getNodeTextColor,
} from './node-icon.helpers';
import NodeInterface from './node-interface';

type Props = {
  positions: PositionsWithGroupsMap<GraphNodeInterface>;
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
  const { change } = node;
  const { x, y } = positions.nodes[node.name];
  const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups);
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties(node.device?.deviceSize ?? 'MEDIUM');

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
        {node.name}
      </Text>
      <NodeIconImage sizeTransform={sizeTransform} />
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
        {interfaceGroups.map(([group, data]) => {
          const iPosition = data.position;
          const sourceInterface = data.interfaces.find((i) => i.id === selectedEdge?.source.interface);
          const targetInterface = data.interfaces.find((i) => i.id === selectedEdge?.target.interface);
          return (
            <NodeInterface
              key={`group-${group}`}
              position={{
                x: iPosition.x - x,
                y: iPosition.y - y,
              }}
              sourceInterface={sourceInterface}
              targetInterface={targetInterface}
              isFocused={isFocused}
            />
          );
        })}
      </G>
    </G>
  );
};

export default NodeIcon;
