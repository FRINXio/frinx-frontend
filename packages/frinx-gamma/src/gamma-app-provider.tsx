import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React, { createContext, FC, useEffect, useState } from 'react';
import { getTransactionId, removeTransactionId, setTransactionId } from './helpers/transaction-id';
import uniflowCallbackUtils, { UniflowCallbacks } from './uniflow-callback-utils';
import unistoreCallbackUtils, { UnistoreCallbacks } from './unistore-callback-utils';

export const UnistoreApiContext = createContext(false);

export type GammaAppProviderProps = {
  hasTransactionError: boolean;
  onTransactionRefresh: () => void;
};
const GammaAppProvider: FC<GammaAppProviderProps> = ({ children, hasTransactionError, onTransactionRefresh }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!getTransactionId()) {
      const callbacks = unistoreCallbackUtils.getCallbacks;
      callbacks.getTransactionCookie().then((data) => {
        setTransactionId(data);
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);

  const handleRefreshBtnClick = () => {
    setIsReady(false);
    removeTransactionId();
    const callbacks = unistoreCallbackUtils.getCallbacks;
    callbacks.getTransactionCookie().then((data) => {
      onTransactionRefresh();
      setTransactionId(data);
      setIsReady(true);
    });
  };

  if (!isReady) {
    return null;
  }

  return (
    <UnistoreApiContext.Provider value>
      {hasTransactionError ? (
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
              Transaction expired
            </Heading>
            <Text marginBottom={2}>All uncommited changes will be lost.</Text>
            <Button type="button" colorScheme="blue" onClick={handleRefreshBtnClick}>
              Refresh
            </Button>
          </Box>
          {children}
        </Box>
      ) : (
        children
      )}
    </UnistoreApiContext.Provider>
  );
};

export type GammaAppCallbacks = {
  unistoreCallbacks: UnistoreCallbacks;
  uniflowCallbacks: UniflowCallbacks;
};

export function getGammaAppProvider(callbacks: GammaAppCallbacks): FC<GammaAppProviderProps> {
  unistoreCallbackUtils.setCallbacks(callbacks.unistoreCallbacks);
  uniflowCallbackUtils.setCallbacks(callbacks.uniflowCallbacks);
  return GammaAppProvider;
}
