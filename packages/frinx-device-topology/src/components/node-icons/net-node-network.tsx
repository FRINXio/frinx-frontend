import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { height, width } from '../../pages/topology/graph.helpers';
import { InventoryNetNetwork } from '../../__generated__/graphql';

type Props = {
  network: Omit<InventoryNetNetwork, 'ospfRouteType'>;
  allNetworks: Omit<InventoryNetNetwork, 'ospfRouteType'>[];
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NetNodeNetwork: VoidFunctionComponent<Props> = ({ network, allNetworks }) => {
  const positionX = network.coordinates.x * width;
  const positionY = network.coordinates.y * height;

  const isEndNetwork = !allNetworks.some((netNetwork) => netNetwork.subnet === network.subnet);

  if (isEndNetwork) {
    return (
      <G sx={{ userSelect: 'none' }}>
        <line x1={0} y1={0} x2={positionX} y2={positionY} stroke="black" />
        <Circle
          r={15}
          fill="gray.300"
          transformOrigin="center center"
          transform={`translate3d(${positionX}px, ${positionY}px, 0)`}
        />
        <G
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="gray.600"
          transformOrigin="center center"
          transform={`translate3d(${positionX - 10}px, ${positionY - 10}px, 0)`}
          fill="none"
          width="12px"
          height="12px"
        >
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" transform="scale(0.8)" />
        </G>
        <Text fontSize="sm" transform={`translate3d(${positionX + 20}px, ${positionY}px, 0)`}>
          {network.subnet}
        </Text>
      </G>
    );
  }

  // if (!isEndNetwork && isSelected) {
  //   return <Text transform={`translate3d(${(netX / 2)-50}px, ${netY / 2}px, 0)`}>{network.subnet}</Text>;
  // }

  return null;
};

export default NetNodeNetwork;
