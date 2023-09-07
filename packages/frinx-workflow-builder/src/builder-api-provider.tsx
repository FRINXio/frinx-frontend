import { CustomToastProvider } from '@frinx/shared';
import { retryExchange } from '@urql/exchange-retry';
import React, { createContext, FC, useRef } from 'react';
import { cacheExchange, ClientOptions, createClient, Provider } from 'urql';

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};

export type Props = {
  client: InventoryApiClient;
};

export const UniflowApiContext = createContext(false);

const BuilderApiProvider: FC = ({ children }) => {
  return (
    <UniflowApiContext.Provider value>
      <CustomToastProvider>{children}</CustomToastProvider>
    </UniflowApiContext.Provider>
  );
};

export function getBuilderApiProvider(): FC {
  return BuilderApiProvider;
}

export const InventoryAPIProvider: FC<Props> = ({ children, client }) => {
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
      ],
    }),
  );

  return <Provider value={urqlClient}>{children}</Provider>;
};
