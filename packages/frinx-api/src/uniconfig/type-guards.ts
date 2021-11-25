/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CliOperationalState,
  NetconfOperationalState,
  CliConfigurationalState,
  NetconfConfigurationalState,
  CliTopology,
  NetconfTopology,
  CliDeviceTranslations,
} from './types';

export function isCliOperationalState(state: unknown): state is CliOperationalState {
  if (state !== null && typeof state === 'object') {
    return 'node-id' in state! && typeof state['node-id'] === 'string';
  }
  return false;
}

export function isNetconfOperationalState(state: unknown): state is NetconfOperationalState {
  if (state !== null && typeof state === 'object') {
    return 'node-id' in state! && typeof state['node-id'] === 'string';
  }
  return false;
}

export function isCliConfigurationalState(state: unknown): state is CliConfigurationalState {
  if (state !== null && typeof state === 'object') {
    return 'node-id' in state! && typeof state['node-id'] === 'string';
  }
  return false;
}

export function isNetconfConfigurationalState(state: unknown): state is NetconfConfigurationalState {
  if (state !== null && typeof state === 'object') {
    return 'node-id' in state! && typeof state['node-id'] === 'string';
  }
  return false;
}

export function isCliTopology(topology: unknown): topology is CliTopology {
  if (topology !== null && typeof topology === 'object') {
    return 'topology' in topology!;
  }
  return false;
}

export function isNetconfTopology(topology: unknown): topology is NetconfTopology {
  if (topology !== null && typeof topology === 'object') {
    return 'topology' in topology!;
  }
  return false;
}

export function isCliDeviceTranslations(translations: unknown): translations is CliDeviceTranslations {
  if (translations !== null && typeof translations === 'object') {
    return 'available-cli-device-translations' in translations!;
  }
  return false;
}
