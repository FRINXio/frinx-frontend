import React, { createContext, FC } from 'react';
import callbackUtils, { Callbacks } from './callback-utils';

export const UniflowApiContext = createContext(false);

const BuilderApiProvider: FC = ({ children }) => {
  return <UniflowApiContext.Provider value>{children}</UniflowApiContext.Provider>;
};

export function getBuilderApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return BuilderApiProvider;
}
