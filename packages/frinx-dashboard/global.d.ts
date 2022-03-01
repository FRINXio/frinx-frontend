declare type DashboardApp = {
  init: () => Promise<DashboardApp>;

  render: () => void;
};

declare const COMMIT_HASH: string;

/* eslint-disable */
declare interface Window {
  __CONFIG__: Readonly<{
    isAuthEnabled: boolean;
    authClientId: string;
    authRedirectURL: string;
    uniflowApiURL: string;
    uniconfigApiDocsURL: string;
    isUniresourceEnabled: boolean;
    isUniflowEnabled: boolean;
    isInventoryEnabled: boolean;
    URLBasename: string;
    inventoryApiURL: string;
    uniresourceApiURL: string;
    uniflowApiDocsURL: string;
    MSALAuthority: string;
  }>;

  dashboardApp: DashboardApp;
}
/* eslint-enable */
