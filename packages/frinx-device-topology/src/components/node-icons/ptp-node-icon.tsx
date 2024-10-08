import { chakra } from '@chakra-ui/react';
import React, { PointerEvent, VoidFunctionComponent } from 'react';
import {
  GraphNetNode,
  GraphNode,
  GraphPtpNodeInterface,
  MplsGraphNode,
  PositionsWithGroupsMap,
  PtpGraphNode,
  SynceGraphNode,
} from '../../pages/topology/graph.helpers';
import { PtpGraphNodeWithDiff } from '../../helpers/topology-helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import NodeIconImage from './node-icon-image';
import { getDeviceNodeTransformProperties, getNodeBackgroundColor, getNodeInterfaceGroups } from './node-icon.helpers';
import NodeInterface from './node-interface';

type Props = {
  isPtpDiffSynceShown: boolean;
  ptpDiffSynceIds: string[];
  positions: PositionsWithGroupsMap<GraphPtpNodeInterface>;
  isFocused: boolean;
  isSelected: boolean;
  isSelectedForGmPath: boolean;
  isGmPath: boolean;
  node: PtpGraphNodeWithDiff;
  topologyMode: TopologyMode;
  selectedEdge: GraphEdge | null;
  selectedNode: GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode | MplsGraphNode | null;
  onPointerDown: (event: PointerEvent<SVGRectElement>) => void;
  onPointerMove: (event: PointerEvent<SVGRectElement>) => void;
  onPointerUp: (event: PointerEvent<SVGRectElement>) => void;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const PtpNodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isPtpDiffSynceShown,
  ptpDiffSynceIds,
  isFocused,
  isSelected,
  isSelectedForGmPath,
  isGmPath,
  node,
  topologyMode,
  selectedEdge,
  selectedNode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  const { x, y } = positions.nodes[node.name];
  const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups).filter((item) =>
    selectedNode ? item[0].includes(selectedNode.name) : true,
  );
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties('MEDIUM');

  const ptpNodeBackgroundColor =
    isPtpDiffSynceShown && ptpDiffSynceIds?.includes(node.nodeId)
      ? 'red.200'
      : getNodeBackgroundColor({ isSelected, change: node.change });

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
          fill={ptpNodeBackgroundColor}
          strokeWidth={1}
          stroke={ptpNodeBackgroundColor}
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

export default PtpNodeIcon;
