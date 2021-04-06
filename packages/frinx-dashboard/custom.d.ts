declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.inline.svg' {
  const content: 'svg';
  export default content;
}

declare module 'react-notifications';

declare module 'feather-icons-react' {
  const content: FC<{ icon: string; size: string }>;

  export default content;
}

type DashboardApp = {
  init: () => Promise<DashboardApp>;

  render: () => void;
};

/* eslint-disable */
interface Window {
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
