import { VpnService, DefaultCVlanEnum, VpnServiceTopology } from './service-types';
import {
  CountryCode,
  SiteDevice,
  SiteManagementType,
  SiteVpnFlavor,
  VpnSite,
  SiteNetworkAccess,
  SiteNetworkAccessType,
  AccessPriority,
  MaximumRoutes,
  ProviderIdentifiers,
  RoutingProtocol,
  RoutingProtocolType,
  LanTag,
  RequestedCVlan,
  IPConnection,
} from './site-types';
import {
  ApiQosProfileInput,
  VpnServicesOutput,
  VpnSitesOutput,
  SiteDevicesOutput,
  SiteNetworkAccessOutput,
  ValidProviderIdentifiersOutput,
  RoutingProtocolItemOutput,
  CreateVpnServiceInput,
  CreateVpnSiteInput,
  CreateNetworkAccessInput,
  CreateRoutingProtocolItem,
  CreateRoutingProtocolsInput,
  SiteServiceOutput,
  IPConnectionOutput,
  CreateIPConnectionInput,
  BearerStatusOutput,
  CarrierOutput,
  ConnectionOutput,
  EvcAttachmentOutput,
  VpnBearerOutput,
} from '../../network-types';
import unwrap from '../../helpers/unwrap';
import { VpnBearer, BearerStatus, Carrier, Connection, EvcAttachment } from './bearer-types';

function apiDefaultCVlanToClientDefaultCVlan(defaultCVlan: number): Pick<VpnService, 'defaultCVlan' | 'customCVlan'> {
  const value = defaultCVlan.toString();
  switch (value) {
    case DefaultCVlanEnum['Dedicated SIP VPN']:
    case DefaultCVlanEnum['Guest Wifi VPN']:
    case DefaultCVlanEnum['Main Corporate VPN']:
      return {
        defaultCVlan: value,
      };
    default: {
      return {
        defaultCVlan: DefaultCVlanEnum['Custom C-VLAN'],
        customCVlan: defaultCVlan,
      };
    }
  }
}

export function apiVpnServiceToClientVpnService(apiVpnService: VpnServicesOutput): VpnService[] {
  return apiVpnService['vpn-services']['vpn-service'].map((vpn) => {
    const extranetVpns = vpn['extranet-vpns']['extranet-vpn']
      ? vpn['extranet-vpns']['extranet-vpn'].map((ex) => {
          return ex['vpn-id'];
        })
      : [];
    const vpnServiceTopology = unwrap(vpn['vpn-service-topology'].split(':').pop());
    const defaultCVlan = apiDefaultCVlanToClientDefaultCVlan(vpn['default-c-vlan']);

    return {
      vpnId: vpn['vpn-id'],
      customerName: vpn['customer-name'],
      vpnServiceTopology: vpnServiceTopology as VpnServiceTopology,
      extranetVpns,
      ...defaultCVlan,
    };
  });
}

function getDefaultCVlan(cVlanType: DefaultCVlanEnum, customValue?: number): string {
  if (cVlanType === DefaultCVlanEnum['Custom C-VLAN']) {
    return customValue?.toString() || '';
  }
  return cVlanType;
}

export function clientVpnServiceToApiVpnService(clientVpnService: VpnService): CreateVpnServiceInput {
  const extranetVpns = clientVpnService.extranetVpns.map((vpn) => {
    return {
      'vpn-id': vpn,
    };
  });
  const defaultCVlan = getDefaultCVlan(clientVpnService.defaultCVlan, clientVpnService.customCVlan);
  return {
    'vpn-service': [
      {
        'vpn-id': unwrap(clientVpnService.vpnId),
        'customer-name': clientVpnService.customerName,
        'extranet-vpns': {
          'extranet-vpn': extranetVpns,
        },
        'vpn-service-topology': clientVpnService.vpnServiceTopology,
        'default-c-vlan': defaultCVlan,
      },
    ],
  };
}

