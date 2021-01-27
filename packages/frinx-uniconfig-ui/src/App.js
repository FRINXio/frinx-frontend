import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import List from './components/uniconfig/deviceTable/List';
import DeviceView from './components/uniconfig/deviceView/DeviceView';
import { GlobalProvider, globalConstants } from './components/common/GlobalContext';

const { frontendUrlPrefix } = globalConstants;

function App(props) {
  return (
    <GlobalProvider {...props}>
      <Switch>
        <Route exact path={(props.frontendUrlPrefix || frontendUrlPrefix) + '/devices'} component={List} />
        <Route
          exact
          path={(props.frontendUrlPrefix || frontendUrlPrefix) + '/devices/edit/:id'}
          component={DeviceView}
        />
        <Redirect to={(props.frontendUrlPrefix || frontendUrlPrefix) + '/devices'} />
      </Switch>
    </GlobalProvider>
  );
}

export default App;