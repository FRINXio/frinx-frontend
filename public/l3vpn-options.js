window.__GAMMA_FORM_OPTIONS__ = {
  service: {
    vpn_topology: {
      'any-to-any': 'any-to-any',
      'hub-spoke': 'hub-spoke',
      'hub-spoke-disjoint': 'hub-spoke-disjoint',
    },
    default_cvlan: {
      400: 'Main Corporate VPN',
      1000: 'Guest Wifi VPN',
      50: 'Dedicated SIP VPN',
      custom: 'Custom C-VLAN',
    },
    extranet_vpns: {
      MGMT: 'MGMT',
      SIP889: 'SIP889',
    },
  },
  site: {
    site_management: {
      'provider-managed': 'provider-managed',
      'co-managed': 'co-managed',
      'customer-managed': 'customer-managed',
    },
    location: {
      UK: 'UK',
      IE: 'IE',
    },
    maximum_routes: {
      1000: '1000',
      2000: '2000',
      5000: '5000',
      10000: '10000',
      1000000: '1000000',
    },
  },
  site_network_access: {
    site_role: {
      'any-to-any-role': 'any-any',
      'hub-role': 'hub',
      'spoke-role': 'spoke',
    },
    requested_cvlan: {
      400: 'l3vpn',
      100: 'Pseudowire',
      200: 'Local Internet Breakout',
      300: 'DMZ',
    },
    bandwidths: new Map([
      ['1 Mbps', 1000],
      ['2 Mbps', 2000],
      ['3 Mbps', 3000],
      ['4 Mbps', 4000],
      ['5 Mbps', 5000],
      ['6 Mbps', 6000],
      ['7 Mbps', 7000],
      ['8 Mbps', 8000],
      ['9 Mbps', 9000],
      ['10 Mbps', 10000],
      ['15 Mbps', 15000],
      ['20 Mbps', 20000],
      ['25 Mbps', 25000],
      ['30 Mbps', 30000],
      ['35 Mbps', 35000],
      ['40 Mbps', 40000],
      ['45 Mbps', 45000],
      ['50 Mbps', 50000],
      ['60 Mbps', 60000],
      ['70 Mbps', 70000],
      ['80 Mbps', 80000],
      ['90 Mbps', 90000],
      ['100 Mbps', 100_000],
      ['150 Mbps', 150_000],
      ['200 Mbps', 200_000],
      ['250 Mbps', 250_000],
      ['300 Mbps', 300_000],
      ['350 Mbps', 350_000],
      ['400 Mbps', 400_000],
      ['450 Mbps', 450_000],
      ['500 Mbps', 500_000],
      ['550 Mbps', 550_000],
      ['600 Mbps', 600_000],
      ['650 Mbps', 650_000],
      ['700 Mbps', 700_000],
      ['750 Mbps', 750_000],
      ['800 Mbps', 800_000],
      ['850 Mbps', 850_000],
      ['900 Mbps', 900_000],
      ['950 Mbps', 950_000],
      ['1 Gbps', 1_000_000],
      ['1.5 Gbps', 1_500_000],
      ['2 Gbps', 2_000_000],
      ['2.5 Gbps', 2_500_000],
      ['3 Gbps', 3_000_000],
      ['3.5 Gbps', 3_500_000],
      ['4 Gbps', 4_000_000],
      ['4.5 Gbps', 4_500_000],
      ['5 Gbps', 5_000_000],
    ]),
  },
  bearer: {
    service_type: {
      evc: 'evc',
      'shared-fw': 'shared-fw',
    },
    service_status: {
      active: 'active',
      ordered: 'ordered',
      reserved: 'reserved',
      'no-more-capacity': 'no-more-capacity',
      disabled: 'disabled',
    },
    encapsulation_type: {
      'tagged-int': 'tagged-int',
      'untagged-int': 'untagged-int',
    },
    'svlan-assignment-type': {
      auto: 'auto',
      'third-party': 'third-party',
    },
    tpid: {
      dot1ad: '802.1ad (0x88a8)',
      qinq: '802.1QinQ (0x9100)',
      dot1q: '802.1q (0x8100)',
    },
    evc_type: {
      'evc-point-to-point': 'point-to-point',
      'evc-multipoint': 'multipoint',
    },
    port_id: {
      'xe-0/1/0': 'xe-0/1/0',
      'xe-0/1/1': 'xe-0/1/1',
      'xe-0/1/2': 'xe-0/1/2',
      'xe-0/1/3': 'xe-0/1/3',
      'xe-0/1/4': 'xe-0/1/4',
      'xe-0/1/5': 'xe-0/1/5',
      'xe-0/1/6': 'xe-0/1/6',
      'xe-0/1/7': 'xe-0/1/7',
    },
    roles: {
      'layer-2-aggregation-role': 'layer-2-aggregation-role',
      'vpn-termination-role': 'vpn-termination-role',
    },
  },
};