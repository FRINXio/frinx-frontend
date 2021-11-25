import React, { FC, useEffect, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom';
import { authContext } from './auth-helpers';

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
        EditDevicePage,
        EditBlueprintPage,
      } = mod;
      setComponents({
        DeviceList,
        CreateDevicePage,
        InventoryAPIProvider,
        DeviceConfigPage,
        DeviceBlueprints,
        CreateBlueprintPage,
        EditDevicePage,
        EditBlueprintPage,
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
    EditDevicePage,
    EditBlueprintPage,
  } = components;

  return (
    <InventoryAPIProvider url={window.__CONFIG__.inventory_api_url} getAuthToken={authContext.getAuthToken}>
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
            onEditButtonClick={(deviceId) => {
              history.push(`/inventory/${deviceId}/edit`);
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
          path="/inventory/:deviceId/edit"
          render={(props: RouteComponentProps<{ deviceId: string }>) => {
            const { deviceId } = props.match.params;
            return (
              <EditDevicePage
                deviceId={deviceId}
                onSuccess={() => history.replace('/inventory/devices')}
                onCancelButtonClick={() => {
                  history.replace('/inventory/devices');
                }}
              />
            );
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
            onEditBlueprintButtonClick={(blueprintId) => {
              history.push(`/inventory/blueprints/${blueprintId}/edit`);
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
        <Route
          exact
          path="/inventory/blueprints/:blueprintId/edit"
          render={(props: RouteComponentProps<{ blueprintId: string }>) => {
            const { blueprintId } = props.match.params;
            return (
              <EditBlueprintPage
                blueprintId={blueprintId}
                onSuccess={() => history.push('/inventory/blueprints')}
                onCancel={() => {
                  history.push('/inventory/blueprints');
                }}
              />
            );
          }}
        />
      </Switch>
    </InventoryAPIProvider>
  );
};

export default InventoryApp;
