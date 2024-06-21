import { InventoryApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { useConfig } from './config.provider';
import { authContext } from './auth-helpers';

const DeviceTopologyApp: FC = () => {
  const { inventoryApiURL, devInventoryWsURL, inventoryWsSchema, inventoryWsPath, isPerformanceMonitoringEnabled } =
    useConfig();
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
    <InventoryAPIProvider
      wsUrl={wsURL}
      client={InventoryApi.create({ url: inventoryApiURL, authContext }).client}
      isPerformanceMonitoringEnabled={isPerformanceMonitoringEnabled}
    >
      <App />
    </InventoryAPIProvider>
  );
};

export default DeviceTopologyApp;
