import { Either, fold } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

// TODO: should go to config
const YANG_MODULE = 'gamma-l3vpn-svc';

function optional<T, U>(type: t.Type<T, U>) {
  return t.union([type, t.void]);
}

export function extractResult<A>(result: Either<t.Errors, A>): A {
  return fold(
    () => {
      const errorMessages = PathReporter.report(result);
      throw new Error(`BAD_REQUEST: ${errorMessages.join(',')}`);
    },
    (data: A) => data,
  )(result);
}

const VpnServicesOutputValidator = t.type({
  'vpn-service': t.array(
    t.type({
      'vpn-id': t.string,
      'customer-name': t.string,
      'extranet-vpns': t.type({
        'extranet-vpn': optional(
          t.array(
            t.type({
              'vpn-id': t.string,
              'local-sites-role': optional(t.string),
            }),
          ),
        ),
      }),
      'vpn-service-topology': t.string,
      'default-c-vlan': t.number,
    }),
  ),
});
export type VpnServicesOutput = t.TypeOf<typeof VpnServicesOutputValidator>;

export function decodeVpnServicesOutput(value: unknown): VpnServicesOutput {
  return extractResult(VpnServicesOutputValidator.decode(value));
}

export type CreateVpnServiceInput = {
  'vpn-service': [
    {
      'vpn-id': string;
      'customer-name': string;
      'extranet-vpns': {
        'extranet-vpn': {
          'vpn-id': string;
          'local-sites-role'?: string;
        }[];
      };
      'vpn-service-topology': string;
      'default-c-vlan': string;
    },
  ];
};

const SiteDevicesValidator = t.type({
  device: optional(
    t.array(
      t.type({
        'device-id': t.string,
        management: optional(
          t.type({
            address: t.string,
          }),
        ),
        location: t.string,
      }),
    ),
  ),
});

export type SiteDevicesOutput = t.TypeOf<typeof SiteDevicesValidator>;

export function decodeSiteDevicesOutput(value: unknown): SiteDevicesOutput {
  return extractResult(SiteDevicesValidator.decode(value));
}

const MaximumRoutesValidator = t.type({
  'address-family': t.array(
    t.type({
      af: t.literal('ipv4'),
      'maximum-routes': optional(t.number),
    }),
  ),
});

const SiteVpnFlavorValidator = t.union([
  t.literal(`${YANG_MODULE}:site-vpn-flavor-single`),
  t.literal(`${YANG_MODULE}:site-vpn-flavor-sub`),
  t.literal(`${YANG_MODULE}:site-vpn-flavor-nni`),
]);

const ManagementValidator = t.type({
  type: t.union([
    t.literal(`${YANG_MODULE}:point-to-point`),
    t.literal(`${YANG_MODULE}:provider-managed`),
    t.literal(`${YANG_MODULE}:co-managed`),
    t.literal(`${YANG_MODULE}:customer-managed`),
  ]),
});

const LocationsValidator = t.type({
  location: optional(
    t.array(
      t.type({
        'location-id': t.string,
        'postal-code': optional(t.string),
        state: optional(t.string),
        address: optional(t.string),
        city: optional(t.string),
        'country-code': optional(t.string), // should be Ireland/UK
      }),
    ),
  ),
});

export type LocationsOutput = t.TypeOf<typeof LocationsValidator>;

export function decodeLocationsOutput(value: unknown): LocationsOutput {
  return extractResult(LocationsValidator.decode(value));
}

