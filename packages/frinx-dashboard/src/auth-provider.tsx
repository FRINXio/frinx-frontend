import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React, { createContext, FC, useEffect, useState, useMemo } from 'react';
import { authContext } from './auth-helpers';
import ErrorMessageBox from './components/error-message-box/error-message-box';

export type ContextType = null;

export const Context = createContext<ContextType | null>(null);

const AuthProvider: FC = ({ children }) => {
  const [isAccessError, setIsAccessError] = useState(false);

  useEffect(() => {
    authContext.eventEmitter.once('FORBIDDEN', () => {
      setIsAccessError(true);
    });
  }, []);

  const handleClose = () => {
    setIsAccessError(false);
  };

  const contextProviderValue = useMemo(() => null, []);

  return (
    <Context.Provider value={contextProviderValue}>
      {isAccessError ? (
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
              No access
            </Heading>
            <Text marginBottom={2}>You have no access to this resource</Text>
            <Button type="button" colorScheme="blue" onClick={handleClose}>
              Close
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
