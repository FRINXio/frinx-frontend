import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Position } from '../../pages/topology/graph.helpers';

type Props = {
  position: Position;
  sourceInterface?: { id: string; name: string };
  targetInterface?: { id: string; name: string };
  isFocused: boolean;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NodeInterface: VoidFunctionComponent<Props> = ({ position, sourceInterface, targetInterface, isFocused }) => {
  return position != null ? (
    <G
      transform={isFocused ? `translate3d(${position.x}px, ${position.y}px, 0)` : undefined}
      opacity={isFocused ? 1 : 0}
    >
      {sourceInterface != null && (
        <Text fontSize="sm" transform="translate(5px, -5px)" fill="black">
          {sourceInterface.name}
        </Text>
      )}
      {targetInterface != null && (
        <Text fontSize="sm" transform="translate(5px, -5px)" fill="black">
          {targetInterface.name}
        </Text>
      )}
      <Circle r="4px" fill="purple" />
    </G>
  ) : null;
};

export default NodeInterface;