const VpnValidator = t.type({
  'vpn-id': t.string,
  'site-role': optional(t.string),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VpnPoliciesValidator = t.type({
  'vpn-policy': t.array(
    t.type({
      'vpn-policy-id': t.string,
      entries: t.array(
        t.type({
          id: t.string,
          filters: t.type({
            filter: t.array(
              t.type({
                type: t.string,
                'lan-tag': t.array(t.string),
                'ipv4-lan-prefix': t.array(t.string),
              }),
            ),
          }),
          vpn: t.array(VpnValidator),
        }),
      ),
    }),
  ),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SiteServiceValidator = t.type({
  qos: t.type({
    'qos-profile': t.type({
      'qos-profile': t.array(
        t.type({
          profile: t.string,
        }),
      ),
    }),
  }),
});

export type SiteServiceOutput = t.TypeOf<typeof SiteServiceValidator>;

export function decodeSiteServiceOutput(value: unknown): SiteServiceOutput {
  return extractResult(SiteServiceValidator.decode(value));
}

const RoutingProtocolItemValidator = t.type({
  type: t.string,
  vrrp: optional(
    t.type({
      'address-family': t.array(t.string),
    }),
  ),
  static: optional(
    t.type({
      'cascaded-lan-prefixes': t.type({
        'ipv4-lan-prefixes': t.array(
          t.type({
            lan: t.string,
            'next-hop': t.string,
            'lan-tag': optional(t.string),
          }),
        ),
      }),
    }),
  ),
  bgp: optional(
    t.type({
      'bgp-profiles': t.type({
        'bgp-profile': t.array(
          t.type({
            profile: t.string,
          }),
        ),
      }),
      'autonomous-system': t.number,
      'address-family': t.array(t.string),
    }),
  ),
});

export type RoutingProtocolItemOutput = t.TypeOf<typeof RoutingProtocolItemValidator>;
export function decodeRoutingProtocolItemOutput(value: unknown): RoutingProtocolItemOutput {
  return extractResult(RoutingProtocolItemValidator.decode(value));
}

const RoutingProtocolsValidator = t.type({
  'routing-protocol': optional(t.array(RoutingProtocolItemValidator)),
});

export type RoutingProtocolsOutput = t.TypeOf<typeof RoutingProtocolsValidator>;

export function decodeRoutingProtocolsOutput(value: unknown): RoutingProtocolsOutput {
  return extractResult(RoutingProtocolsValidator.decode(value));
}

const IPConnectionValidator = t.type({
  oam: optional(
    t.type({
      bfd: optional(
        t.type({
          enabled: optional(t.boolean),
          'profile-name': optional(t.string),
        }),
      ),
    }),
  ),
  ipv4: optional(
    t.type({
      'address-allocation-type': optional(t.string),
      addresses: optional(
        t.type({
          'customer-address': optional(t.string),
          'prefix-length': optional(t.number),
          'provider-address': optional(t.string),
        }),
      ),
    }),
  ),
});

export type IPConnectionOutput = t.TypeOf<typeof IPConnectionValidator>;
export function decodeIPConnectionOutput(value: unknown): IPConnectionOutput {
  return extractResult(IPConnectionValidator.decode(value));
}

const SiteNetworkAccessValidator = t.type({
  'site-network-access': t.array(
    t.type({
      'site-network-access-id': t.string,
      'site-network-access-type': t.string,
      // this property is part of the form inputs, but it was reported,
      // that they dont want to lose it when we edit form
      'ip-connection': optional(IPConnectionValidator),
      'maximum-routes': MaximumRoutesValidator,
      'location-reference': optional(t.string),
      'device-reference': optional(t.string),
      'vpn-attachment': optional(VpnValidator),
      availability: t.type({
        'access-priority': t.number,
      }),
      bearer: t.type({
        'always-on': t.boolean,
        'bearer-reference': t.string,
        'requested-c-vlan': t.number,
        'requested-type': t.type({
          'requested-type': t.string,
          strict: t.boolean,
        }),
      }),

      service: t.type({
        'svc-input-bandwidth': t.number,
        'svc-output-bandwidth': t.number,
        qos: t.type({
          'qos-profile': t.type({
            'qos-profile': t.array(
              t.type({
                profile: t.string,
              }),
            ),
          }),
        }),
      }),
      'routing-protocols': optional(RoutingProtocolsValidator),
    }),
  ),
});

export type SiteNetworkAccessOutput = t.TypeOf<typeof SiteNetworkAccessValidator>;

export function decodeSiteNetworkAccessOutput(value: unknown): SiteNetworkAccessOutput {
  return extractResult(SiteNetworkAccessValidator.decode(value));
}

const VpnSitesOutputValidator = t.type({
  site: t.array(
    t.type({
      'site-id': t.string,
      devices: optional(SiteDevicesValidator),
      'site-network-accesses': optional(SiteNetworkAccessValidator),
      'maximum-routes': MaximumRoutesValidator,
      'site-vpn-flavor': SiteVpnFlavorValidator,
      'traffic-protection': t.type({
        enabled: t.boolean,
      }),
      management: ManagementValidator,
      locations: LocationsValidator,
      // 'vpn-policies': VpnPoliciesValidator,
      service: optional(SiteServiceValidator),
    }),
  ),
});

export type VpnSitesOutput = t.TypeOf<typeof VpnSitesOutputValidator>;

export function decodeVpnSitesOutput(value: unknown): VpnSitesOutput {
  return extractResult(VpnSitesOutputValidator.decode(value));
}

export type CreateRoutingProtocolItem = {
  type: 'bgp' | 'vrrp' | 'static';
  static?: {
    'cascaded-lan-prefixes': {
      'ipv4-lan-prefixes': {
        lan: string;
        'next-hop': string;
        'lan-tag'?: string;
      }[];
    };
  };
  bgp?: {
    'bgp-profiles': {
      'bgp-profile': [
        {
          profile: string;
        },
      ];
    };
    'autonomous-system': number;
    'address-family': ['ipv4'];
  };
};

export type CreateRoutingProtocolsInput = {
  'routing-protocol': CreateRoutingProtocolItem[];
};

export type CreateVpnAttachment = {
  'vpn-id': string;
  'site-role'?: string;
};

export type CreateIPConnectionInput = {
  oam?: {
    bfd?: {
      enabled?: boolean;
      'profile-name'?: string;
    };
  };
  ipv4?: {
    'address-allocation-type'?: string;
    addresses?: {
      'customer-address'?: string;
      'prefix-length'?: number;
      'provider-address'?: string;
    };
  };
};

export type CreateNetworkAccessInput = {
  'site-network-access': {
    'site-network-access-id': string;
    'site-network-access-type': string;
    // it is part of create/edit input even we dont use this value in the form,
    // but we need to preserve it in the structure
    'ip-connection'?: CreateIPConnectionInput;
    availability: {
      'access-priority': number;
    };
    'maximum-routes': {
      'address-family': {
        af: 'ipv4';
        'maximum-routes'?: MaximumRoutes;
      }[];
    };
    'routing-protocols': CreateRoutingProtocolsInput;
    'location-reference'?: string;
    'device-reference'?: string;
    bearer: {
      'always-on': boolean;
      'bearer-reference': string;
      'requested-c-vlan': number;
      'requested-type': {
        'requested-type': string;
        strict: boolean;
      };
    };
    service: {
      'svc-input-bandwidth': number;
      'svc-output-bandwidth': number;
      qos: {
        'qos-profile': {
          'qos-profile': [
            {
              profile: string;
            },
          ];
        };
      };
    };
    'vpn-attachment'?: {
      'vpn-id': string;
      'site-role'?: string;
    };
  }[];
};

export type ApiQosProfileInput = {
  qos: {
    'qos-profile': {
      'qos-profile': [
        {
          profile: string;
        },
      ];
    };
  };
};

export type CreateVpnSiteInput = {
  site: [
    {
      'site-id': string;
      devices: {
        device: {
          'device-id': string;
          management: {
            address: string;
          };
          location: string;
        }[];
      };
      'site-network-accesses'?: CreateNetworkAccessInput;
      'maximum-routes': {
        'address-family': {
          af: 'ipv4';
          'maximum-routes'?: number;
        }[];
      };
      'site-vpn-flavor': string;
      'traffic-protection': {
        enabled: boolean;
      };
      management: {
        type: string;
      };
      locations: {
        location: {
          'location-id': string;
          'postal-code': string;
          state: string;
          address: string;
          city: string;
          'country-code': string;
        }[];
      };
      service?: ApiQosProfileInput;
      // 'vpn-policies': {
      //   'vpn-policy': {
      //     'vpn-policy-id': string;
      //     entries: {
      //       id: '8';
      //       filters: {
      //         filter: [
      //           {
      //             type: string[];
      //             'lan-tag': string[];
      //             'ipv4-lan-prefix': string[];
      //           },
      //         ];
      //       };
      //       vpn: [
      //         {
      //           'vpn-id': string;
      //           'site-role': string;
      //         },
      //       ];
      //     }[];
      //   }[];
      // };
    },
  ];
};

const ValidProviderIdentifiersOutputValidator = t.type({
  'valid-provider-identifiers': t.type({
    'qos-profile-identifier': optional(
      t.array(
        t.type({
          id: t.string,
        }),
      ),
    ),
    'bfd-profile-identifier': optional(
      t.array(
        t.type({
          id: t.string,
        }),
      ),
    ),
    'bgp-profile-identifier': optional(
      t.array(
        t.type({
          id: t.string,
        }),
      ),
    ),
  }),
});

export type ValidProviderIdentifiersOutput = t.TypeOf<typeof ValidProviderIdentifiersOutputValidator>;

export function decodeValidProviderIdentifiersOutput(value: unknown): ValidProviderIdentifiersOutput {
  return extractResult(ValidProviderIdentifiersOutputValidator.decode(value));
}

const VpnCarrierItemsValidator = t.type({
  carrier: t.array(
    t.type({
      'carrier-name': t.string,
      description: optional(t.string),
    }),
  ),
});
export type VpnCarrierItemsOutput = t.TypeOf<typeof VpnCarrierItemsValidator>;
export type VpnCarrierInput = VpnCarrierItemsOutput;
export function decodeVpnCarrierItemsOutput(value: unknown): VpnCarrierItemsOutput {
  return extractResult(VpnCarrierItemsValidator.decode(value));
}

const VpnCarriersValidator = t.type({
  carriers: optional(VpnCarrierItemsValidator),
});
export type VpnCarriersOutput = t.TypeOf<typeof VpnCarriersValidator>;
export function decodeVpnCarriersOutput(value: unknown): VpnCarriersOutput {
  return extractResult(VpnCarriersValidator.decode(value));
}

const VpnNodeItemsValidator = t.type({
  'vpn-node': t.array(
    t.type({
      'ne-id': t.string,
      'router-id': t.string,
      role: optional(t.string),
    }),
  ),
});
export type VpnNodeItemsOutput = t.TypeOf<typeof VpnNodeItemsValidator>;
export type VpnNodeInput = VpnNodeItemsOutput;
export function decodeVpnNodeItemsOutput(value: unknown): VpnNodeItemsOutput {
  return extractResult(VpnNodeItemsValidator.decode(value));
}

const VpnNodesValidator = t.type({
  'vpn-nodes': optional(VpnNodeItemsValidator),
});
export type VpnNodesOutput = t.TypeOf<typeof VpnNodesValidator>;
export function decodeVpnNodesOutput(value: unknown): VpnNodesOutput {
  return extractResult(VpnNodesValidator.decode(value));
}

const BearerStatusValidator = t.type({
  'admin-status': optional(
    t.type({
      status: optional(t.string),
      'last-updated': optional(t.string),
    }),
  ),
  'oper-status': optional(
    t.type({
      status: optional(t.string),
      'last-updated': optional(t.string),
    }),
  ),
});
export type BearerStatusOutput = t.TypeOf<typeof BearerStatusValidator>;
export function decodeBearerStatusOutput(value: unknown): BearerStatusOutput {
  return extractResult(BearerStatusValidator.decode(value));
}

const EvcAttachmentOutputValidator = t.type({
  'evc-type': t.string,
  'customer-name': optional(t.string),
  'circuit-reference': t.string,
  'carrier-reference': optional(t.string),
  'svlan-id': optional(t.number),
  status: optional(BearerStatusValidator),
  'input-bandwidth': t.number,
  'qos-input-profile': optional(t.string),
  'upstream-bearer': optional(t.string),
});
export type EvcAttachmentOutput = t.TypeOf<typeof EvcAttachmentOutputValidator>;
export function decodeEvcAttachmentOutput(value: unknown): EvcAttachmentOutput {
  return extractResult(EvcAttachmentOutputValidator.decode(value));
}

const CarrierOutputValidator = t.type({
  'carrier-name': optional(t.string),
  'carrier-reference': optional(t.string),
  'service-type': optional(t.string),
  'service-status': optional(t.string),
});
export type CarrierOutput = t.TypeOf<typeof CarrierOutputValidator>;
export function decodeCarrierOutput(value: unknown): CarrierOutput {
  return extractResult(CarrierOutputValidator.decode(value));
}

const ConnectionOutputValidator = t.type({
  'encapsulation-type': optional(t.string),
  'svlan-assignment-type': optional(t.string),
  tpid: optional(t.string),
  mtu: t.number,
  'remote-ne-id': optional(t.string),
  'remote-port-id': optional(t.string),
});
export type ConnectionOutput = t.TypeOf<typeof ConnectionOutputValidator>;
export function decodeConnectionOutput(value: unknown): ConnectionOutput {
  return extractResult(ConnectionOutputValidator.decode(value));
}

const VpnBearerItemsOutputValidator = t.array(
  t.type({
    'sp-bearer-reference': t.string,
    description: optional(t.string),
    'ne-id': t.string,
    'port-id': t.string,
    status: optional(BearerStatusValidator),
    carrier: optional(CarrierOutputValidator),
    connection: optional(ConnectionOutputValidator),
    'default-upstream-bearer': optional(t.string),
    'evc-attachments': optional(
      t.type({
        'evc-attachment': t.array(EvcAttachmentOutputValidator),
      }),
    ),
  }),
);
export type VpnBearerItemsOutput = t.TypeOf<typeof VpnBearerItemsOutputValidator>;
export type VpnBearerInput = { 'vpn-bearer': VpnBearerItemsOutput };
export function decodeVpnBearerItemsOutput(value: unknown): VpnBearerItemsOutput {
  return extractResult(VpnBearerItemsOutputValidator.decode(value));
}

export type EvcAttachmentInput = {
  'evc-attachment': EvcAttachmentOutput[];
};

const VpnBearerOutputValidator = t.type({
  'vpn-bearer': optional(VpnBearerItemsOutputValidator),
});

export type VpnBearerOutput = t.TypeOf<typeof VpnBearerOutputValidator>;

export function decodeVpnBearerOutput(value: unknown): VpnBearerOutput {
  return extractResult(VpnBearerOutputValidator.decode(value));
}

const SvcBearerOutputValidator = t.type({
  carriers: optional(VpnCarriersValidator),
  'vpn-nodes': optional(VpnNodesValidator),
  'vpn-bearers': optional(VpnBearerOutputValidator),
});

export type SvcBearerOutput = t.TypeOf<typeof SvcBearerOutputValidator>;
export function decodeSvcBearerOutput(value: unknown): SvcBearerOutput {
  return extractResult(SvcBearerOutputValidator.decode(value));
}

export type VpnServiceTopology = 'any-to-any' | 'hub-spoke' | 'hub-spoke-disjointed' | 'custom';

// eslint-disable-next-line no-shadow
export enum DefaultCVlanEnum {
  'Main Corporate VPN' = '400',
  'Guest Wifi VPN' = '1000',
  'Dedicated SIP VPN' = '50',
  'Custom C-VLAN' = 'custom',
  // LocalInternet = '300',
}

export type AddressFamily = 'ipv4' | 'ipv6';
export type MaximumRoutes = 1000 | 2000 | 5000 | 10000 | 1000000;

export type VpnService = {
  vpnId?: string;
  customerName: string;
  vpnServiceTopology: VpnServiceTopology;
  defaultCVlan: DefaultCVlanEnum;
  customCVlan?: number;
  extranetVpns: string[];
};

export type ProviderIdentifiers = {
  bfdIdentifiers: string[];
  qosIdentifiers: string[];
  bgpIdentifiers: string[];
};
export type CountryCode = 'UK' | 'Ireland';
export type CustomerLocation = {
  locationId?: string;
  street: string;
  postalCode: string;
  state: string;
  city: string;
  countryCode: CountryCode;
};

export type SiteDevice = {
  deviceId?: string;
  locationId: string | null;
  managementIP: string;
};

export type SiteManagementType = 'point-to-point' | 'provider-managed' | 'co-managed' | 'customer-managed';
export type SiteVpnFlavor = 'site-vpn-flavor-single' | 'site-vpn-flavor-sub' | 'site-vpn-flavor-nni';

export type SiteNetworkAccessType = 'point-to-point' | 'multipoint';
// eslint-disable-next-line no-shadow
export enum AccessPriority {
  'Primary Ethernet' = '150',
  'Backup Ethernet' = '100',
  PDSL = '90',
  'Backup PDSL' = '80',
  '4G' = '70',
  'Backup 4G' = '60',
}

// eslint-disable-next-line no-shadow
// export enum RequestedCVlan {
//   l3vpn = '400',
//   Pseudowire = '100',
//   'Local Internet Breakout' = '200',
//   DMZ = '300',
// }
export type RoutingProtocolType = 'bgp' | 'static';
export type VrrpRoutingType = 'ipv4';
export type StaticRoutingType = {
  lan: string;
  nextHop: string;
  lanTag: string | null;
};
export type BgpRoutingType = {
  addressFamily: 'ipv4';
  autonomousSystem: string;
  bgpProfile: string | null;
};
export type RoutingProtocol = {
  type: RoutingProtocolType;
  vrrp?: VrrpRoutingType;
  static?: StaticRoutingType[];
  bgp?: BgpRoutingType;
};

export type Bearer = {
  alwaysOn: boolean;
  bearerReference: string;
  requestedCLan: string;
  requestedType: {
    requestedType: string;
    strict: boolean;
  };
};

export type Service = {
  svcInputBandwidth: number;
  svcOutputBandwidth: number;
  qosProfiles: [string];
};

export type IPConnection = {
  oam?: {
    bfd?: {
      enabled?: boolean;
      profileName?: string;
    };
  };
  ipv4?: {
    addressAllocationType?: string;
    addresses?: {
      customerAddress?: string;
      prefixLength?: number;
      providerAddress?: string;
    };
  };
};

export type SiteNetworkAccess = {
  siteNetworkAccessId: string;
  siteNetworkAccessType: SiteNetworkAccessType;
  ipConnection?: IPConnection;
  accessPriority: AccessPriority;
  maximumRoutes: MaximumRoutes | null;
  routingProtocols: RoutingProtocol[];
  locationReference: string | null;
  deviceReference: string | null;
  bearer: Bearer;
  service: Service;
  vpnAttachment: string | null;
  siteRole: string | null;
};

export type VpnSite = {
  siteId?: string;
  customerLocations: CustomerLocation[];
  siteDevices: SiteDevice[];
  siteManagementType: SiteManagementType;
  siteVpnFlavor: SiteVpnFlavor;
  siteServiceQosProfile: string | null;
  enableBgpPicFastReroute: boolean;
  siteNetworkAccesses: SiteNetworkAccess[];
  maximumRoutes: MaximumRoutes | null;
};

export type Status = {
  status: string | null;
  lastUpdated: string | null;
};

export type BearerStatus = {
  adminStatus: Status | null;
  operStatus: Status | null;
};

export type Carrier = {
  carrierName: string | null;
  carrierReference: string | null;
  serviceType: string | null;
  serviceStatus: string | null;
};

export type Connection = {
  encapsulationType: string | null;
  svlanAssignmentType: string | null;
  tpId: string | null;
  mtu: number;
  remoteNeId: string | null;
  remotePortId: string | null;
};

export type EvcAttachment = {
  evcType: string;
  customerName: string | null;
  circuitReference: string;
  carrierReference: string | null;
  svlanId: number | null;
  status: BearerStatus | null;
  inputBandwidth: number;
  qosInputProfile: string | null;
  upstreamBearer: string | null;
};

export type VpnBearer = {
  spBearerReference: string;
  description: string | null;
  neId: string;
  portId: string;
  status: BearerStatus | null;
  carrier: Carrier | null;
  connection: Connection | null;
  defaultUpstreamBearer: string | null;
  evcAttachments: EvcAttachment[];
};

export type VpnNode = {
  neId: string;
  routerId: string;
  role: string | null;
};

export type VpnCarrier = {
  name: string;
  description: string | null;
};
