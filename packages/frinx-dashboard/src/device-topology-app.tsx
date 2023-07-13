import { useMsal } from '@azure/msal-react';
import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext, refreshToken } from './auth-helpers';

type DeviceTopologyComponents = typeof import('@frinx/device-topology/src');
const DeviceTopologyApp: FC = () => {
  const [components, setComponents] = useState<DeviceTopologyComponents | null>(null);
  const { inProgress, accounts, instance } = useMsal();

  useEffect(() => {
    import('@frinx/device-topology/src').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { InventoryAPIProvider, DeviceTopologyApp: App } = components;

  return (
    <InventoryAPIProvider
      client={InventoryApi.create({ url: window.__CONFIG__.inventoryApiURL, authContext }).client}
      refreshToken={() => refreshToken(inProgress, accounts, instance)}
    >
      <App />
    </InventoryAPIProvider>
  );
};

export default DeviceTopologyApp;
