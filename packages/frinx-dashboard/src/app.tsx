import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createPublicClientApp } from './auth-helpers';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import GammaApp from './gamma-app';
import InventoryApp from './inventory-app';
import theme from './theme';
import { ServiceKey } from './types';
import UniflowApp from './uniflow-app';
import UniresourceApp from './uniresource-app';

function getURLBaseName(): string {
  return window.__CONFIG__.url_basename ?? '/';
}

const AppWithAuth: FC<{
  enabledServices: Map<ServiceKey, boolean>;
}> = ({ enabledServices }) => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <ChakraProvider theme={theme}>
      <MsalProvider instance={publicClientAppRef.current}>
        <BrowserRouter basename={getURLBaseName()}>
          <Header isAuthEnabled enabledServices={enabledServices} />
          <Box paddingTop={10}>
            <Switch>
              <Route path="/" exact>
                <Dashboard enabledServices={enabledServices} />
              </Route>
              {enabledServices.get('uniflow_enabled') && (
                <Route path="/uniflow">
                  <UniflowApp />
                </Route>
              )}
              {enabledServices.get('inventory_enabled') && (
                <Route path="/inventory">
                  <InventoryApp />
                </Route>
              )}
              {enabledServices.get('uniresource_enabled') && (
                <Route path="/uniresource">
                  <UniresourceApp />
                </Route>
              )}
              {enabledServices.get('gamma_enabled') && (
                <Route path="/gamma">
                  <GammaApp />
                </Route>
              )}
            </Switch>
          </Box>
        </BrowserRouter>
      </MsalProvider>
    </ChakraProvider>
  );
};

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
  isAuthEnabled: boolean;
};

const App: FC<Props> = ({ isAuthEnabled, enabledServices }) => {
  return isAuthEnabled ? (
    <AppWithAuth enabledServices={enabledServices} />
  ) : (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename={getURLBaseName()}>
        <Header isAuthEnabled={false} enabledServices={enabledServices} />
        <Box paddingTop={10}>
          <Switch>
            <Route path="/" exact>
              <Dashboard enabledServices={enabledServices} />
            </Route>
            {enabledServices.get('uniflow_enabled') && (
              <Route path="/uniflow">
                <UniflowApp />
              </Route>
            )}
            {enabledServices.get('inventory_enabled') && (
              <Route path="/inventory">
                <InventoryApp />
              </Route>
            )}
            {enabledServices.get('uniresource_enabled') && (
              <Route path="/uniresource">
                <UniresourceApp />
              </Route>
            )}
            {enabledServices.get('gamma_enabled') && (
              <Route path="/gamma">
                <GammaApp />
              </Route>
            )}
          </Switch>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
