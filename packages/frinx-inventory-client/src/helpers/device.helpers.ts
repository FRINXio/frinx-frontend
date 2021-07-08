import { Device, Zone } from './types';

export function createEmptyDevice(): Device {
  return {
    id: '',
    host: '',
    name: '',
    vendor: '',
    zone: {
      id: '',
      name: '',
      tenant: '',
    } as Zone,
    model: '',
    status: 'N/A',
  };
}
