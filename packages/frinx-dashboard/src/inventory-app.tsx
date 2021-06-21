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
      const { DeviceList, getInventoryAPIProvider } = mod;
      setComponents({
        DeviceList,
        InventoryAPIProvider: getInventoryAPIProvider(callbacks),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { DeviceList, InventoryAPIProvider } = components;

  return (
    <InventoryAPIProvider>
      <Switch>
        <Route exact path="/inventory">
          <DeviceList />
        </Route>
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
