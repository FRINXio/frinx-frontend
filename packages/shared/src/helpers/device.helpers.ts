const isHighUsage = (usage: number) => usage >= 90;
const isMediumUsage = (usage: number) => usage >= 75 && usage < 90;
const isLowUsage = (usage: number) => usage < 75;

// eslint-disable-next-line no-shadow
export enum DeviceUsageWatermark {
  HIGH_CPU = 'high CPU load',
  HIGH_MEMORY = 'high Memory load',
  HIGH = 'high CPU and Memory load',
  MEDIUM = 'medium load',
  LOW = 'low load',
  UNKNOWN = 'unknown',
}

export const getDeviceUsage = (cpuLoad?: number | null, memoryLoad?: number | null) => {
  if (cpuLoad == null || memoryLoad == null) {
    return DeviceUsageWatermark.UNKNOWN;
  }

  if (isHighUsage(cpuLoad) && isHighUsage(memoryLoad)) {
    return DeviceUsageWatermark.HIGH;
  }

  if (isHighUsage(cpuLoad) && !isHighUsage(memoryLoad)) {
    return DeviceUsageWatermark.HIGH_CPU;
  }

  if (!isHighUsage(cpuLoad) && isHighUsage(memoryLoad)) {
    return DeviceUsageWatermark.HIGH_MEMORY;
  }

  if (isMediumUsage(cpuLoad) && isMediumUsage(memoryLoad)) {
    return DeviceUsageWatermark.MEDIUM;
  }

  if (isLowUsage(cpuLoad) || isLowUsage(memoryLoad)) {
    return DeviceUsageWatermark.LOW;
  }

  return DeviceUsageWatermark.UNKNOWN;
};

export const getDeviceUsageColor = (cpuLoad?: number | null, memoryLoad?: number | null) => {
  const deviceUsage = getDeviceUsage(cpuLoad, memoryLoad);

  switch (deviceUsage) {
    case DeviceUsageWatermark.HIGH:
    case DeviceUsageWatermark.HIGH_CPU:
    case DeviceUsageWatermark.HIGH_MEMORY:
      return 'red';
    case DeviceUsageWatermark.MEDIUM:
      return 'yellow';
    case DeviceUsageWatermark.LOW:
      return 'green';
    default:
      return 'gray';
  }
};
