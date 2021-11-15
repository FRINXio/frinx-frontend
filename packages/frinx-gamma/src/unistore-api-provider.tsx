import React, { createContext, FC, useEffect } from 'react';
import callbackUtils, { Callbacks } from './callback-utils';
import { getTransactionId, setTransactionId } from './helpers/transaction-id';

export const UnistoreApiContext = createContext(false);

const UnistoreApiProvider: FC = ({ children }) => {
  useEffect(() => {
    if (!getTransactionId()) {
      setTransactionId();
    }
  }, []);
  return <UnistoreApiContext.Provider value>{children}</UnistoreApiContext.Provider>;
};

export function getUnistoreApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UnistoreApiProvider;
}
