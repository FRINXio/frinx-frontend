import { CustomToastProvider } from '@frinx/shared';
import { CombinedError } from '@urql/core';
import { GraphQLError, GraphQLErrorExtensions } from 'graphql';
import { createClient as createWSClient } from 'graphql-ws';
import React, { FC, useRef } from 'react';
import {
  cacheExchange,
  ClientOptions,
  createClient,
  Provider,
  subscriptionExchange,
  fetchExchange,
  mapExchange,
} from 'urql';
import { AuthContext } from '@frinx/dashboard/src/auth-helpers';

export type InventoryApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
};

export type Props = {
  client: InventoryApiClient;
  wsUrl: string;
  authContext: AuthContext;
};

type HttpError = {
  status: number;
  statusText: string;
};

type GraphqlHttpError = GraphQLError & {
  extensions: GraphQLErrorExtensions & HttpError;
};

type GraphqlApiError = CombinedError & {
  graphQLErrors: GraphqlHttpError[];
};

function isApiError(error: CombinedError): error is GraphqlApiError {
  if (!error.message.includes('API error')) {
    return false;
  }
  return true;
}

export const InventoryAPIProvider: FC<Props> = ({ children, client, wsUrl, authContext }) => {
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
        mapExchange({
          // lets check for API errors that we propagate via proxy
          // we only check for 403 and 401 errors to be able to show modal
          onError(error) {
            if (isApiError(error)) {
              const { extensions } = error.graphQLErrors[0];
              if (extensions.status === 403) {
                authContext.emit('FORBIDDEN');
              }
            }
          },
        }),
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
