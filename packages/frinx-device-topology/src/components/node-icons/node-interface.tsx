import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { getSynceInterfaceNodeColor } from '../../helpers/topology-helpers';
import { Position } from '../../pages/topology/graph.helpers';
import { TopologyLayer } from '../../state.reducer';

type InterfaceDetails = {
  isSynceEnabled: boolean | undefined;
  isQualifiedForUse: string | null | undefined;
  isSelectedForUse: string | null;
};

type Props = {
  position: Position;
  sourceInterface?: { id: string; name: string };
  targetInterface?: { id: string; name: string };
  isFocused: boolean;
  topologyLayer?: TopologyLayer;
  interfaceDetails?: InterfaceDetails;
};

const G = chakra('g');
const Circle = chakra('circle');
const Text = chakra('text');

const NodeInterface: VoidFunctionComponent<Props> = ({
  position,
  sourceInterface,
  targetInterface,
  isFocused,
  topologyLayer,
  interfaceDetails,
}) => {
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
      <Circle
        r="4px"
        fill={
          (topologyLayer === 'Synchronous Ethernet')
            ? getSynceInterfaceNodeColor(
                interfaceDetails?.isQualifiedForUse,
                interfaceDetails?.isSelectedForUse,
                interfaceDetails?.isSynceEnabled,
              )
            : 'purple'
        }
      />
    </G>
  ) : null;
};

export default NodeInterface;
