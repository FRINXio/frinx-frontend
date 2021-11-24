import React, { createContext, FC, useEffect, useState } from 'react';
import callbackUtils, { Callbacks } from './callback-utils';
import { getTransactionId, setTransactionId } from './helpers/transaction-id';

export const UnistoreApiContext = createContext(false);

const UnistoreApiProvider: FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!getTransactionId()) {
      const callbacks = callbackUtils.getCallbacks;
      callbacks.getTransactionCookie().then((data) => {
        setTransactionId(data);
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);
  return isReady ? <UnistoreApiContext.Provider value>{children}</UnistoreApiContext.Provider> : null;
};

export function getUnistoreApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UnistoreApiProvider;
}
