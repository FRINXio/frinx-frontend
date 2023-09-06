import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type UniflowComponents = Omit<typeof import('@frinx/workflow-ui'), 'getUniflowApiProvider'>;

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<UniflowComponents | null>(null);

  useEffect(() => {
    import('@frinx/workflow-ui').then((mod) => {
      const { UniflowApp: App, InventoryAPIProvider } = mod;

      setComponents({
        UniflowApp: App,
        InventoryAPIProvider,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { UniflowApp: App, InventoryAPIProvider } = components;

  return (
    <InventoryAPIProvider
      client={InventoryApi.create({ authContext, url: window.__CONFIG__.inventoryApiURL }).client}
      wsUrl={window.__CONFIG__.inventoryWsURL}
    >
      <App />
    </InventoryAPIProvider>
  );
};

export default UniflowApp;
