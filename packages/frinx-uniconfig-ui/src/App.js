import React from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import './App.css';
import DeviceView from './components/uniconfig/deviceView/DeviceView';
import { GlobalProvider } from './components/common/GlobalContext';
import DeviceList from './components/uniconfig/deviceTable/DeviceList';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './components/common/theme';
import DeviceDetails from './components/uniconfig/deviceTable/DeviceDetails';
import Breadcrumb from './components/common/Breadcrumb';
import MountDevice from './components/uniconfig/deviceTable/mount/MountDevice';

function App(props) {
  let { path } = useRouteMatch();

  return (
    <GlobalProvider {...props}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path={path + '/devices/edit/:id'} component={DeviceView} />
          <>
            <Breadcrumb />
            <Route exact path={path + '/devices'} component={DeviceList} />
            <Route
              exact
              path={path + '/devices/:nodeId'}
              component={DeviceDetails}
            />
            <Route exact path={path + '/mount'} component={MountDevice} />
            <Redirect to={path + '/devices'} />
          </>
        </Switch>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;
