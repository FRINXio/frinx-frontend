import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type DeviceTopologyComponents = typeof import('@frinx/device-topology');
const DeviceTopologyApp: FC = () => {
  const [components, setComponents] = useState<DeviceTopologyComponents | null>(null);

  useEffect(() => {
    import('@frinx/device-topology').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { InventoryAPIProvider, DeviceTopologyApp: App } = components;

  return (
    <InventoryAPIProvider client={InventoryApi.create({ url: window.__CONFIG__.inventoryApiURL, authContext }).client}>
      <App />
    </InventoryAPIProvider>
  );
};

export default DeviceTopologyApp;
