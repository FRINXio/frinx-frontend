import { EditDevicePage } from '@frinx/inventory-client/src';
import React, { FC, useEffect, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom';

type InventoryComponents = typeof import('@frinx/inventory-client/src');
const InventoryApp: FC = () => {
  const [components, setComponents] = useState<InventoryComponents | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/inventory-client/src').then((mod) => {
      const {
        DeviceList,
        CreateDevicePage,
        InventoryAPIProvider,
        DeviceConfigPage,
        DeviceBlueprints,
        CreateBlueprintPage,
      } = mod;
      setComponents({
        DeviceList,
        CreateDevicePage,
        InventoryAPIProvider,
        DeviceConfigPage,
        DeviceBlueprints,
        CreateBlueprintPage,
        EditDevicePage,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    DeviceList,
    CreateDevicePage,
    InventoryAPIProvider,
    DeviceConfigPage,
    DeviceBlueprints,
    CreateBlueprintPage,
  } = components;

  return (
    <InventoryAPIProvider url={window.__CONFIG__.inventory_api_url}>
      <Switch>
        <Route exact path="/inventory">
          <Redirect to="/inventory/devices" />
        </Route>
        <Route exact path="/inventory/devices">
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
          path="/inventory/edit/:deviceId"
          render={(props: RouteComponentProps<{ deviceId: string }>) => {
            const { deviceId } = props.match.params;
            return <EditDevicePage deviceId={deviceId} onSuccess={() => history.replace('/inventory/devices')} />;
          }}
        />
        <Route
          exact
          path="/inventory/config/:deviceId"
          render={(props: RouteComponentProps<{ deviceId: string }>) => {
            const { match } = props;
            const { params } = match;
            return <DeviceConfigPage deviceId={params.deviceId} />;
          }}
        />
        <Route exact path="/inventory/blueprints">
          <DeviceBlueprints
            onAddButtonClick={() => {
              history.push('/inventory/blueprints/new');
            }}
          />
        </Route>
        <Route exact path="/inventory/blueprints/new">
          <CreateBlueprintPage
            onCreateSuccess={() => {
              history.push('/inventory/blueprints');
            }}
          />
        </Route>
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
