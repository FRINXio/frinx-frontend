declare type DashboardApp = {
  init: () => Promise<DashboardApp>;

  render: () => void;
};

/* eslint-disable */
declare interface Window {
  __CONFIG__: Readonly<{
    auth_enabled: boolean;
    auth_client_id: string;
    auth_redirect_url: string;
    conductor_api_url: string;
    uniconfig_api_url: string;
    uniconfig_auth: string;
    uniresource_enabled: boolean;
    uniconfig_enabled: boolean;
    uniflow_enabled: boolean;
    usermanagement_enabled: boolean;
    url_basename: string;
  }>;

  dashboardApp: DashboardApp;
}
/* eslint-enable */
