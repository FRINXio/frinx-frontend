import React, { createContext, FC } from 'react';
import callbackUtils, { Callbacks } from './callback-utils';
import { getTransactionId, setTransactionId } from './helpers/transaction-id';

if (!getTransactionId()) {
  setTransactionId();
}

export const UnistoreApiContext = createContext(false);

const UnistoreApiProvider: FC = ({ children }) => {
  return <UnistoreApiContext.Provider value>{children}</UnistoreApiContext.Provider>;
};

export function getUnistoreApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UnistoreApiProvider;
}
