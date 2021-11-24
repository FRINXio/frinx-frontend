import React, { createContext, FC, useRef } from 'react';
import { Provider, createClient } from 'urql';
import { CustomToastProvider } from './notifications-context';

export const InventoryAPIContext = createContext(false);

export type Props = {
  url: string;
  getAuthToken: () => string | null;
};

export const InventoryAPIProvider: FC<Props> = ({ children, url, getAuthToken }) => {
  const { current: urqlClient } = useRef(
    (() => {
      const authToken = getAuthToken();
      return createClient({
        url,
        fetchOptions: {
          headers: {
            ...(authToken != null ? { authorization: `Bearer ${authToken}` } : {}),
          },
        },
      });
    })(),
  );
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};
