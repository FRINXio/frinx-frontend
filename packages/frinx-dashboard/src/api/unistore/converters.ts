import unwrap from '../../helpers/unwrap';
import {
  AccessPriority,
  ApiQosProfileInput,
  CountryCode,
  CreateNetworkAccessInput,
  CreateRoutingProtocolsInput,
  CreateVpnServiceInput,
  CreateVpnSiteInput,
  DefaultCVlanEnum,
  LanTag,
  MaximumRoutes,
  ProviderIdentifiers,
  RequestedCVlan,
  RoutingProtocols,
  RoutingProtocolsOutput,
  RoutingProtocolType,
  SiteDevice,
  SiteDevicesOutput,
  SiteManagementType,
  SiteNetworkAccess,
  SiteNetworkAccessOutput,
  SiteNetworkAccessType,
  SiteServiceOutput,
  SiteVpnFlavor,
  ValidProviderIdentifiersOutput,
  VpnService,
  VpnServicesOutput,
  VpnServiceTopology,
  VpnSite,
  VpnSitesOutput,
} from './network-types';

export function apiVpnServiceToClientVpnService(apiVpnService: VpnServicesOutput): VpnService[] {
  return apiVpnService['vpn-services']['vpn-service'].map((vpn) => {
    const extranetVpns = vpn['extranet-vpns']['extranet-vpn']
      ? vpn['extranet-vpns']['extranet-vpn'].map((ex) => {
          return ex['vpn-id'];
        })
      : [];
    const vpnServiceTopology = unwrap(vpn['vpn-service-topology'].split(':').pop());

    return {
      vpnId: vpn['vpn-id'],
      customerName: vpn['customer-name'],
      vpnServiceTopology: vpnServiceTopology as VpnServiceTopology,
      defaultCVlan: DefaultCVlanEnum.L3VPN,
      extranetVpns,
    };
  });
}

export function clientVpnServiceToApiVpnService(clientVpnService: VpnService): CreateVpnServiceInput {
  const extranetVpns = clientVpnService.extranetVpns.map((vpn) => {
    return {
      'vpn-id': vpn,
      // 'local-sites-role': '',
    };
  });
  return {
    'vpn-service': [
      {
        'vpn-id': unwrap(clientVpnService.vpnId),
        'customer-name': clientVpnService.customerName,
        'extranet-vpns': {
          'extranet-vpn': extranetVpns,
        },
        'vpn-service-topology': clientVpnService.vpnServiceTopology,
        'default-c-vlan': clientVpnService.defaultCVlan,
      },
    ],
  };
}

export function apiRoutingProtocolToClientRoutingProtocol(routingProtocol: RoutingProtocolsOutput): RoutingProtocols {
  const routingProtocolType = routingProtocol['routing-protocol'][0].type.split(':').pop();
  const staticProtocol = routingProtocol['routing-protocol'][0].static;
  const bgpProtocol = routingProtocol['routing-protocol'][0].bgp;
  return {
    type: routingProtocolType as RoutingProtocolType,
    vrrp: 'ipv4',
    static: staticProtocol
      ? staticProtocol['cascaded-lan-prefixes']['ipv4-lan-prefixes'].map((p) => {
          return {
            lan: p.lan,
            lanTag: p['lan-tag'] as LanTag,
            nextHop: p['next-hop'],
          };
        })
      : undefined,
    bgp: bgpProtocol
      ? {
          addressFamily: 'ipv4',
          autonomousSystem: bgpProtocol['autonomous-system'],
          bgpProfile: bgpProtocol['bgp-profiles']['bgp-profile'][0].profile,
        }
      : undefined,
  };
}

