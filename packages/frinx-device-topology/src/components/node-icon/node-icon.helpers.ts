import { getDeviceSizeDiameter } from '../../pages/topology/graph.helpers';
import { DeviceSize as DeviceSizeEnum } from '../../pages/topology/topology-graph';
import { DeviceSize } from '../../__generated__/graphql';

type DeviceNodeSize = {
  circleDiameter: number;
  sizeTransform: string;
};

export function getDeviceNodeTransformProperties(deviceSize: DeviceSize): DeviceNodeSize {
  const circleDiameter = getDeviceSizeDiameter(deviceSize);

  switch (deviceSize) {
    case DeviceSizeEnum.MEDIUM:
      return {
        circleDiameter,
        sizeTransform: 'translate3d(-15px, -15px, 0) scale(1.2)',
      };
    case DeviceSizeEnum.LARGE:
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
