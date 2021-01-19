declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.inline.svg' {
  const content: 'svg';
  export default content;
}

declare module 'react-notifications';

interface Window {
  __CONFIG__: {
    public_url: string;
    auth_enabled: 'true' | 'false';
    auth_client_id: string;
    auth_redirect_url: string;
    inventory_enabled: 'true' | 'false';
    uniconfig_enabled: 'true' | 'false';
    uniflow_enabled: 'true' | 'false';
    usermanagement_enabled: 'true' | 'false';
    url_inventory: string;
    url_uniconfig: string;
    url_uniflow: string;
    url_usermanagement: string;
  };

  dashboardApp: {
    render: () => void;
  };
}
