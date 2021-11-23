declare type DashboardApp = {
  init: () => Promise<DashboardApp>;

  render: () => void;
};

declare const COMMIT_HASH: string;

/* eslint-disable */
declare interface Window {
  __CONFIG__: Readonly<{
    auth_enabled: boolean;
    auth_client_id: string;
    auth_redirect_url: string;
    conductor_api_url: string;
    uniconfig_api_url: string;
    uniconfig_auth: string;
    uniconfig_api_docs_url: string;
    uniresource_enabled: boolean;
    uniconfig_enabled: boolean;
    uniflow_enabled: boolean;
    inventory_enabled: boolean;
    usermanagement_enabled: boolean;
    url_basename: string;
    inventory_api_url: string;
    uniresource_api_url: string;
    gamma_enabled: boolean;
    unistore_api_url: string;
  }>;

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

  dashboardApp: DashboardApp;
}
/* eslint-enable */
