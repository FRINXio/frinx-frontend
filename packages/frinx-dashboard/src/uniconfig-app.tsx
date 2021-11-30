import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory, RouteComponentProps } from 'react-router-dom';
import { UniconfigApi } from '@frinx/api';
import { authContext } from './auth-helpers';

const UniconfigApp: FC = () => {
  const history = useHistory();
  const [components, setComponents] = useState<typeof import('@frinx/uniconfig-ui') | null>(null);

  useEffect(() => {
    import('@frinx/uniconfig-ui').then((mod) => {
      const { DeviceDetails, DeviceList, DeviceView, MountDevice, getUniconfigApiProvider } = mod;

      setComponents({
        DeviceDetails,
        DeviceList,
        DeviceView,
        MountDevice,
        getUniconfigApiProvider,
        UniconfigApiProvider: getUniconfigApiProvider(
          UniconfigApi.create({ url: window.__CONFIG__.uniconfig_api_url, authContext }),
        ),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { DeviceDetails, DeviceList, DeviceView, MountDevice, UniconfigApiProvider } = components;

  return (
    <UniconfigApiProvider>
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
          render={(props: RouteComponentProps<{ nodeId: string }>) => {
            const query = new URLSearchParams(props.location.search);

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
          render={(props: RouteComponentProps<void, void, { templateNode?: { topologyId: string } }>) => {
            return (
              <MountDevice
                onBackBtnClick={() => {
                  history.push('/uniconfig/devices');
                }}
                templateNode={props.location.state?.templateNode ?? null}
              />
            );
          }}
        />
      </Switch>
    </UniconfigApiProvider>
  );
};

export default UniconfigApp;
