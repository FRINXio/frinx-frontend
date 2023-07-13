import { ClientOptions } from 'urql';
import { AuthContext } from './api-helpers';

export type ApiConfig = {
  url: string;
  authContext: AuthContext;
  refreshToken?: () => Promise<string | null>;
};

export type GraphQLApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};
