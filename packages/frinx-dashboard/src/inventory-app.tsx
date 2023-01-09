import { InventoryApi, UniflowApi } from '@frinx/api';
import { InventoryApiClient } from '@frinx/inventory-client/src';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type InventoryComponents = Omit<typeof import('@frinx/inventory-client/src'), 'getInventoryApiProvider'> & {
  InventoryAPIProvider: FC<{ client: InventoryApiClient }>;
};
const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      setComponents({
        InventoryApp: mod.InventoryApp,
        InventoryAPIProvider: mod.getInventoryApiProvider(
          UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
        ),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { InventoryAPIProvider, InventoryApp: App } = components;

  return (
    <InventoryAPIProvider client={InventoryApi.create({ url: window.__CONFIG__.inventoryApiURL, authContext }).client}>
      <App />
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
