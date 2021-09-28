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
                'local-sites-role': t.string,
              }),
            ),
          ),
        }),
        'vpn-service-topology': t.string,
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
          'local-sites-role': string;
        }[];
      };
      'vpn-service-topology': string;
      'default-c-vlan': string;
    },
  ];
};

const SiteDevicesValidator = t.type({
  device: t.array(
    t.type({
      'device-id': t.string,
      management: t.type({
        address: t.string,
      }),
      location: t.string,
    }),
  ),
});

const MaximumRoutesValidator = t.type({
  'address-family': t.array(
    t.type({
      af: t.string,
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
  location: t.array(
    t.type({
      'location-id': t.string,
      'postal-code': t.string,
      state: t.string,
      address: t.string,
      city: t.string,
      'country-code': t.string, // should be Ireland/UK
    }),
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

const ServiceValidator = t.type({
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SiteNetworkAccesssesValidator = t.type({
  'site-network-access': t.array(
    t.type({
      'site-network-access-id': t.string,
      'ip-connection': t.type({
        oam: t.type({
          bfd: t.type({
            enabled: t.boolean,
            'profile-name': t.string,
          }),
        }),
        ipv4: t.type({
          'address-allocation-type': t.string,
          addresses: t.type({
            'customer-address': t.string,
            'prefix-length': t.number,
            'provider-address': t.string,
          }),
        }),
      }),
      'maximum-routes': MaximumRoutesValidator,
      'location-reference': t.string,
      'vpn-attachment': VpnValidator,
      availability: t.type({
        'access-priority': t.number,
      }),
      'site-network-access-type': t.string,
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
        'svc-mtu': t.number,
        'svc-output-bandwidth': t.number,
      }),
      'routing-protocols': t.type({
        'routing-protocol': t.array(
          t.type({
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
                      'lan-tag': t.string,
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
          }),
        ),
      }),
    }),
  ),
});

const VpnSitesOutputValidator = t.type({
  sites: t.type({
    site: t.array(
      t.type({
        'site-id': t.string,
        devices: SiteDevicesValidator,
        // 'site-network-accesses': SiteNetworkAccesssesValidator,
        // 'maximum-routes': MaximumRoutesValidator,
        'site-vpn-flavor': SiteVpnFlavorValidator,
        'traffic-protection': t.type({
          enabled: t.boolean,
        }),
        management: ManagementValidator,
        locations: LocationsValidator,
        // 'vpn-policies': VpnPoliciesValidator,
        service: ServiceValidator,
      }),
    ),
  }),
});

export type VpnSitesOutput = t.TypeOf<typeof VpnSitesOutputValidator>;

export function decodeVpnSitesOutput(value: unknown): VpnSitesOutput {
  return extractResult(VpnSitesOutputValidator.decode(value));
}

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
      // 'site-network-accesses': {
      //   'site-network-access': string[];
      // };
      // 'maximum-routes': {
      //   'address-family': {
      //     af: 'ipv4';
      //     'maximum-routes': number;
      //   }[];
      // };
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
      service: {
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
    },
  ];
};
