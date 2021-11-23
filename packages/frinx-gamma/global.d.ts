declare module 'feather-icons-react';

declare interface Window {
  __GAMMA_FORM_OPTIONS__: Readonly<{
    service: {
      vpn_topology: {
        'any-to-any': 'any-to-any';
        'hub-spoke': 'hub-spoke';
        'hub-spoke-disjointed': 'hub-spoke-disjointed';
      };
      default_cvlan: {
        'Main Corporate VPN': 400;
        'Guest Wifi VPN': 1000;
        'Dedicated SIP VPN': 50;
        'Custom C-VLAN': 'custom';
      };
      extranet_vpns: {
        MGMT: 'MGMT';
        SIP889: 'SIP889';
      };
    };
  }>;
}
