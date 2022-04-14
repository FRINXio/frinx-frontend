export const calcDiffData = {
  output: {
    bearer: {
      status: 'COMPLETED',
      output: {
        url: 'http://unistore:8181/rests/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration',
        response_code: 200,
        response_body: {
          'frinx-uniconfig-topology:configuration': {
            'gamma-bearer-svc:bearer-svc': {
              'vpn-nodes': {
                'vpn-node': [
                  {
                    'ne-id': 'lab-vmx1',
                    'router-id': '10.141.130.61',
                  },
                ],
              },
              carriers: {
                carrier: [
                  {
                    'carrier-name': '6DG',
                    description: 'Six Degrees Group',
                  },
                  {
                    'carrier-name': 'BT-WHOLESALE',
                    description: 'BT Wholesale',
                  },
                  {
                    'carrier-name': 'COLT',
                    description: 'Colt Technology Services',
                  },
                  {
                    'carrier-name': 'EIRCOM',
                    description: 'Eircom',
                  },
                  {
                    'carrier-name': 'EQUINIX',
                    description: 'Equinix',
                  },
                  {
                    'carrier-name': 'TALKTALK',
                    description: 'TalkTalk Business',
                  },
                  {
                    'carrier-name': 'VMB',
                    description: 'Virgin Media Business',
                  },
                ],
              },
              'valid-provider-identifiers': {
                'qos-profile-identifier': [
                  {
                    id: 'GNS_GENERIC',
                  },
                  {
                    id: 'ABC_TEST',
                  },
                  {
                    id: 'XYZ_TEST',
                  },
                ],
              },
              'vpn-bearers': {
                'vpn-bearer': [
                  {
                    'sp-bearer-reference': 'CES00000000-00',
                    description: 'bearer-1',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/0',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-up',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-1',
                      'carrier-name': 'EIRCOM',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-00',
                          'svlan-id': 1,
                          'customer-name': 'customer-1',
                          'carrier-reference': 'carrier-1',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                  {
                    'sp-bearer-reference': 'CES00000000-02',
                    description: 'bearer-2',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/1',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-up',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-2',
                      'carrier-name': '6DG',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-02',
                          'svlan-id': 1,
                          'customer-name': 'customer-2',
                          'carrier-reference': 'carrier-2',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                  {
                    'sp-bearer-reference': 'CES00000000-03',
                    description: 'bearer-3',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/2',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-up',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-3',
                      'carrier-name': '6DG',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-03',
                          'svlan-id': 1,
                          'customer-name': 'customer-3',
                          'carrier-reference': 'carrier-3',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                  {
                    'sp-bearer-reference': 'CES00000000-04',
                    description: 'bearer-4',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/3',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-down',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-4',
                      'carrier-name': 'EQUINIX',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-04',
                          'svlan-id': 1,
                          'customer-name': 'customer-4',
                          'carrier-reference': 'carrier-4',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                  {
                    'sp-bearer-reference': 'CES00000000-05',
                    description: 'bearer-5',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/4',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-down',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-5',
                      'carrier-name': 'TALKTALK',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-05',
                          'svlan-id': 1,
                          'customer-name': 'customer-5',
                          'carrier-reference': 'carrier-5',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                  {
                    'sp-bearer-reference': 'CES00000000-06',
                    description: 'bearer-6',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/5',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-up',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-6',
                      'carrier-name': 'VMB',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-06',
                          'svlan-id': 1,
                          'customer-name': 'customer-6',
                          'carrier-reference': 'carrier-6',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                  {
                    'sp-bearer-reference': 'CES00000000-07',
                    description: 'bearer-7',
                    'ne-id': 'lab-vmx1',
                    'port-id': 'xe-0/0/6',
                    status: {
                      'admin-status': {
                        status: 'gamma-vpn-common:administrative-state-up',
                      },
                    },
                    connection: {
                      tpid: 'gamma-bearer-svc:dot1ad',
                      mtu: 1501,
                    },
                    carrier: {
                      'carrier-reference': 'bearer-7',
                      'carrier-name': 'EQUINIX',
                    },
                    'evc-attachments': {
                      'evc-attachment': [
                        {
                          'evc-type': 'gamma-bearer-svc:evc-point-to-point',
                          'circuit-reference': 'CES00000000-07',
                          'svlan-id': 1,
                          'customer-name': 'customer-5',
                          'carrier-reference': 'carrier-5',
                          'input-bandwidth': 1000,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      logs: [],
    },
    before: {
      status: 'COMPLETED',
      output: {
        url: 'http://unistore:8181/rests/data/network-topology:network-topology/topology=unistore/node=service/frinx-uniconfig-topology:configuration/gamma-l3vpn-svc:l3vpn-svc?content=nonconfig',
        response_code: 200,
        response_body: {
          'gamma-l3vpn-svc:l3vpn-svc': {
            'vpn-profiles': {
              'valid-provider-identifiers': {
                'qos-profile-identifier': [
                  {
                    id: 'GNS_BESPOKE_CUST1',
                  },
                ],
                'bfd-profile-identifier': [
                  {
                    id: '500ms',
                  },
                ],
                'bgp-profile-identifier': [
                  {
                    id: '300ms',
                  },
                ],
              },
            },
            sites: {
              site: [
                {
                  'site-id': '999',
                  'site-network-accesses': {
                    'site-network-access': [
                      {
                        'site-network-access-id': 'TEST_1',
                        'ip-connection': {
                          oam: {
                            bfd: {
                              enabled: false,
                              'profile-name': '500ms',
                            },
                          },
                          ipv4: {
                            'address-allocation-type': 'gamma-l3vpn-svc:static-address',
                            addresses: {
                              'provider-address': '0.0.0.0',
                              'customer-address': '10.100.0.1',
                              'prefix-length': 24,
                            },
                          },
                        },
                        'maximum-routes': {
                          'address-family': [
                            {
                              af: 'ipv4',
                              'maximum-routes': 1000,
                            },
                          ],
                        },
                        'location-reference': '4',
                        'vpn-attachment': {
                          'vpn-id': 'VPN_1_A',
                          'site-role': 'gamma-l3vpn-svc:any-to-any-role',
                        },
                        availability: {
                          'access-priority': 100,
                        },
                        'site-network-access-type': 'gamma-l3vpn-svc:point-to-point',
                        bearer: {
                          'always-on': true,
                          'bearer-reference': 'CES00000000-00',
                          'requested-c-vlan': 100,
                          'requested-type': {
                            'requested-type': 'dot1ad',
                            strict: false,
                          },
                        },
                        service: {
                          'svc-input-bandwidth': 10000000,
                          'svc-mtu': 1600,
                          'svc-output-bandwidth': 10000000,
                          qos: {
                            'qos-profile': {
                              'qos-profile': [
                                {
                                  profile: 'GNS_BESPOKE_CUST1',
                                },
                              ],
                            },
                          },
                        },
                        'routing-protocols': {
                          'routing-protocol': [
                            {
                              type: 'gamma-l3vpn-svc:bgp',
                              bgp: {
                                'autonomous-system': 65000,
                                'address-family': ['ipv4'],
                                'bgp-profiles': {
                                  'bgp-profile': [
                                    {
                                      profile: '300ms',
                                    },
                                  ],
                                },
                              },
                            },
                            {
                              type: 'gamma-l3vpn-svc:static',
                              static: {
                                'cascaded-lan-prefixes': {
                                  'ipv4-lan-prefixes': [
                                    {
                                      lan: '10.0.0.1/0',
                                      'next-hop': '10.0.0.3',
                                      'lan-tag': 'lan-tag-test',
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  'maximum-routes': {
                    'address-family': [
                      {
                        af: 'ipv4',
                        'maximum-routes': 1000,
                      },
                    ],
                  },
                  'site-vpn-flavor': 'gamma-l3vpn-svc:site-vpn-flavor-single',
                  'traffic-protection': {
                    enabled: false,
                  },
                  management: {
                    type: 'gamma-l3vpn-svc:customer-managed',
                  },
                  locations: {
                    location: [
                      {
                        'location-id': '4',
                        address: '10.10.10.6',
                        city: 'Micina',
                        'postal-code': '11111',
                        state: 'Slovakia',
                        'country-code': 'SK',
                      },
                    ],
                  },
                  'vpn-policies': {
                    'vpn-policy': [
                      {
                        'vpn-policy-id': '7',
                        entries: [
                          {
                            id: '8',
                            filters: {
                              filter: [
                                {
                                  type: 'gamma-l3vpn-svc:lan',
                                  'lan-tag': ['10.100'],
                                },
                              ],
                            },
                            vpn: [
                              {
                                'vpn-id': 'VPN_1_A',
                                'site-role': 'gamma-l3vpn-svc:any-to-any-role',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  service: {
                    qos: {
                      'qos-profile': {
                        'qos-profile': [
                          {
                            profile: 'GNS_BESPOKE_CUST1',
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  'site-id': 'SITE_TJiusKcA',
                  devices: {},
                  'maximum-routes': {
                    'address-family': [
                      {
                        af: 'ipv4',
                        'maximum-routes': 1000,
                      },
                    ],
                  },
                  'site-vpn-flavor': 'gamma-l3vpn-svc:site-vpn-flavor-single',
                  'traffic-protection': {
                    enabled: false,
                  },
                  management: {
                    type: 'gamma-l3vpn-svc:provider-managed',
                  },
                  locations: {},
                  service: {
                    qos: {
                      'qos-profile': {
                        'qos-profile': [
                          {
                            profile: 'GNS_BESPOKE_CUST1',
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
            'vpn-services': {
              'vpn-service': [
                {
                  'vpn-id': 'VPN_1_A',
                  'customer-name': 'Customer 1',
                  'extranet-vpns': {
                    'extranet-vpn': [
                      {
                        'vpn-id': 'VPN_2',
                        'local-sites-role': 'gamma-l3vpn-svc:any-to-any-role',
                      },
                    ],
                  },
                  'vpn-service-topology': 'gamma-l3vpn-svc:any-to-any',
                  'default-c-vlan': 10,
                },
                {
                  'vpn-id': 'GSN00000512',
                  'customer-name': 'Customer 1',
                  'extranet-vpns': {},
                  'vpn-service-topology': 'gamma-l3vpn-svc:any-to-any',
                  'default-c-vlan': 400,
                },
              ],
            },
          },
        },
      },
      logs: [],
    },
    after: {
      status: 'COMPLETED',
      output: {
        url: 'http://unistore:8181/rests/data/network-topology:network-topology/topology=unistore/node=service/frinx-uniconfig-topology:configuration/gamma-l3vpn-svc:l3vpn-svc?content=config',
        response_code: 200,
        response_body: {
          'gamma-l3vpn-svc:l3vpn-svc': {
            'vpn-profiles': {
              'valid-provider-identifiers': {
                'qos-profile-identifier': [
                  {
                    id: 'GNS_BESPOKE_CUST1',
                  },
                ],
                'bfd-profile-identifier': [
                  {
                    id: '500ms',
                  },
                ],
                'bgp-profile-identifier': [
                  {
                    id: '300ms',
                  },
                ],
              },
            },
            sites: {
              site: [
                {
                  'site-id': '999',
                  devices: {},
                  'site-network-accesses': {
                    'site-network-access': [
                      {
                        'site-network-access-id': 'TEST_1',
                        'ip-connection': {
                          oam: {
                            bfd: {
                              'profile-name': '500ms',
                            },
                          },
                          ipv4: {
                            'address-allocation-type': 'gamma-l3vpn-svc:static-address',
                            addresses: {
                              'provider-address': '0.0.0.0',
                              'customer-address': '10.100.0.1',
                              'prefix-length': 24,
                            },
                          },
                        },
                        'maximum-routes': {
                          'address-family': [
                            {
                              af: 'ipv4',
                              'maximum-routes': 1000,
                            },
                          ],
                        },
                        'location-reference': '4',
                        'vpn-attachment': {
                          'vpn-id': 'VPN_1_A',
                          'site-role': 'gamma-l3vpn-svc:any-to-any-role',
                        },
                        availability: {
                          'access-priority': 100,
                        },
                        'site-network-access-type': 'gamma-l3vpn-svc:point-to-point',
                        bearer: {
                          'always-on': true,
                          'bearer-reference': 'CES00000000-00',
                          'requested-c-vlan': 100,
                          'requested-type': {
                            'requested-type': 'dot1ad',
                            strict: false,
                          },
                        },
                        service: {
                          'svc-output-bandwidth': 10000000,
                          'svc-input-bandwidth': 10000000,
                          qos: {
                            'qos-profile': {
                              'qos-profile': [
                                {
                                  profile: 'GNS_BESPOKE_CUST1',
                                },
                              ],
                            },
                          },
                        },
                        'routing-protocols': {
                          'routing-protocol': [
                            {
                              type: 'gamma-l3vpn-svc:bgp',
                              bgp: {
                                'autonomous-system': 65000,
                                'address-family': ['ipv4'],
                                'bgp-profiles': {
                                  'bgp-profile': [
                                    {
                                      profile: '300ms',
                                    },
                                  ],
                                },
                              },
                            },
                            {
                              type: 'gamma-l3vpn-svc:static',
                              static: {
                                'cascaded-lan-prefixes': {
                                  'ipv4-lan-prefixes': [
                                    {
                                      lan: '10.0.0.1/0',
                                      'next-hop': '10.0.0.3',
                                      'lan-tag': 'lan-tag-test',
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  'maximum-routes': {
                    'address-family': [
                      {
                        af: 'ipv4',
                        'maximum-routes': 2000,
                      },
                    ],
                  },
                  'site-vpn-flavor': 'gamma-l3vpn-svc:site-vpn-flavor-single',
                  'traffic-protection': {
                    enabled: false,
                  },
                  management: {
                    type: 'gamma-l3vpn-svc:customer-managed',
                  },
                  locations: {
                    location: [
                      {
                        'location-id': '4',
                        address: '10.10.10.6',
                        city: 'Micina',
                        'postal-code': '11111',
                        state: 'Slovakia',
                        'country-code': 'UK',
                      },
                    ],
                  },
                  service: {
                    qos: {
                      'qos-profile': {
                        'qos-profile': [
                          {
                            profile: 'GNS_BESPOKE_CUST1',
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  'site-id': 'SITE_TJiusKcA',
                  devices: {},
                  'site-network-accesses': {
                    'site-network-access': [
                      {
                        'site-network-access-id': 'NETWORK_ACCESS_Cu7ZKnps',
                        'ip-connection': {
                          ipv4: {
                            'address-allocation-type': 'gamma-l3vpn-svc:static-address',
                            addresses: {
                              'provider-address': '0.0.0.17',
                              'customer-address': '0.0.0.18',
                              'prefix-length': 30,
                            },
                          },
                        },
                        'maximum-routes': {
                          'address-family': [
                            {
                              af: 'ipv4',
                              'maximum-routes': 1000,
                            },
                          ],
                        },
                        'vpn-attachment': {
                          'vpn-id': 'VPN_1_A',
                          'site-role': 'gamma-l3vpn-svc:any-to-any-role',
                        },
                        availability: {
                          'access-priority': 150,
                        },
                        'site-network-access-type': 'gamma-l3vpn-svc:point-to-point',
                        bearer: {
                          'always-on': false,
                          'bearer-reference': 'CPNH212341234-123',
                          'requested-c-vlan': 400,
                          'requested-type': {
                            'requested-type': 'dot1ad',
                            strict: false,
                          },
                        },
                        service: {
                          'svc-output-bandwidth': 1000,
                          'svc-input-bandwidth': 1000,
                          qos: {
                            'qos-profile': {
                              'qos-profile': [
                                {
                                  profile: 'GNS_BESPOKE_CUST1',
                                },
                              ],
                            },
                          },
                        },
                        'routing-protocols': {},
                      },
                    ],
                  },
                  'maximum-routes': {
                    'address-family': [
                      {
                        af: 'ipv4',
                        'maximum-routes': 1000,
                      },
                    ],
                  },
                  'site-vpn-flavor': 'gamma-l3vpn-svc:site-vpn-flavor-single',
                  'traffic-protection': {
                    enabled: false,
                  },
                  management: {
                    type: 'gamma-l3vpn-svc:provider-managed',
                  },
                  locations: {},
                  service: {
                    qos: {
                      'qos-profile': {
                        'qos-profile': [
                          {
                            profile: 'GNS_BESPOKE_CUST1',
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  'site-id': 'SITE_EoDAP1UT',
                  devices: {},
                  'maximum-routes': {
                    'address-family': [
                      {
                        af: 'ipv4',
                        'maximum-routes': 1000,
                      },
                    ],
                  },
                  'site-vpn-flavor': 'gamma-l3vpn-svc:site-vpn-flavor-single',
                  'traffic-protection': {
                    enabled: false,
                  },
                  management: {
                    type: 'gamma-l3vpn-svc:provider-managed',
                  },
                  locations: {},
                },
              ],
            },
            'vpn-services': {
              'vpn-service': [
                {
                  'vpn-id': 'VPN_1_A',
                  'customer-name': 'Customer 1',
                  'extranet-vpns': {
                    'extranet-vpn': [
                      {
                        'vpn-id': 'VPN_2',
                        'local-sites-role': 'gamma-l3vpn-svc:any-to-any-role',
                      },
                    ],
                  },
                  'vpn-service-topology': 'gamma-l3vpn-svc:any-to-any',
                  'default-c-vlan': 10,
                },
                {
                  'vpn-id': 'GSN00000512',
                  'customer-name': 'Customer 1',
                  'extranet-vpns': {},
                  'vpn-service-topology': 'gamma-l3vpn-svc:any-to-any',
                  'default-c-vlan': 400,
                },
              ],
            },
          },
        },
      },
      logs: [],
    },
    changes: {
      creates: {
        sites: {
          SITE_TJiusKcA: {
            'site-network-accesses': {
              NETWORK_ACCESS_Cu7ZKnps: {},
            },
          },
          SITE_EoDAP1UT: {},
        },
        'vpn-services': {},
      },
      deletes: {
        vpn_service: [],
        site: [],
        site_network_access: [],
        routing: [],
        static_prefixes_ipv4: [],
        static_prefixes_ipv6: [],
      },
      updates: {
        sites: {
          999: {
            __directly_updated: true,
            'site-network-accesses': {
              TEST_1: {
                __directly_updated: true,
              },
            },
          },
        },
        'vpn-services': {},
      },
      full: false,
    },
  },
};
