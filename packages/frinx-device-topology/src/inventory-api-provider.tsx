import { CustomToastProvider } from '@frinx/shared';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, fetchExchange, Provider } from 'urql';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
};

export type Props = {
  client: InventoryApiClient;
};

export const InventoryAPIProvider: FC<Props> = ({ children, client }) => {
  const { current: urqlClient } = useRef(
    createClient({
      ...client.clientOptions,
      exchanges: [cacheExchange, fetchExchange],
    }),
  );
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};
