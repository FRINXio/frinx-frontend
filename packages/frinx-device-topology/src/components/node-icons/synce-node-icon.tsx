import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import { SynceGraphNodeWithDiff } from '../../helpers/topology-helpers';
import {
  GraphNetNode,
  GraphNode,
  GraphSynceNodeInterface,
  PositionsWithGroupsMap,
  PtpGraphNode,
  SynceGraphNode,
} from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import NodeIconImage from './node-icon-image';
import { getDeviceNodeTransformProperties, getNodeInterfaceGroups, getNodeBackgroundColor } from './node-icon.helpers';
import NodeInterface from './node-interface';

type Props = {
  positions: PositionsWithGroupsMap<GraphSynceNodeInterface>;
  isFocused: boolean;
  isSelectedForGmPath: boolean;
  isGmPath: boolean;
  node: SynceGraphNodeWithDiff;
  topologyMode: TopologyMode;
  onPointerDown: (event: PointerEvent<SVGRectElement>) => void;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerUp: (event: PointerEvent<SVGRectElement>) => void;
  selectedEdge: GraphEdge | null;
  selectedNode: GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode | null;
  isSelected: boolean;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const SynceNodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isFocused,
  isSelectedForGmPath,
  isGmPath,
  node,
  topologyMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  selectedEdge,
  selectedNode,
  isSelected,
}) => {
  const { x, y } = positions.nodes[node.name];
  const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups).filter((item) =>
    selectedNode ? item[0].includes(selectedNode.name) : true,
  );
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties('MEDIUM');

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
          fill={getNodeBackgroundColor({
            isSelected,
            change: node.change,
          })}
          strokeWidth={1}
          stroke={getNodeBackgroundColor({
            isSelected,
            change: node.change,
          })}
        />
      </G>
      <Text
        height={`${circleDiameter / 2}px`}
        transform="translate3d(35px, 5px, 0)"
        fontWeight="600"
        userSelect="none"
        fill="black"
      >
        {node.name}
      </Text>
      <NodeIconImage sizeTransform={sizeTransform} />
      {isSelectedForGmPath && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="red.300"
        />
      )}
      {isGmPath && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="red.300"
        />
      )}
      <G>
        {interfaceGroups.map(([group, data]) => {
          const iPosition = data.position;
          const sourceInterface = data.interfaces.find((i) => i.id === selectedEdge?.source.interface);
          const targetInterface = data.interfaces.find((i) => i.id === selectedEdge?.target.interface);

          return (
            <NodeInterface
              key={group}
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

export default SynceNodeIcon;
