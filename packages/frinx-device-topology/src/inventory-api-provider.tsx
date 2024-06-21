import { CustomToastProvider, PerformanceMonitoringProvider } from '@frinx/shared';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, fetchExchange, Provider, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
};

export type Props = {
  client: InventoryApiClient;
  wsUrl: string;
  isPerformanceMonitoringEnabled: boolean;
};

export const InventoryAPIProvider: FC<Props> = ({ children, client, wsUrl, isPerformanceMonitoringEnabled }) => {
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
      <PerformanceMonitoringProvider isEnabled={isPerformanceMonitoringEnabled}>
        <CustomToastProvider>{children}</CustomToastProvider>
      </PerformanceMonitoringProvider>
    </Provider>
  );
};
