import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { retryExchange } from '@urql/exchange-retry';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, dedupExchange, Provider } from 'urql';
import { CustomToastProvider } from './notifications-context';

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
        multipartFetchExchange,
      ],
    }),
  );
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};
