import { cacheExchange, ClientOptions, createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { retryExchange } from '@urql/exchange-retry';
import React, { FC, useRef } from 'react';
import { CustomToastProvider } from '@frinx/shared/src';
import PageContainer from './components/page-container';

export type InventoryApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};
export type Props = {
  client: InventoryApiClient;
};

const ResourceManagerApiProvider: FC<Props> = ({ children, client }) => {
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
        fetchExchange,
      ],
    }),
  );

  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>
        <PageContainer>{children}</PageContainer>
      </CustomToastProvider>
    </Provider>
  );
};

export default ResourceManagerApiProvider;