import { InteractionStatus } from '@azure/msal-browser';
import { AuthenticationResult } from '@azure/msal-common';
import { useMsal } from '@azure/msal-react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React, { createContext, FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';
import ErrorMessageBox from './components/error-message-box/error-message-box';

export type ContextType = {
  login: () => Promise<AuthenticationResult>;
  logout: () => Promise<void>;
  inProgress: InteractionStatus;
};

export const Context = createContext<ContextType | null>(null);

const AuthProvider: FC = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    if (inProgress === 'none' && accounts.length > 0) {
      const authResultPromise = instance.acquireTokenSilent({
        account: accounts[0],
        scopes: ['User.Read'],
      });

      authResultPromise.then((value) => {
        authContext.setAuthToken(value.idToken);
      });
    }
  }, [inProgress, instance, accounts]);

  useEffect(() => {
    authContext.eventEmitter.once('UNAUTHORIZED', () => {
      setIsAuthError(true);
    });
  }, []);

  const handleLogin = () => {
    return instance
      .loginPopup({
        scopes: ['openid', 'profile', 'User.Read.All'],
      })
      .then((data) => {
        setIsAuthError(false);
        return data;
      });
  };

  return (
    <Context.Provider
      value={{
        login: handleLogin,
        inProgress,
        logout: () => {
          return instance.logout();
        },
      }}
    >
      {isAuthError ? (
        <Box
          position="fixed"
          inset={0}
          _after={{
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'blackAlpha.700',
            zIndex: 20,
          }}
        >
          <ErrorMessageBox>
            <Heading size="md" marginBottom={2}>
              Unauthorized
            </Heading>
            <Text marginBottom={2}>Please login to continue</Text>
            <Button type="button" colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
          </ErrorMessageBox>
          {children}
        </Box>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default AuthProvider;
