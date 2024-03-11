import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import {
  GrahpNetNodeInterface,
  GraphNetNode,
  PositionsWithGroupsMap,
  width,
  height,
} from '../../pages/topology/graph.helpers';
import { TopologyMode } from '../../state.actions';
import { GraphEdge } from '../../__generated__/graphql';
import NetNodeNetwork from './net-node-network';
import NodeIconImage from './node-icon-image';
import { getDeviceNodeTransformProperties, getNodeInterfaceGroups } from './node-icon.helpers';
import NodeInterface from './node-interface';

type Props = {
  positions: PositionsWithGroupsMap<GrahpNetNodeInterface>;
  isCommon: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isShortestPath: boolean;
  isSelectedForCommonSearch: boolean;
  isSelectedForShortestPath: boolean;
  node: GraphNetNode;
  netNodes: GraphNetNode[];
  topologyMode: TopologyMode;
  selectedEdge: GraphEdge | null;
  onClick: (node: GraphNetNode) => void;
  isWeightVisible: boolean;
};

type NetNodeNetworks = {
  network: string;
  source: EndPoint;
  target: EndPoint;
};

type EndPoint = {
  id: string;
  coordinates: Coordinates;
};

type Coordinates = {
  x: number;
  y: number;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NetNodeIcon: VoidFunctionComponent<Props> = ({
  positions,
  isFocused,
  isSelected,
  isCommon,
  isShortestPath,
  isSelectedForCommonSearch,
  isSelectedForShortestPath,
  node,
  topologyMode,
  selectedEdge,
  netNodes,
  onClick,
  isWeightVisible,
}) => {
  const { x, y } = positions.nodes[node.name];
  const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups);
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties('MEDIUM');

  const allNetworks = netNodes
    .filter((netNode) => node.id !== netNode.id)
    .map((item) => item.networks)
    .reduce((acc, networks) => acc.concat(networks), []);

  const getNetworkDataForNode = (netNodesData: GraphNetNode[], nodeName: string) => {
    const networkConnections: NetNodeNetworks[] = [];
    const sourceNode = netNodesData.find(({ name }) => name === nodeName);

    if (!sourceNode) return [];

    sourceNode.networks.forEach((network) => {
      const { subnet } = network;

      const connectedNodes = netNodesData.filter(
        (n) => n.networks.some((net) => net.subnet === subnet) && n.name !== nodeName,
      );

      connectedNodes.forEach((targetNode) => {
        const connectionObject = {
          network: subnet,
          source: {
            id: sourceNode.id,
            coordinates: sourceNode.coordinates,
          },
          target: {
            id: targetNode.id,
            coordinates: targetNode.coordinates,
          },
        };

        const uniqueIdentifier = JSON.stringify(connectionObject);

        if (!networkConnections.some((obj) => JSON.stringify(obj) === uniqueIdentifier)) {
          networkConnections.push(connectionObject);
        }
      });
    });

    return networkConnections;
  };

  const networkDataForNode = getNetworkDataForNode(netNodes, node.name);

  return (
    <G
      position="relative"
      cursor={topologyMode === 'COMMON_NODES' ? 'not-allowed' : 'pointer'}
      transform={`translate3d(${x}px, ${y}px, 0)`}
      transformOrigin="center center"
      onClick={() => {
        onClick(node);
      }}
    >
      {isSelected &&
        !isWeightVisible &&
        networkDataForNode.map((netNode) => {
          const netX = (netNode.target.coordinates.x - netNode.source.coordinates.x) * width;
          const netY = (netNode.target.coordinates.y - netNode.source.coordinates.y) * height;

          return (
            <G transform={`translate3d(${netX / 2}px, ${netY / 2}px, 0)`}>
              <Circle r={4} fill="back" transition="all .2s ease-in-out" />
              <Text key={netNode.target.id} transform="translate3d(-45px, -5px, 0)" fontSize={15} bg="red">
                {netNode.network}
              </Text>
            </G>
          );
        })}
      <G>
        {node.networks.map((network) => {
          return <NetNodeNetwork allNetworks={allNetworks} key={network.id} network={network} />;
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
