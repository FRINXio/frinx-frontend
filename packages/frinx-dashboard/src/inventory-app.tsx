import { InventoryApi } from '@frinx/api';
import { InventoryApiClient } from '@frinx/inventory-client/src';
import React, { FC, useEffect, useState } from 'react';
import { useConfig } from './config.provider';

type InventoryComponents = Omit<typeof import('@frinx/inventory-client'), 'getInventoryApiProvider'> & {
  InventoryAPIProvider: FC<{ client: InventoryApiClient; wsUrl: string }>;
};
const InventoryApp: FC = () => {
  const { gatewayApiUrl, inventoryWsURL } = useConfig();
  const [components, setComponents] = useState<InventoryComponents | null>(null);

  useEffect(() => {
    import('@frinx/inventory-client').then((mod) => {
      setComponents({
        InventoryApp: mod.InventoryApp,
        InventoryAPIProvider: mod.getInventoryApiProvider(),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { InventoryAPIProvider, InventoryApp: App } = components;

  return (
    <InventoryAPIProvider wsUrl={inventoryWsURL} client={InventoryApi.create({ url: gatewayApiUrl }).client}>
      <App />
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
