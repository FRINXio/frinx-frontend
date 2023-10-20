import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { ChakraProvider } from '@chakra-ui/react';
import React, { FC, useRef, VoidFunctionComponent } from 'react';
import App from './app';
import { createPublicClientApp } from './auth-helpers';
import AuthProvider from './auth-provider';
import theme from './theme';
import '@fontsource/roboto';
import { useConfigContext } from './config.provider';

const AuthRoot: FC = ({ children }) => {
  const { MSALAuthority, authClientId, authRedirectURL } = useConfigContext();
  const publicClientAppRef = useRef<PublicClientApplication>(
    createPublicClientApp({ authority: MSALAuthority, clientId: authClientId, redirectUri: authRedirectURL }),
  );

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <AuthProvider>{children}</AuthProvider>
    </MsalProvider>
  );
};

const Root: VoidFunctionComponent = () => {
  const { isAuthEnabled, URLBasename } = useConfigContext();

  return isAuthEnabled ? (
    <ChakraProvider theme={theme}>
      <AuthRoot>
        <App isAuthEnabled basename={URLBasename ?? '/'} />
      </AuthRoot>
    </ChakraProvider>
  ) : (
    <ChakraProvider theme={theme}>
      <App isAuthEnabled={false} basename={URLBasename ?? '/'} />
    </ChakraProvider>
  );
};

export default Root;
