declare type GammaApp = {
  init: () => Promise<GammaApp>;

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
    unistore_api_url: string;
    yang_module: string;
    uniconfig_api_url: string;
    uniconfig_auth: string;
    uniconfig_api_docs_url: string;
    unistore_api_url: string;
    unistore_auth: string;
    uniresource_enabled: boolean;
    uniconfig_enabled: boolean;
    uniflow_enabled: boolean;
    inventory_enabled: boolean;
    usermanagement_enabled: boolean;
    url_basename: string;
    inventory_api_url: string;
    uniresource_api_url: string;
  }>;

  gammaApp: GammaApp;
}
/* eslint-enable */
