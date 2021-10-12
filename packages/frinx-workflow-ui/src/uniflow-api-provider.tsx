import React, { createContext, FC } from 'react';
import callbackUtils, { Callbacks } from './utils/callback-utils';

export const UniflowApiContext = createContext(false);
const UniflowApiProvider: FC = ({ children }) => {
  return <UniflowApiContext.Provider value>{children}</UniflowApiContext.Provider>;
};

export function getUniflowApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UniflowApiProvider;
}
