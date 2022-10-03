import { CustomToastProvider } from '@frinx/shared/src';
import React, { createContext, FC } from 'react';
import callbackUtils, { Callbacks } from './utils/callback-utils';

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
