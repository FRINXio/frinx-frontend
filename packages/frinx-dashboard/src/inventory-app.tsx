import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { getDevices } from './api/inventory/inventory-api';

const callbacks = {
  getDevices,
};

type InventoryComponents = Omit<typeof import('@frinx/inventory-client/src'), 'getInventoryAPIProvider'> & {
  InventoryAPIProvider: FC;
};

const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);
  const history = useHistory();

  const handleAddButtonClick = () => history.push('/inventory/new');

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
          <DeviceList onAddButtonClick={handleAddButtonClick} />
        </Route>
        <Route exact path="/inventory/new">
          <CreateDevicePage />
        </Route>
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
