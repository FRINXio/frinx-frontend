import React, { createContext, FC, useRef } from 'react';
import { Provider, createClient } from 'urql';
import { CustomToastProvider } from './notifications-context';

export const InventoryAPIContext = createContext(false);

export type Props = {
  url: string;
};

export const InventoryAPIProvider: FC<Props> = ({ children, url }) => {
  const { current: clientRef } = useRef(
    createClient({
      url,
    }),
  );
  return (
    <Provider value={clientRef}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};
