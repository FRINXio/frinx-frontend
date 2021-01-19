import React, { FC, useEffect, useRef } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { ChakraProvider } from '@chakra-ui/react';
import { MsalProvider } from '@azure/msal-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import 'react-notifications/lib/notifications.css';
import { createPublicClientApp } from './auth-helpers';
import theme from './theme';

function setMessages() {
  const urlParams = new URLSearchParams(window.location?.search);
  const message = urlParams.get('message');
  const messageLevel = urlParams.get('message_level');

  // TODO this causes a warning in browser
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

const AppWithAuth = () => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <ChakraProvider theme={theme}>
      <MsalProvider instance={publicClientAppRef.current}>
        <Header isAuthEnabled />
        <Dashboard />
        <NotificationContainer />
      </MsalProvider>
    </ChakraProvider>
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
      <Header isAuthEnabled={false} />
      <Dashboard />
      <NotificationContainer correlationId="notificationContainer" />
    </ChakraProvider>
  );
};

export default App;
