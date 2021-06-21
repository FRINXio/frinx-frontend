/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Device } from './inventory-types';

export function isDeviceType(value: unknown): value is Device {
  if (value != null && typeof value === 'object') {
    return 'name' in value!;
  }
  return false;
}

export function isDeviceArrayType(value: unknown): value is Device[] {
  if (value != null && Array.isArray(value)) {
    return value.every(isDeviceType);
  }
  return false;
}
