import React, { FC, useEffect, useRef, useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { Box, ChakraProvider, Container, HStack, Skeleton } from '@chakra-ui/react';
import { MsalProvider } from '@azure/msal-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import 'react-notifications/lib/notifications.css';
import { createPublicClientApp } from './auth-helpers';
import theme from './theme';
import { getRoutes, RouteType } from './helpers/route.helpers';
import AppMenu from './components/app-menu/app-menu';

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

const AppWithAuth: FC<{ routes: RouteType[] | null }> = ({ routes }) => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <NotificationContainer correlationId="notificationContainer" />
          <Header isAuthEnabled>
            <Switch>
              {routes &&
                routes.map((r) => {
                  return (
                    <Route path={r.path} key={r.path}>
                      <AppMenu menuLinks={r.menuLinks} />
                    </Route>
                  );
                })}
            </Switch>
          </Header>
          <Box paddingTop={10}>
            <Switch>
              <Route path="/" exact>
                <Dashboard />
              </Route>
              {routes &&
                routes.map((r) => {
                  const { path, RootComponent } = r;
                  return (
                    <Route path={path} key={path}>
                      <RootComponent />
                    </Route>
                  );
                })}
            </Switch>
          </Box>
        </BrowserRouter>
      </ChakraProvider>
    </MsalProvider>
  );
};

const App: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  const [routes, setRoutes] = useState<null | RouteType[]>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages();
    setIsLoading(true);
    getRoutes().then((r) => {
      setRoutes(r);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Header isAuthEnabled={false} />
          <Box paddingTop={10}>
            <Container maxWidth={1280}>
              <HStack spacing={4}>
                <Skeleton height="100px" flex={1} />
                <Skeleton height="100px" flex={1} />
                <Skeleton height="100px" flex={1} />
                <Skeleton height="100px" flex={1} />
              </HStack>
            </Container>
          </Box>
        </BrowserRouter>
      </ChakraProvider>
    );
  }

  return isAuthEnabled ? (
    <AppWithAuth routes={routes} />
  ) : (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NotificationContainer correlationId="notificationContainer" />
        <Header isAuthEnabled={false}>
          <Switch>
            {routes &&
              routes.map((r) => {
                return (
                  <Route path={r.path} key={r.path}>
                    <AppMenu menuLinks={r.menuLinks} />
                  </Route>
                );
              })}
          </Switch>
        </Header>
        <Box paddingTop={10}>
          <Switch>
            <Route path="/" exact>
              <Dashboard />
            </Route>
            {routes &&
              routes.map((r) => {
                const { path, RootComponent } = r;
                return (
                  <Route exact path={path} key={path}>
                    <RootComponent />
                  </Route>
                );
              })}
          </Switch>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
