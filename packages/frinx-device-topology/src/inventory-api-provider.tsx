import { retryExchange } from '@urql/exchange-retry';
import { CustomToastProvider } from '@frinx/shared/src';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, dedupExchange, fetchExchange, Provider } from 'urql';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
};

export const InventoryAPIProvider: FC<Props> = ({ children, client }) => {
  const { current: urqlClient } = useRef(
    createClient({
      ...client.clientOptions,
      exchanges: [
        dedupExchange,
        cacheExchange,
        retryExchange({
          retryIf: (err) => {
            if (err.networkError?.message === 'Unauthorized') {
              client.onError();
            }
            return false;
          },
        }),
        fetchExchange,
      ],
    }),
  );
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};
