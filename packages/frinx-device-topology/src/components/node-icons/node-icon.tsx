import { chakra } from '@chakra-ui/react';
import React, { memo, PointerEvent, VoidFunctionComponent } from 'react';
import { getDeviceUsageColor } from '@frinx/shared';
import { GraphNodeWithDiff } from '../../helpers/topology-helpers';
import {
  GraphNetNode,
  GraphNode,
  GraphNodeInterface,
  PositionsWithGroupsMap,
  PtpGraphNode,
  SynceGraphNode,
  MplsGraphNode,
} from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { DeviceUsage, GraphEdge } from '../../__generated__/graphql';
import NodeIconImage from './node-icon-image';
import { getDeviceNodeTransformProperties, getNodeInterfaceGroups, getNodeTextColor } from './node-icon.helpers';
import NodeInterface from './node-interface';

type Props = {
  positions: PositionsWithGroupsMap<GraphNodeInterface>;
  isSelected: boolean;
  isCommon: boolean;
  isFocused: boolean;
  isSelectedForCommonSearch: boolean;
  node: GraphNodeWithDiff;
  selectedNode: GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode | MplsGraphNode | null;
  topologyMode: TopologyMode;
  onPointerDown: (event: PointerEvent<SVGRectElement>) => void;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerUp: (event: PointerEvent<SVGRectElement>) => void;
  selectedEdge: GraphEdge | null;
  isShowingLoad: boolean;
  nodeLoad?: DeviceUsage | null;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

// <<<<<<< HEAD
const NodeIcon: VoidFunctionComponent<Props> = memo(
  ({
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
    selectedNode,
    isShowingLoad,
    nodeLoad,
  }) => {
    const { change } = node;
    const { x, y } = positions.nodes[node.name];
    const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups).filter((item) =>
      selectedNode ? item[0].includes(selectedNode.name) : true,
    );

    const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties(node.device?.deviceSize ?? 'MEDIUM');
    const nodeColor =
      isSelected && isShowingLoad ? `${getDeviceUsageColor(nodeLoad?.cpuLoad, nodeLoad?.memoryLoad)}.500` : 'gray.500';

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
          <Circle r={`${circleDiameter / 2}px`} fill={nodeColor} strokeWidth={1} stroke={nodeColor} />
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
  },
);

export default NodeIcon;
