// TODO: remove this and find a better way to do types through callbackUtils
import { Either, fold } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { MaximumRoutes } from './components/forms/site-types';

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
  'vpn-services': t.type({
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
  }),
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
      'maximum-routes': t.number,
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

const VpnValidator = t.type({
  'vpn-id': t.string,
  'site-role': t.string,
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
  'routing-protocol': t.array(RoutingProtocolItemValidator),
});

export type RoutingProtocolsOutput = t.TypeOf<typeof RoutingProtocolsValidator>;

export function decodeRoutingProtocolsOutput(value: unknown): RoutingProtocolsOutput {
  return extractResult(RoutingProtocolsValidator.decode(value));
}

const SiteNetworkAccessValidator = t.type({
  'site-network-access': t.array(
    t.type({
      'site-network-access-id': t.string,
      'site-network-access-type': t.string,
      // 'ip-connection': t.type({
      //   oam: t.type({
      //     bfd: t.type({
      //       enabled: t.boolean,
      //       'profile-name': t.string,
      //     }),
      //   }),
      //   ipv4: t.type({
      //     'address-allocation-type': t.string,
      //     addresses: t.type({
      //       'customer-address': t.string,
      //       'prefix-length': t.number,
      //       'provider-address': t.string,
      //     }),
      //   }),
      // }),
      'maximum-routes': MaximumRoutesValidator,
      'location-reference': optional(t.string),
      'device-reference': optional(t.string),
      'vpn-attachment': optional(VpnValidator),
      availability: t.type({
        'access-priority': t.number,
      }),
      bearer: t.type({
        'always-on': t.boolean,
        'bearer-reference': optional(t.string),
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
      'routing-protocols': RoutingProtocolsValidator,
    }),
  ),
});

export type SiteNetworkAccessOutput = t.TypeOf<typeof SiteNetworkAccessValidator>;

export function decodeSiteNetworkAccessOutput(value: unknown): SiteNetworkAccessOutput {
  return extractResult(SiteNetworkAccessValidator.decode(value));
}

const VpnSitesOutputValidator = t.type({
  sites: t.type({
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
  }),
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

export type CreateNetworkAccessInput = {
  'site-network-access': {
    'site-network-access-id': string;
    'site-network-access-type': string;
    availability: {
      'access-priority': number;
    };
    'maximum-routes': {
      'address-family': {
        af: 'ipv4';
        'maximum-routes': MaximumRoutes;
      }[];
    };
    'routing-protocols': CreateRoutingProtocolsInput;
    'location-reference'?: string;
    'device-reference'?: string;
    bearer: {
      'always-on': boolean;
      'bearer-reference'?: string;
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
          'maximum-routes': number;
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
