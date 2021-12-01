import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ChakraProvider } from '@chakra-ui/react';
import React, { FC, useRef, VoidFunctionComponent } from 'react';
import App from './app';
import { createPublicClientApp } from './auth-helpers';
import AuthProvider from './auth-provider';
import theme from './theme';
import { ServiceKey } from './types';

function getURLBaseName(): string {
  return window.__CONFIG__.url_basename ?? '/';
}

const AuthRoot: FC = ({ children }) => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <AuthProvider>{children}</AuthProvider>
    </MsalProvider>
  );
};

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
  isAuthEnabled: boolean;
};

const Root: VoidFunctionComponent<Props> = ({ isAuthEnabled, enabledServices }) => {
  return isAuthEnabled ? (
    <ChakraProvider theme={theme}>
      <AuthRoot>
        <App isAuthEnabled enabledServices={enabledServices} basename={getURLBaseName()} />
      </AuthRoot>
    </ChakraProvider>
  ) : (
    <ChakraProvider theme={theme}>
      <App isAuthEnabled={false} enabledServices={enabledServices} basename={getURLBaseName()} />
    </ChakraProvider>
  );
};

export default Root;
