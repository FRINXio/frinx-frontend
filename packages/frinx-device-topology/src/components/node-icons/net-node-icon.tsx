import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { GrahpNetNodeInterface, GraphNetNode, PositionsWithGroupsMap } from '../../pages/topology/graph.helpers';
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
};

type NetNodeNetworks = {
  network: string;
  source: EndPoint;
  target: EndPoint;
};

type EndPoint = {
  id: string;
  coordinates: {
    x: Number;
    y: Number;
  };
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
}) => {
  const { x, y } = positions.nodes[node.name];
  const interfaceGroups = getNodeInterfaceGroups(node.name, positions.interfaceGroups);
  const { circleDiameter, sizeTransform } = getDeviceNodeTransformProperties('MEDIUM');

  const allNetworks = netNodes
    .filter((netNode) => node.id !== netNode.id)
    .map((item) => item.networks)
    .reduce((acc, networks) => acc.concat(networks), []);

  function transformDataForNode(data: GraphNetNode[], nodeName: string) {
    const networkConnections: NetNodeNetworks[] = [];
    const sourceNode = data.find((node) => node.name === nodeName);

    // Return empty if the node with the specified name is not found
    if (!sourceNode) return [];

    sourceNode.networks.forEach((network) => {
      const subnet = network.subnet;

      // Find all nodes that are part of this network and are not the source node
      const connectedNodes = data.filter((n) => n.networks.some((net) => net.subnet === subnet) && n.name !== nodeName);

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

        // Adding a unique string identifier to help with removing duplicates later
        const uniqueIdentifier = JSON.stringify(connectionObject);

        if (!networkConnections.some((obj) => JSON.stringify(obj) === uniqueIdentifier)) {
          networkConnections.push(connectionObject);
        }
      });
    });

    return networkConnections;
  }

  const transformedDataForNode = transformDataForNode(netNodes, node.name);
  console.log(node.name, transformedDataForNode);

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
        transformedDataForNode.map((netNode) => {
          const netX = (netNode?.target.coordinates.x - netNode?.source.coordinates.x) * 1248;
          const netY = (netNode?.target.coordinates.y - netNode?.source.coordinates.y) * 600;

          return (
            <Text key={netNode.target.id} transform={`translate3d(${netX / 2 - 25}px, ${netY / 2}px, 0)`} fontSize={10} bg="red">
              {netNode.network}
            </Text>
          );
        })}
      <G>
        {node.networks.map((network) => {
          return (
            <NetNodeNetwork allNetworks={allNetworks} isSelected={isSelected} key={network.id} network={network} />
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
