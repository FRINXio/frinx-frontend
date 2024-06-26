import { ClientOptions } from 'urql';
import { AuthContext } from './api-helpers';

export type ApiConfig = {
  url: string;
  authContext: AuthContext;
};

export type GraphQLApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
  authContext: AuthContext;
};
