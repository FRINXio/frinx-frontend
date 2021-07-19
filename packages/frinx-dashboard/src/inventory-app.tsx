import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { getDevices, getZones, addDevice, installDevice, uninstallDevice } from './api/inventory/inventory-api';

const callbacks = {
  getDevices,
  getZones,
  addDevice,
  installDevice,
  uninstallDevice,
};

type InventoryComponents = Omit<typeof import('@frinx/inventory-client/src'), 'getInventoryAPIProvider'> & {
  InventoryAPIProvider: FC;
};

const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);
  const history = useHistory();

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
          <DeviceList
            onAddButtonClick={() => {
              history.push('/inventory/new');
            }}
          />
        </Route>
        <Route exact path="/inventory/new">
          <CreateDevicePage
            onAddDeviceSuccess={() => {
              history.push('/inventory');
            }}
          />
        </Route>
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
