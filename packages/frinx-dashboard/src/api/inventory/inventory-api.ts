import { decodeDeviceOutput, decodeZonesOutput, Device, Zone } from './network-types';
import { sendGetRequest, sendPostRequest } from './api-helpers';

export async function getDevices(): Promise<Device[]> {
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

export async function getZones(): Promise<Zone[]> {
  const json = await sendGetRequest('/zones');
  const data = decodeZonesOutput(json);

  return data;
}
