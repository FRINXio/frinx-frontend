import { sendGetRequest } from './api-helpers';
import { decodeVpnServicesOutput, VpnServicesOutput } from './network-types';

export async function getVpnServices(): Promise<VpnServicesOutput> {
  const json = await sendGetRequest('/vpn-data.json');
  const data = decodeVpnServicesOutput(json);
  return data;
}

export async function getVpnSites(): Promise<VpnServicesOutput> {
  const json = await sendGetRequest('/vpn-data.json');
  const data = decodeVpnServicesOutput(json);
  return data;
}