export function apiSiteNetworkAccessToClientSiteNetworkAccess(
  networkAccess: SiteNetworkAccessOutput | void,
): SiteNetworkAccess[] {
  if (!networkAccess) {
    return [];
  }

  return networkAccess['site-network-access'].map((access) => {
    const apiQosProfiles = access.service.qos['qos-profile']['qos-profile'];
    const [clientQosProfile] = apiQosProfiles.length ? apiQosProfiles.map((p) => p.profile) : [''];
    return {
      siteNetworkAccessId: access['site-network-access-id'],
      siteNetworkAccessType: access['site-network-access-type'] as SiteNetworkAccessType,
      accessPriority: String(access.availability['access-priority']) as AccessPriority,
      maximumRoutes: access['maximum-routes']['address-family'][0]['maximum-routes'] as MaximumRoutes,
      locationReference: access['location-reference'] || null,
      deviceReference: access['device-reference'] || null,
      routingProtocols: [apiRoutingProtocolToClientRoutingProtocol(access['routing-protocols'])],
      bearer: {
        alwaysOn: access.bearer['always-on'],
        bearerReference: access.bearer['bearer-reference'],
        requestedCLan: String(access.bearer['requested-c-vlan']) as RequestedCVlan,
        requestedType: {
          requestedType: access.bearer['requested-type']['requested-type'],
          strict: access.bearer['requested-type'].strict,
        },
      },
      service: {
        qosProfiles: [clientQosProfile],
        svcInputBandwidth: access.service['svc-input-bandwidth'],
        svcOutputBandwidth: access.service['svc-output-bandwidth'],
      },
    };
  });
}

export function apiProviderIdentifiersToClientIdentifers(
  identifiers: ValidProviderIdentifiersOutput,
): ProviderIdentifiers {
  const bfdIdentifiers = identifiers['valid-provider-identifiers']['bfd-profile-identifier'];
  const qosIdentifiers = identifiers['valid-provider-identifiers']['qos-profile-identifier'];
  const bgpIdentifiers = identifiers['valid-provider-identifiers']['bgp-profile-identifier'];
  return {
    bfdIdentifiers: bfdIdentifiers ? bfdIdentifiers.map((i) => i.id) : [],
    qosIdentifiers: qosIdentifiers ? qosIdentifiers.map((i) => i.id) : [],
    bgpIdentifiers: bgpIdentifiers ? bgpIdentifiers.map((i) => i.id) : [],
  };
}

function apiSiteDevicesToClientSiteDevices(apiSiteDevices?: SiteDevicesOutput): SiteDevice[] {
  if (!apiSiteDevices || !apiSiteDevices.device) {
    return [];
  }

  return apiSiteDevices.device.map((device) => {
    return {
      deviceId: device['device-id'],
      locationId: device.location,
      managementIP: device.management ? device.management.address : '',
    };
  });
}

function apiSiteServiceToClientSiteService(siteService?: SiteServiceOutput): string | null {
  if (!siteService) {
    return null;
  }
  return siteService.qos['qos-profile']['qos-profile'][0].profile;
}

export function apiVpnSitesToClientVpnSite(apiVpnSite: VpnSitesOutput): VpnSite[] {
  return apiVpnSite.sites.site.map((site) => {
    const managementType: unknown = site.management.type.split(':')[1];
    const siteVpnFlavor: unknown = site['site-vpn-flavor'].split(':')[1];
    const siteDevices = apiSiteDevicesToClientSiteDevices(site.devices || undefined);
    const siteServiceQosProfile = apiSiteServiceToClientSiteService(site.service || undefined);
    return {
      siteId: site['site-id'],
      siteDevices,
      customerLocations: site.locations.location
        ? site.locations.location.map((l) => {
            const countryCode: CountryCode =
              l['country-code'] === 'UK' || l['country-code'] === 'Ireland' ? l['country-code'] : 'UK';
            return {
              locationId: l['location-id'],
              street: l.address || '',
              city: l.city || '',
              postalCode: l['postal-code'] || '',
              countryCode: countryCode || 'UK',
              state: l.state || '',
            };
          })
        : [],
      siteManagementType: managementType as SiteManagementType,
      siteVpnFlavor: siteVpnFlavor as SiteVpnFlavor,
      siteServiceQosProfile,
      enableBgpPicFastReroute: site['traffic-protection'].enabled,
      siteNetworkAccesses: apiSiteNetworkAccessToClientSiteNetworkAccess(site['site-network-accesses']),
      maximumRoutes: site['maximum-routes']['address-family'][0]['maximum-routes'] as MaximumRoutes,
    };
  });
}