export function apiRoutingProtocolToClientRoutingProtocol(routingProtocol: RoutingProtocolItemOutput): RoutingProtocol {
  const routingProtocolType = routingProtocol.type.split(':').pop();
  const staticProtocol = routingProtocol.static;
  const bgpProtocol = routingProtocol.bgp;
  return {
    type: routingProtocolType as RoutingProtocolType,
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

export function apiIPConnectionToClientIPConnection(ipConnection: IPConnectionOutput): IPConnection {
  const output: IPConnection = {};
  if (ipConnection.oam) {
    output.oam = {};
    if (ipConnection.oam.bfd) {
      output.oam.bfd = {
        enabled: ipConnection.oam.bfd.enabled || undefined,
        profileName: ipConnection.oam.bfd['profile-name'] || undefined,
      };
    }
  }
  if (ipConnection.ipv4) {
    output.ipv4 = {
      addressAllocationType: ipConnection.ipv4['address-allocation-type'] || undefined,
    };
    if (ipConnection.ipv4.addresses) {
      const { addresses } = ipConnection.ipv4;
      output.ipv4.addresses = {
        customerAddress: addresses['customer-address'] || undefined,
        prefixLength: addresses['prefix-length'] || undefined,
        providerAddress: addresses['provider-address'] || undefined,
      };
    }
  }

  return output;
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
    const vpnAttachment = access['vpn-attachment'] ? access['vpn-attachment']['vpn-id'] : null;
    const routingProtocols = access['routing-protocols']['routing-protocol'].map((p) => {
      return apiRoutingProtocolToClientRoutingProtocol(p);
    });
    return {
      siteNetworkAccessId: access['site-network-access-id'],
      siteNetworkAccessType: access['site-network-access-type'] as SiteNetworkAccessType,
      ipConnection: access['ip-connection'] ? apiIPConnectionToClientIPConnection(access['ip-connection']) : undefined,
      accessPriority: String(access.availability['access-priority']) as AccessPriority,
      maximumRoutes: access['maximum-routes']['address-family'][0]['maximum-routes'] as MaximumRoutes,
      locationReference: access['location-reference'] || null,
      deviceReference: access['device-reference'] || null,
      routingProtocols,
      bearer: {
        alwaysOn: access.bearer['always-on'],
        bearerReference: access.bearer['bearer-reference'] || '',
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
      vpnAttachment,
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

function isValidProtocolPredicate(routingProtocol: RoutingProtocol): boolean {
  if (routingProtocol.type === 'static') {
    if (!routingProtocol.static) {
      return false;
    }
    return !(!routingProtocol.static[0].lan || !routingProtocol.static[0].nextHop);
  }

  if (routingProtocol.type === 'bgp') {
    if (!routingProtocol.bgp) {
      return false;
    }
    return !(!routingProtocol.bgp.bgpProfile || !routingProtocol.bgp.autonomousSystem);
  }

  return false;
}

function filterValidRoutingProtocols(routingProtocols: RoutingProtocol[]): RoutingProtocol[] {
  return routingProtocols.filter(isValidProtocolPredicate);
}

function clientRoutingProtocolsToApiRoutingProtocols(routingProtocols: RoutingProtocol[]): CreateRoutingProtocolsInput {
  const validProtocols = filterValidRoutingProtocols(routingProtocols);
  const protocols = validProtocols.map((p) => {
    const protocol: CreateRoutingProtocolItem = {
      type: p.type,
    };
    if (p.bgp) {
      protocol.bgp = {
        'bgp-profiles': {
          'bgp-profile': [{ profile: p.bgp.bgpProfile || '' }] as [{ profile: string }],
        },
        'address-family': ['ipv4'] as ['ipv4'],
        'autonomous-system': p.bgp.autonomousSystem,
      };
    }
    if (p.static) {
      protocol.static = {
        'cascaded-lan-prefixes': {
          'ipv4-lan-prefixes': p.static.map((s) => {
            return {
              lan: s.lan,
              'lan-tag': s.lanTag,
              'next-hop': s.nextHop,
            };
          }),
        },
      };
    }
    return protocol;
  });

  return {
    'routing-protocol': protocols,
  };
}

function clientIPConnectionToApiIPConnection(ipConnection: IPConnection): CreateIPConnectionInput {
  const output: CreateIPConnectionInput = {};

  if (ipConnection.oam) {
    output.oam = {};

    if (ipConnection.oam.bfd) {
      const { bfd } = ipConnection.oam;
      output.oam.bfd = {
        enabled: bfd?.enabled,
        'profile-name': bfd?.profileName,
      };
    }
  }
  if (ipConnection.ipv4) {
    output.ipv4 = {
      'address-allocation-type': ipConnection.ipv4?.addressAllocationType,
    };

    if (ipConnection.ipv4.addresses) {
      const { addresses } = ipConnection.ipv4;
      output.ipv4.addresses = {
        'customer-address': addresses.customerAddress,
        'prefix-length': addresses.prefixLength,
        'provider-address': addresses.providerAddress,
      };
    }
  }

  return output;
}

function clientNetworkAccessToApiNetworkAccess(networkAccesses: SiteNetworkAccess[]): CreateNetworkAccessInput {
  return {
    'site-network-access': networkAccesses.map((access) => {
      return {
        'site-network-access-id': access.siteNetworkAccessId,
        'site-network-access-type': access.siteNetworkAccessType,
        'ip-connection': access.ipConnection ? clientIPConnectionToApiIPConnection(access.ipConnection) : undefined,
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

function apiBearerStatusToClientBearerStatus(apiBearerStatus: BearerStatusOutput): BearerStatus {
  const adminStatus = apiBearerStatus['admin-status']
    ? {
        status: apiBearerStatus['admin-status'].status || null,
        lastUpdated: null,
      }
    : null;
  const operStatus = apiBearerStatus['oper-status']
    ? {
        status: apiBearerStatus['oper-status'].status || null,
        lastUpdated: null,
      }
    : null;
  return {
    adminStatus,
    operStatus,
  };
}

function apiCarrierToClientCarrier(apiCarrier: CarrierOutput): Carrier {
  return {
    carrierName: apiCarrier['carrier-name'] || null,
    carrierReference: apiCarrier['carrier-reference'] || null,
    serviceStatus: apiCarrier['service-status'] || null,
    serviceType: apiCarrier['service-type'] || null,
  };
}

function apiConnectionToClientConnnection(apiConnection: ConnectionOutput): Connection {
  return {
    encapsulationType: apiConnection['encapsulation-type'] || null,
    svlanAssignmentType: apiConnection['svlan-assignment-type'] || null,
    tpId: apiConnection.tpid || null,
    mtu: apiConnection.mtu,
    remoteNeId: apiConnection['remote-ne-id'] || null,
    remotePortId: apiConnection['remote-port-id'] || null,
  };
}

function apiEvcAttachmentToClientEvcAttachment(apiEvc: EvcAttachmentOutput): EvcAttachment {
  return {
    evcType: apiEvc['evc-type'],
    customerName: apiEvc['customer-name'] || null,
    circuitReference: apiEvc['circuit-reference'],
    carrierReference: apiEvc['carrier-reference'] || null,
    svlanId: apiEvc['svlan-id'] || null,
    status: apiEvc.status ? apiBearerStatusToClientBearerStatus(apiEvc.status) : null,
    inputBandwidth: apiEvc['input-bandwidth'],
    qosInputProfile: apiEvc['qos-input-profile'] || null,
    upstreamBearer: apiEvc['upstream-bearer'] || null,
  };
}

export function apiBearerToClientBearer(apiBearer: VpnBearerOutput): VpnBearer[] {
  if (!apiBearer['vpn-bearers']) {
    return [];
  }

  return apiBearer['vpn-bearers']['vpn-bearer'].map((b) => {
    return {
      spBearerReference: b['sp-bearer-reference'],
      description: b.description || null,
      neId: b['ne-id'],
      portId: b['port-id'],
      status: b.status ? apiBearerStatusToClientBearerStatus(b.status) : null,
      carrier: b.carrier ? apiCarrierToClientCarrier(b.carrier) : null,
      connection: b.connection ? apiConnectionToClientConnnection(b.connection) : null,
      defaultUpstreamBearer: b['default-upstream-bearer'] || null,
      evcAttachments: b['evc-attachments'] ? b['evc-attachments'].map(apiEvcAttachmentToClientEvcAttachment) : [],
    };
  });
}
