import React, { FC, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { getDevices } from './api/inventory/inventory-api';

const callbacks = {
  getDevices,
};

type InventoryComponents = Omit<typeof import('@frinx/inventory-client/src'), 'getInventoryAPIProvider'> & {
  InventoryAPIProvider: FC;
};

const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      const { DeviceList, CreateDevicePage, getInventoryAPIProvider } = mod;
      setComponents({
        DeviceList,
        CreateDevicePage,
        InventoryAPIProvider: getInventoryAPIProvider(callbacks),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { DeviceList, CreateDevicePage, InventoryAPIProvider } = components;

  return (
    <InventoryAPIProvider>
      <Switch>
        <Route exact path="/inventory">
          <DeviceList />
        </Route>
        <Route exact path="/inventory/create-device">
          <CreateDevicePage />
        </Route>
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
