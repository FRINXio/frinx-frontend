declare type DashboardApp = {
  init: () => Promise<DashboardApp>;

  render: () => void;
};

declare const COMMIT_HASH: string;

/* eslint-disable */
declare interface Window {
  IS_PRODUCTION: 'true' | 'false';

  __CONFIG__: Readonly<{
    isAuthEnabled: boolean;
    authClientId: string;
    authRedirectURL: string;
    uniflowApiURL: string;
    uniconfigApiDocsURL: string;
    isResourceManagerEnabled: boolean;
    unistoreApiURL: string;
    isUniflowEnabled: boolean;
    isInventoryEnabled: boolean;
    isL3VPNEnabled: boolean;
    isDeviceTopologyEnabled: boolean;
    URLBasename: string;
    inventoryApiURL: string;
    inventoryWsURL: string;
    uniresourceApiURL: string;
    uniflowApiDocsURL: string;
    MSALAuthority: string;
    commitHash: string;
  }>;

  __GAMMA_FORM_OPTIONS__: Readonly<{
    service: {
      vpn_topology: Options;
      default_cvlan: Options;
      extranet_vpns: Options;
    };
    site: {
      site_management: Options;
      location: Options;
      maximum_routes: Options;
    };
    site_network_access: {
      site_role: Options;
      requested_cvlan: Options;
      bandwidths: Options;
    };
    bearer: {
      service_type: Options;
      service_status: Options;
      encapsulation_type: Options;
      'svlan-assignment-type': Options;
      tpid: Options;
      evc_type: Options;
      port_id: Options;
      roles: Options;
    };
  }>;

  dashboardApp: DashboardApp;
}
/* eslint-enable */
