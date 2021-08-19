import React, { FC, useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom';

type InventoryComponents = typeof import('@frinx/inventory-client/src');
const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      const { DeviceList, CreateDevicePage, InventoryAPIProvider, DeviceConfigPage } = mod;
      setComponents({
        DeviceList,
        CreateDevicePage,
        InventoryAPIProvider,
        DeviceConfigPage,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { DeviceList, CreateDevicePage, InventoryAPIProvider, DeviceConfigPage } = components;

  return (
    <InventoryAPIProvider url={window.__CONFIG__.inventory_api_url}>
      <Switch>
        <Route exact path="/inventory">
          <DeviceList
            onAddButtonClick={() => {
              history.push('/inventory/new');
            }}
            onSettingsButtonClick={(deviceId) => {
              history.push(`/inventory/config/${deviceId}`);
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
        <Route
          exact
          path="/inventory/config/:deviceId"
          render={(props: RouteComponentProps<{ deviceId: string }>) => {
            const { match } = props;
            const { params } = match;
            return <DeviceConfigPage deviceId={params.deviceId} />;
          }}
        />
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
