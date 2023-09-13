import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';
import { useConfigContext } from './config.provider';

type UniflowComponents = typeof import('@frinx/workflow-ui');

const UniflowApp: FC = () => {
  const { inventoryApiURL, inventoryWsURL } = useConfigContext();
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
      client={InventoryApi.create({ authContext, url: inventoryApiURL }).client}
      wsUrl={inventoryWsURL}
    >
      <App />
    </InventoryAPIProvider>
  );
};

export default UniflowApp;
