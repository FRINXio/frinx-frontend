import { decodeDeviceOutput, DevicesOutput } from './network-types';
import { sendGetRequest } from './api-helpers';

export async function getDevices(): Promise<DevicesOutput> {
  const json = await sendGetRequest('/devices');
  const data = decodeDeviceOutput(json);

  return data;
}
