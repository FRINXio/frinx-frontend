import React, { createContext, FC, useEffect, useState } from 'react';
import { getTransactionId, setTransactionId } from './helpers/transaction-id';
import uniflowCallbackUtils, { UniflowCallbacks } from './uniflow-callback-utils';
import unistoreCallbackUtils, { UnistoreCallbacks } from './unistore-callback-utils';

export const UnistoreApiContext = createContext(false);

const GammaAppProvider: FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!getTransactionId()) {
      const callbacks = unistoreCallbackUtils.getCallbacks;
      callbacks.getTransactionCookie().then((data) => {
        console.log(data);
        setTransactionId(data);
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);
  return isReady ? <UnistoreApiContext.Provider value>{children}</UnistoreApiContext.Provider> : null;
};

export type GammaAppCallbacks = {
  unistoreCallbacks: UnistoreCallbacks;
  uniflowCallbacks: UniflowCallbacks;
};

export function getGammaAppProvider(callbacks: GammaAppCallbacks): FC {
  unistoreCallbackUtils.setCallbacks(callbacks.unistoreCallbacks);
  uniflowCallbackUtils.setCallbacks(callbacks.uniflowCallbacks);
  return GammaAppProvider;
}
