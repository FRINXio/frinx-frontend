const isHighUsage = (usage: number) => usage >= 90;
const isMediumUsage = (usage: number) => usage >= 75 && usage < 90;
const isLowUsage = (usage: number) => usage < 75;

// eslint-disable-next-line no-shadow
export enum DeviceUsageWatermark {
  HIGH_CPU = 'high CPU load',
  HIGH_MEMORY = 'high Memory load',
  HIGH = 'high CPU and Memory load',
  MEDIUM = 'medium load',
  IN_SERVICE = 'in service',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown',
}

// TODO: write test
export const getDeviceUsage = (
  cpuLoad?: number | null,
  memoryLoad?: number | null,
  deviceConnection?: string | null,
  deviceInstallStatus?: boolean,
) => {
  if ((cpuLoad == null || memoryLoad == null) && deviceConnection === 'online' && deviceInstallStatus) {
    return DeviceUsageWatermark.IN_SERVICE;
  }

  if ((cpuLoad == null || memoryLoad == null) && deviceConnection === 'offline' && deviceInstallStatus) {
    return DeviceUsageWatermark.OFFLINE;
  }

  if (cpuLoad == null || memoryLoad == null) {
    return DeviceUsageWatermark.UNKNOWN;
  }

  if (isHighUsage(cpuLoad) && isHighUsage(memoryLoad) && deviceConnection === 'online' && deviceInstallStatus) {
    return DeviceUsageWatermark.HIGH;
  }

  if (isHighUsage(cpuLoad) && !isHighUsage(memoryLoad) && deviceConnection === 'online' && deviceInstallStatus) {
    return DeviceUsageWatermark.HIGH_CPU;
  }

  if (!isHighUsage(cpuLoad) && isHighUsage(memoryLoad) && deviceConnection === 'online' && deviceInstallStatus) {
    return DeviceUsageWatermark.HIGH_MEMORY;
  }

  if (isMediumUsage(cpuLoad) && isMediumUsage(memoryLoad) && deviceConnection === 'online' && deviceInstallStatus) {
    return DeviceUsageWatermark.MEDIUM;
  }

  if ((isLowUsage(cpuLoad) || isLowUsage(memoryLoad)) && deviceConnection === 'online' && deviceInstallStatus) {
    return DeviceUsageWatermark.IN_SERVICE;
  }

  if ((isLowUsage(cpuLoad) || isLowUsage(memoryLoad)) && deviceConnection === 'offline' && deviceInstallStatus) {
    return DeviceUsageWatermark.OFFLINE;
  }

  if (cpuLoad && memoryLoad && !deviceInstallStatus) {
    return DeviceUsageWatermark.UNKNOWN;
  }

  return DeviceUsageWatermark.UNKNOWN;
};

export const getDeviceUsageColor = (
  cpuLoad?: number | null,
  memoryLoad?: number | null,
  deviceConnection?: string | null,
  deviceInstallStatus?: boolean,
) => {
  const deviceUsage = getDeviceUsage(cpuLoad, memoryLoad, deviceConnection, deviceInstallStatus);

  switch (deviceUsage) {
    case DeviceUsageWatermark.HIGH:
    case DeviceUsageWatermark.HIGH_CPU:
    case DeviceUsageWatermark.HIGH_MEMORY:
      return 'red';
    case DeviceUsageWatermark.MEDIUM:
      return 'yellow';
    case DeviceUsageWatermark.IN_SERVICE:
      return 'green';
    case DeviceUsageWatermark.OFFLINE:
      return 'red';
    default:
      return 'gray';
  }
};
