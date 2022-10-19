import { NODE_CIRCLE_RADIUS } from '../../pages/topology/graph.helpers';
import { DeviceSize as DeviceSizeEnum } from '../../pages/topology/topology-graph';
import { DeviceSize } from '../../__generated__/graphql';

type DeviceNodeSize = {
  circleDiameter: number;
  sizeTransform: string;
};

export function getDeviceNodeTransformProperties(deviceSize: DeviceSize): DeviceNodeSize {
  let circleDiameter = NODE_CIRCLE_RADIUS;
  let sizeTransform = 'translate3d(-10px, -10px, 0) scale(.8)';

  switch (deviceSize) {
    case DeviceSizeEnum.SMALL:
      circleDiameter = NODE_CIRCLE_RADIUS;
      sizeTransform = 'translate3d(-10px, -10px, 0) scale(.8)';
      break;
    case DeviceSizeEnum.MEDIUM:
      circleDiameter = NODE_CIRCLE_RADIUS * 1.5;
      sizeTransform = 'translate3d(-15px, -15px, 0) scale(1.2)';
      break;
    case DeviceSizeEnum.LARGE:
      circleDiameter = NODE_CIRCLE_RADIUS * 2;
      sizeTransform = 'translate3d(-20px, -20px, 0) scale(1.6)';
      break;

    default:
      circleDiameter = NODE_CIRCLE_RADIUS;
      sizeTransform = 'translate3d(-10px, -10px, 0) scale(.8)';
      break;
  }

  return {
    circleDiameter,
    sizeTransform,
  };
}
