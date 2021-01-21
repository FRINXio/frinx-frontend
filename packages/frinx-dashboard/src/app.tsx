import React, { FC, useEffect, useRef, useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { ChakraProvider } from '@chakra-ui/react';
import { MsalProvider } from '@azure/msal-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import 'react-notifications/lib/notifications.css';
import { createPublicClientApp } from './auth-helpers';
import theme from './theme';
import unwrap from './helpers/unwrap';

type RouteRecord = {
  route: string;
  importFn: () => Promise<any>;
  componentName: string;
};
const importMap = new Map<ServiceName, RouteRecord>([
  ['uniflow', { route: '/uniflow', importFn: () => import('@frinx/workflow-ui/dist'), componentName: 'WorkflowApp' }],
]);

async function getRoutes(): Promise<{ route: string; Component: FC }[]> {
  const promiseArray = await Promise.all(
    window.__CONFIG__.enabled_services.map(async (r) => {
      const { route, importFn, componentName } = unwrap(importMap.get(r));
      return {
        route,
        componentName,
        component: await importFn(),
      };
    }),
  );

  return promiseArray.map((p) => ({
    route: p.route,
    Component: p.component[p.componentName],
  }));
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

const AppWithAuth: FC<{ routes: { route: string; Component: FC }[] | null }> = ({ routes }) => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <NotificationContainer correlationId="notificationContainer" />
          <Header isAuthEnabled />
          <Switch>
            <Route path="/" exact>
              <Dashboard />
            </Route>
            {routes &&
              routes.map((r) => {
                const { route, Component } = r;
                return (
                  <Route path={route} key={route}>
                    <Component />
                  </Route>
                );
              })}
          </Switch>
        </BrowserRouter>
      </ChakraProvider>
    </MsalProvider>
  );
};

const App: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  const [routes, setRoutes] = useState<null | { route: string; Component: FC }[]>(null);

  useEffect(() => {
    setMessages();
    getRoutes().then((r) => {
      setRoutes(r);
    });
  }, []);

  return isAuthEnabled ? (
    <AppWithAuth routes={routes} />
  ) : (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NotificationContainer correlationId="notificationContainer" />
        <Header isAuthEnabled={false} />
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          {routes &&
            routes.map((r) => {
              const { route, Component } = r;
              return (
                <Route exact path={route} key={route}>
                  <Component />
                </Route>
              );
            })}
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
