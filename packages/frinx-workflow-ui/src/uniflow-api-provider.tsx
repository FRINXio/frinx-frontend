import React, { createContext, FC, useRef } from 'react';
import { callbackUtils, Callbacks, CustomToastProvider } from '@frinx/shared/src';
import { cacheExchange, ClientOptions, createClient, dedupExchange, Provider } from 'urql';
import { retryExchange } from '@urql/exchange-retry';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
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

  return <Provider value={urqlClient}>{children}</Provider>;
};
