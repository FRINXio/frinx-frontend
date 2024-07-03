const isHighUsage = (usage: number) => usage >= 90;
const isMediumUsage = (usage: number) => usage >= 75 && usage < 90;
const isLowUsage = (usage: number) => usage < 75;

// eslint-disable-next-line no-shadow
export enum DeviceUsageWatermark {
  HIGH = 'high load',
  MEDIUM = 'medium load',
  LOW = 'low load',
  UNKNOWN = 'unknown',
}

export const getDeviceUsage = (cpuLoad?: number | null, memoryLoad?: number | null) => {
  if (cpuLoad == null || memoryLoad == null) {
    return DeviceUsageWatermark.UNKNOWN;
  }

  if (isHighUsage(cpuLoad) || isHighUsage(memoryLoad)) {
    return DeviceUsageWatermark.HIGH;
  }

  if (isMediumUsage(cpuLoad) && isMediumUsage(memoryLoad)) {
    return DeviceUsageWatermark.MEDIUM;
  }

  if (isLowUsage(cpuLoad) || isLowUsage(memoryLoad)) {
    return DeviceUsageWatermark.LOW;
  }

  return DeviceUsageWatermark.UNKNOWN;
};

export const isDeviceOnUniconfigLayer = (mountParameters: string | null): boolean => {
  if (!mountParameters) {
    return false;
  }

  const parsedMountParameters = JSON.parse(mountParameters);

  if (
    'cli' in parsedMountParameters &&
    'uniconfig-config:install-uniconfig-node-enabled' in parsedMountParameters.cli
  ) {
    return parsedMountParameters.cli['uniconfig-config:install-uniconfig-node-enabled'];
  }

  if (
    'netconf' in parsedMountParameters &&
    'uniconfig-config:install-uniconfig-node-enabled' in parsedMountParameters.netconf
  ) {
    return parsedMountParameters.netconf['uniconfig-config:install-uniconfig-node-enabled'];
  }

  if (
    'gnmi' in parsedMountParameters &&
    'uniconfig-config:install-uniconfig-node-enabled' in parsedMountParameters.gnmi
  ) {
    return parsedMountParameters.gnmi['uniconfig-config:install-uniconfig-node-enabled'];
  }

  return true;
};
