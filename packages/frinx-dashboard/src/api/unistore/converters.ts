import unwrap from '../../helpers/unwrap';
import {
  AccessPriority,
  ApiQosProfileInput,
  BearerStatus,
  BearerStatusOutput,
  Carrier,
  CarrierOutput,
  Connection,
  ConnectionOutput,
  CountryCode,
  CreateIPConnectionInput,
  CreateNetworkAccessInput,
  CreateRoutingProtocolItem,
  CreateRoutingProtocolsInput,
  CreateVpnAttachment,
  CreateVpnServiceInput,
  CreateVpnSiteInput,
  DefaultCVlanEnum,
  EvcAttachment,
  EvcAttachmentOutput,
  EvcAttachmentInput,
  IPConnection,
  LanTag,
  MaximumRoutes,
  ProviderIdentifiers,
  RequestedCVlan,
  RoutingProtocol,
  RoutingProtocolItemOutput,
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
  VpnBearerOutput,
  VpnBearerInput,
  VpnBearer,
  VpnService,
  VpnServicesOutput,
  VpnServiceTopology,
  VpnSite,
  VpnSitesOutput,
  VpnNode,
  VpnNodesOutput,
} from './network-types';

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

function clientDefaultCVlanToApiDefaultCVlan(cVlanType: DefaultCVlanEnum, customValue?: number): string {
  if (cVlanType === DefaultCVlanEnum['Custom C-VLAN']) {
    return customValue?.toString() || '';
  }
  return cVlanType;
}

export function clientVpnServiceToApiVpnService(clientVpnService: VpnService): CreateVpnServiceInput {
  const extranetVpns = clientVpnService.extranetVpns.map((vpn) => {
    return {
      'vpn-id': vpn,
      // 'local-sites-role': '',
    };
  });
  const defaultCVlan = clientDefaultCVlanToApiDefaultCVlan(clientVpnService.defaultCVlan, clientVpnService.customCVlan);
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
          autonomousSystem: String(bgpProtocol['autonomous-system']),
          bgpProfile: bgpProtocol['bgp-profiles']['bgp-profile'][0].profile,
        }
      : undefined,
  };
}

