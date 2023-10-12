import { CustomToastProvider } from '@frinx/shared';
import { createClient as createWSClient } from 'graphql-ws';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, fetchExchange, Provider, subscriptionExchange } from 'urql';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
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
        fetchExchange,
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
