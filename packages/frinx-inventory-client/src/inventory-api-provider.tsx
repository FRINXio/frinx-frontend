import React, { createContext, FC, useRef } from 'react';
import { retryExchange } from '@urql/exchange-retry';
import { Provider, createClient, ClientOptions, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import { CustomToastProvider } from './notifications-context';

export const InventoryAPIContext = createContext(false);

type InventoryApiClient = {
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
