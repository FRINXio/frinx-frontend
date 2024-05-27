import { CustomToastProvider, PerformanceMonitoringProvider } from '@frinx/shared';
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
  isPerformanceMonitoringEnabled: boolean;
};

const InventoryAPIProvider: FC<Props> = ({ children, client, wsUrl, isPerformanceMonitoringEnabled }) => {
  const wsClient = createWSClient({ url: wsUrl });
  const { current: urqlClient } = useRef(
    createClient({
      ...client.clientOptions,
      suspense: true,
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

export function getInventoryApiProvider(): FC<Props> {
  return InventoryAPIProvider;
}
