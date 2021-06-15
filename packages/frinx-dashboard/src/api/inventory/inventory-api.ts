import { sendGetRequest } from './api-helpers';

export async function getDevices(): Promise<unknown> {
  const response = await sendGetRequest('devices');
}
