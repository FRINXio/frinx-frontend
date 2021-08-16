import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

type InventoryComponents = typeof import('@frinx/inventory-client/src');
const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      const { DeviceList, CreateDevicePage, InventoryAPIProvider, DeviceConfig } = mod;
      setComponents({
        DeviceList,
        CreateDevicePage,
        InventoryAPIProvider,
        DeviceConfig,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { DeviceList, CreateDevicePage, InventoryAPIProvider, DeviceConfig } = components;

  return (
    <InventoryAPIProvider url={window.__CONFIG__.inventory_api_url}>
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
        <Route exact path="/inventory/config/:deviceId">
          <DeviceConfig />
        </Route>
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
