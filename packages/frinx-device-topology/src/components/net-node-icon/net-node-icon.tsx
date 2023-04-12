import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import {
  GrahpNetNodeInterface,
  GraphNetNode,
  height,
  PositionsWithGroupsMap,
  width,
} from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import { getDeviceNodeTransformProperties, getNodeInterfaceGroups } from '../node-icon/node-icon.helpers';

type Props = {
  positions: PositionsWithGroupsMap<GrahpNetNodeInterface>;
  isCommon: boolean;
  isFocused: boolean;
  isSelectedForCommonSearch: boolean;
  node: GraphNetNode;
  topologyMode: TopologyMode;
  selectedEdge: GraphEdge | null;
  onClick: (node: GraphNetNode) => void;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NetNodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isFocused,
  isCommon,
  isSelectedForCommonSearch,
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
          const netPositionX = network.coordinates.x * width;
          const netPositionY = network.coordinates.y * height;
          return (
            <G key={network.id}>
              <line x1={0} y1={0} x2={netPositionX} y2={netPositionY} stroke="black" />
              <Circle
                r={15}
                fill="gray.300"
                transformOrigin="center center"
                transform={`translate3d(${netPositionX}px, ${netPositionY}px, 0)`}
              />
              <G
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="gray.600"
                transformOrigin="center center"
                transform={`translate3d(${netPositionX - 10}px, ${netPositionY - 10}px, 0)`}
                fill="none"
                width="12px"
                height="12px"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" transform="scale(0.8)" />
              </G>
              <Text fontSize="sm" transform={`translate3d(${netPositionX + 20}px, ${netPositionY}px, 0)`}>
                {network.subnet}
              </Text>
            </G>
          );
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
        <Circle r={`${circleDiameter / 2}px`} fill="gray.400" strokeWidth={1} stroke="gray.400" />
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
      <G
        fill="none"
        stroke="gray.600"
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
                <Text data-id={sourceInterface.id} fontSize="sm" transform="translate(5px, -5px)" fill="black">
                  {sourceInterface.name}
                </Text>
              )}
              {targetInterface != null && (
                <Text data-id={targetInterface.id} fontSize="sm" transform="translate(5px, -5px)" fill="black">
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

export default NetNodeIcon;
