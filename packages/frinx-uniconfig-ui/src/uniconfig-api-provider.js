import React, { createContext } from 'react';
import callbackUtils from './utils/callbackUtils';

export function getUniconfigApiProvider(callbacks) {
  callbackUtils.setCallbacks(callbacks);
  return UniconfigApiProvider;
}

export const UniconfigApiContext = createContext(false);

const UniconfigApiProvider = ({ children }) => {
  return <UniconfigApiContext.Provider value={true}>{children}</UniconfigApiContext.Provider>;
};
