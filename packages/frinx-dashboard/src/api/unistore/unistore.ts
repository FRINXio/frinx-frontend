import { sendDeleteRequest, sendPostRequest, sendGetRequest, sendPutRequest } from './api-helpers';
import {
  decodeVpnServicesOutput,
  decodeVpnSitesOutput,
  decodeValidProviderIdentifiersOutput,
  VpnServicesOutput,
  VpnSitesOutput,
  ValidProviderIdentifiersOutput,
  VpnService,
  VpnSite,
  decodeVpnBearerOutput,
  VpnBearerOutput,
  VpnBearer,
} from './network-types';
import { clientBearerToApiBearer, clientVpnServiceToApiVpnService, clientVpnSiteToApiVpnSite } from './converters';

// data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers
const UNICONFIG_SERVICE_URL =
  '/data/network-topology:network-topology/topology=uniconfig/node=service_scale/frinx-uniconfig-topology:configuration';

export async function getVpnServices(): Promise<VpnServicesOutput> {
  const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`);
  const data = decodeVpnServicesOutput(json);
  return data;
}

export async function editVpnServices(vpnService: VpnService): Promise<unknown> {
  const body = clientVpnServiceToApiVpnService(vpnService);
  const json = await sendPutRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnService.vpnId}`,
    body,
  );
  return json;
}

export async function deleteVpnService(vpnServiceId: string): Promise<unknown> {
  const json = await sendDeleteRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnServiceId}`,
  );
  return json;
}

export async function createVpnService(vpnService: VpnService): Promise<void> {
  const body = clientVpnServiceToApiVpnService(vpnService);
  await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`, body);
}

export async function getVpnSites(): Promise<VpnSitesOutput> {
  const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites?content=config`);
  const data = decodeVpnSitesOutput(json);
  return data;
}

export async function createVpnSite(vpnSite: VpnSite): Promise<void> {
  const body = clientVpnSiteToApiVpnSite(vpnSite);
  await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites`, body);
}

export async function editVpnSite(vpnSite: VpnSite): Promise<void> {
  const body = clientVpnSiteToApiVpnSite(vpnSite);
  await sendPutRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSite.siteId}`, body);
}

export async function deleteVpnSite(vpnSiteId: string): Promise<void> {
  await sendDeleteRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSiteId}`);
}

export async function getValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
  const json = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-profiles/valid-provider-identifiers`,
  );
  const data = decodeValidProviderIdentifiersOutput(json);
  return data;
}

export async function getVpnBearers(): Promise<VpnBearerOutput> {
  const json = await sendGetRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers',
  );
  const data = decodeVpnBearerOutput(json);

  return data;
}

export async function createVpnBearer(bearer: VpnBearer): Promise<void> {
  const body = clientBearerToApiBearer(bearer);
  await sendPostRequest(
    '/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers',
    body,
  );
}

export async function editVpnBearer(vpnBearer: VpnBearer): Promise<unknown> {
  const body = clientBearerToApiBearer(vpnBearer);
  const json = await sendPutRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${vpnBearer.spBearerReference}`,
    body,
  );
  return json;
}

export async function deleteVpnBearer(id: string): Promise<void> {
  await sendDeleteRequest(
    `/data/network-topology:network-topology/topology=uniconfig/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${id}`,
  );
}
