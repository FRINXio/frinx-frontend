window.__GAMMA_FORM_OPTIONS__ = {
  service: {
    vpn_topology: {
      'any-to-any': 'any-to-any',
      'hub-spoke': 'hub-spoke',
      'hub-spoke-disjointed': 'hub-spoke-disjointed',
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
      Ireland: 'Ireland',
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
    bandwidths: {
      1000: '1000',
      2000: '2000',
      5000: '5000',
      10000: '10000',
    },
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
    },
    evc_type: {
      'evc-point-to-point': 'point-to-point',
      'evc-multipoint': 'multipoint',
    },
  },
};
