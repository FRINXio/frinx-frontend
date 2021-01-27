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
import AppMenu from './components/app-menu/app-menu';
import UniflowApp from './uniflow-app';
import UniresourceApp from "./uniresource-app";

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

const AppWithAuth: FC = () => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <NotificationContainer correlationId="notificationContainer" />
          <Header isAuthEnabled>
            <AppMenu />
          </Header>
          <Box paddingTop={10}>
            <Switch>
              <Route path="/" exact>
                <Dashboard />
              </Route>
              <Route path="/uniflow">
                <UniflowApp />
              </Route>
              <Route path="/uniresource">
                <UniresourceApp />
              </Route>
            </Switch>
          </Box>
        </BrowserRouter>
      </ChakraProvider>
    </MsalProvider>
  );
};

const App: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  useEffect(() => {
    setMessages();
  }, []);

  return isAuthEnabled ? (
    <AppWithAuth />
  ) : (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NotificationContainer correlationId="notificationContainer" />
        <Header isAuthEnabled={false}>
          <AppMenu />
        </Header>
        <Box paddingTop={10}>
          <Switch>
            <Route path="/" exact>
              <Dashboard />
            </Route>
            <Route path="/uniflow">
              <UniflowApp />
            </Route>
            <Route path="/uniresource">
              <UniresourceApp />
            </Route>
          </Switch>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
