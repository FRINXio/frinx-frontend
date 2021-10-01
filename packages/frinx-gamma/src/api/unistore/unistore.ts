import { sendDeleteRequest, sendPostRequest, sendGetRequest, sendPutRequest } from './api-helpers';
import { VpnService } from '../../components/forms/service-types';
import { VpnSite } from '../../components/forms/site-types';
import {
  decodeVpnServicesOutput,
  decodeVpnSitesOutput,
  decodeValidProviderIdentifiersOutput,
  VpnServicesOutput,
  VpnSitesOutput,
  ValidProviderIdentifiersOutput,
} from './network-types';
import { clientVpnServiceToApiVpnService, clientVpnSiteToApiVpnSite } from '../../components/forms/converters';

const UNICONFIG_SERVICE_URL =
  '/data/network-topology:network-topology/topology=uniconfig/node=service_scale/frinx-uniconfig-topology:configuration';

export async function getVpnServices(): Promise<VpnServicesOutput> {
  const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`);
  const data = decodeVpnServicesOutput(json);
  return data;
}

export async function editVpnServices(body: VpnService): Promise<unknown> {
  const extranetVpns =
    body.extranetVpns.length > 0
      ? {
          'extranet-vpn': body.extranetVpns.map((vpn) => {
            return {
              'vpn-id': vpn,
              'local-sites-role': 'spoke-role',
            };
          }),
        }
      : {};

  const jsonBody = {
    'vpn-service': [
      {
        'vpn-id': body.vpnId,
        'customer-name': body.customerName,
        'vpn-service-topology': body.vpnServiceTopology,
        'default-c-vlan': body.defaultCVlan,
        'extranet-vpns': extranetVpns,
      },
    ],
  };
  const json = await sendPutRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${body.vpnId}`,
    jsonBody,
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
  const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites`);
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
  await sendDeleteRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSiteId}}`);
}

export async function getValidProviderIdentifiers(): Promise<ValidProviderIdentifiersOutput> {
  const json = await sendGetRequest(
    `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-profiles/valid-provider-identifiers`,
  );
  const data = decodeValidProviderIdentifiersOutput(json);
  return data;
}
