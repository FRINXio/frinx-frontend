import React from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import './App.css';
import DeviceView from './components/uniconfig/deviceView/DeviceView';
import DeviceList from './components/uniconfig/deviceTable/DeviceList';
import DeviceDetails from './components/uniconfig/deviceTable/DeviceDetails';
import MountDevice from './components/uniconfig/deviceTable/mount/MountDevice';
import { getUniconfigApiProvider } from './UniconfigApiProvider';

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
