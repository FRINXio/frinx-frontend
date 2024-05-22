import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { useConfig } from './config.provider';

const DeviceTopologyApp: FC = () => {
  const { inventoryApiURL, devInventoryWsURL, inventoryWsSchema, inventoryWsPath } = useConfig();
  const [components, setComponents] = useState<typeof import('@frinx/device-topology') | null>(null);

  useEffect(() => {
    import('@frinx/device-topology').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { InventoryAPIProvider, DeviceTopologyApp: App } = components;
  const wsURL = devInventoryWsURL || `${inventoryWsSchema}${window.location.host}${inventoryWsPath}`;

  return (
    <InventoryAPIProvider client={InventoryApi.create({ url: inventoryApiURL }).client} wsUrl={wsURL}>
      <App />
    </InventoryAPIProvider>
  );
};

export default DeviceTopologyApp;
