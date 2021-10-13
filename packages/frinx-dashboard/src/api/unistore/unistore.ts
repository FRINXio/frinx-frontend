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
} from './network-types';
import { clientVpnServiceToApiVpnService, clientVpnSiteToApiVpnSite } from './converters';

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
  // const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites`);
  const json = {
    sites: {
      site: [
        {
          'site-id': 'GAMMA_MA3',
          devices: {
            device: [
              {
                'device-id': 'fw1.ma3',
                location: 'DEFAULT',
              },
              {
                'device-id': 'fw2.ma3',
                location: 'DEFAULT',
              },
            ],
          },
          'site-network-accesses': {
            'site-network-access': [
              {
                'site-network-access-id': 'TEST_1',
                'ip-connection': {
                  oam: { bfd: { enabled: false, 'profile-name': '500ms' } },
                  ipv4: {
                    'address-allocation-type': 'gamma-l3vpn-svc:static-address',
                    addresses: { 'customer-address': '10.100.0.1', 'prefix-length': 0, 'provider-address': '0.0.0.0' },
                  },
                },
                'maximum-routes': { 'address-family': [{ af: 'ipv4', 'maximum-routes': 1000 }] },
                'location-reference': '4',
                'vpn-attachment': { 'vpn-id': 'VPN_1_A', 'site-role': 'gamma-l3vpn-svc:any-to-any-role' },
                availability: { 'access-priority': 100 },
                'site-network-access-type': 'gamma-l3vpn-svc:point-to-point',
                bearer: {
                  'always-on': true,
                  'bearer-reference': 'BEAR-LD8-VMB-0001',
                  'requested-c-vlan': 100,
                  'requested-type': { 'requested-type': 'dot1ad', strict: false },
                },
                service: {
                  'svc-input-bandwidth': 10000000,
                  'svc-mtu': 1600,
                  'svc-output-bandwidth': 10000000,
                  qos: { 'qos-profile': { 'qos-profile': [{ profile: 'GNS_BESPOKE_CUST1' }] } },
                },
                'routing-protocols': {
                  'routing-protocol': [
                    {
                      type: 'gamma-l3vpn-svc:bgp',
                      bgp: {
                        'bgp-profiles': { 'bgp-profile': [{ profile: '300ms' }] },
                        'autonomous-system': 65000,
                        'address-family': ['ipv4'],
                      },
                    },
                    {
                      type: 'gamma-l3vpn-svc:static',
                      static: {
                        'cascaded-lan-prefixes': {
                          'ipv4-lan-prefixes': [
                            { lan: '10.0.0.1/0', 'next-hop': '10.0.0.3', 'lan-tag': 'lan-tag-test' },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          'maximum-routes': { 'address-family': [{ af: 'ipv4', 'maximum-routes': 1000 }] },
          'site-vpn-flavor': 'gamma-l3vpn-svc:site-vpn-flavor-single',
          'traffic-protection': { enabled: false },
          management: { type: 'gamma-l3vpn-svc:customer-managed' },
          locations: { location: [{ 'location-id': 'DEFAULT' }] },
          'vpn-policies': {
            'vpn-policy': [
              {
                'vpn-policy-id': '7',
                entries: [
                  {
                    id: '8',
                    filters: { filter: [{ type: 'gamma-l3vpn-svc:lan', 'lan-tag': ['10.100'] }] },
                    vpn: [{ 'vpn-id': 'VPN_1_A', 'site-role': 'gamma-l3vpn-svc:any-to-any-role' }],
                  },
                ],
              },
            ],
          },
          service: { qos: { 'qos-profile': { 'qos-profile': [{ profile: 'GNS_BESPOKE_CUST1' }] } } },
        },
      ],
    },
  };
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
