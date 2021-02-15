import React, { createContext, FC } from 'react';
import callbackUtils from './utils/callbackUtils';

// TODO types for callbacks
export type UniflowApiCallbacks = {
  getWorkflows: unknown,
  getTaskDefinitions: unknown,
};

export function getUniflowApiProvider(callbacks: UniflowApiCallbacks) {
  callbackUtils.setCallbacks(callbacks);
  return UniflowApiProvider;
}

export const UniflowApiContext = createContext<boolean>(false);

const UniflowApiProvider: FC = ({ children }) => {
  return <UniflowApiContext.Provider value={true}>{children}</UniflowApiContext.Provider>;
};
