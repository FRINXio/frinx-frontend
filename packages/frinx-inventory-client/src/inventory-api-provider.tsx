import React, { createContext, FC } from 'react';
import callbackUtils, { Callbacks } from './callback-utils';

export const InventoryAPIContext = createContext(false);

const InventoryAPIProvider: FC = ({ children }) => {
  return <InventoryAPIContext.Provider value>{children}</InventoryAPIContext.Provider>;
};

export function getInventoryAPIProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return InventoryAPIProvider;
}
