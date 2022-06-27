import React, { createContext, FC } from 'react';
import { CustomToastProvider } from './notifications-context';
import callbackUtils, { Callbacks } from './callback-utils';

export const UniflowApiContext = createContext(false);

const BuilderApiProvider: FC = ({ children }) => {
  return (
    <UniflowApiContext.Provider value>
      <CustomToastProvider>{children}</CustomToastProvider>
    </UniflowApiContext.Provider>
  );
};

export function getBuilderApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return BuilderApiProvider;
}
