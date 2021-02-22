import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory, useLocation, RouteComponentProps } from 'react-router-dom';
import {
  getCliTopology,
  getNetconfTopology,
  getCliConfigurationalState,
  getNetconfConfigurationalState,
  getCliOperationalState,
  getNetconfOperationalState,
  getCliConfigurationalDataStore,
  getCliOperationalDataStore,
  mountCliNode,
  mountNetconfNode,
  unmountCliNode,
  unmountNetconfNode,
  getCliDeviceTranslations,
  updateCliConfigurationalDataStore,
  calculateDiff,
  commitToNetwork,
  dryRunCommit,
  syncFromNetwork,
  replaceConfigWithOperational,
  getSnapshots,
  deleteSnapshot,
  replaceConfigWithSnapshot,
  createSnapshot,
} from './api/uniconfig/uniconfig-api';

const callbacks = {
  getCliTopology,
  getNetconfTopology,
  getCliConfigurationalState,
  getNetconfConfigurationalState,
  getCliOperationalState,
  getNetconfOperationalState,
  getCliConfigurationalDataStore,
  getCliOperationalDataStore,
  mountCliNode,
  mountNetconfNode,
  unmountCliNode,
  unmountNetconfNode,
  getCliDeviceTranslations,
  updateCliConfigurationalDataStore,
  calculateDiff,
  commitToNetwork,
  dryRunCommit,
  syncFromNetwork,
  replaceConfigWithOperational,
  getSnapshots,
  deleteSnapshot,
  replaceConfigWithSnapshot,
  createSnapshot,
};

const UniconfigApp: FC = () => {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);

  const [components, setComponents] = useState<typeof import('@frinx/uniconfig-ui') | null>(null);

  useEffect(() => {
    import('@frinx/uniconfig-ui').then((mod) => {
      const { ThemeProvider, DeviceDetails, DeviceList, DeviceView, MountDevice, getUniconfigApiProvider } = mod;

      setComponents({
        ThemeProvider,
        DeviceDetails,
        DeviceList,
        DeviceView,
        MountDevice,
        getUniconfigApiProvider,
        UniconfigApiProvider: getUniconfigApiProvider(callbacks),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { ThemeProvider, DeviceDetails, DeviceList, DeviceView, MountDevice, UniconfigApiProvider } = components;

  return (
    <UniconfigApiProvider>
      <ThemeProvider>
        <Switch>
          <Route exact path="/uniconfig">
            <Redirect to="/uniconfig/devices" />
          </Route>
          <Route exact path="/uniconfig/devices">
            <DeviceList
              onMountBtnClick={(templateNode) => {
                history.push('/uniconfig/mount', { templateNode });
              }}
              onDeviceClick={(deviceId, topologyId) => {
                history.push(`/uniconfig/devices/${deviceId}?topology=${topologyId}`);
              }}
              onEditClick={(deviceId) => {
                history.push(`/uniconfig/devices/edit/${deviceId}`);
              }}
            />
          </Route>
          <Route
            exact
            path="/uniconfig/devices/edit/:id"
            render={(props: RouteComponentProps<{ id: string }>) => {
              return (
                <DeviceView
                  deviceId={props.match.params.id}
                  onBackBtnClick={() => {
                    props.history.push('/uniconfig/devices');
                  }}
                />
              );
            }}
          />
          <Route
            exact
            path="/uniconfig/devices/:nodeId"
            render={(props: RouteComponentProps<{ nodeId: string; topology: string }>) => {
              return (
                <DeviceDetails
                  nodeId={props.match.params.nodeId}
                  topology={query.get('topology')}
                  onBackBtnClick={() => {
                    history.push('/uniconfig/devices');
                  }}
                />
              );
            }}
          />
          <Route
            exact
            path="/uniconfig/mount"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            render={(props: RouteComponentProps<void, void, { templateNode: unknown }>) => {
              return (
                <MountDevice
                  onBackBtnClick={() => {
                    history.push('/uniconfig/devices');
                  }}
                  templateNode={props.location.state.templateNode}
                />
              );
            }}
          />
        </Switch>
      </ThemeProvider>
    </UniconfigApiProvider>
  );
};

export default UniconfigApp;
