import { DeviceSize as DeviceSizeType } from '../__generated__/graphql';

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
  deviceSize: DeviceSizeType;
};

// eslint-disable-next-line no-shadow
export enum ServiceState {
  PLANNING = 'PLANNING',
  IN_SERVICE = 'IN_SERVICE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

// eslint-disable-next-line no-shadow
export enum DeviceSize {
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
  { value: DeviceSize.SMALL, label: 'Small' },
  { value: DeviceSize.MEDIUM, label: 'Medium' },
  { value: DeviceSize.LARGE, label: 'Large' },
];
