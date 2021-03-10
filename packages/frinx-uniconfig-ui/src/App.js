import React from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import './App.css';
import DeviceView from './components/uniconfig/device-view/device-view';
import DeviceList from './components/uniconfig/device-table/device-list';
import DeviceDetails from './components/uniconfig/device-table/device-details';
import MountDevice from './components/uniconfig/device-table/mount/mount-device';
import { getUniconfigApiProvider } from './uniconfig-api-provider';

const callbacks = {
  //...
};

const UniconfigApiProvider = getUniconfigApiProvider(callbacks);

function App() {
  let { path } = useRouteMatch();

  return (
    <UniconfigApiProvider>
      <Switch>
        <Route exact path={path + '/devices/edit/:id'} component={DeviceView} />
        <>
          <Route exact path={path + '/devices'} component={DeviceList} />
          <Route exact path={path + '/devices/:nodeId'} component={DeviceDetails} />
          <Route exact path={path + '/mount'} component={MountDevice} />
          <Redirect to={path + '/devices'} />
        </>
      </Switch>
    </UniconfigApiProvider>
  );
}

export default App;
