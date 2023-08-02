import React, { createContext, FC, useRef } from 'react';
import { callbackUtils, Callbacks, CustomToastProvider } from '@frinx/shared/src';
import { cacheExchange, ClientOptions, createClient, dedupExchange, subscriptionExchange, Provider } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';
import { retryExchange } from '@urql/exchange-retry';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
  wsUrl: string;
};

export const UniflowApiContext = createContext(false);

const UniflowApiProvider: FC = ({ children }) => (
  <UniflowApiContext.Provider value>
    <CustomToastProvider>{children}</CustomToastProvider>
  </UniflowApiContext.Provider>
);

export function getUniflowApiProvider(callbacks: Callbacks): FC {
  callbackUtils.setCallbacks(callbacks);
  return UniflowApiProvider;
}

export const InventoryAPIProvider: FC<Props> = ({ children, client, wsUrl }) => {
  const { current: wsClient } = useRef(
    createWSClient({
      url: wsUrl,
      lazy: true,
    }),
  );

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
        subscriptionExchange({
          forwardSubscription: (operation) => ({
            subscribe: (sink) => ({
              unsubscribe: wsClient.subscribe(operation, sink),
            }),
          }),
        }),
      ],
    }),
  );

  return <Provider value={urqlClient}>{children}</Provider>;
};
