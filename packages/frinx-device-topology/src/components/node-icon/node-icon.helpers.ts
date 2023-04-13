import { Change } from '../../helpers/topology-helpers';
import { getDeviceSizeDiameter, GroupData, PositionGroupsMap } from '../../pages/topology/graph.helpers';
import { DeviceSize } from '../../__generated__/graphql';

type DeviceNodeSize = {
  circleDiameter: number;
  sizeTransform: string;
};

export function getDeviceNodeTransformProperties(deviceSize: DeviceSize): DeviceNodeSize {
  const circleDiameter = getDeviceSizeDiameter(deviceSize);

  switch (deviceSize) {
    case 'MEDIUM':
      return {
        circleDiameter,
        sizeTransform: 'translate3d(-15px, -15px, 0) scale(1.2)',
      };
    case 'LARGE':
      return {
        circleDiameter,
        sizeTransform: 'translate3d(-20px, -20px, 0) scale(1.6)',
      };
    default:
      return {
        circleDiameter,
        sizeTransform: 'translate3d(-10px, -10px, 0) scale(.8)',
      };
  }
}

export function getNodeInterfaceGroups<S extends { id: string; name: string }>(
  nodeId: string,
  interfaceGroupPositions: PositionGroupsMap<S>,
): [string, GroupData<S>][] {
  return Object.entries(interfaceGroupPositions).filter(([groupId]) => {
    return groupId.startsWith(nodeId);
  });
}

export function getNodeBackgroundColor({ isSelected, change }: { isSelected: boolean; change: Change }): string {
  if (change === 'DELETED') {
    return 'red.200';
  }
  if (change === 'ADDED') {
    return 'green.200';
  }
  if (change === 'UPDATED') {
    return 'yellow.200';
  }
  return isSelected ? 'blue.500' : 'gray.400';
}
export function getNodeTextColor(change: Change): string {
  if (change === 'DELETED') {
    return 'red.400';
  }
  if (change === 'ADDED') {
    return 'green.400';
  }
  if (change === 'UPDATED') {
    return 'yellow.400';
  }
  return 'black';
}
export function getNodeIconColor({ isSelected, change }: { isSelected: boolean; change: Change }): string {
  if (change === 'DELETED') {
    return 'red.400';
  }
  if (change === 'ADDED') {
    return 'green.400';
  }
  if (change === 'UPDATED') {
    return 'yellow.400';
  }
  return isSelected ? 'whiteAlpha.800' : 'gray.600';
}
