import React, { FC } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { List, DeviceView } from '@frinx/uniconfig-ui';

const UniconfigApp: FC = () => {
  const history = useHistory();

  return (
    <Switch>
      <Route exact path="/uniconfig">
        <Redirect to="/uniconfig/devices" />
      </Route>
      <Route exact path="/uniconfig/devices">
        <List />
      </Route>
      <Route exact path="/uniconfig/devices/edit/:id">
        <DeviceView />
      </Route>
    </Switch>
  );
};

export default UniconfigApp;
