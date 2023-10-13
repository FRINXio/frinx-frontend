import { CustomToastProvider } from '@frinx/shared';
import { createClient as createWSClient } from 'graphql-ws';
import React, { FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, Provider, subscriptionExchange, fetchExchange } from 'urql';

export type InventoryApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
};

export type Props = {
  client: InventoryApiClient;
  wsUrl: string;
};

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
