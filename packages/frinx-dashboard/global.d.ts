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

  dashboardApp: DashboardApp;
}
/* eslint-enable */
