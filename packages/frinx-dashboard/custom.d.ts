declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.inline.svg' {
  const content: 'svg';
  export default content;
}

declare module 'react-notifications';

interface DashboardApp {
  init: () => Promise<DashboardApp>;

  render: () => void;
}

/* eslint-disable @typescript-eslint/naming-convention */
interface Window {
  __CONFIG__: Readonly<{
    auth_enabled: boolean;
    auth_client_id: string;
    auth_redirect_url: string;
    uniresource_enabled: boolean;
    uniconfig_enabled: boolean;
    uniflow_enabled: boolean;
    usermanagement_enabled: boolean;
  }>;

  dashboardApp: DashboardApp;
}
/* eslint-enable */
