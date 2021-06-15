import React, { FC, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

const InventoryApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/inventory-client/src') | null>(null);

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      const { DeviceList } = mod;
      setComponents({
        DeviceList,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { DeviceList } = components;

  return (
    <>
      <Switch>
        <Route exact path="/inventory">
          <DeviceList />
        </Route>
      </Switch>
    </>
  );
};

export default InventoryApp;
