import { ClientOptions } from 'urql';
import { AuthContext } from './api-helpers';

export type ApiConfig = {
  url: string;
  authContext: AuthContext;
};

export type GraphQLApiClient = {
  clientOptions: ClientOptions;
  onError: () => void;
};
<<<<<<< HEAD

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface GraphQLApi {
  client: GraphQLApiClient;
}
=======
>>>>>>> origin/main
