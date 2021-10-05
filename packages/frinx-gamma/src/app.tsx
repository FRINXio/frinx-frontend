import { Box, ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/pages/main/main';
import CreateVpnService from './components/pages/create-vpn-service/create-vpn-service';
import EditVpnService from './components/pages/edit-vpn-service/edit-vpn-service';
import CreateVpnSite from './components/pages/create-vpn-site/create-vpn-site';
import EditVpnSite from './components/pages/edit-vpn-site/edit-vpn-site';
import CreateSiteNetAccess from './components/pages/create-site-network-access/create-site-network-access';
import EditSiteNetAccess from './components/pages/edit-site-network-access/edit-site-network-access';
import theme from './theme';

function getURLBaseName(): string {
  return window.__CONFIG__.url_basename ?? '/';
}

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename={getURLBaseName()}>
        <Box paddingTop={10}>
          <Switch>
            <Route path="/" exact>
              <Main />
            </Route>
            <Route path="/add-vpn-service" exact>
              <CreateVpnService />
            </Route>
            <Route path="/edit-vpn-service" exact>
              <EditVpnService />
            </Route>
            <Route path="/add-vpn-site" exact>
              <CreateVpnSite />
            </Route>
            <Route path="/edit-vpn-site" exact>
              <EditVpnSite />
            </Route>
            <Route path="/add-site-network-access" exact>
              <CreateSiteNetAccess />
            </Route>
            <Route path="/edit-site-network-access" exact>
              <EditSiteNetAccess />
            </Route>
          </Switch>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
