import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory, RouteComponentProps } from 'react-router-dom';

const UniconfigApp: FC = () => {
  const history = useHistory();
  const [components, setComponents] = useState<typeof import('@frinx/uniconfig-ui') | null>(null);

  useEffect(() => {
    import('@frinx/uniconfig-ui').then((mod) => {
      const { ThemeProvider, DeviceDetails, DeviceList, DeviceView, MountDevice } = mod;

      setComponents({ ThemeProvider, DeviceDetails, DeviceList, DeviceView, MountDevice });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { ThemeProvider, DeviceDetails, DeviceList, DeviceView, MountDevice } = components;

  return (
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
          render={(props: RouteComponentProps<{ deviceId: string }>) => {
            return (
              <DeviceView
                deviceid={props.match.params.deviceId}
                onBackBtnClick={() => {
                  props.history.push('/uniconfig/devices');
                }}
              />
            );
          }}
        />
        <Route exact path="/uniconfig/devices/:nodeId">
          <DeviceDetails
            onBackBtnClick={() => {
              history.push('/uniconfig/devices');
            }}
          />
        </Route>
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
  );
};

export default UniconfigApp;
