import { cacheExchange, ClientOptions, createClient, fetchExchange, Provider } from 'urql';
import React, { FC, useRef } from 'react';
import { CustomToastProvider } from '@frinx/shared';
import PageContainer from './components/page-container';

export type InventoryApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
};
export type Props = {
  client: InventoryApiClient;
};

const ResourceManagerApiProvider: FC<Props> = ({ children, client }) => {
  const { current: urqlClient } = useRef(
    createClient({
      ...client.clientOptions,
      exchanges: [cacheExchange, fetchExchange],
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
