import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { retryExchange } from '@urql/exchange-retry';
import { Callbacks, callbackUtils, CustomToastProvider } from '@frinx/shared/src';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, dedupExchange, Provider } from 'urql';

export const InventoryAPIContext = createContext(false);

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
};

const InventoryAPIProvider: FC<Props> = ({ children, client }) => {
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

export function getInventoryApiProvider(callbacks: Callbacks): FC<Props> {
  callbackUtils.setCallbacks(callbacks);
  return InventoryAPIProvider;
}
