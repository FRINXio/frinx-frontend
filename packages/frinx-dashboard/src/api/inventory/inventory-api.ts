import { isDeviceArrayType } from '../../helpers/types/inventory-type-guards';
import { Device } from '../../helpers/types/inventory-types';
import mockData from './mock-data';
// import { sendGetRequest } from './api-helpers';

async function fakeDevicesFetch() {
  return mockData;
}

export async function getDevices(): Promise<Device[]> {
  const response = await fakeDevicesFetch();

  // TODO: proper type-check here
  if (isDeviceArrayType(response)) {
    return response;
  }

  throw new Error(`Expected Device[], got ${JSON.stringify(response)}`);
}
