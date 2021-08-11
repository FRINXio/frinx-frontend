import React, { FC, useEffect, useRef } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { MsalProvider } from '@azure/msal-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import 'react-notifications/lib/notifications.css';
import { createPublicClientApp } from './auth-helpers';
import theme from './theme';
import UniflowApp from './uniflow-app';
import { ServiceKey } from './types';
import UniresourceApp from './uniresource-app';
import InventoryApp from './inventory-app';

function getURLBaseName(): string {
  return window.__CONFIG__.url_basename ?? '/';
}

function setMessages() {
  const urlParams = new URLSearchParams(window.location?.search);
  const message = urlParams.get('message');
  const messageLevel = urlParams.get('message_level');

  // Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node

  if (message) {
    switch (messageLevel) {
      default:
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message);
        break;
      case 'warning':
        NotificationManager.warning(message);
        break;
      case 'error':
        NotificationManager.error(message);
        break;
    }
  }
}

const AppWithAuth: FC<{
  enabledServices: Map<ServiceKey, boolean>;
}> = ({ enabledServices }) => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <ChakraProvider theme={theme}>
        <BrowserRouter basename={getURLBaseName()}>
          <NotificationContainer correlationId="notificationContainer" />
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
              <Route path="/inventory">
                <InventoryApp />
              </Route>
            </Switch>
          </Box>
        </BrowserRouter>
      </ChakraProvider>
    </MsalProvider>
  );
};

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
  isAuthEnabled: boolean;
};

const App: FC<Props> = ({ isAuthEnabled, enabledServices }) => {
  useEffect(() => {
    setMessages();
  }, []);

  return isAuthEnabled ? (
    <AppWithAuth enabledServices={enabledServices} />
  ) : (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename={getURLBaseName()}>
        <NotificationContainer correlationId="notificationContainer" />
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
          </Switch>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
