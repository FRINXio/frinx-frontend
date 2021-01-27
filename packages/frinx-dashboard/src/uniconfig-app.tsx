import React, { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  DeviceList,
  DeviceView,
  ThemeProvider,
  DeviceDetails,
  Breadcrumb,
  MountDevice,
  theme,
} from '@frinx/uniconfig-ui';

const UniconfigApp: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/uniconfig">
          <Redirect to="/uniconfig/devices" />
        </Route>
        <Route
          exact
          path={'/uniconfig/devices/edit/:id'}
          component={DeviceView}
        />
        <>
          <Breadcrumb />
          <Route exact path={'/uniconfig/devices'} component={DeviceList} />
          <Route
            exact
            path={'/uniconfig/devices/:nodeId'}
            component={DeviceDetails}
          />
          <Route exact path={'/uniconfig/mount'} component={MountDevice} />
        </>
      </Switch>
    </ThemeProvider>
  );
};

export default UniconfigApp;