function clientRoutingProtocolsToApiRoutingProtocols(
  routingProtocols: RoutingProtocols[],
): CreateRoutingProtocolsInput {
  const output: CreateRoutingProtocolsInput = {
    'routing-protocol': [
      {
        type: routingProtocols[0].type,
        vrrp: {
          'address-family': [routingProtocols[0].vrrp],
        },
      },
    ],
  };
  const bgpProfile = routingProtocols[0].bgp
    ? {
        'bgp-profiles': {
          'bgp-profile': [{ profile: routingProtocols[0].bgp.bgpProfile || '' }] as [{ profile: string }],
        },
        'address-family': ['ipv4'] as ['ipv4'],
        'autonomous-system': routingProtocols[0].bgp.autonomousSystem,
      }
    : undefined;

  const staticProfile = routingProtocols[0].static
    ? {
        'cascaded-lan-prefixes': {
          'ipv4-lan-prefixes': routingProtocols[0].static.map((s) => {
            return {
              lan: s.lan,
              'lan-tag': s.lanTag,
              'next-hop': s.nextHop,
            };
          }),
        },
      }
    : undefined;

  return {
    ...output,
    'routing-protocol': [
      {
        ...output['routing-protocol'][0],
        bgp: bgpProfile,
        static: staticProfile,
      },
    ],
  };
}

function clientNetworkAccessToApiNetworkAccess(networkAccesses: SiteNetworkAccess[]): CreateNetworkAccessInput {
  return {
    'site-network-access': networkAccesses.map((access) => {
      return {
        'site-network-access-id': access.siteNetworkAccessId,
        'site-network-access-type': access.siteNetworkAccessType,
        availability: {
          'access-priority': Number(access.accessPriority),
        },
        'location-reference': access.locationReference || undefined,
        'device-reference': access.deviceReference || undefined,
        'maximum-routes': {
          'address-family': [
            {
              af: 'ipv4',
              'maximum-routes': access.maximumRoutes,
            },
          ],
        },
        bearer: {
          'always-on': access.bearer.alwaysOn,
          'bearer-reference': access.bearer.bearerReference,
          'requested-type': {
            'requested-type': access.bearer.requestedType.requestedType,
            strict: access.bearer.requestedType.strict,
          },
          'requested-c-vlan': Number(access.bearer.requestedCLan),
        },
        service: {
          'svc-input-bandwidth': access.service.svcInputBandwidth,
          'svc-output-bandwidth': access.service.svcOutputBandwidth,
          qos: {
            'qos-profile': {
              'qos-profile': [
                {
                  profile: access.service.qosProfiles[0],
                },
              ],
            },
          },
        },
        'routing-protocols': clientRoutingProtocolsToApiRoutingProtocols(access.routingProtocols),
      };
    }),
  };
}

function clientQosProfileToApiQosProfile(siteQosProfile: string | null): ApiQosProfileInput | undefined {
  if (!siteQosProfile) {
    return undefined;
  }

  return {
    qos: {
      'qos-profile': {
        'qos-profile': [{ profile: siteQosProfile }],
      },
    },
  };
}

export function clientVpnSiteToApiVpnSite(vpnSite: VpnSite): CreateVpnSiteInput {
  const apiDevices = vpnSite.siteDevices.map((device) => {
    return {
      'device-id': device.deviceId || '',
      management: {
        address: device.managementIP,
      },
      location: device.locationId || '',
    };
  });

  const apiLocations = vpnSite.customerLocations.map((location) => {
    return {
      'location-id': location.locationId || '',
      'postal-code': location.postalCode,
      state: location.state,
      address: location.street,
      city: location.city,
      'country-code': location.countryCode,
    };
  });

  const output: CreateVpnSiteInput = {
    site: [
      {
        'site-id': unwrap(vpnSite.siteId),
        devices: {
          device: apiDevices,
        },
        // 'site-network-accesses': {
        //   'site-network-access': [],
        // },
        'maximum-routes': {
          'address-family': [
            {
              af: 'ipv4',
              'maximum-routes': vpnSite.maximumRoutes,
            },
          ],
        },
        'site-vpn-flavor': vpnSite.siteVpnFlavor,
        'traffic-protection': { enabled: vpnSite.enableBgpPicFastReroute },
        management: { type: vpnSite.siteManagementType },
        locations: { location: apiLocations },
        service: clientQosProfileToApiQosProfile(vpnSite.siteServiceQosProfile),
        // 'vpn-policies': {
        //   'vpn-policy': [],
        // },
      },
    ],
  };

  if (vpnSite.siteNetworkAccesses.length) {
    output.site[0]['site-network-accesses'] = clientNetworkAccessToApiNetworkAccess(vpnSite.siteNetworkAccesses);
  }

  return output;
}