function getClientSiteRole(role: string | void): string | null {
  if (!role) {
    return null;
  }

  return role.split(':').pop() as string;
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
    const siteRole = access['vpn-attachment'] ? getClientSiteRole(access['vpn-attachment']['site-role']) || null : null;
    const routingProtocols =
      access['routing-protocols'] && access['routing-protocols']['routing-protocol']
        ? access['routing-protocols']['routing-protocol'].map((p) => {
            return apiRoutingProtocolToClientRoutingProtocol(p);
          })
        : [];
    return {
      siteNetworkAccessId: access['site-network-access-id'],
      siteNetworkAccessType: access['site-network-access-type'] as SiteNetworkAccessType,
      accessPriority: String(access.availability['access-priority']) as AccessPriority,
      maximumRoutes: access['maximum-routes']['address-family'][0]['maximum-routes'] as MaximumRoutes,
      locationReference: access['location-reference'] || null,
      deviceReference: access['device-reference'] || null,
      routingProtocols,
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
      vpnAttachment,
      siteRole,
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
  if (routingProtocol.type !== 'bgp' && routingProtocol.type !== 'static') {
    return false;
  }
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
    return routingProtocol.bgp.bgpProfile !== null && routingProtocol.bgp.autonomousSystem.length > 0;
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
        'autonomous-system': Number(p.bgp.autonomousSystem),
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

function clientVpnAttachmentToApiVpnAttachment(vpnAttachment: string, siteRole: string | null): CreateVpnAttachment {
  return {
    'vpn-id': vpnAttachment,
    'site-role': siteRole || undefined,
  };
}

function clientIPConnectionToApiIPConnection(ipConnection: IPConnection): CreateIPConnectionInput {
  // TODO: fix this hardcoded oam
  const output: CreateIPConnectionInput = {
    oam: {
      bfd: {
        enabled: false,
        'profile-name': '500ms',
      },
    },
  };

  // if (ipConnection.oam) {
  //   output.oam = {};

  //   if (ipConnection.oam.bfd) {
  //     const { bfd } = ipConnection.oam;
  //     output.oam.bfd = {
  //       enabled: bfd?.enabled,
  //       'profile-name': bfd?.profileName,
  //     };
  //   }
  // }
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
            'requested-type': 'dot1ad',
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
        'vpn-attachment': access.vpnAttachment
          ? clientVpnAttachmentToApiVpnAttachment(access.vpnAttachment, access.siteRole)
          : undefined,
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

export function apiVpnNodesToClientVpnNodes(apiNodes: VpnNodesOutput): VpnNode[] {
  if (!apiNodes['vpn-nodes']) {
    return [];
  }

  return apiNodes['vpn-nodes']['vpn-node'].map((node) => {
    return {
      neId: node['ne-id'],
      routerId: node['router-id'],
      role: node.role || null,
    };
  });
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
  const serviceType = apiCarrier['service-type'] ? (apiCarrier['service-type'].split(':').pop() as string) : null;
  const serviceStatus = apiCarrier['service-status'] ? (apiCarrier['service-status'].split(':').pop() as string) : null;
  return {
    carrierName: apiCarrier['carrier-name'] || null,
    carrierReference: apiCarrier['carrier-reference'] || null,
    serviceStatus,
    serviceType,
  };
}

function apiConnectionToClientConnnection(apiConnection: ConnectionOutput): Connection {
  const encapsulationType = apiConnection['encapsulation-type']
    ? (apiConnection['encapsulation-type'].split(':').pop() as string)
    : null;
  const svlanAssignmentType = apiConnection['svlan-assignment-type']
    ? (apiConnection['svlan-assignment-type'].split(':').pop() as string)
    : null;
  const tpId = apiConnection.tpid ? (apiConnection.tpid.split(':').pop() as string) : null;
  return {
    encapsulationType,
    svlanAssignmentType,
    tpId,
    mtu: apiConnection.mtu,
    remoteNeId: apiConnection['remote-ne-id'] || null,
    remotePortId: apiConnection['remote-port-id'] || null,
  };
}

function apiEvcAttachmentToClientEvcAttachment(apiEvc: EvcAttachmentOutput): EvcAttachment {
  return {
    evcType: apiEvc['evc-type'].split(':').pop() as string,
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
    const evcAttachments =
      b['evc-attachments'] && b['evc-attachments']['evc-attachment']
        ? b['evc-attachments']['evc-attachment'].map(apiEvcAttachmentToClientEvcAttachment)
        : [];
    return {
      spBearerReference: b['sp-bearer-reference'],
      description: b.description || null,
      neId: b['ne-id'],
      portId: b['port-id'],
      status: b.status ? apiBearerStatusToClientBearerStatus(b.status) : null,
      carrier: b.carrier ? apiCarrierToClientCarrier(b.carrier) : null,
      connection: b.connection ? apiConnectionToClientConnnection(b.connection) : null,
      defaultUpstreamBearer: b['default-upstream-bearer'] || null,
      evcAttachments,
    };
  });
}
function clientBearerStatusToApiBearerStatus(status: BearerStatus): BearerStatusOutput {
  const adminStatus = status.adminStatus
    ? {
        status: status.adminStatus.status || undefined,
        'last-updated': status.adminStatus.lastUpdated || undefined,
      }
    : undefined;
  const operStatus = status.operStatus
    ? {
        status: status.operStatus.status || undefined,
        'last-updated': status.operStatus.lastUpdated || undefined,
      }
    : undefined;
  return {
    'admin-status': adminStatus,
    'oper-status': operStatus,
  };
}

function clientCarrierToApiCarrier(carrier: Carrier): CarrierOutput {
  return {
    'carrier-name': carrier.carrierName || undefined,
    'carrier-reference': carrier.carrierReference || undefined,
    'service-status': carrier.serviceStatus || undefined,
    'service-type': carrier.serviceType || undefined,
  };
}

function clientConnectionToApiConnection(connection: Connection): ConnectionOutput {
  return {
    'encapsulation-type': connection.encapsulationType || undefined,
    'remote-ne-id': connection.remoteNeId || undefined,
    'remote-port-id': connection.remotePortId || undefined,
    'svlan-assignment-type': connection.svlanAssignmentType || undefined,
    mtu: connection.mtu,
    tpid: connection.tpId || undefined,
  };
}

function clientEvcAttachmentsToApiEvcAttachments(attachments: EvcAttachment[]): EvcAttachmentInput | undefined {
  if (!attachments.length) {
    return undefined;
  }

  const result = attachments.map((a: EvcAttachment): EvcAttachmentOutput => {
    return {
      'evc-type': a.evcType,
      'customer-name': a.customerName || undefined,
      'circuit-reference': a.circuitReference,
      'carrier-reference': a.carrierReference || undefined,
      'svlan-id': a.svlanId || undefined,
      status: a.status ? clientBearerStatusToApiBearerStatus(a.status) : undefined,
      'input-bandwidth': a.inputBandwidth,
      'qos-input-profile': a.qosInputProfile || undefined,
      'upstream-bearer': a.upstreamBearer || undefined,
    };
  });

  return {
    'evc-attachment': result,
  };
}

export function clientBearerToApiBearer(bearer: VpnBearer): VpnBearerInput {
  const output: VpnBearerInput = {
    'vpn-bearer': [
      {
        'sp-bearer-reference': bearer.spBearerReference,
        description: bearer.description || undefined,
        'ne-id': bearer.neId,
        'port-id': bearer.portId,
        status: bearer.status ? clientBearerStatusToApiBearerStatus(bearer.status) : undefined,
        carrier: bearer.carrier ? clientCarrierToApiCarrier(bearer.carrier) : undefined,
        connection: bearer.connection ? clientConnectionToApiConnection(bearer.connection) : undefined,
        'default-upstream-bearer': bearer.defaultUpstreamBearer || undefined,
        'evc-attachments': clientEvcAttachmentsToApiEvcAttachments(bearer.evcAttachments),
      },
    ],
  };
  return output;
}
