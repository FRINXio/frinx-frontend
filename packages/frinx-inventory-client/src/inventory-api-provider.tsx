import { CustomToastProvider } from '@frinx/shared';
import { retryExchange } from '@urql/exchange-retry';
import { createClient as createWSClient } from 'graphql-ws';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, Provider, subscriptionExchange } from 'urql';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
  wsUrl: string;
};

const InventoryAPIProvider: FC<Props> = ({ children, client, wsUrl }) => {
  const wsClient = createWSClient({ url: wsUrl });
  const { current: urqlClient } = useRef(
    createClient({
      ...client.clientOptions,
      exchanges: [
        cacheExchange,
        retryExchange({
          retryIf: (err) => {
            if (err.networkError?.message === 'Unauthorized') {
              client.onError();
            }
            return false;
          },
        }),
        subscriptionExchange({
          forwardSubscription: (request) => {
            const input = { ...request, query: request.query || '' };
            return {
              subscribe: (sink) => ({
                unsubscribe: wsClient.subscribe(input, sink),
              }),
            };
          },
        }),
      ],
    }),
  );
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};

export function getInventoryApiProvider(): FC<Props> {
  return InventoryAPIProvider;
}
