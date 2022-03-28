import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type InventoryComponents = typeof import('@frinx/inventory-client/src');
const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      setComponents(mod);
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
