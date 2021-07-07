import { decodeDeviceOutput, DevicesOutput } from './network-types';
import { sendGetRequest } from './api-helpers';
import { sendPostRequest } from '../uniflow/api-helpers';

export async function getDevices(): Promise<DevicesOutput> {
  const json = await sendGetRequest('/devices');
  const data = decodeDeviceOutput(json);

  return data;
}

export type AddDeviceParams = {
  name: string;
  zoneId: string;
  mountParameters?: string;
};

export async function addDevice(params: AddDeviceParams): Promise<void> {
  await sendPostRequest('/devices', params);
}
