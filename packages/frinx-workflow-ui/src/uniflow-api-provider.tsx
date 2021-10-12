import React, { createContext, FC } from 'react';
import callbackUtils from './utils/callbackUtils';

export const UniflowApiContext = createContext(false);

// TODO types for callbacks
export type UniflowApiCallbacks = {
  getWorkflows: unknown;
  getTaskDefinitions: unknown;
};

const UniflowApiProvider: FC = ({ children }) => {
  return <UniflowApiContext.Provider value>{children}</UniflowApiContext.Provider>;
};

export function getUniflowApiProvider(callbacks: UniflowApiCallbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UniflowApiProvider;
}
