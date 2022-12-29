import React, { createContext, FC } from 'react';
import { callbackUtils, Callbacks, CustomToastProvider } from '@frinx/shared/src';

export const UniflowApiContext = createContext(false);
const UniflowApiProvider: FC = ({ children }) => (
  <UniflowApiContext.Provider value>
    <CustomToastProvider>{children}</CustomToastProvider>
  </UniflowApiContext.Provider>
);

export function getUniflowApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UniflowApiProvider;
}
