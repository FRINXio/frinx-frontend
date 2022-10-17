import { DeviceSize } from '../__generated__/graphql';

export type Zone = {
  id: string;
  name: string;
};
export type Device = {
  id: string;
  name: string;
  vendor: string | null;
  model: string | null;
  host: string | null;
  zone: Zone;
  serviceState: ServiceState;
  mountParameters: string;
  deviceSize: DeviceSize;
};

// eslint-disable-next-line no-shadow
export enum ServiceState {
  PLANNING = 'PLANNING',
  IN_SERVICE = 'IN_SERVICE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

// eslint-disable-next-line no-shadow
export enum DeviceSizeEnum {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export const serviceStateOptions = [
  { value: ServiceState.PLANNING, label: 'Planning' },
  { value: ServiceState.IN_SERVICE, label: 'In Service' },
  { value: ServiceState.OUT_OF_SERVICE, label: 'Out of Service' },
];

export const deviceSizeOptions = [
  { value: DeviceSizeEnum.SMALL, label: 'Small' },
  { value: DeviceSizeEnum.MEDIUM, label: 'Medium' },
  { value: DeviceSizeEnum.LARGE, label: 'Large' },
];
