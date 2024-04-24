import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { NetGraphNodeWithDiff } from '../../helpers/topology-helpers';
import { GrahpNetNodeInterface, GraphNetNode, PositionsWithGroupsMap } from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import NetNodeNetwork from './net-node-network';
import NodeIconImage from './node-icon-image';
import { getDeviceNodeTransformProperties, getNodeInterfaceGroups, getNodeBackgroundColor } from './node-icon.helpers';
import NodeInterface from './node-interface';

type Props = {
  positions: PositionsWithGroupsMap<GrahpNetNodeInterface>;
  isCommon: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isShortestPath: boolean;
  isSelectedForCommonSearch: boolean;
  isSelectedForShortestPath: boolean;
  node: NetGraphNodeWithDiff;
  topologyMode: TopologyMode;
  selectedEdge: GraphEdge | null;
  onClick: (node: GraphNetNode) => void;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NetNodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isSelected,
  isFocused,
  isCommon,
  isShortestPath,
  isSelectedForCommonSearch,
  isSelectedForShortestPath,
  node,
  topologyMode,
  selectedEdge,
  onClick,
}) => {
  const { x, y } = positions.nodes[node.name];
  const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups);
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties('MEDIUM');

  return (
    <G
      cursor={topologyMode === 'COMMON_NODES' ? 'not-allowed' : 'pointer'}
      transform={`translate3d(${x}px, ${y}px, 0)`}
      transformOrigin="center center"
      onClick={() => {
        onClick(node);
      }}
    >
      <G>
        {node.networks.map((network) => {
          return <NetNodeNetwork key={network.id} network={network} />;
        })}
      </G>
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
      {isSelectedForCommonSearch && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="red.300"
        />
      )}
      {isSelectedForShortestPath && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="blue.500"
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
      {isShortestPath && (
        <Circle
          r={`${circleDiameter / 2 + 5}px`}
          fill="transparent"
          strokeWidth={3}
          strokeDasharray="15, 15"
          stroke="blue.400"
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

export default NetNodeIcon;
