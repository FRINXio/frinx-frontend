import { InteractionStatus } from '@azure/msal-browser';
import { AuthenticationResult } from '@azure/msal-common';
import { useMsal } from '@azure/msal-react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import React, { FC, useEffect, useState, createContext } from 'react';
import { authContext } from './auth-helpers';

export type ContextType = {
  login: () => Promise<AuthenticationResult>;
  logout: () => Promise<void>;
  inProgress: InteractionStatus;
};

export const Context = createContext<ContextType | null>(null);

const AuthProvider: FC = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [key, setKey] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    if (inProgress === 'none' && accounts.length > 0) {
      const authResultPromise = instance.acquireTokenSilent({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        setKey(uuid());
        return data;
      });
  };

  return (
    <Context.Provider
      key={key}
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
          <Box
            position="fixed"
            top={4}
            minWidth={96}
            left="50%"
            transform="translateX(-50%)"
            paddingY={4}
            paddingX={8}
            borderRadius="md"
            zIndex="modal"
            background="white"
            borderTop={4}
            borderStyle="solid"
            borderColor="red"
            textAlign="center"
          >
            <Heading size="md" marginBottom={2}>
              Unauthorized
            </Heading>
            <Text marginBottom={2}>Please login to continue</Text>
            <Button type="button" colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
          </Box>
          {children}
        </Box>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default AuthProvider;
