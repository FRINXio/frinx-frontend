import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { useConfig } from './config.provider';

type UniflowComponents = typeof import('@frinx/workflow-ui');

const UniflowApp: FC = () => {
  const { inventoryApiURL, devInventoryWsURL, inventoryWsSchema, inventoryWsPath } = useConfig();
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
  const wsURL = devInventoryWsURL || `${inventoryWsSchema}${window.location.host}${inventoryWsPath}`;

  const { UniflowApp: App, InventoryAPIProvider } = components;
  return (
    <InventoryAPIProvider client={InventoryApi.create({ url: inventoryApiURL }).client} wsUrl={wsURL}>
      <App />
    </InventoryAPIProvider>
  );
};

export default UniflowApp;
