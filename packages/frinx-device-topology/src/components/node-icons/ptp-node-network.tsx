import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { height, width } from '../../pages/topology/graph.helpers';
import { NetNetwork } from '../../__generated__/graphql';

type Props = {
  network: NetNetwork;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NetNodeNetwork: VoidFunctionComponent<Props> = ({ network }) => {
  const positionX = network.coordinates.x * width;
  const positionY = network.coordinates.y * height;
  return (
    <G>
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
};

export default NetNodeNetwork;
