import { Callbacks, callbackUtils, CustomToastProvider } from '@frinx/shared/src';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { retryExchange } from '@urql/exchange-retry';
import { createClient as createWSClient } from 'graphql-ws';
import React, { createContext, FC, useRef } from 'react';
import {
  cacheExchange,
  ClientOptions,
  createClient,
  dedupExchange,
  mapExchange,
  Provider,
  subscriptionExchange,
} from 'urql';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
  wsUrl: string;
  refreshToken: () => Promise<string | null>;
};

const InventoryAPIProvider: FC<Props> = ({ children, client, wsUrl, refreshToken }) => {
  const wsClient = createWSClient({ url: wsUrl });
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
        mapExchange({
          onResult: async (result) => {
            refreshToken();
            // eslint-disable-next-line no-console
            console.log('== device manager: refresh token on result');
            return result;
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
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>{children}</CustomToastProvider>
    </Provider>
  );
};

export function getInventoryApiProvider(callbacks: Callbacks): FC<Props> {
  callbackUtils.setCallbacks(callbacks);
  return InventoryAPIProvider;
}
