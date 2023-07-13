import { cacheExchange, ClientOptions, createClient, dedupExchange, fetchExchange, mapExchange, Provider } from 'urql';
import { retryExchange } from '@urql/exchange-retry';
import React, { FC, useRef } from 'react';
import { CustomToastProvider } from '@frinx/shared/src';
import PageContainer from './components/page-container';

export type ResourceManagerApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};
export type Props = {
  client: ResourceManagerApiClient;
  refreshToken: () => Promise<string | null>;
};

const ResourceManagerApiProvider: FC<Props> = ({ children, client, refreshToken }) => {
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
            console.log('== resource manager: refresh token on result');
            return result;
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
